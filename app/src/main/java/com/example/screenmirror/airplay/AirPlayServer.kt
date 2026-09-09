package com.example.screenmirror.airplay

import android.util.Log
import com.example.screenmirror.ConnectionState
import io.netty.bootstrap.ServerBootstrap
import io.netty.channel.*
import io.netty.channel.nio.NioEventLoopGroup
import io.netty.channel.socket.SocketChannel
import io.netty.channel.socket.nio.NioServerSocketChannel
import io.netty.handler.codec.http.*

class AirPlayServer(
    private val port: Int,
    private val onVideoFrame: (ByteArray) -> Unit,
    private val onAudioFrame: (ByteArray) -> Unit,
    private val onConnectionChange: (ConnectionState) -> Unit
) {
    private val TAG = "AirPlayServer"
    private var bossGroup: NioEventLoopGroup? = null
    private var workerGroup: NioEventLoopGroup? = null
    private var channel: Channel? = null

    fun start() {
        bossGroup = NioEventLoopGroup(1)
        workerGroup = NioEventLoopGroup()

        try {
            val bootstrap = ServerBootstrap()
                .group(bossGroup, workerGroup)
                .channel(NioServerSocketChannel::class.java)
                .childOption(ChannelOption.SO_REUSEADDR, true)
                .childOption(ChannelOption.TCP_NODELAY, true)
                .childHandler(object : ChannelInitializer<SocketChannel>() {
                    override fun initChannel(ch: SocketChannel) {
                        ch.pipeline().apply {
                            addLast(HttpServerCodec())
                            addLast(HttpObjectAggregator(65536))
                            addLast(RtspHandler(
                                onMirrorStart = { config ->
                                    Log.d(TAG, "Mirror started: $config")
                                    onConnectionChange(ConnectionState.CONNECTED)
                                },
                                onMirrorStop = {
                                    Log.d(TAG, "Mirror stopped")
                                    onConnectionChange(ConnectionState.DISCONNECTED)
                                }
                            ))
                        }
                    }
                })

            channel = bootstrap.bind(port).sync().channel()
            Log.i(TAG, "AirPlay сервер запущен на порту $port")
        } catch (e: Exception) {
            Log.e(TAG, "Ошибка запуска сервера", e)
        }
    }

    fun stop() {
        channel?.close()
        bossGroup?.shutdownGracefully()
        workerGroup?.shutdownGracefully()
        Log.i(TAG, "AirPlay сервер остановлен")
    }
}
