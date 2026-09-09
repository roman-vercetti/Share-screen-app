package com.example.screenmirror.network

data class RTPPacket(
    val version: Int,
    val payloadType: Int,
    val sequenceNumber: Int,
    val timestamp: Long,
    val payload: ByteArray
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as RTPPacket
        return sequenceNumber == other.sequenceNumber && timestamp == other.timestamp
    }

    override fun hashCode(): Int {
        var result = version
        result = 31 * result + payloadType
        result = 31 * result + sequenceNumber
        result = 31 * result + timestamp.hashCode()
        return result
    }
}
