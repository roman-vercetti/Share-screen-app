package com.example.screenmirror.codec

import android.media.MediaCodec
import android.media.MediaFormat
import android.util.Log
import android.view.Surface
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.TimeUnit

class H264Decoder {
    private val TAG = "H264Decoder"
    private var codec: MediaCodec? = null
    private var isRunning = false
    private val inputQueue = LinkedBlockingQueue<ByteArray>(60)
    private var surface: Surface? = null

    fun start(initialSurface: Surface?, width: Int = 1920, height: Int = 1080) {
        surface = initialSurface

        val format = MediaFormat.createVideoFormat(
            MediaFormat.MIMETYPE_VIDEO_AVC, width, height
        ).apply {
            setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, 4 * 1024 * 1024)
            setInteger(MediaFormat.KEY_LOW_LATENCY, 1)
        }

        codec = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
        codec!!.configure(format, surface, null, 0)
        codec!!.start()
        isRunning = true

        Thread({
            val bufferInfo = MediaCodec.BufferInfo()
            while (isRunning) {
                // Input
                val inIndex = codec!!.dequeueInputBuffer(5000)
                if (inIndex >= 0) {
                    val frame = inputQueue.poll(10, TimeUnit.MILLISECONDS)
                    if (frame != null) {
                        val buffer = codec!!.getInputBuffer(inIndex)
                        buffer?.clear()
                        buffer?.put(frame)
                        codec!!.queueInputBuffer(inIndex, 0, frame.size,
                            System.nanoTime() / 1000, 0)
                    } else {
                        codec!!.queueInputBuffer(inIndex, 0, 0, 0, 0)
                    }
                }

                // Output
                var outIndex = codec!!.dequeueOutputBuffer(bufferInfo, 5000)
                while (outIndex >= 0) {
                    codec!!.releaseOutputBuffer(outIndex, true)
                    outIndex = codec!!.dequeueOutputBuffer(bufferInfo, 0)
                }
            }
        }, "H264-Decoder").start()

        Log.i(TAG, "H.264 декодер запущен")
    }

    fun feedFrame(nalUnit: ByteArray) {
        inputQueue.offer(nalUnit)
    }

    fun setSurface(newSurface: Surface?) {
        surface = newSurface
        try {
            codec?.setOutputSurface(newSurface)
        } catch (e: Exception) {
            Log.e(TAG, "Ошибка установки Surface", e)
        }
    }

    fun stop() {
        isRunning = false
        try {
            codec?.stop()
            codec?.release()
        } catch (e: Exception) {
            Log.e(TAG, "Ошибка остановки декодера", e)
        }
        codec = null
        Log.i(TAG, "H.264 декодер остановлен")
    }
}
