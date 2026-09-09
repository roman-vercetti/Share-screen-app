package com.example.screenmirror

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context

class App : Application() {

    companion object {
        const val CHANNEL_ID = "airplay_channel"

        private lateinit var instance: App

        fun getContext(): Context = instance.applicationContext
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "AirPlay Service",
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "Уведомления сервиса AirPlay"
        }
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }
}
