package com.example.screenmirror.airplay

data class MirrorConfig(
    val videoCodec: String = "H264",
    val audioCodec: String = "AAC",
    val width: Int = 1920,
    val height: Int = 1080,
    val fps: Int = 60
)
