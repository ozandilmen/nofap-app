// Bugünün tarihini YYYY-MM-DD formatında al
function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// Kayıtlı veriyi çek
function getStoredData() {
  return JSON.parse(localStorage.getItem("growthData"));
}

// Veriyi kaydet
function storeData(data) {
  localStorage.setItem("growthData", JSON.stringify(data));
}

// Kullanıcı profilini kaydet
function saveUserProfile(profile) {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

// Kullanıcı profilini çek
function getUserProfile() {
  return JSON.parse(localStorage.getItem('userProfile'));
}

// Kupalar sistemini kontrol et
function checkAchievements(dayCount) {
  const achievements = getAchievements();
  const newAchievements = [];

  const milestones = [
    { days: 3, name: '3 Günlük Başlangıç', icon: '🥉', description: 'İlk 3 günü tamamladın!' },
    { days: 7, name: '1 Haftalık Kahraman', icon: '🥈', description: '1 haftalık seriyi başardın!' },
    { days: 14, name: '2 Haftalık Savaşçı', icon: '🥇', description: '2 haftalık güçlü iradeyi gösterdin!' },
    { days: 30, name: '1 Aylık Efsane', icon: '🏆', description: 'Tam 1 ay boyunca kendini yendin!' },
    { days: 60, name: '2 Aylık Usta', icon: '👑', description: '2 aylık inanılmaz disiplin!' },
    { days: 90, name: '3 Aylık Şampiyon', icon: '⭐', description: '3 aylık mükemmel kontrol!' }
  ];

  milestones.forEach(milestone => {
    if (dayCount >= milestone.days && !achievements.some(a => a.days === milestone.days)) {
      newAchievements.push(milestone);
      achievements.push(milestone);
    }
  });

  if (newAchievements.length > 0) {
    localStorage.setItem('achievements', JSON.stringify(achievements));
    showAchievementNotification(newAchievements);
  }

  return newAchievements;
}

// Kupalar listesini al
function getAchievements() {
  return JSON.parse(localStorage.getItem('achievements')) || [];
}

// Kupa bildirimini göster
function showAchievementNotification(achievements) {
  achievements.forEach(achievement => {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <span class="achievement-icon">${achievement.icon}</span>
        <div>
          <strong>${achievement.name}</strong>
          <p>${achievement.description}</p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  });
}

// Bugünün tarihini YYYY-MM-DD formatında al
function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// Kayıtlı veriyi çek
function getStoredData() {
  return JSON.parse(localStorage.getItem("growthData"));
}

// Veriyi kaydet
function storeData(data) {
  localStorage.setItem("growthData", JSON.stringify(data));
}

// Kullanıcı profilini kaydet
function saveUserProfile(profile) {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

// Kullanıcı profilini çek
function getUserProfile() {
  return JSON.parse(localStorage.getItem('userProfile'));
}

// Sorular ve seçenekler
const questions = [
  {
    id: 'duration',
    title: '🕐 Kaç yıldır bu alışkanlığın var?',
    type: 'select',
    options: [
      { value: 'less-than-1', text: '1 yıldan az' },
      { value: '1-3', text: '1-3 yıl' },
      { value: '3-5', text: '3-5 yıl' },
      { value: '5-10', text: '5-10 yıl' },
      { value: 'more-than-10', text: '10 yıldan fazla' }
    ]
  },
  {
    id: 'frequency',
    title: '📊 Ne sıklıkla mastürbasyon yapıyordun?',
    type: 'select',
    options: [
      { value: 'daily', text: 'Günde birkaç kez' },
      { value: 'once-daily', text: 'Günde bir kez' },
      { value: 'few-times-week', text: 'Haftada birkaç kez' },
      { value: 'weekly', text: 'Haftada bir' },
      { value: 'rarely', text: 'Nadiren' }
    ]
  },
  {
    id: 'weaknesses',
    title: '💭 Kendini hangi yönlerde eksik hissediyorsun?',
    subtitle: 'Birden fazla seçebilirsin',
    type: 'checkbox',
    options: [
      { value: 'confidence', text: 'Özgüven eksikliği' },
      { value: 'energy', text: 'Enerji düşüklüğü' },
      { value: 'focus', text: 'Odaklanma sorunu' },
      { value: 'social', text: 'Sosyal ilişkilerde zorluk' },
      { value: 'motivation', text: 'Motivasyon eksikliği' },
      { value: 'guilt', text: 'Suçluluk hissi' }
    ]
  },
  {
    id: 'mainReason',
    title: '🎯 Bu alışkanlığı bırakmak istemenin en büyük nedeni nedir?',
    type: 'textarea',
    placeholder: 'Kendi kelimlerinle açıkla...'
  }
];

let currentQuestionIndex = 0;
let userAnswers = {};

// Sayfa yüklendiğinde kontrol et
window.addEventListener('DOMContentLoaded', function() {
  const userProfile = getUserProfile();

  // Eğer profil yoksa onboarding göster, varsa ana uygulamayı göster
  if (!userProfile) {
    showOnboarding();
  } else {
    showMainApp();
    initializeMainApp();
  }
});

// Ana uygulamayı başlat
function initializeMainApp() {
  updateMainDisplay();
  renderAchievements();
  renderProfile();
  renderArticles();
  renderSuccessStories();
}

// Ana ekranı güncelle
function updateMainDisplay() {
  const data = getStoredData();
  if (data) {
    document.getElementById("output").innerText = `${data.dayCount}. gün - Harikasın!`;
    document.getElementById("treeStage").innerText = getTreeStage(data.dayCount);
  }
}

// Onboarding başlat
function showOnboarding() {
  document.getElementById('onboardingContainer').style.display = 'block';
  document.getElementById('mainContainer').style.display = 'none';
  currentQuestionIndex = 0;
  userAnswers = {};
  showCurrentQuestion();
}

// Ana uygulamayı göster
function showMainApp() {
  document.getElementById('onboardingContainer').style.display = 'none';
  document.getElementById('mainContainer').style.display = 'block';
}

// Mevcut soruyu göster
function showCurrentQuestion() {
  const question = questions[currentQuestionIndex];
  const container = document.getElementById('questionContainer');
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Progress bar güncelle
  document.getElementById('progressFill').style.width = `${progress}%`;

  let html = `
    <div class="question-screen">
      <h2>${question.title}</h2>
      ${question.subtitle ? `<p class="subtitle">${question.subtitle}</p>` : ''}
      <div class="question-content">
  `;

  if (question.type === 'select') {
    html += '<div class="options-list">';
    question.options.forEach(option => {
      html += `
        <button class="option-btn" onclick="selectOption('${option.value}')">
          ${option.text}
        </button>
      `;
    });
    html += '</div>';

  } else if (question.type === 'checkbox') {
    html += '<div class="checkbox-options">';
    question.options.forEach(option => {
      html += `
        <label class="checkbox-option">
          <input type="checkbox" value="${option.value}" onchange="updateCheckboxAnswers()">
          <span>${option.text}</span>
        </label>
      `;
    });
    html += '</div>';
    html += '<button class="continue-btn" onclick="continueFromCheckbox()" disabled>Devam Et</button>';

  } else if (question.type === 'textarea') {
    html += `
      <textarea id="textareaAnswer" placeholder="${question.placeholder}" rows="4"></textarea>
      <button class="continue-btn" onclick="continueFromTextarea()">Devam Et</button>
    `;
  }

  html += '</div></div>';
  container.innerHTML = html;
}

// Seçenek seçimi (radio button tarzı)
function selectOption(value) {
  const question = questions[currentQuestionIndex];
  userAnswers[question.id] = value;

  // Seçilen seçeneği vurgula
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.classList.add('selected');

  // Kısa bir süre bekle ve devam et
  setTimeout(() => {
    nextQuestion();
  }, 500);
}

// Checkbox cevaplarını güncelle
function updateCheckboxAnswers() {
  const question = questions[currentQuestionIndex];
  const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const values = Array.from(checkedBoxes).map(cb => cb.value);

  userAnswers[question.id] = values;

  // En az bir seçenek seçildiyse devam butonunu aktif et
  const continueBtn = document.querySelector('.continue-btn');
  continueBtn.disabled = values.length === 0;
}

// Checkbox'tan devam et
function continueFromCheckbox() {
  nextQuestion();
}

// Textarea'dan devam et
function continueFromTextarea() {
  const textarea = document.getElementById('textareaAnswer');
  if (textarea.value.trim()) {
    const question = questions[currentQuestionIndex];
    userAnswers[question.id] = textarea.value.trim();
    nextQuestion();
  } else {
    alert('Lütfen bir açıklama yazın.');
  }
}

// Bir sonraki soruya geç
function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    // Tüm sorular tamamlandı
    completeOnboarding();
  } else {
    // Bir sonraki soruyu göster
    showCurrentQuestion();
  }
}

// Onboarding tamamlandı
function completeOnboarding() {
  const profile = {
    ...userAnswers,
    createdAt: new Date().toISOString()
  };

  saveUserProfile(profile);

  // Tebrik ekranı göster
  const container = document.getElementById('questionContainer');
  container.innerHTML = `
    <div class="completion-screen">
      <h2>🎉 Harika!</h2>
      <p>Artık sana özel motivasyon mesajları hazırlayabilirim.</p>
      <p>Hadi ağacını yetiştirmeye başla!</p>
      <button onclick="showMainApp(); initializeMainApp();" class="start-btn">🌱 Başla</button>
    </div>
  `;
}

// Kupalar bölümünü render et
function renderAchievements() {
  const achievements = getAchievements();
  const container = document.getElementById('achievementsSection');

  let html = '<h3>🏆 Kupalarım</h3><div class="achievements-grid">';

  const allMilestones = [
    { days: 3, name: '3 Günlük Başlangıç', icon: '🥉', description: 'İlk 3 günü tamamla' },
    { days: 7, name: '1 Haftalık Kahraman', icon: '🥈', description: '1 haftalık seriyi başar' },
    { days: 14, name: '2 Haftalık Savaşçı', icon: '🥇', description: '2 haftalık güçlü iradeyi göster' },
    { days: 30, name: '1 Aylık Efsane', icon: '🏆', description: 'Tam 1 ay boyunca kendini yen' },
    { days: 60, name: '2 Aylık Usta', icon: '👑', description: '2 aylık inanılmaz disiplin' },
    { days: 90, name: '3 Aylık Şampiyon', icon: '⭐', description: '3 aylık mükemmel kontrol' }
  ];

  allMilestones.forEach(milestone => {
    const isEarned = achievements.some(a => a.days === milestone.days);
    html += `
      <div class="achievement-card ${isEarned ? 'earned' : 'locked'}">
        <div class="achievement-icon">${isEarned ? milestone.icon : '🔒'}</div>
        <div class="achievement-name">${milestone.name}</div>
        <div class="achievement-desc">${milestone.description}</div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Profil bölümünü render et
function renderProfile() {
  const profile = getUserProfile();
  const data = getStoredData();
  const achievements = getAchievements();

  if (!profile) return;

  const container = document.getElementById('profileSection');

  let html = `
    <div class="profile-card">`;

  html += `
    <h3>👤 Profilim</h3>
    <div class="profile-card">
      <div class="profile-stat">
        <strong>Mevcut Seri:</strong> ${data ? data.dayCount : 0} gün
      </div>
      <div class="profile-stat">
        <strong>Kazanılan Kupalar:</strong> ${achievements.length}
      </div>
      <div class="profile-stat">
        <strong>Ana Hedef:</strong> ${profile.mainReason}
      </div>
      <div class="profile-weaknesses">
        <strong>Çalıştığım Alanlar:</strong>
        <ul>
  `;

  if (profile.weaknesses && profile.weaknesses.length > 0) {
    const weaknessNames = {
      confidence: 'Özgüven',
      energy: 'Enerji',
      focus: 'Odaklanma',
      social: 'Sosyal İlişkiler',
      motivation: 'Motivasyon',
      guilt: 'Suçluluk Hissi'
    };

    profile.weaknesses.forEach(weakness => {
      html += `<li>${weaknessNames[weakness] || weakness}</li>`;
    });
  }

  html += `
        </ul>
      </div>
      <button onclick="resetProfile()" class="reset-btn">Profili Sıfırla</button>
    </div>
  `;

  container.innerHTML = html;
}

// Makaleler bölümünü render et
function renderArticles() {
  const container = document.getElementById('articlesSection');

  const articles = [
    {
      title: "NoFap'in Bilimsel Faydaları",
      summary: "Araştırmalara göre mastürbasyonu bırakmanın beyin ve vücut üzerindeki olumlu etkileri",
      emoji: "🧠"
    },
    {
      title: "İlk 30 Günü Nasıl Atlatırsın?",
      summary: "En zor dönem olan ilk ayı başarıyla tamamlama stratejileri",
      emoji: "🎯"
    },
    {
      title: "Dopamin Detoksu Rehberi",
      summary: "Dopamin seviyelerini normalize etmek için pratik adımlar",
      emoji: "⚡"
    },
    {
      title: "Spor ve NoFap İlişkisi",
      summary: "Fiziksel aktivitenin bu süreçteki önemi ve egzersiz önerileri",
      emoji: "💪"
    }
  ];

  let html = '<h3>📚 Faydalı Makaleler</h3><div class="articles-grid">';

  articles.forEach(article => {
    html += `
      <div class="article-card">
        <div class="article-emoji">${article.emoji}</div>
        <h4>${article.title}</h4>
        <p>${article.summary}</p>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Başarı hikayeleri bölümünü render et
function renderSuccessStories() {
  const container = document.getElementById('successStoriesSection');

  const stories = [
    {
      name: "Mehmet, 25",
      duration: "90 gün",
      story: "İlk 2 hafta çok zordu ama sonrasında özgüvenim arttı. Artık insanlarla daha rahat konuşuyorum.",
      emoji: "💪"
    },
    {
      name: "Ali, 22",
      duration: "180 gün",
      story: "6 aylık süreçte enerji seviyem inanılmaz arttı. Spor yapma isteğim de geldi, hayatım değişti."
    ,
      emoji: "⚡"
    },
    {
      name: "Can, 28",
      duration: "365 gün",
      story: "1 yıl sonra bambaşka bir insanım. Odaklanma becerilerim gelişti, kariyerimde ilerleme kaydettim.",
      emoji: "🎯"
    }
  ];

  let html = '<h3>🌟 Başarı Hikayeleri</h3><div class="stories-grid">';

  stories.forEach(story => {
    html += `
      <div class="story-card">
        <div class="story-emoji">${story.emoji}</div>
        <div class="story-header">
          <strong>${story.name}</strong>
          <span class="story-duration">${story.duration}</span>
        </div>
        <p>"${story.story}"</p>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Profili sıfırla
function resetProfile() {
  if (confirm('Profili sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('growthData');
    localStorage.removeItem('achievements');
    showOnboarding();
  }
}

// Ağaç kuruduğunda sıfırla
function resetTree() {
  localStorage.removeItem("growthData");
  document.getElementById("output").innerText = "Ağaç kurudu... Tekrar tohum dikildi.";
  document.getElementById("treeStage").innerText = "🌱";
}

// Ağaç görseline animasyon sınıfı ekle
function addAnimation(className) {
  const tree = document.getElementById("treeStage");
  tree.classList.remove("animateSeed", "animateWater", "animateDead");
  void tree.offsetWidth; // animasyon resetlemek için
  tree.classList.add(className);
}

// Su verme işlemini yönet
function handleWatering() {
  const today = getTodayDate();
  let data = getStoredData();
  const tree = document.getElementById("treeStage");

  if (!data) {
    // İlk kez başlatılıyor (tohum dik)
    data = {
      startDate: today,
      lastWatered: today,
      dayCount: 1
    };
    storeData(data);
    document.getElementById("output").innerText = "Tohum toprağa dikildi! 1. gün 🌱";
    tree.innerText = getTreeStage(1);
    addAnimation("animateSeed");
    checkAchievements(1);
    renderAchievements();
    return;
  }

  const lastWatered = data.lastWatered;
  const lastDate = new Date(lastWatered);
  const currentDate = new Date(today);
  const diffDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Normal sulama günü
    data.dayCount += 1;
    data.lastWatered = today;
    storeData(data);
    document.getElementById("output").innerText = `${data.dayCount}. gün - Sulama başarılı!`;
    tree.innerText = getTreeStage(data.dayCount);
    addAnimation("animateWater");
    checkAchievements(data.dayCount);
    renderAchievements();
    renderProfile();

  } else if (diffDays === 0) {
    // Aynı gün ikinci kez basma
    document.getElementById("output").innerText = "Bugün zaten sulandı!";
  } else {
    // Seriyi bozdu
    addAnimation("animateDead");
    setTimeout(() => {
      resetTree();
      storeData({
        startDate: today,
        lastWatered: today,
        dayCount: 1
      });
      tree.innerText = getTreeStage(1);
      addAnimation("animateSeed");
      renderAchievements();
      renderProfile();
    }, 1000);
  }
}

// Ağaç görseli aşamasını belirle
function getTreeStage(days) {
  if (days <= 1) return "🌱";       // Tohum
  if (days <= 3) return "🌿";       // Filiz
  if (days <= 7) return "🌴";       // Küçük Fidan
  if (days <= 14) return "🌳";      // Ağaç
  if (days <= 30) return "🌸🌳";    // Çiçekli Ağaç
  return "🍎🌳";                    // Meyve Veren Ağaç
}

// Kişiselleştirilmiş motivasyon mesajı oluştur
function getPersonalizedMotivation(dayCount, profile) {
  const weaknessMessages = {
    confidence: [
      "💪 Her geçen gün özgüvenin artıyor! Bu başarın senin gücünü kanıtlıyor.",
      `🌟 ${dayCount} gündür kendine olan saygın büyüyor. Sen güçlü bir insansın!`,
      "⭐ Her 'hayır' dediğin an, içindeki güçlü karakteri ortaya çıkarıyor."
    ],
    energy: [
      `⚡ Enerjin her gün artıyor! ${dayCount} günde ne kadar değiştiğini hissediyor musun?`,
      "🔋 Temiz enerji sende birikiyor. Bu momentumu kaybetme!",
      "💥 Vücudun ve zihnin artık daha güçlü. Bu enerjiyi koru!"
    ],
    focus: [
      `🎯 Odaklanma becerin her gün gelişiyor. ${dayCount} gün önemli bir süre!`,
      "🧠 Zihnin artık daha berrak. Bu netliği kaybetmek istemezsin.",
      "🔍 Konsantrasyonun artık daha güçlü. Bu gidişatı sürdür!"
    ],
    social: [
      "🤝 İnsanlarla ilişkin artık daha samimi ve doğal. Bu gelişimi koru!",
      `👥 ${dayCount} gündür sosyal özgüvenin artıyor. Bu değişimi hissediyor musun?`,
      "🗣️ Konuşmalarında artık daha rahat ve kendinden emin hissediyorsun."
    ],
    motivation: [
      `🚀 Motivasyonun her gün daha güçlü! ${dayCount} gün büyük bir başarı!`,
      "💪 İçindeki savaşçı ruhu uyandı. Bu gücü kaybetme!",
      "🔥 Her gün daha kararlı ve motiveli oluyorsun. Devam et!"
    ],
    guilt: [
      "🕊️ Suçluluk hissin azalıyor, temiz vicdanın geri geliyor.",
      `💚 ${dayCount} gündür kendini affetmeyi öğreniyorsun. Bu çok değerli!`,
      "🌈 Geçmişin seni tanımlamıyor, bugünkü seçimlerin tanımlıyor."
    ]
  };

  const durationMessages = {
    'less-than-1': `1 yıldan kısa süreli bu alışkanlığı ${dayCount} günde büyük oranda kontrol altına aldın!`,
    '1-3': `1-3 yıllık bu alışkanlığa karşı ${dayCount} günde büyük adım attın!`,
    '3-5': `3-5 yıllık bu zorlu alışkanlığı ${dayCount} günde yenmeye başladın!`,
    '5-10': `5-10 yıllık bu derin alışkanlığa karşı ${dayCount} günde inanılmaz güç gösterdin!`,
    'more-than-10': `10+ yıllık bu köklü alışkanlığı ${dayCount} günde sarsmaya başladın! Bu muhteşem!`
  };

  const frequencyMessages = {
    'daily': `Günde birkaç kez olan alışkanlığını ${dayCount} gündür durdurdun. Bu inanılmaz!`,
    'once-daily': `Günlük olan alışkanlığını ${dayCount} gündür yendin. Çok güçlüsün!`,
    'few-times-week': `Haftada birkaç kez olan alışkanlığını ${dayCount} gündür kontrol ediyorsun!`,
    'weekly': `Haftalık alışkanlığını ${dayCount} gündür yeniyorsun. Harika gidiyorsun!`,
    'rarely': `Zaten az olan alışkanlığını tamamen bırakma yolunda ${dayCount} gün geçti!`
  };

  // Kullanıcının zayıflık alanlarına göre mesaj seç
  let personalMessage = "";
  if (profile.weaknesses && profile.weaknesses.length > 0) {
    const weakness = profile.weaknesses[0]; // İlk zayıflık alanını al
    if (weaknessMessages[weakness]) {
      const messages = weaknessMessages[weakness];
      personalMessage = messages[Math.floor(Math.random() * messages.length)];
    }
  }

  // Duration ve frequency mesajları
  const durationMsg = durationMessages[profile.duration] || "";
  const frequencyMsg = frequencyMessages[profile.frequency] || "";

  return {
    personal: personalMessage,
    duration: durationMsg,
    frequency: frequencyMsg,
    reason: profile.mainReason
  };
}

// Panik butonu işlevi
function handlePanic() {
  const motivationDiv = document.getElementById("motivationOutput");
  const data = getStoredData();
  const dayCount = data ? data.dayCount : 0;
  const profile = getUserProfile();

  let message = "";

  if (profile) {
    // Kişiselleştirilmiş mesaj
    const personalMotivation = getPersonalizedMotivation(dayCount, profile);

    message = `💪 <strong>Güçlü kal!</strong><br><br>
      ${personalMotivation.personal}<br><br>
      📊 ${personalMotivation.frequency}<br><br>
      ⏳ ${personalMotivation.duration}<br><br>
      🎯 <em>"${profile.mainReason}"</em> - Bu nedenle başladığını unutma!`;
  } else {
    // Genel motivasyon mesajları
    const motivationMessages = [
      `🌱 ${dayCount} gündür ne kadar güçlü olduğunu kanıtladın! Bu ağacın büyümesi senin iradenin kanıtı.`,
      "💪 Kötü alışkanlıklar geçicidir, ama güçlü karakterin kalıcıdır. Sen bunu yapabilirsin!",
      "🔥 Her panik anı aslında seni daha güçlü yapan bir fırsattır. Bu zorluğu da aşacaksın!",
      "⭐ Bugüne kadar geldiğin yol boşa gitmeyecek. Sen çok değerlisin, pes etme!"
    ];

    const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
    message = `💪 <strong>Güçlü kal!</strong><br><br>${randomMessage}`;
  }

  motivationDiv.style.display = "block";
  motivationDiv.innerHTML = message;
}