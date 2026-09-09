package com.example.screenmirror.codec

import android.media.*
import android.util.Log
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.TimeUnit

class AACDecoder {
    private val TAG = "AACDecoder"
    private var codec: MediaCodec? = null
    private var audioTrack: AudioTrack? = null
    private var isRunning = false
    private val inputQueue = LinkedBlockingQueue<ByteArray>(100)

    fun start() {
        val sampleRate = 44100
        val channels = 2

        val bufferSize = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_STEREO,
            AudioFormat.ENCODING_PCM_16BIT
        ) * 2

        audioTrack = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setSampleRate(sampleRate)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .build()
            )
            .setBufferSizeInBytes(bufferSize)
            .setTransferMode(AudioTrack.MODE_STREAM)
            .build()
        audioTrack!!.play()

        val format = MediaFormat.createAudioFormat(
            MediaFormat.MIMETYPE_AUDIO_AAC, sampleRate, channels
        ).apply {
            setInteger(MediaFormat.KEY_AAC_PROFILE,
                MediaCodecInfo.CodecProfileLevel.AACObjectLC)
            setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, 8192)
        }

        codec = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_AUDIO_AAC)
        codec!!.configure(format, null, null, 0)
        codec!!.start()
        isRunning = true

        Thread({
            val bufferInfo = MediaCodec.BufferInfo()
            while (isRunning) {
                val inIndex = codec!!.dequeueInputBuffer(5000)
                if (inIndex >= 0) {
                    val frame = inputQueue.poll(10, TimeUnit.MILLISECONDS)
                    if (frame != null) {
                        val buffer = codec!!.getInputBuffer(inIndex)
                        buffer?.clear()
                        buffer?.put(frame)
                        codec!!.queueInputBuffer(inIndex, 0, frame.size, 0, 0)
                    }
                }

                var outIndex = codec!!.dequeueOutputBuffer(bufferInfo, 5000)
                while (outIndex >= 0) {
                    val outputBuffer = codec!!.getOutputBuffer(outIndex)
                    if (outputBuffer != null && bufferInfo.size > 0) {
                        val pcm = ByteArray(bufferInfo.size)
                        outputBuffer.get(pcm)
                        audioTrack!!.write(pcm, 0, pcm.size)
                    }
                    codec!!.releaseOutputBuffer(outIndex, false)
                    outIndex = codec!!.dequeueOutputBuffer(bufferInfo, 0)
                }
            }
        }, "AAC-Decoder").start()

        Log.i(TAG, "AAC декодер запущен")
    }

    fun feedFrame(aacFrame: ByteArray) {
        inputQueue.offer(aacFrame)
    }

    fun stop() {
        isRunning = false
        try {
            codec?.stop()
            codec?.release()
            audioTrack?.stop()
            audioTrack?.release()
        } catch (e: Exception) {
            Log.e(TAG, "Ошибка остановки AAC декодера", e)
        }
        codec = null
        audioTrack = null
        Log.i(TAG, "AAC декодер остановлен")
    }
}
