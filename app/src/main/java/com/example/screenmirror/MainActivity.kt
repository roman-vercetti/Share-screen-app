package com.example.screenmirror

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.SurfaceHolder
import android.view.View
import android.widget.TextView

class MainActivity : Activity() {

    private lateinit var surfaceView: android.widget.SurfaceView
    private lateinit var statusText: TextView
    private lateinit var overlay: View

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        surfaceView = findViewById(R.id.surfaceView)
        statusText = findViewById(R.id.statusText)
        overlay = findViewById(R.id.overlay)

        // Запускаем фоновый сервис
        val serviceIntent = Intent(this, AirPlayService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }

        // Подписываемся на состояние подключения
        AirPlayService.connectionState.observe(this) { state ->
            when (state) {
                ConnectionState.WAITING -> {
                    overlay.visibility = View.VISIBLE
                    statusText.text = "Ожидание подключения..."
                }
                ConnectionState.CONNECTED -> {
                    overlay.visibility = View.GONE
                }
                ConnectionState.DISCONNECTED -> {
                    overlay.visibility = View.VISIBLE
                    statusText.text = "Соединение потеряно"
                }
            }
        }

        // Привязываем Surface к рендереру
        surfaceView.holder.addCallback(object : SurfaceHolder.Callback {
            override fun surfaceCreated(holder: SurfaceHolder) {
                AirPlayService.setSurface(holder.surface)
            }
            override fun surfaceChanged(holder: SurfaceHolder, format: Int, w: Int, h: Int) {}
            override fun surfaceDestroyed(holder: SurfaceHolder) {
                AirPlayService.setSurface(null)
            }
        })
    }

    override fun onDestroy() {
        super.onDestroy()
        stopService(Intent(this, AirPlayService::class.java))
    }
}
