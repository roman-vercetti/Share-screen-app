package com.example.screenmirror.render

import android.util.Log
import com.example.screenmirror.codec.AACDecoder

class AudioRenderer {
    private val TAG = "AudioRenderer"
    private val decoder = AACDecoder()
    private var isStarted = false

    init {
        decoder.start()
        isStarted = true
        Log.i(TAG, "Аудио рендерер запущен")
    }

    fun feedFrame(data: ByteArray) {
        if (!isStarted) return
        decoder.feedFrame(data)
    }

    fun stop() {
        decoder.stop()
        isStarted = false
        Log.i(TAG, "Аудио рендерер остановлен")
    }
}
