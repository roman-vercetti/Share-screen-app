package com.example.screenmirror

import android.app.Notification
import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import android.view.Surface
import androidx.core.app.NotificationCompat
import androidx.lifecycle.MutableLiveData
import com.example.screenmirror.airplay.AirPlayServer
import com.example.screenmirror.network.MDNSAdvertiser
import com.example.screenmirror.render.AudioRenderer
import com.example.screenmirror.render.VideoRenderer

class AirPlayService : Service() {

    companion object {
        private const val TAG = "AirPlayService"
        const val PORT = 7000

        val connectionState = MutableLiveData(ConnectionState.WAITING)
        private var videoRenderer: VideoRenderer? = null
        private var audioRenderer: AudioRenderer? = null

        fun setSurface(surface: Surface?) {
            videoRenderer?.setSurface(surface)
        }
    }

    private lateinit var mdnsAdvertiser: MDNSAdvertiser
    private lateinit var airPlayServer: AirPlayServer

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "Сервис создан")

        // Создаём рендереры
        videoRenderer = VideoRenderer()
        audioRenderer = AudioRenderer()

        // Запускаем mDNS рекламу
        mdnsAdvertiser = MDNSAdvertiser()
        mdnsAdvertiser.start("Android TV Mirror", PORT)

        // Запускаем AirPlay сервер
        airPlayServer = AirPlayServer(
            port = PORT,
            onVideoFrame = { frame -> videoRenderer?.feedFrame(frame) },
            onAudioFrame = { frame -> audioRenderer?.feedFrame(frame) },
            onConnectionChange = { state -> connectionState.postValue(state) }
        )
        airPlayServer.start()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification: Notification = NotificationCompat.Builder(this, App.CHANNEL_ID)
            .setContentTitle("Screen Mirror")
            .setContentText("Ожидание подключения iPhone...")
            .setSmallIcon(android.R.drawable.ic_menu_share)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
        startForeground(1, notification)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "Сервис уничтожен")
        try {
            mdnsAdvertiser.stop()
            airPlayServer.stop()
            videoRenderer?.stop()
            audioRenderer?.stop()
        } catch (e: Exception) {
            Log.e(TAG, "Ошибка при остановке", e)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
