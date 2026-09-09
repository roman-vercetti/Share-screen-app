package com.example.screenmirror.airplay

import android.util.Log

data class SDPInfo(
    val videoCodec: String = "H264",
    val audioCodec: String = "AAC",
    val width: Int? = null,
    val height: Int? = null,
    val fps: Int? = null
)

object SDPParser {
    private const val TAG = "SDPParser"

    fun parse(sdpContent: String): SDPInfo {
        Log.d(TAG, "Парсинг SDP:\n$sdpContent")

        var videoCodec = "H264"
        var audioCodec = "AAC"
        var width: Int? = null
        var height: Int? = null
        var fps: Int? = null

        val lines = sdpContent.lines()
        for (line in lines) {
            when {
                line.startsWith("m=video") -> {
                    videoCodec = extractCodec(line) ?: "H264"
                }
                line.startsWith("m=audio") -> {
                    audioCodec = extractCodec(line) ?: "AAC"
                }
                line.startsWith("a=x-dimensions:") -> {
                    val dims = line.substringAfter(":").split(",")
                    if (dims.size == 2) {
                        width = dims[0].trim().toIntOrNull()
                        height = dims[1].trim().toIntOrNull()
                    }
                }
                line.startsWith("a=fmtp:") -> {
                    val params = line.substringAfter(":")
                    fps = extractFps(params)
                }
            }
        }

        return SDPInfo(
            videoCodec = videoCodec,
            audioCodec = audioCodec,
            width = width,
            height = height,
            fps = fps
        )
    }

    private fun extractCodec(line: String): String? {
        return when {
            line.contains("H264", ignoreCase = true) -> "H264"
            line.contains("H.264", ignoreCase = true) -> "H264"
            line.contains("AAC", ignoreCase = true) -> "AAC"
            else -> null
        }
    }

    private fun extractFps(params: String): Int? {
        val fpsMatch = Regex("fps=(\\d+)").find(params)
        return fpsMatch?.groupValues?.get(1)?.toIntOrNull()
    }
}
