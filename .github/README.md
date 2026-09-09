# 🤖 GitHub Actions — Android CI/CD

Эта папка содержит готовые workflow-файлы для автоматической сборки Android APK.

## 📂 Файлы

| Файл | Описание | Когда запускается |
|------|----------|-------------------|
| `android-ci.yml` | **Полный** — debug + release + GitHub Release | Push в main, PR, теги `v*` |
| `build-debug-simple.yml` | **Минимальный** — только debug APK | Push в main, PR |

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

Запомните пароль и alias!

### Шаг 2: Конвертируйте в base64

```bash
# macOS / Linux:
base64 -i release-key.jks | tr -d '\n' > keystore-base64.txt

# Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release-key.jks")) | Out-File -NoNewline keystore-base64.txt
```

### Шаг 3: Добавьте Secrets в GitHub

Откройте: **GitHub → ваш репозиторий → Settings → Secrets and variables → Actions → New repository secret**

Добавьте 4 секрета:

| Имя | Значение |
|-----|----------|
| `KEYSTORE_FILE` | Содержимое `keystore-base64.txt` |
| `KEYSTORE_PASSWORD` | Пароль, который вы задали при создании keystore |
| `KEY_ALIAS` | `screen-mirror` (или ваш alias) |
| `KEY_PASSWORD` | Пароль ключа (обычно совпадает с keystore password) |

### Шаг 4: Обновите build.gradle

Убедитесь, что в `app/build.gradle` есть:

```groovy
android {
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_FILE") ?: "release-key.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## 📦 Как создать релиз

```bash
# Локально:
git tag v1.0.0
git push origin v1.0.0

# Результат:
# ✅ GitHub Actions соберёт подписанный APK
# ✅ Создаст GitHub Release
# ✅ Прикрепит APK к релизу
# ✅ Сгенерирует release notes автоматически
```

## 🔧 Troubleshooting

| Проблема | Решение |
|----------|---------|
| `gradlew: Permission denied` | Добавьте `chmod +x gradlew` в workflow |
| `SDK location not found` | Убедитесь что `local.properties` в `.gitignore` |
| `Keystore decode failed` | Проверьте что `KEYSTORE_FILE` — это base64 без переносов строк |
| `SigningConfig not found` | Проверьте `build.gradle` и имена Secrets |
| Сборка занимает >15 мин | Добавьте кэширование Gradle (уже есть в `android-ci.yml`) |

## ⚡ Полезные команды

```bash
# Посмотреть статус workflow:
gh run list

# Посмотреть логи конкретного запуска:
gh run view <run-id> --log

# Перезапустить workflow:
gh workflow run android-ci.yml

# Скачать артефакт:
gh run download <run-id>
```

## 📚 Документация

- [GitHub Actions для Android](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-gradle)
- [Подписание Android приложений](https://developer.android.com/studio/publish/app-signing)
- [softprops/action-gh-release](https://github.com/softprops/action-gh-release)
