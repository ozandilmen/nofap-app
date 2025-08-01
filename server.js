
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// OpenAI API çağrısı için endpoint
app.post('/api/motivation', async (req, res) => {
  const { dayCount, treeStage } = req.body;
  
  // OpenAI API key'i environment variable'dan al
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'OpenAI API key bulunamadı. Lütfen OPENAI_API_KEY environment variable\'ını ayarlayın.' 
    });
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Sen bir motivasyon koçusun. Kötü alışkanlıklarını bırakmaya çalışan kişilere yardım ediyorsun. Türkçe, samimi, motive edici ve kısa mesajlar yazıyorsun.'
          },
          {
            role: 'user',
            content: `Kötü alışkanlığımı bırakmaya çalışıyorum ve ${dayCount} gündür başarılıyım. Ağacım ${treeStage} aşamasında. Şu anda panik halindeyim ve eski alışkanlığıma dönmek istiyorum. Bana motivasyon ver ve bu zorlu anı atlatmama yardım et. Mesajın kısa ama etkili olsun.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.json({ message: data.choices[0].message.content });
    } else {
      throw new Error('OpenAI API\'den geçersiz yanıt');
    }
    
  } catch (error) {
    console.error('OpenAI API hatası:', error);
    res.status(500).json({ 
      error: 'Motivasyon mesajı alınamadı',
      fallback: true 
    });
  }
});

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
