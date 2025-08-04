# 📱 Cordova ile APK Oluşturma Rehberi

## 🚀 Adım 1: Cordova Kurulumu

```bash
npm install -g cordova
```

## 📦 Adım 2: Yeni Cordova Projesi Oluşturma

```bash
# Ana dizine çıkın
cd ..

# Cordova projesi oluşturun
cordova create NoFapApp com.example.nofap "NoFap Motivasyon"

# Proje dizinine girin
cd NoFapApp
```

## 📁 Adım 3: Dosyaları Kopyalama

```bash
# Mevcut dosyaları www klasörüne kopyalayın
cp -r ../quit-porn-addiction/index.html www/
cp -r ../quit-porn-addiction/style.css www/
cp -r ../quit-porn-addiction/script.js www/
cp -r ../quit-porn-addiction/manifest.json www/
cp -r ../quit-porn-addiction/sw.js www/
```

## ⚙️ Adım 4: Cordova Konfigürasyonu

### `config.xml` dosyasını düzenleyin:
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.example.nofap" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>NoFap Motivasyon</name>
    <description>Kişisel gelişim ve motivasyon uygulaması</description>
    <author email="dev@example.com" href="http://example.com">
        Your Name
    </author>
    <content src="index.html" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <platform name="android">
        <allow-intent href="market:*" />
    </platform>
    <platform name="ios">
        <allow-intent href="itms:*" />
    </platform>
    <platform name="android">
        <preference name="android-minSdkVersion" value="22" />
        <preference name="android-targetSdkVersion" value="33" />
    </platform>
</widget>
```

## 🔧 Adım 5: Platform Ekleme

```bash
# Android platformunu ekleyin
cordova platform add android

# iOS platformunu ekleyin (Mac gerekli)
# cordova platform add ios
```

## 📱 Adım 6: APK Oluşturma

### Debug APK (Hızlı):
```bash
cordova build android
```

### Release APK (Yayın için):
```bash
# Keystore oluşturun (sadece bir kez)
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

# Release build
cordova build android --release

# APK imzalayın
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name

# APK optimize edin
zipalign -v 4 app-release-unsigned.apk NoFapApp.apk
```

## 🎯 Adım 7: APK Yükleme

1. **APK dosyasını telefonunuza kopyalayın**
2. **Telefonunuzda "Bilinmeyen kaynaklar"ı etkinleştirin**
3. **APK'yı yükleyin**

## ⚠️ Önemli Notlar

### Android Studio Gereksinimleri:
- **Android Studio** kurulu olmalı
- **Android SDK** kurulu olmalı
- **JAVA_HOME** environment variable ayarlanmalı

### Windows'ta Kurulum:
```bash
# Android Studio'yu indirin ve kurun
# https://developer.android.com/studio

# Environment variables ayarlayın
set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
```

### Mac/Linux'ta Kurulum:
```bash
# Homebrew ile kurulum
brew install android-sdk

# Environment variables
export ANDROID_HOME=$HOME/Library/Android/sdk
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.x.jdk/Contents/Home
```

## 🔧 Sorun Giderme

### "Android SDK bulunamadı" hatası:
1. Android Studio'yu kurun
2. SDK Manager'dan gerekli SDK'ları indirin
3. Environment variables'ları ayarlayın

### "Gradle build failed" hatası:
1. `cordova clean android` komutunu çalıştırın
2. `cordova build android` tekrar deneyin

### "Keystore bulunamadı" hatası:
1. Keystore oluşturma adımlarını takip edin
2. Doğru yolda olduğundan emin olun

## 📱 APK Özellikleri

✅ **Tamamen offline çalışır**
✅ **LocalStorage kullanır**
✅ **Ana ekrana eklenebilir**
✅ **Push notification desteği** (eklenebilir)
✅ **Gerçek uygulama gibi çalışır**

## 🎯 Sonuç

Bu yöntemle uygulamanız:
- **Gerçek bir APK** olarak çalışır
- **Telefonunuzda kalıcı** olarak yüklenir
- **İnternet gerektirmez**
- **Verileriniz telefonda kalır**

APK dosyası `platforms/android/app/build/outputs/apk/debug/` klasöründe oluşacak! 