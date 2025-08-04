# Quit Tracker - Panic Button

Bu uygulama, kötü alışkanlıkları bırakmaya çalışan kişilere yardım etmek için tasarlanmış bir motivasyon takip uygulamasıdır.

## Özellikler

- 🌱 Ağaç yetiştirme sistemi
- 🚨 Panik butonu ile anlık motivasyon
- 🏆 Başarı kupaları sistemi
- 📚 Faydalı makaleler
- 🌟 Başarı hikayeleri
- 👤 Kişiselleştirilmiş profil

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment variables dosyası oluşturun:
```bash
cp .env.example .env
```

3. `.env` dosyasını düzenleyin:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
```

4. Uygulamayı başlatın:
```bash
npm start
```

## Kullanım

- Uygulama ilk açıldığında onboarding sürecini tamamlayın
- Her gün "Su Ver" butonuna tıklayarak ağacınızı sulayın
- Zor anlarınızda "Panik" butonuna basarak motivasyon alın
- Başarılarınızı kupalar sekmesinde takip edin

## Teknik Detaylar

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-3.5-turbo
- **Veri Saklama**: LocalStorage

## Güvenlik

- API anahtarları environment variables ile saklanır
- Client-side veri sadece localStorage'da tutulur
- HTTPS kullanımı önerilir

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 