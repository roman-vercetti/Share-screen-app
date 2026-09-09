import { useState } from 'react';

type Tab = 'overview' | 'architecture' | 'airplay' | 'receiver' | 'renderer' | 'build' | 'code';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [codeTab, setCodeTab] = useState<string>('build-gradle');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Обзор', icon: 'fa-eye' },
    { id: 'architecture', label: 'Архитектура', icon: 'fa-sitemap' },
    { id: 'airplay', label: 'AirPlay', icon: 'fa-broadcast-tower' },
    { id: 'receiver', label: 'Приёмник', icon: 'fa-satellite-dish' },
    { id: 'renderer', label: 'Рендеринг', icon: 'fa-tv' },
    { id: 'build', label: 'Сборка', icon: 'fa-hammer' },
    { id: 'code', label: 'Код', icon: 'fa-code' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <i className="fas fa-mobile-screen text-3xl text-blue-400"></i>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                iPhone → Android TV Screen Mirror
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Полное руководство по разработке приложения трансляции экрана
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <i className={`fas ${tab.icon} text-xs`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'architecture' && <ArchitectureSection />}
        {activeTab === 'airplay' && <AirPlaySection />}
        {activeTab === 'receiver' && <ReceiverSection />}
        {activeTab === 'renderer' && <RendererSection />}
        {activeTab === 'build' && <BuildSection />}
        {activeTab === 'code' && <CodeSection codeTab={codeTab} setCodeTab={setCodeTab} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Руководство по разработке • Android TV + AirPlay Receiver</p>
          <p className="mt-1">Используйте OpenSource библиотеки: JMDNS, ExoPlayer, Netty</p>
        </div>
      </footer>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-8 border border-blue-800/30">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <i className="fas fa-rocket text-blue-400"></i>
          Что мы создаём
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Android TV приложение, которое принимает видеопоток с iPhone через протокол 
          <span className="text-blue-400 font-semibold"> AirPlay </span> 
          и отображает его на экране телевизора. iPhone видит наше приложение как AirPlay-совместимый приёмник 
          и может транслировать экран, видео или аудио.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon="fa-mobile-screen"
          title="iPhone (Источник)"
          description="Отправляет экран через AirPlay Mirror. Использует H.264 видео + AAC аудио в RTP пакетах."
          color="blue"
        />
        <FeatureCard
          icon="fa-network-wired"
          title="Локальная сеть"
          description="mDNS для обнаружения + RTP/RTSP для передачи данных. Всё в одной WiFi сети."
          color="purple"
        />
        <FeatureCard
          icon="fa-tv"
          title="Android TV (Приёмник)"
          description="Принимает поток, декодирует H.264 и рендерит через SurfaceView/ExoPlayer."
          color="green"
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-list-check text-green-400"></i>
          Ключевые компоненты
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ComponentItem
            number="1"
            title="mDNS/DNS-SD Service"
            description="Регистрация _airplay._tcp сервиса для обнаружения iPhone"
          />
          <ComponentItem
            number="2"
            title="AirPlay Pairing"
            description="Обработка сопряжения и RSA-аутентификации"
          />
          <ComponentItem
            number="3"
            title="RTP Receiver"
            description="Приём RTP пакетов с H.264 видео и AAC аудио"
          />
          <ComponentItem
            number="4"
            title="Video Decoder"
            description="Декодирование H.264 через MediaCodec (аппаратное)"
          />
          <ComponentItem
            number="5"
            title="Audio Decoder"
            description="Декодирование AAC через MediaCodec"
          />
          <ComponentItem
            number="6"
            title="A/V Sync Renderer"
            description="Синхронизированный вывод видео и аудио"
          />
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">
          <i className="fas fa-triangle-exclamation"></i>
          Важные замечания
        </h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <i className="fas fa-circle text-yellow-500 text-xs mt-2"></i>
            <span>Протокол AirPlay не документирован официально Apple. Используем reverse-engineered спецификации.</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fas fa-circle text-yellow-500 text-xs mt-2"></i>
            <span>iOS 17+ использует AirPlay 2 с дополнительным шифрованием. Потребуется обработка новых протоколов.</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fas fa-circle text-yellow-500 text-xs mt-2"></i>
            <span>Для production нужна RSA-пара ключей и обработка PIN-кода сопряжения.</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fas fa-circle text-yellow-500 text-xs mt-2"></i>
            <span>Задержка обычно 100-300мс при хорошем WiFi. Для игр может быть недостаточно.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <i className="fas fa-sitemap text-purple-400"></i>
        Архитектура системы
      </h2>

      {/* Architecture Diagram */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <h3 className="text-lg font-bold mb-6 text-center">Схема взаимодействия</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* iPhone */}
          <div className="bg-blue-900/40 border border-blue-700 rounded-xl p-6 text-center w-64">
            <i className="fas fa-mobile-screen text-4xl text-blue-400 mb-3"></i>
            <h4 className="font-bold text-blue-300">iPhone</h4>
            <div className="mt-3 space-y-1 text-xs text-gray-400">
              <div className="bg-blue-800/30 rounded px-2 py-1">Screen Capture</div>
              <div className="bg-blue-800/30 rounded px-2 py-1">H.264 Encoder</div>
              <div className="bg-blue-800/30 rounded px-2 py-1">AAC Encoder</div>
              <div className="bg-blue-800/30 rounded px-2 py-1">RTP Sender</div>
            </div>
          </div>

          {/* Arrows */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-purple-400 text-sm font-mono">mDNS</div>
            <i className="fas fa-arrows-left-right text-2xl text-purple-400"></i>
            <div className="text-purple-400 text-sm font-mono">RTP/RTSP</div>
          </div>

          {/* Android TV */}
          <div className="bg-green-900/40 border border-green-700 rounded-xl p-6 text-center w-64">
            <i className="fas fa-tv text-4xl text-green-400 mb-3"></i>
            <h4 className="font-bold text-green-300">Android TV</h4>
            <div className="mt-3 space-y-1 text-xs text-gray-400">
              <div className="bg-green-800/30 rounded px-2 py-1">mDNS Advertiser</div>
              <div className="bg-green-800/30 rounded px-2 py-1">RTP Receiver</div>
              <div className="bg-green-800/30 rounded px-2 py-1">H.264 Decoder</div>
              <div className="bg-green-800/30 rounded px-2 py-1">SurfaceView</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-arrows-spin text-blue-400"></i>
          Поток данных
        </h3>
        <div className="space-y-4">
          <FlowStep
            step={1}
            title="Обнаружение"
            description="Android TV регистрирует _airplay._tcp сервис через mDNS. iPhone сканирует сеть и находит наш сервис."
            color="blue"
          />
          <FlowStep
            step={2}
            title="Соединение"
            description="iPhone устанавливает RTSP сессию. Происходит обмен параметрами (кодеки, разрешение, FPS)."
            color="purple"
          />
          <FlowStep
            step={3}
            title="Передача"
            description="iPhone отправляет RTP пакеты с H.264 NAL-юнитами на видео-порт и AAC фреймы на аудио-порт."
            color="green"
          />
          <FlowStep
            step={4}
            title="Декодирование"
            description="Android TV принимает RTP, извлекает NAL-юниты, декодирует через MediaCodec в SurfaceView."
            color="orange"
          />
          <FlowStep
            step={5}
            title="Отображение"
            description="Декодированные фреймы рендерятся на экране TV с минимальной задержкой."
            color="pink"
          />
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-layer-group text-green-400"></i>
          Технологический стек
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <TechItem name="Kotlin" description="Основной язык разработки" />
          <TechItem name="JMDNS" description="mDNS/DNS-SD библиотека для Java" />
          <TechItem name="Netty" description="NIO фреймворк для RTP сервера" />
          <TechItem name="MediaCodec" description="Аппаратное декодирование H.264/AAC" />
          <TechItem name="ExoPlayer" description="Альтернативный рендерер с A/V sync" />
          <TechItem name="BouncyCastle" description="RSA/криптография для AirPlay pairing" />
        </div>
      </div>
    </div>
  );
}

function AirPlaySection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <i className="fas fa-broadcast-tower text-blue-400"></i>
        Протокол AirPlay
      </h2>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">mDNS регистрация сервиса</h3>
        <p className="text-gray-300 mb-4">
          Для обнаружения iPhone, Android TV должен зарегистрировать AirPlay сервис в локальной сети:
        </p>
        <CodeBlock
          language="kotlin"
          code={`// Регистрация AirPlay сервиса через JMDNS
val jmdns = JmDNS.create(InetAddress.getLocalHost())

val info = ServiceInfo.create(
    "_airplay._tcp.local.",     // тип сервиса
    "Android TV Screen",         // имя устройства
    7000,                        // порт HTTP сервера
    "model=AppleTV3,2",          // TXT записи
    "deviceid=FA:KE:MA:CA:DD:RE",
    "features=0x5A7FFFF7,0x1E", // поддерживаемые фичи
    "srcvers=300.64",            // версия AirPlay
    "vv=1"                       // версия протокола
)

jmdns.registerService(info)
Log.d("AirPlay", "Сервис зарегистрирован, iPhone может нас найти")`}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">TXT Records (ключевые параметры)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-2 px-3 text-blue-400">Параметр</th>
                <th className="text-left py-2 px-3 text-blue-400">Значение</th>
                <th className="text-left py-2 px-3 text-blue-400">Описание</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono text-xs">model</td>
                <td className="py-2 px-3 font-mono text-xs">AppleTV3,2</td>
                <td className="py-2 px-3">Модель устройства (притворяемся Apple TV)</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono text-xs">features</td>
                <td className="py-2 px-3 font-mono text-xs">0x5A7FFFF7,0x1E</td>
                <td className="py-2 px-3">Битовая маска возможностей</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono text-xs">deviceid</td>
                <td className="py-2 px-3 font-mono text-xs">XX:XX:XX:XX:XX:XX</td>
                <td className="py-2 px-3">Уникальный MAC-адрес</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono text-xs">srcvers</td>
                <td className="py-2 px-3 font-mono text-xs">300.64</td>
                <td className="py-2 px-3">Версия AirPlay источника</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono text-xs">pk</td>
                <td className="py-2 px-3 font-mono text-xs">base64...</td>
                <td className="py-2 px-3">Публичный RSA ключ (для pairing)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-xs">pi</td>
                <td className="py-2 px-3 font-mono text-xs">uuid</td>
                <td className="py-2 px-3">Pairing identifier</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">RTSP сессия (Screen Mirroring)</h3>
        <p className="text-gray-300 mb-4">
          После обнаружения iPhone инициирует RTSP сессию для зеркального отображения:
        </p>
        <CodeBlock
          language="http"
          code={`// 1. iPhone → TV: OPTIONS
OPTIONS * RTSP/1.0
CSeq: 1
Apple-Protocol: AirPlayV2
User-Agent: AirPlay/300.64

// 2. TV → iPhone: 200 OK
RTSP/1.0 200 OK
CSeq: 1
Public: ANNOUNCE, SETUP, RECORD, PAUSE, FLUSH, TEARDOWN

// 3. iPhone → TV: ANNOUNCE (SDP описание)
ANNOUNCE /mirror RTSP/1.0
CSeq: 2
Content-Type: application/sdp

v=0
o=iPhone 0 0 IN IP4 192.168.1.100
s=ScreenMirror
t=0 0
m=video 0 RTP/AVP 96
a=rtpmap:96 H264/90000
a=fmtp:96 packetization-mode=1
m=audio 0 RTP/AVP 97
a=rtpmap:97 MPEG4-GENERIC/44100/2
a=fmtp:97 mode=AAC-hbr

// 4. iPhone → TV: SETUP (видео)
SETUP /mirror/stream RTSP/1.0
CSeq: 3
Transport: RTP/AVP/UDP;unicast;interleaved=0-1
// Ответ содержит порты для RTP

// 5. iPhone → TV: RECORD (начать передачу)
RECORD /mirror RTSP/1.0
CSeq: 4
Session: <session-id>`}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">RTP формат пакетов</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Видео RTP</h4>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300">
              <div>┌──────────────────────────┐</div>
              <div>│ RTP Header (12 bytes)    │</div>
              <div>│  - Payload Type: 96      │</div>
              <div>│  - Sequence Number       │</div>
              <div>│  - Timestamp (90kHz)     │</div>
              <div>├──────────────────────────┤</div>
              <div>│ Payload Header (var)     │</div>
              <div>│  - Payload Size          │</div>
              <div>│  - Timestamp (µs)        │</div>
              <div>├──────────────────────────┤</div>
              <div>│ H.264 NAL Units          │</div>
              <div>│  - SPS/PPS (key frame)   │</div>
              <div>│  - IDR slice             │</div>
              <div>│  - Non-IDR slices        │</div>
              <div>└──────────────────────────┘</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-green-400 mb-2">Аудио RTP</h4>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300">
              <div>┌──────────────────────────┐</div>
              <div>│ RTP Header (12 bytes)    │</div>
              <div>│  - Payload Type: 97      │</div>
              <div>│  - Sequence Number       │</div>
              <div>│  - Timestamp (44.1kHz)   │</div>
              <div>├──────────────────────────┤</div>
              <div>│ AAC-LC Frame             │</div>
              <div>│  - 1024 samples/frame    │</div>
              <div>│  - 44100 Hz sample rate  │</div>
              <div>│  - Stereo (2 channels)   │</div>
              <div>│  - ~128 kbps bitrate     │</div>
              <div>└──────────────────────────┘</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceiverSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <i className="fas fa-satellite-dish text-green-400"></i>
        Реализация приёмника
      </h2>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">HTTP/RTSP сервер</h3>
        <p className="text-gray-300 mb-4">
          Основной сервер обрабатывает RTSP запросы от iPhone:
        </p>
        <CodeBlock
          language="kotlin"
          code={`class AirPlayServer(private val port: Int) {
    private lateinit var server: NettyServer
    private var currentSession: MirrorSession? = null

    fun start() {
        server = NettyServer()
            .group(NioEventLoopGroup(), NioEventLoopGroup())
            .channel(NioServerSocketChannel::class.java)
            .childHandler(object : ChannelInitializer<SocketChannel>() {
                override fun initChannel(ch: SocketChannel) {
                    ch.pipeline().apply {
                        addLast(HttpServerCodec())
                        addLast(HttpObjectAggregator(65536))
                        addLast(RtspRequestDecoder())
                        addLast(RtspResponseEncoder())
                        addLast(AirPlayHandler(this@AirPlayServer))
                    }
                }
            })
            .bind(port)
            .sync()

        Log.d("AirPlayServer", "Сервер запущен на порту $port")
    }

    // Обработка RTSP запросов
    fun handleRequest(ctx: ChannelHandlerContext, request: RtspRequest) {
        when (request.method) {
            RtspMethod.OPTIONS -> handleOptions(ctx, request)
            RtspMethod.ANNOUNCE -> handleAnnounce(ctx, request)
            RtspMethod.SETUP -> handleSetup(ctx, request)
            RtspMethod.RECORD -> handleRecord(ctx, request)
            RtspMethod.TEARDOWN -> handleTeardown(ctx, request)
            else -> sendResponse(ctx, request, RtspResponseStatus.METHOD_NOT_VALID)
        }
    }

    private fun handleAnnounce(ctx: ChannelHandlerContext, request: RtspRequest) {
        // Парсим SDP для получения параметров кодеков
        val sdp = parseSDP(request.content.toString(CharsetUtil.UTF_8))
        
        currentSession = MirrorSession(
            videoCodec = sdp.videoCodec,      // H264
            audioCodec = sdp.audioCodec,      // AAC
            videoPort = allocatePort(),        // Порт для RTP видео
            audioPort = allocatePort()         // Порт для RTP аудио
        )

        // Создаём RTP приёмники
        currentSession!!.startReceivers()
        
        // Отправляем ответ с портами
        val response = buildSetupResponse(
            videoPort = currentSession!!.videoPort,
            audioPort = currentSession!!.audioPort
        )
        ctx.writeAndFlush(response)
    }
}`}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">RTP приёмник</h3>
        <CodeBlock
          language="kotlin"
          code={`class RTPReceiver(
    private val port: Int,
    private val onPacket: (RTPPacket) -> Unit
) {
    private var socket: DatagramSocket? = null
    private var isRunning = false

    fun start() {
        socket = DatagramSocket(port)
        socket!!.receiveBufferSize = 2 * 1024 * 1024 // 2MB буфер
        isRunning = true

        Thread {
            val buffer = ByteArray(65536)
            while (isRunning) {
                val packet = DatagramPacket(buffer, buffer.size)
                socket!!.receive(packet)
                
                val rtpPacket = parseRTP(packet.data, packet.length)
                onPacket(rtpPacket)
            }
        }.apply {
            name = "RTP-Receiver-$port"
            priority = Thread.MAX_PRIORITY
            start()
        }
    }

    private fun parseRTP(data: ByteArray, length: Int): RTPPacket {
        val version = (data[0].toInt() and 0xC0) shr 6
        val payloadType = data[1].toInt() and 0x7F
        val sequenceNumber = ((data[2].toInt() and 0xFF) shl 8) or 
                              (data[3].toInt() and 0xFF)
        val timestamp = ((data[4].toInt() and 0xFF) shl 24) or
                        ((data[5].toInt() and 0xFF) shl 16) or
                        ((data[6].toInt() and 0xFF) shl 8) or
                        (data[7].toInt() and 0xFF)

        val headerSize = 12 + ((data[0].toInt() and 0x0F) * 4)
        val payload = data.copyOfRange(headerSize, length)

        return RTPPacket(
            version = version,
            payloadType = payloadType,
            sequenceNumber = sequenceNumber,
            timestamp = timestamp,
            payload = payload
        )
    }

    fun stop() {
        isRunning = false
        socket?.close()
    }
}`}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">Сборка H.264 фреймов из RTP</h3>
        <p className="text-gray-300 mb-4">
          Один видеофрейм может быть разбит на несколько RTP пакетов. Нужно собрать их обратно:
        </p>
        <CodeBlock
          language="kotlin"
          code={`class H264FrameAssembler {
    private val pendingPackets = mutableMapOf<Int, MutableList<RTPPacket>>()
    private val frameQueue = LinkedBlockingQueue<ByteArray>(30)

    fun addPacket(packet: RTPPacket) {
        // AirPlay использует собственный заголовок перед NAL-юнитами
        val payloadHeader = parseAirPlayVideoHeader(packet.payload)
        val nalData = packet.payload.copyOfRange(payloadHeader.size, packet.payload.size)
        
        // Определяем, является ли пакет последним в фрейме
        val isLast = payloadHeader.isLastPacket
        
        if (!pendingPackets.containsKey(payloadHeader.frameId)) {
            pendingPackets[payloadHeader.frameId] = mutableListOf()
        }
        pendingPackets[payloadHeader.frameId]!!.add(packet)

        if (isLast) {
            // Все пакеты фрейма получены — собираем
            val frame = assembleFrame(pendingPackets.remove(payloadHeader.frameId)!!)
            frameQueue.offer(frame)
        }
    }

    private fun assembleFrame(packets: List<RTPPacket>): ByteArray {
        val output = ByteArrayOutputStream()
        
        // Добавляем start code (0x00 0x00 0x00 0x01) перед каждым NAL
        for (packet in packets.sortedBy { it.sequenceNumber }) {
            val header = parseAirPlayVideoHeader(packet.payload)
            val nalData = packet.payload.copyOfRange(header.size, packet.payload.size)
            
            output.write(byteArrayOf(0, 0, 0, 1)) // Annex B start code
            output.write(nalData)
        }
        
        return output.toByteArray()
    }

    fun pollFrame(): ByteArray? = frameQueue.poll()
}`}
        />
      </div>
    </div>
  );
}

function RendererSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <i className="fas fa-tv text-orange-400"></i>
        Рендеринг видео
      </h2>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">MediaCodec декодер + SurfaceView</h3>
        <CodeBlock
          language="kotlin"
          code={`class VideoRenderer(
    private val surfaceView: SurfaceView
) {
    private var decoder: MediaCodec? = null
    private var isRunning = false

    fun start() {
        val format = MediaFormat.createVideoFormat(
            MediaFormat.MIMETYPE_VIDEO_AVC, 1920, 1080
        ).apply {
            setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, 4 * 1024 * 1024)
            // SPS/PPS будут добавлены позже
        }

        decoder = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
        decoder!!.configure(format, surfaceView.holder.surface, null, 0)
        decoder!!.start()

        isRunning = true
        decodeLoop()
    }

    private fun decodeLoop() {
        Thread {
            val bufferInfo = MediaCodec.BufferInfo()
            
            while (isRunning) {
                // Подаём данные в декодер
                val inputIndex = decoder!!.dequeueInputBuffer(10000)
                if (inputIndex >= 0) {
                    val frame = frameAssembler.pollFrame()
                    if (frame != null) {
                        val inputBuffer = decoder!!.getInputBuffer(inputIndex)
                        inputBuffer?.clear()
                        inputBuffer?.put(frame)
                        decoder!!.queueInputBuffer(
                            inputIndex, 0, frame.size,
                            System.nanoTime() / 1000, 0
                        )
                    } else {
                        decoder!!.queueInputBuffer(
                            inputIndex, 0, 0, 0,
                            MediaCodec.BUFFER_FLAG_END_OF_STREAM
                        )
                    }
                }

                // Получаем декодированные фреймы
                var outputIndex = decoder!!.dequeueOutputBuffer(bufferInfo, 10000)
                while (outputIndex >= 0) {
                    // Рендерим на Surface (true = отобразить)
                    decoder!!.releaseOutputBuffer(outputIndex, true)
                    outputIndex = decoder!!.dequeueOutputBuffer(bufferInfo, 0)
                }
            }
        }.start()
    }

    // Обновление SPS/PPS при получении ключевых фреймов
    fun updateCodecConfig(sps: ByteArray, pps: ByteArray) {
        // MediaCodec может потребовать переконфигурацию
        val format = MediaFormat.createVideoFormat(
            MediaFormat.MIMETYPE_VIDEO_AVC, 1920, 1080
        ).apply {
            setByteBuffer("csd-0", ByteBuffer.wrap(sps))
            setByteBuffer("csd-1", ByteBuffer.wrap(pps))
        }
        // decoder!!.configure(format, surface, null, 0)
    }

    fun stop() {
        isRunning = false
        decoder?.stop()
        decoder?.release()
    }
}`}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">Аудио рендерер</h3>
        <CodeBlock
          language="kotlin"
          code={`class AudioRenderer {
    private var audioTrack: AudioTrack? = null
    private var decoder: MediaCodec? = null

    fun start() {
        // Настройка AudioTrack
        val sampleRate = 44100
        val channelConfig = AudioFormat.CHANNEL_OUT_STEREO
        val audioFormat = AudioFormat.ENCODING_PCM_16BIT
        
        val bufferSize = AudioTrack.getMinBufferSize(
            sampleRate, channelConfig, audioFormat
        ) * 2

        audioTrack = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setSampleRate(sampleRate)
                    .setChannelMask(channelConfig)
                    .setEncoding(audioFormat)
                    .build()
            )
            .setBufferSizeInBytes(bufferSize)
            .setTransferMode(AudioTrack.MODE_STREAM)
            .build()

        audioTrack!!.play()

        // AAC декодер
        val format = MediaFormat.createAudioFormat(
            MediaFormat.MIMETYPE_AUDIO_AAC, sampleRate, 2
        ).apply {
            setInteger(MediaFormat.KEY_AAC_PROFILE, 
                MediaCodecInfo.CodecProfileLevel.AACObjectLC)
            setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, 8192)
        }

        decoder = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_AUDIO_AAC)
        decoder!!.configure(format, null, null, 0)
        decoder!!.start()
    }

    fun decodeAndPlay(aacFrame: ByteArray) {
        val inputIndex = decoder!!.dequeueInputBuffer(10000)
        if (inputIndex >= 0) {
            val buffer = decoder!!.getInputBuffer(inputIndex)
            buffer?.clear()
            buffer?.put(aacFrame)
            decoder!!.queueInputBuffer(inputIndex, 0, aacFrame.size, 0, 0)
        }

        val bufferInfo = MediaCodec.BufferInfo()
        val outputIndex = decoder!!.dequeueOutputBuffer(bufferInfo, 10000)
        if (outputIndex >= 0) {
            val outputBuffer = decoder!!.getOutputBuffer(outputIndex)
            if (outputBuffer != null && bufferInfo.size > 0) {
                val pcmData = ByteArray(bufferInfo.size)
                outputBuffer.get(pcmData)
                audioTrack!!.write(pcmData, 0, pcmData.size)
            }
            decoder!!.releaseOutputBuffer(outputIndex, false)
        }
    }
}`}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">Layout Activity</h3>
        <CodeBlock
          language="xml"
          code={`<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:color/black">

    <!-- Видео с iPhone -->
    <SurfaceView
        android:id="@+id/surfaceView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_gravity="center" />

    <!-- Оверлей с информацией -->
    <LinearLayout
        android:id="@+id/overlay"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="top|center"
        android:layout_marginTop="32dp"
        android:background="#80000000"
        android:padding="16dp"
        android:orientation="horizontal"
        android:visibility="gone">

        <ImageView
            android:layout_width="24dp"
            android:layout_height="24dp"
            android:src="@drawable/ic_airplay" />

        <TextView
            android:id="@+id/statusText"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textColor="@android:color/white"
            android:text="Ожидание подключения..."
            android:layout_marginStart="8dp" />
    </LinearLayout>

</FrameLayout>`}
        />
      </div>
    </div>
  );
}

function BuildSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <i className="fas fa-hammer text-yellow-400"></i>
        Сборка проекта
      </h2>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">build.gradle (app)</h3>
        <CodeBlock
          language="groovy"
          code={`plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.example.screenmirror'
    compileSdk 34

    defaultConfig {
        applicationId "com.example.screenmirror"
        minSdk 26  // Android TV минимум
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = '17'
    }
}

dependencies {
    // mDNS для обнаружения
    implementation 'org.jmdns:jmdns:3.5.8'
    
    // Netty для сетевого сервера
    implementation 'io.netty:netty-all:4.1.100.Final'
    
    // BouncyCastle для криптографии
    implementation 'org.bouncycastle:bcprov-jdk18on:1.76'
    
    // ExoPlayer (опционально, для улучшенного рендеринга)
    implementation 'androidx.media3:media3-exoplayer:1.2.0'
    implementation 'androidx.media3:media3-exoplayer-hls:1.2.0'
    
    // AndroidX
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.leanback:leanback:1.0.0' // TV UI
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.6.2'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
}`}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">AndroidManifest.xml</h3>
        <CodeBlock
          language="xml"
          code={`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Разрешения -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />

    <!-- Android TV -->
    <uses-feature android:name="android.software.leanback" android:required="true" />
    <uses-feature android:name="android.hardware.wifi" android:required="true" />

    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.ScreenMirror">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="landscape"
            android:configChanges="orientation|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Фоновый сервис для AirPlay сервера -->
        <service
            android:name=".AirPlayService"
            android:exported="false"
            android:foregroundServiceType="mediaProjection" />

    </application>
</manifest>`}
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">Структура проекта</h3>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
          <pre>{`app/
├── src/main/
│   ├── java/com/example/screenmirror/
│   │   ├── MainActivity.kt          # UI Activity
│   │   ├── AirPlayService.kt        # Фоновый сервис
│   │   ├── airplay/
│   │   │   ├── AirPlayServer.kt     # HTTP/RTSP сервер
│   │   │   ├── RtspHandler.kt       # Обработка RTSP
│   │   │   ├── SDPParser.kt         # Парсинг SDP
│   │   │   ├── MirrorSession.kt     # Сессия зеркалирования
│   │   │   └── PairingManager.kt    # RSA pairing
│   │   ├── network/
│   │   │   ├── MDNSAdvertiser.kt    # mDNS регистрация
│   │   │   ├── RTPReceiver.kt       # Приём RTP пакетов
│   │   │   └── RTPPacket.kt         # Модель RTP пакета
│   │   ├── codec/
│   │   │   ├── H264Decoder.kt       # Видео декодер
│   │   │   ├── AACDecoder.kt        # Аудио декодер
│   │   │   └── H264FrameAssembler.kt # Сборка фреймов
│   │   └── render/
│   │       ├── VideoRenderer.kt     # Вывод видео
│   │       └── AudioRenderer.kt     # Вывод аудио
│   ├── res/
│   │   ├── layout/
│   │   │   └── activity_main.xml
│   │   └── values/
│   │       └── strings.xml
│   └── AndroidManifest.xml
└── build.gradle`}</pre>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">Пошаговая сборка</h3>
        <div className="space-y-3">
          <BuildStep step={1} text="Создайте новый проект в Android Studio (Empty Activity, Kotlin)" />
          <BuildStep step={2} text="Добавьте зависимости в build.gradle (JMDNS, Netty, BouncyCastle)" />
          <BuildStep step={3} text="Реализуйте MDNSAdvertiser для регистрации AirPlay сервиса" />
          <BuildStep step={4} text="Создайте AirPlayServer с обработкой RTSP запросов" />
          <BuildStep step={5} text="Реализуйте RTPReceiver для приёма видео/аудио пакетов" />
          <BuildStep step={6} text="Добавьте H264FrameAssembler для сборки фреймов" />
          <BuildStep step={7} text="Настройте MediaCodec декодер и SurfaceView рендерер" />
          <BuildStep step={8} text="Добавьте AudioRenderer с AAC декодированием" />
          <BuildStep step={9} text="Протестируйте на реальном устройстве Android TV" />
        </div>
      </div>
    </div>
  );
}

function CodeSection({ codeTab, setCodeTab }: { codeTab: string; setCodeTab: (tab: string) => void }) {
  const codeTabs = [
    { id: 'build-gradle', label: 'build.gradle' },
    { id: 'manifest', label: 'Manifest' },
    { id: 'main-activity', label: 'MainActivity' },
    { id: 'service', label: 'Service' },
    { id: 'mdns', label: 'mDNS' },
    { id: 'rtsp', label: 'RTSP' },
    { id: 'rtp', label: 'RTP' },
    { id: 'decoder', label: 'Decoder' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <i className="fas fa-code text-cyan-400"></i>
        Полный код
      </h2>

      <div className="flex flex-wrap gap-2">
        {codeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCodeTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              codeTab === tab.id
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {codeTab === 'build-gradle' && (
          <CodeBlock
            language="groovy"
            code={`plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.example.screenmirror'
    compileSdk 34

    defaultConfig {
        applicationId "com.example.screenmirror"
        minSdk 26
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'org.jmdns:jmdns:3.5.8'
    implementation 'io.netty:netty-all:4.1.100.Final'
    implementation 'org.bouncycastle:bcprov-jdk18on:1.76'
    implementation 'androidx.media3:media3-exoplayer:1.2.0'
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.leanback:leanback:1.0.0'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
}`}
          />
        )}

        {codeTab === 'manifest' && (
          <CodeBlock
            language="xml"
            code={`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <uses-feature android:name="android.software.leanback" android:required="true" />
    <uses-feature android:name="android.hardware.wifi" android:required="true" />

    <application
        android:allowBackup="true"
        android:label="Screen Mirror"
        android:supportsRtl="true"
        android:theme="@style/Theme.MaterialComponents.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="landscape"
            android:configChanges="orientation|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".AirPlayService"
            android:exported="false"
            android:foregroundServiceType="mediaProjection" />

    </application>
</manifest>`}
          />
        )}

        {codeTab === 'main-activity' && (
          <CodeBlock
            language="kotlin"
            code={`class MainActivity : Activity() {
    
    private lateinit var surfaceView: SurfaceView
    private lateinit var statusText: TextView
    private lateinit var overlay: View
    private var serviceIntent: Intent? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        surfaceView = findViewById(R.id.surfaceView)
        statusText = findViewById(R.id.statusText)
        overlay = findViewById(R.id.overlay)

        // Запускаем фоновый сервис
        serviceIntent = Intent(this, AirPlayService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }

        // Подписываемся на события
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
        serviceIntent?.let { stopService(it) }
    }
}`}
          />
        )}

        {codeTab === 'service' && (
          <CodeBlock
            language="kotlin"
            code={`class AirPlayService : Service() {
    
    companion object {
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
        
        // Создаём рендереры
        videoRenderer = VideoRenderer()
        audioRenderer = AudioRenderer()

        // Запускаем mDNS рекламу
        mdnsAdvertiser = MDNSAdvertiser().apply {
            start("Android TV Mirror", 7000)
        }

        // Запускаем AirPlay сервер
        airPlayServer = AirPlayServer(
            port = 7000,
            onVideoFrame = { frame -> videoRenderer?.feedFrame(frame) },
            onAudioFrame = { frame -> audioRenderer?.feedFrame(frame) },
            onConnectionChange = { state -> connectionState.postValue(state) }
        )
        airPlayServer.start()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Foreground service notification
        val notification = NotificationCompat.Builder(this, "airplay_channel")
            .setContentTitle("Screen Mirror")
            .setContentText("Ожидание подключения iPhone...")
            .setSmallIcon(R.drawable.ic_notification)
            .build()
        startForeground(1, notification)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        mdnsAdvertiser.stop()
        airPlayServer.stop()
        videoRenderer?.stop()
        audioRenderer?.stop()
    }

    override fun onBind(intent: Intent?) = null
}`}
          />
        )}

        {codeTab === 'mdns' && (
          <CodeBlock
            language="kotlin"
            code={`class MDNSAdvertiser {
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
        val keyPair = generateRSAKeyPair()
        val publicKeyBase64 = Base64.encodeToString(
            keyPair.public.encoded, Base64.NO_WRAP
        )

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
        Log.i("mDNS", "AirPlay сервис опубликован: \${deviceName}")
    }

    fun stop() {
        serviceInfo?.let { jmdns?.unregisterService(it) }
        jmdns?.close()
        multicastLock?.release()
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
}`}
          />
        )}

        {codeTab === 'rtsp' && (
          <CodeBlock
            language="kotlin"
            code={`class RtspHandler(
    private val onMirrorStart: (MirrorConfig) -> Unit,
    private val onMirrorStop: () -> Unit
) : SimpleChannelInboundHandler<FullHttpRequest>() {

    private var cseq = 0
    private var sessionId = UUID.randomUUID().toString().take(8)

    override fun channelRead0(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val method = request.headers().get("CSeq")?.let { 
            RtspMethod.fromRequest(request) 
        }

        when (request.method()) {
            HttpMethod.OPTIONS -> handleOptions(ctx, request)
            HttpMethod.ANNOUNCE -> handleAnnounce(ctx, request)  
            HttpMethod.SETUP -> handleSetup(ctx, request)
            HttpMethod.GET_PARAMETER -> handleGetParameter(ctx, request)
            HttpMethod.SET_PARAMETER -> handleSetParameter(ctx, request)
            HttpMethod.RECORD -> handleRecord(ctx, request)
            HttpMethod.TEARDOWN -> handleTeardown(ctx, request)
            else -> sendError(ctx, request, 405)
        }
    }

    private fun handleOptions(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val response = DefaultFullHttpResponse(
            HttpVersion.RTSP_1_0,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        response.headers().set("Public", 
            "OPTIONS, ANNOUNCE, SETUP, RECORD, PAUSE, FLUSH, TEARDOWN, GET_PARAMETER, SET_PARAMETER")
        ctx.writeAndFlush(response)
    }

    private fun handleAnnounce(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val sdpContent = request.content().toString(CharsetUtil.UTF_8)
        val sdp = SDPParser.parse(sdpContent)
        
        // Сохраняем конфигурацию зеркалирования
        val config = MirrorConfig(
            videoCodec = sdp.videoCodec,
            audioCodec = sdp.audioCodec,
            width = sdp.width ?: 1920,
            height = sdp.height ?: 1080,
            fps = sdp.fps ?: 60
        )
        
        onMirrorStart(config)

        val response = DefaultFullHttpResponse(
            HttpVersion.RTSP_1_0,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        response.headers().set("Session", sessionId)
        ctx.writeAndFlush(response)
    }

    private fun handleSetup(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val uri = request.uri()
        val transport = request.headers().get("Transport") ?: ""
        
        // Выделяем порты для RTP
        val videoPort = PortAllocator.allocate()
        val audioPort = PortAllocator.allocate()

        val response = DefaultFullHttpResponse(
            HttpVersion.RTSP_1_0,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        response.headers().set("Session", sessionId)
        response.headers().set("Transport", 
            "RTP/AVP/UDP;unicast;client_port=\${videoPort}-\${videoPort + 1}")
        response.headers().set("Connection", "keep-alive")
        ctx.writeAndFlush(response)
    }

    private fun handleRecord(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        val response = DefaultFullHttpResponse(
            HttpVersion.RTSP_1_0,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        ctx.writeAndFlush(response)
    }

    private fun handleTeardown(ctx: ChannelHandlerContext, request: FullHttpRequest) {
        onMirrorStop()
        
        val response = DefaultFullHttpResponse(
            HttpVersion.RTSP_1_0,
            HttpResponseStatus.OK
        )
        response.headers().set("CSeq", getCSeq(request))
        ctx.writeAndFlush(response)
        ctx.close()
    }

    private fun getCSeq(request: FullHttpRequest): String =
        request.headers().get("CSeq") ?: "1"
}`}
          />
        )}

        {codeTab === 'rtp' && (
          <CodeBlock
            language="kotlin"
            code={`class RTPReceiver(
    private val port: Int,
    private val isVideo: Boolean,
    private val onPacket: (ByteArray, Long, Int) -> Unit
) {
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
                    
                    // Парсим RTP заголовок
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
                    
                    if (hasExtension) {
                        val extLen = ((data[offset + 2].toInt() and 0xFF) shl 8) or
                                      (data[offset + 3].toInt() and 0xFF)
                        offset += 4 + extLen * 4
                    }

                    val payload = data.copyOfRange(offset, packet.length)
                    onPacket(payload, timestamp, seqNum)
                    
                } catch (e: SocketException) {
                    if (isRunning) Log.e("RTP", "Socket error", e)
                }
            }
        }, "RTP-\${if (isVideo) "Video" else "Audio"}-$port")
        
        thread!!.priority = Thread.MAX_PRIORITY
        thread!!.start()
    }

    fun stop() {
        isRunning = false
        socket?.close()
        thread?.interrupt()
    }
}

// Модель AirPlay Video Header
data class AirPlayVideoHeader(
    val payloadSize: Int,
    val timestampMicros: Long,
    val isLastPacket: Boolean,
    val frameId: Int
) {
    companion object {
        fun parse(data: ByteArray): AirPlayVideoHeader {
            // Apple использует собственный заголовок перед H.264 данными
            val payloadSize = ((data[0].toInt() and 0xFF) shl 8) or 
                               (data[1].toInt() and 0xFF)
            val timestampMicros = ByteBuffer.wrap(data, 2, 4)
                .order(ByteOrder.BIG_ENDIAN).int.toLong() and 0xFFFFFFFFL
            val flags = data[6].toInt() and 0xFF
            val isLast = (flags and 0x01) != 0
            
            return AirPlayVideoHeader(
                payloadSize = payloadSize,
                timestampMicros = timestampMicros,
                isLastPacket = isLast,
                frameId = (data[7].toInt() and 0xFF)
            )
        }
    }
}`}
          />
        )}

        {codeTab === 'decoder' && (
          <CodeBlock
            language="kotlin"
            code={`class H264Decoder(private val surface: Surface) {
    private var codec: MediaCodec? = null
    private var isRunning = false
    private val inputQueue = LinkedBlockingQueue<ByteArray>(60)

    fun start(width: Int = 1920, height: Int = 1080) {
        val format = MediaFormat.createVideoFormat(
            MediaFormat.MIMETYPE_VIDEO_AVC, width, height
        ).apply {
            setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, 4 * 1024 * 1024)
            setInteger(MediaFormat.KEY_LOW_LATENCY, 1) // Минимальная задержка
        }

        codec = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
        codec!!.setOnFrameRenderedListener({ _, _, _ ->
            // Фрейм отрендерен
        }, Handler(Looper.getMainLooper()))
        
        codec!!.configure(format, surface, null, 0)
        codec!!.start()
        isRunning = true

        // Поток декодирования
        Thread({
            val bufferInfo = MediaCodec.BufferInfo()
            while (isRunning) {
                // Input
                val inIndex = codec!!.dequeueInputBuffer(5000)
                if (inIndex >= 0) {
                    val frame = inputQueue.poll(10, TimeUnit.MILLISECONDS)
                    if (frame != null) {
                        val buffer = codec!!.getInputBuffer(inIndex)
                        buffer?.clear()
                        buffer?.put(frame)
                        codec!!.queueInputBuffer(inIndex, 0, frame.size, 
                            System.nanoTime() / 1000, 0)
                    } else {
                        codec!!.queueInputBuffer(inIndex, 0, 0, 0, 0)
                    }
                }

                // Output
                var outIndex = codec!!.dequeueOutputBuffer(bufferInfo, 5000)
                while (outIndex >= 0) {
                    codec!!.releaseOutputBuffer(outIndex, true) // render = true
                    outIndex = codec!!.dequeueOutputBuffer(bufferInfo, 0)
                }
            }
        }, "H264-Decoder").start()
    }

    fun feedFrame(nalUnit: ByteArray) {
        inputQueue.offer(nalUnit)
    }

    fun setSurface(newSurface: Surface?) {
        codec?.setOutputSurface(newSurface)
    }

    fun stop() {
        isRunning = false
        codec?.stop()
        codec?.release()
        codec = null
    }
}

class AACDecoder {
    private var codec: MediaCodec? = null
    private var audioTrack: AudioTrack? = null
    private var isRunning = false
    private val inputQueue = LinkedBlockingQueue<ByteArray>(100)

    fun start() {
        val sampleRate = 44100
        val channels = 2

        // AudioTrack
        val bufferSize = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_STEREO,
            AudioFormat.ENCODING_PCM_16BIT
        ) * 2

        audioTrack = AudioTrack.Builder()
            .setAudioAttributes(AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build())
            .setAudioFormat(AudioFormat.Builder()
                .setSampleRate(sampleRate)
                .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                .build())
            .setBufferSizeInBytes(bufferSize)
            .setTransferMode(AudioTrack.MODE_STREAM)
            .build()
        audioTrack!!.play()

        // AAC Decoder
        val format = MediaFormat.createAudioFormat(
            MediaFormat.MIMETYPE_AUDIO_AAC, sampleRate, channels
        ).apply {
            setInteger(MediaFormat.KEY_AAC_PROFILE,
                MediaCodecInfo.CodecProfileLevel.AACObjectLC)
            setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, 8192)
        }

        codec = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_AUDIO_AAC)
        codec!!.configure(format, null, null, 0)
        codec!!.start()
        isRunning = true

        Thread({
            val bufferInfo = MediaCodec.BufferInfo()
            while (isRunning) {
                val inIndex = codec!!.dequeueInputBuffer(5000)
                if (inIndex >= 0) {
                    val frame = inputQueue.poll(10, TimeUnit.MILLISECONDS)
                    if (frame != null) {
                        val buffer = codec!!.getInputBuffer(inIndex)
                        buffer?.clear()
                        buffer?.put(frame)
                        codec!!.queueInputBuffer(inIndex, 0, frame.size, 0, 0)
                    }
                }

                var outIndex = codec!!.dequeueOutputBuffer(bufferInfo, 5000)
                while (outIndex >= 0) {
                    val outputBuffer = codec!!.getOutputBuffer(outIndex)
                    if (outputBuffer != null && bufferInfo.size > 0) {
                        val pcm = ByteArray(bufferInfo.size)
                        outputBuffer.get(pcm)
                        audioTrack!!.write(pcm, 0, pcm.size)
                    }
                    codec!!.releaseOutputBuffer(outIndex, false)
                    outIndex = codec!!.dequeueOutputBuffer(bufferInfo, 0)
                }
            }
        }, "AAC-Decoder").start()
    }

    fun feedFrame(aacFrame: ByteArray) {
        inputQueue.offer(aacFrame)
    }

    fun stop() {
        isRunning = false
        codec?.stop()
        codec?.release()
        audioTrack?.stop()
        audioTrack?.release()
    }
}`}
          />
        )}
      </div>
    </div>
  );
}

// =================== Helper Components ===================

function FeatureCard({ icon, title, description, color }: { icon: string; title: string; description: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-900/40 to-blue-800/20 border-blue-700/50',
    purple: 'from-purple-900/40 to-purple-800/20 border-purple-700/50',
    green: 'from-green-900/40 to-green-800/20 border-green-700/50',
  };
  const iconColors: Record<string, string> = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border`}>
      <i className={`fas ${icon} text-3xl ${iconColors[color]} mb-3`}></i>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function ComponentItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 bg-gray-700/30 rounded-lg p-3">
      <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
        {number}
      </span>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-gray-400 text-xs mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function FlowStep({ step, title, description, color }: { step: number; title: string; description: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    pink: 'bg-pink-600',
  };

  return (
    <div className="flex items-start gap-4">
      <div className={`w-8 h-8 ${colors[color]} rounded-full flex items-center justify-center text-sm font-bold shrink-0`}>
        {step}
      </div>
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3">
      <i className="fas fa-cube text-blue-400"></i>
      <div>
        <span className="font-mono font-bold text-sm text-blue-300">{name}</span>
        <span className="text-gray-400 text-sm ml-2">— {description}</span>
      </div>
    </div>
  );
}

function BuildStep({ step, text }: { step: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
        {step}
      </span>
      <span className="text-gray-300 text-sm">{text}</span>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">{language}</span>
      </div>
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-gray-300">{code}</code>
      </pre>
    </div>
  );
}

export default App;
