package com.example.screenmirror.render

import android.util.Log
import android.view.Surface
import com.example.screenmirror.codec.H264Decoder
import com.example.screenmirror.codec.H264FrameAssembler

class VideoRenderer {
    private val TAG = "VideoRenderer"
    private val decoder = H264Decoder()
    private val assembler = H264FrameAssembler()
    private var isStarted = false

    fun setSurface(surface: Surface?) {
        if (!isStarted && surface != null) {
            decoder.start(surface)
            isStarted = true
            Log.i(TAG, "Видео рендерер запущен")
        } else if (isStarted) {
            decoder.setSurface(surface)
        }
    }

    fun feedFrame(data: ByteArray) {
        if (!isStarted) return
        assembler.addPacket(data, System.nanoTime(), 0)
        val frame = assembler.pollFrame()
        if (frame != null) {
            decoder.feedFrame(frame)
        }
    }

    fun stop() {
        decoder.stop()
        isStarted = false
        Log.i(TAG, "Видео рендерер остановлен")
    }
}
