# Capacitor Android Studio Kurulum ve Çalıştırma Rehberi

## 📱 Adım Adım Android Studio'da Çalıştırma

### 1️⃣ Web Dosyalarını Sync Et (ÖNEMLİ!)

Her web dosyası değişikliğinden sonra bu komutu çalıştır:

```bash
npx cap sync android
```

Bu komut:
- `www/` klasöründeki tüm dosyaları Android projesine kopyalar
- Capacitor plugin'lerini günceller
- Android projesini senkronize eder

### 2️⃣ Android Studio'yu Aç

```bash
# Terminal'den aç (opsiyonel)
npx cap open android

# VEYA manuel olarak:
# Android Studio > File > Open > android klasörünü seç
```

### 3️⃣ Android Studio'da Projeyi Aç

1. Android Studio'yu aç
2. **File > Open** (veya **Open an Existing Project**)
3. `android` klasörünü seç (proje kökündeki android klasörü)
4. Gradle sync'in bitmesini bekle (sağ alttaki progress bar)

### 4️⃣ Emulator veya Gerçek Cihaz Seç

**Emulator kullanmak için:**
1. Üstteki toolbar'da cihaz seçiciyi aç
2. **Create Virtual Device** (yoksa)
3. Bir cihaz seç (örn: Pixel 5)
4. Android versiyonu seç (API 30+ önerilir)
5. **Finish**

**Gerçek cihaz kullanmak için:**
1. Telefonunu USB ile bağla
2. **USB Debugging**'i aç (Ayarlar > Geliştirici Seçenekleri)
3. Android Studio'da cihazını seç

### 5️⃣ Uygulamayı Çalıştır

1. Üstteki **Run** butonuna tıkla (yeşil play ikonu) 
   - VEYA `Shift + F10` tuşlarına bas
2. İlk çalıştırmada build biraz sürebilir (5-10 dakika)
3. Uygulama emulator/cihazda açılacak

### 6️⃣ Değişiklik Yaptıktan Sonra

**Web dosyalarında değişiklik yaptıysan:**
```bash
npx cap sync android
```
Sonra Android Studio'da **Run** butonuna tekrar bas (veya `Shift + F10`)

**Sadece JavaScript/CSS değişikliği ise:**
- Android Studio'da **Run** butonuna bas
- Capacitor otomatik olarak `www/` klasörünü kullanır

## 🔧 Keyboard Plugin Kurulumu (Opsiyonel)

Klavye açılınca navbar gizleme özelliği için:

```bash
npm install @capacitor/keyboard
npx cap sync android
```

## 📝 Önemli Notlar

1. **Her web değişikliğinden sonra `npx cap sync android` çalıştır!**
2. İlk build uzun sürebilir (Gradle dependencies indirir)
3. Android Studio'da Gradle sync hatası alırsan:
   - **File > Invalidate Caches / Restart**
   - **Build > Clean Project**
   - **Build > Rebuild Project**

## 🚀 Hızlı Komutlar

```bash
# Web dosyalarını sync et
npx cap sync android

# Android Studio'yu aç
npx cap open android

# Sadece web dosyalarını kopyala (hızlı)
npx cap copy android

# Tüm platformları sync et
npx cap sync
```

## 🐛 Sorun Giderme

**"Gradle sync failed" hatası:**
- Android Studio'yu kapat
- `android/.gradle` klasörünü sil
- Android Studio'yu tekrar aç

**"SDK not found" hatası:**
- Android Studio > **Tools > SDK Manager**
- **SDK Platforms** tab'ında Android SDK kurulu olduğundan emin ol
- **SDK Tools** tab'ında Android SDK Build-Tools kurulu olduğundan emin ol

**Uygulama açılmıyor:**
- **Build > Clean Project**
- **Build > Rebuild Project**
- Emulator'ü yeniden başlat

## 📱 Live Reload (Geliştirme İçin)

Android Studio'da çalışırken web dosyalarını değiştirdiğinde:
1. `npx cap sync android` çalıştır
2. Android Studio'da uygulamayı yeniden başlat

VEYA Chrome DevTools kullan:
- Android Studio'da **Run** butonuna bas
- Chrome'da `chrome://inspect` aç
- Cihazını seç ve **inspect** tıkla
- Console'da hataları görebilirsin

