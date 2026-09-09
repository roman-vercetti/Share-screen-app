# 🤖 GitHub Actions — Android CI/CD

Эта папка содержит готовые workflow-файлы для автоматической сборки Android APK.

## 📂 Структура проекта

```
Share-screen-app/
├── .github/
│   └── workflows/
│       ├── android-ci.yml           ← Полный (debug + release + GitHub Release)
│       └── build-debug-simple.yml   ← Минимальный (только debug)
├── app/
│   ├── build.gradle
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/example/screenmirror/
│       │   ├── App.kt
│       │   ├── MainActivity.kt
│       │   ├── AirPlayService.kt
│       │   ├── ConnectionState.kt
│       │   ├── airplay/
│       │   │   ├── AirPlayServer.kt
│       │   │   ├── RtspHandler.kt
│       │   │   ├── SDPParser.kt
│       │   │   ├── MirrorConfig.kt
│       │   │   └── PairingManager.kt
│       │   ├── network/
│       │   │   ├── MDNSAdvertiser.kt
│       │   │   ├── RTPReceiver.kt
│       │   │   └── RTPPacket.kt
│       │   ├── codec/
│       │   │   ├── H264Decoder.kt
│       │   │   ├── AACDecoder.kt
│       │   │   └── H264FrameAssembler.kt
│       │   └── render/
│       │       ├── VideoRenderer.kt
│       │       └── AudioRenderer.kt
│       └── res/
├── build.gradle
├── settings.gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
├── gradle/wrapper/
│   └── gradle-wrapper.properties
└── .gitignore
```

## 🚀 Быстрый старт

### Вариант 1: Только debug (без подписи)

1. Удалите `android-ci.yml` (или оставьте — они не конфликтуют)
2. Запушьте `build-debug-simple.yml`
3. Готово! APK будет собираться при каждом push

### Вариант 2: Полный цикл (debug + release + GitHub Release)

1. Используйте `android-ci.yml`
2. Настройте Secrets (см. ниже)
3. Для релиза: `git tag v1.0.0 && git push origin v1.0.0`

## 🔐 Настройка Secrets (для подписанной сборки)

### Шаг 1: Создайте keystore

```bash
keytool -genkey -v \
  -keystore release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias screen-mirror
```

### Шаг 2: Конвертируйте в base64

```bash
# macOS / Linux:
base64 -i release-key.jks | tr -d '\n' > keystore-base64.txt

# Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release-key.jks")) | Out-File -NoNewline keystore-base64.txt
```

### Шаг 3: Добавьте Secrets в GitHub

**GitHub → ваш репозиторий → Settings → Secrets and variables → Actions → New repository secret**

| Имя | Значение |
|-----|----------|
| `KEYSTORE_FILE` | Содержимое `keystore-base64.txt` |
| `KEYSTORE_PASSWORD` | Пароль keystore |
| `KEY_ALIAS` | `screen-mirror` |
| `KEY_PASSWORD` | Пароль ключа |

## 📦 Как создать релиз

```bash
git tag v1.0.0
git push origin v1.0.0
```

Результат:
- ✅ GitHub Actions соберёт подписанный APK
- ✅ Создаст GitHub Release
- ✅ Прикрепит APK к релизу
- ✅ Сгенерирует release notes автоматически

## ⚠️ Важно: Gradle Wrapper

В этом проекте используется `gradle/actions/setup-gradle@v4`, который **не требует** наличия `gradle-wrapper.jar` в репозитории. Gradle скачивается автоматически при сборке.

Если вы хотите использовать локальный `./gradlew`, скачайте wrapper:

```bash
gradle wrapper --gradle-version 8.2
```

## 🔧 Troubleshooting

| Проблема | Решение |
|----------|---------|
| `gradlew: Permission denied` | `chmod +x gradlew` |
| `SDK location not found` | Добавьте `local.properties` (в `.gitignore`) |
| `Keystore decode failed` | Проверьте что `KEYSTORE_FILE` — base64 без переносов |
| `SigningConfig not found` | Проверьте `build.gradle` и имена Secrets |
| Сборка >15 мин | Кэш Gradle уже включён в workflow |

## 📚 Документация

- [gradle/actions/setup-gradle](https://github.com/gradle/actions)
- [GitHub Actions для Android](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-gradle)
- [Подписание Android приложений](https://developer.android.com/studio/publish/app-signing)
