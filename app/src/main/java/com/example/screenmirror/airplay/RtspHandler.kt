package com.example.screenmirror.airplay

import android.util.Log
import io.netty.buffer.Unpooled
import io.netty.channel.ChannelHandlerContext
import io.netty.channel.SimpleChannelInboundHandler
import io.netty.handler.codec.http.*
import java.nio.charset.StandardCharsets
import java.util.*

class RtspHandler(
    private val onMirrorStart: (MirrorConfig) -> Unit,
    private val onMirrorStop: () -> Unit
) : SimpleChannelInboundHandler<FullHttpRequest>() {

    private val TAG = "RtspHandler"
    private val sessionId = UUID.randomUUID().toString().take(8)

    // RTSP методы (кастомные, т.к. Netty знает только HTTP)
    private val METHOD_OPTIONS = HttpMethod.valueOf("OPTIONS")
    private val METHOD_ANNOUNCE = HttpMethod.valueOf("ANNOUNCE")
    private val METHOD_SETUP = HttpMethod.valueOf("SETUP")
    private val METHOD_RECORD = HttpMethod.valueOf("RECORD")
    private val METHOD_TEARDOWN = HttpMethod.valueOf("TEARDOWN")
    private val METHOD_GET_PARAMETER = HttpMethod.valueOf("GET_PARAMETER")
    private val METHOD_SET_PARAMETER = HttpMethod.valueOf("SET_PARAMETER")
    private val METHOD_PAUSE = HttpMethod.valueOf("PAUSE")
    private val METHOD_FLUSH = HttpMethod.valueOf("FLUSH")

    override fun channelRead0(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val uri = request.uri()
        val method = request.method()
        Log.d(TAG, "Запрос: $method $uri")

        when (method) {
            METHOD_OPTIONS -> handleOptions(ctx, request)
            METHOD_ANNOUNCE -> handleAnnounce(ctx, request)
            METHOD_SETUP -> handleSetup(ctx, request)
            METHOD_GET_PARAMETER -> handleKeepAlive(ctx, request)
            METHOD_SET_PARAMETER -> handleSetParameter(ctx, request)
            METHOD_RECORD -> handleRecord(ctx, request)
            METHOD_TEARDOWN -> handleTeardown(ctx, request)
            METHOD_PAUSE, METHOD_FLUSH -> handleOk(ctx, request)
            else -> sendError(ctx, request, HttpResponseStatus.METHOD_NOT_ALLOWED)
        }
    }

    private fun handleOptions(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        response.headers().set("Public",
            "OPTIONS, ANNOUNCE, SETUP, RECORD, PAUSE, FLUSH, TEARDOWN, GET_PARAMETER, SET_PARAMETER")
        ctx.writeAndFlush(response)
    }

    private fun handleAnnounce(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val sdpContent = request.content().toString(StandardCharsets.UTF_8)
        val sdp = SDPParser.parse(sdpContent)

        val config = MirrorConfig(
            videoCodec = sdp.videoCodec,
            audioCodec = sdp.audioCodec,
            width = sdp.width ?: 1920,
            height = sdp.height ?: 1080,
            fps = sdp.fps ?: 60
        )

        onMirrorStart(config)

        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        response.headers().set("Session", sessionId)
        ctx.writeAndFlush(response)
    }

    private fun handleSetup(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        response.headers().set("Session", sessionId)
        response.headers().set("Transport", "RTP/AVP/UDP;unicast;client_port=0-1")
        response.headers().set("Connection", "keep-alive")
        ctx.writeAndFlush(response)
    }

    private fun handleRecord(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        ctx.writeAndFlush(response)
    }

    private fun handleKeepAlive(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        ctx.writeAndFlush(response)
    }

    private fun handleSetParameter(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        ctx.writeAndFlush(response)
    }

    private fun handleTeardown(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        onMirrorStop()

        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        ctx.writeAndFlush(response)
        ctx.close()
    }

    private fun handleOk(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        ctx.writeAndFlush(response)
    }

    private fun sendError(ctx: ChannelHandlerContext, request: FullHttpRequest, status: HttpResponseStatus) {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            status,
            Unpooled.copiedBuffer(status.toString(), StandardCharsets.UTF_8)
        )
        response.headers().set("CSeq", getCSeq(request))
        response.headers().set("Content-Type", "text/plain")
        ctx.writeAndFlush(response)
    }

    private fun getCSeq(request: FullHttpRequest): String =
        request.headers().get("CSeq") ?: "1"

    override fun exceptionCaught(ctx: ChannelHandlerContext, cause: Throwable) {
        Log.e(TAG, "Ошибка в RTSP", cause)
        ctx.close()
    }
}
