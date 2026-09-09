package com.example.screenmirror.codec

import android.util.Log
import java.io.ByteArrayOutputStream
import java.util.concurrent.LinkedBlockingQueue

class H264FrameAssembler {
    private val TAG = "H264FrameAssembler"
    private val pendingPackets = mutableMapOf<Int, MutableList<ByteArray>>()
    private val frameQueue = LinkedBlockingQueue<ByteArray>(30)

    fun addPacket(payload: ByteArray, timestamp: Long, seqNum: Int) {
        // Простая реализация — каждый пакет считаем полным фреймом
        // В реальном AirPlay пакеты собираются в фреймы по заголовкам
        try {
            val output = ByteArrayOutputStream()
            output.write(byteArrayOf(0, 0, 0, 1)) // Annex B start code
            output.write(payload)
            frameQueue.offer(output.toByteArray())
        } catch (e: Exception) {
            Log.e(TAG, "Ошибка сборки фрейма", e)
        }
    }

    fun pollFrame(): ByteArray? = frameQueue.poll()

    fun clear() {
        pendingPackets.clear()
        frameQueue.clear()
    }
}
