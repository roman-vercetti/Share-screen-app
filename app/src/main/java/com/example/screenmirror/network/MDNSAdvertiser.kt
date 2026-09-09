package com.example.screenmirror.network

import android.content.Context
import android.net.wifi.WifiManager
import android.util.Log
import com.example.screenmirror.App
import com.example.screenmirror.airplay.PairingManager
import javax.jmdns.JmDNS
import javax.jmdns.ServiceInfo
import java.net.InetAddress
import java.util.*

class MDNSAdvertiser {
    private val TAG = "MDNSAdvertiser"
    private var jmdns: JmDNS? = null
    private var serviceInfo: ServiceInfo? = null
    private var multicastLock: WifiManager.MulticastLock? = null

    fun start(deviceName: String, port: Int) {
        val context = App.getContext()
        val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as WifiManager

        // Блокируем multicast (важно для mDNS!)
        multicastLock = wifiManager.createMulticastLock("AirPlayMDNS").apply {
            setReferenceCounted(true)
            acquire()
        }

        val localAddress = getLocalInetAddress()
        jmdns = JmDNS.create(localAddress)

        // Генерируем RSA ключи для pairing
        val keyPair = PairingManager.generateRSAKeyPair()
        val publicKeyBase64 = PairingManager.getPublicKeyBase64(keyPair)

        val txtRecords = mapOf(
            "model" to "AppleTV3,2",
            "deviceid" to getDeviceMAC(),
            "features" to "0x5A7FFFF7,0x1E",
            "srcvers" to "300.64",
            "pk" to publicKeyBase64,
            "pi" to UUID.randomUUID().toString(),
            "vv" to "1",
            "flags" to "0x4",
            "gid" to UUID.randomUUID().toString()
        )

        serviceInfo = ServiceInfo.create(
            "_airplay._tcp.local.",
            deviceName,
            port,
            0, 0,
            txtRecords
        )

        jmdns!!.registerService(serviceInfo!!)
        Log.i(TAG, "AirPlay сервис опубликован: $deviceName на порту $port")
    }

    fun stop() {
        try {
            serviceInfo?.let { jmdns?.unregisterService(it) }
            jmdns?.close()
            multicastLock?.release()
            Log.i(TAG, "mDNS остановлен")
        } catch (e: Exception) {
            Log.e(TAG, "Ошибка остановки mDNS", e)
        }
    }

    private fun getLocalInetAddress(): InetAddress {
        val wifiManager = App.getContext()
            .getSystemService(Context.WIFI_SERVICE) as WifiManager
        val wifiInfo = wifiManager.connectionInfo
        val ipInt = wifiInfo.ipAddress
        return InetAddress.getByAddress(
            byteArrayOf(
                (ipInt and 0xff).toByte(),
                (ipInt shr 8 and 0xff).toByte(),
                (ipInt shr 16 and 0xff).toByte(),
                (ipInt shr 24 and 0xff).toByte()
            )
        )
    }

    private fun getDeviceMAC(): String {
        return "FA:KE:MA:CA:DD:RE" // Заменить на реальный MAC
    }
}
