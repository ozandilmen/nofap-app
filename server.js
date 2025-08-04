
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Yerel motivasyon mesajları endpoint'i
app.post('/api/motivation', async (req, res) => {
  const { dayCount, treeStage } = req.body;
  
  console.log('Motivasyon isteği:', { dayCount, treeStage });
  
  // Yerel motivasyon mesajları
  const motivationMessages = [
    "Sen güçlüsün! Bu zorlu anı atlatacaksın. Her gün bir adım daha ileriye gidiyorsun.",
    "Ağacın büyüyor, sen de büyüyorsun. Bu anı geçecek, sabırlı ol.",
    "Her nefes alışında güçleniyorsun. Bu zorlu anı atlatacaksın!",
    "Sen değerlisin ve bu mücadeleyi kazanacaksın. Güçlü kal!",
    "Bu an geçecek, sen kalıcısın. Her gün daha güçlü oluyorsun.",
    "Her gün daha güçlü oluyorsun. Bu mücadeleyi kazanacaksın!",
    "Sen değerlisin ve bu yolculukta yalnız değilsin. Güçlü kal!",
    "Her nefes alışında güçleniyorsun. Bu anı atlatacaksın!",
    "Ağacın büyüyor, sen de büyüyorsun. Bu zorlu anı geçecek.",
    "Sen güçlüsün! Bu zorlu anı atlatacaksın. Her gün bir adım daha ileriye gidiyorsun."
  ];
  
  const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
  
  res.json({ 
    message: randomMessage,
    local: true
  });
});

// Yerel panik tavsiyesi endpoint'i
app.post('/api/panic-advice', async (req, res) => {
  const { message } = req.body;
  
  console.log('Panik tavsiyesi isteği:', message);
  
  // Yerel panik tavsiyeleri
  const panicAdvice = [
    "Derin nefes al ve 10'a kadar say. Bu anı geçecek, sen güçlüsün!",
    "Şu anda sadece nefes al. Bu geçici bir durum, sen kalıcısın.",
    "Soğuk su ile yüzünü yıka. Bu anı atlatacaksın!",
    "Birkaç dakika yürüyüş yap. Hareket etmek yardımcı olacak.",
    "En sevdiğin müziği aç. Sesler seni rahatlatacak.",
    "5 dakika meditasyon yap. Zihnini temizle.",
    "Bir bardak su iç. Vücudunu rahatlat.",
    "Pencereyi aç ve temiz hava al. Bu seni rahatlatacak.",
    "En sevdiğin filmi aç. Dikkatini dağıt.",
    "Bir arkadaşını ara. Konuşmak yardımcı olacak."
  ];
  
  const randomAdvice = panicAdvice[Math.floor(Math.random() * panicAdvice.length)];
  
  res.json({ 
    message: randomAdvice,
    local: true
  });
});

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`Uygulama şu adreste: http://localhost:${PORT}`);
});
