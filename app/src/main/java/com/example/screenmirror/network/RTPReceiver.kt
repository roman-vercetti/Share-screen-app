package com.example.screenmirror.network

import android.util.Log
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.nio.ByteBuffer
import java.nio.ByteOrder

class RTPReceiver(
    private val port: Int,
    private val isVideo: Boolean,
    private val onPacket: (ByteArray, Long, Int) -> Unit
) {
    private val TAG = "RTPReceiver"
    private var socket: DatagramSocket? = null
    private var isRunning = false
    private var thread: Thread? = null

    fun start() {
        socket = DatagramSocket(port).apply {
            receiveBufferSize = 4 * 1024 * 1024 // 4MB
            reuseAddress = true
        }
        isRunning = true

        thread = Thread({
            val buffer = ByteArray(65536)
            while (isRunning) {
                try {
                    val packet = DatagramPacket(buffer, buffer.size)
                    socket!!.receive(packet)

                    val data = packet.data
                    val payloadType = data[1].toInt() and 0x7F
                    val seqNum = ((data[2].toInt() and 0xFF) shl 8) or
                            (data[3].toInt() and 0xFF)
                    val timestamp = ByteBuffer.wrap(data, 4, 4)
                        .order(ByteOrder.BIG_ENDIAN).int.toLong() and 0xFFFFFFFFL

                    // Извлекаем payload (после RTP заголовка)
                    val csrcCount = data[0].toInt() and 0x0F
                    val hasExtension = (data[0].toInt() and 0x10) != 0
                    var offset = 12 + csrcCount * 4

                    if (hasExtension && offset + 4 <= packet.length) {
                        val extLen = ((data[offset + 2].toInt() and 0xFF) shl 8) or
                                (data[offset + 3].toInt() and 0xFF)
                        offset += 4 + extLen * 4
                    }

                    if (offset < packet.length) {
                        val payload = data.copyOfRange(offset, packet.length)
                        onPacket(payload, timestamp, seqNum)
                    }

                } catch (e: Exception) {
                    if (isRunning) {
                        Log.e(TAG, "Ошибка приёма RTP", e)
                    }
                }
            }
        }, "RTP-${if (isVideo) "Video" else "Audio"}-$port")

        thread!!.priority = Thread.MAX_PRIORITY
        thread!!.start()
        Log.i(TAG, "RTP приёмник запущен на порту $port (${if (isVideo) "видео" else "аудио"})")
    }

    fun stop() {
        isRunning = false
        socket?.close()
        thread?.interrupt()
        Log.i(TAG, "RTP приёмник остановлен")
    }
}
