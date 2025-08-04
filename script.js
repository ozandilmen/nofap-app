// Service Worker'ı kaydet
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker başarıyla kaydedildi:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker kaydı başarısız:', error);
      });
  });
}

// Animasyon yöneticisi
let animations = {};

// Lottie animasyonlarını yükle
function loadLottieAnimations() {
  const animationConfigs = {
    tree: {
      container: 'treeAnimation',
      path: 'https://assets2.lottiefiles.com/packages/lf20_plant_growth.json',
      loop: true,
      autoplay: true
    },
    water: {
      container: 'waterAnimation', 
      path: 'https://assets5.lottiefiles.com/packages/lf20_water_drop.json',
      loop: false,
      autoplay: false
    },
    sun: {
      container: 'sunAnimation',
      path: 'https://assets3.lottiefiles.com/packages/lf20_sun_animation.json',
      loop: true,
      autoplay: true
    },
    cloud: {
      container: 'cloudAnimation',
      path: 'https://assets1.lottiefiles.com/packages/lf20_cloud_float.json',
      loop: true,
      autoplay: true
    }
  };

  try {
    Object.entries(animationConfigs).forEach(([name, config]) => {
      const container = document.getElementById(config.container);
      if (container) {
        animations[name] = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: config.loop,
          autoplay: config.autoplay,
          path: config.path
        });
      }
    });
    console.log('Animasyonlar yüklendi');
  } catch (error) {
    console.error('Animasyon yükleme hatası:', error);
    showFallbackTree();
  }
}

// Hata durumunda basit emoji ağacı göster
function showFallbackTree() {
  const treeContainer = document.getElementById('treeAnimation');
  if (treeContainer) {
    treeContainer.innerHTML = '<div style="font-size: 120px; text-align: center; animation: treeGrow 2s ease-in-out;">🌱</div>';
  }
}

// Emoji Ağaç Sistemi
function updateEmojiTree(days) {
  const treeEmoji = document.querySelector('.tree-emoji');
  if (!treeEmoji) return;

  const emojiStages = [
    { days: 1, emoji: '🌱' },
    { days: 3, emoji: '🌿' },
    { days: 7, emoji: '🌳' },
    { days: 14, emoji: '🌲' },
    { days: 30, emoji: '🌸' },
    { days: Infinity, emoji: '🍎' }
  ];

  const stage = emojiStages.find(s => days <= s.days);
  treeEmoji.textContent = stage.emoji;
  treeEmoji.style.animation = 'treeGrow 1s ease-in-out';
}

// Su animasyonu
function playWaterAnimation() {
  const waterAnimation = document.querySelector('.water-animation');
  if (!waterAnimation) return;

  waterAnimation.style.display = 'block';
  waterAnimation.style.animation = 'waterDrop 2s ease-in-out';
  
  setTimeout(() => {
    waterAnimation.style.display = 'none';
  }, 2000);
}

// Ağaç aşamasını güncelle
function updateTreeStage(days) {
  updateEmojiTree(days);
}

// Canvas Animasyon Yöneticisi
let treeCanvas, waterCanvas, sunCanvas, cloudCanvas;
let treeCtx, waterCtx, sunCtx, cloudCtx;



// Canvas animasyonlarını başlat
function initCanvasAnimations() {
  console.log('initCanvasAnimations başlatıldı');
  
  try {
    // Canvas elementlerini al
    treeCanvas = document.getElementById('treeCanvas');
    waterCanvas = document.getElementById('waterCanvas');
    sunCanvas = document.getElementById('sunCanvas');
    cloudCanvas = document.getElementById('cloudCanvas');

    console.log('Canvas elementleri:', {
      treeCanvas: !!treeCanvas,
      waterCanvas: !!waterCanvas,
      sunCanvas: !!sunCanvas,
      cloudCanvas: !!cloudCanvas
    });

    if (!treeCanvas) {
      console.error('treeCanvas bulunamadı!');
      return;
    }

    // Context'leri al
    treeCtx = treeCanvas.getContext('2d');
    waterCtx = waterCanvas.getContext('2d');
    sunCtx = sunCanvas.getContext('2d');
    cloudCtx = cloudCanvas.getContext('2d');

    console.log('Context\'ler:', {
      treeCtx: !!treeCtx,
      waterCtx: !!waterCtx,
      sunCtx: !!sunCtx,
      cloudCtx: !!cloudCtx
    });

    // Canvas boyutlarını ayarla - sabit boyutlar
    treeCanvas.width = 300;
    treeCanvas.height = 300;
    waterCanvas.width = 300;
    waterCanvas.height = 300;
    sunCanvas.width = 80;
    sunCanvas.height = 80;
    cloudCanvas.width = 120;
    cloudCanvas.height = 80;

    console.log('Canvas animasyonları başlatıldı');
    console.log('Tree canvas boyutları:', treeCanvas.width, 'x', treeCanvas.height);
    
  } catch (error) {
    console.error('Canvas başlatılırken hata:', error);
    showFallbackTree();
  }
}

// Canvas boyutlarını güncelle
function resizeCanvas() {
  if (!treeCanvas || !waterCanvas) return;
  
  // Sabit boyutları koru
  treeCanvas.width = 300;
  treeCanvas.height = 300;
  waterCanvas.width = 300;
  waterCanvas.height = 300;
  sunCanvas.width = 80;
  sunCanvas.height = 80;
  cloudCanvas.width = 120;
  cloudCanvas.height = 80;
  
  // Ağacı yeniden çiz
  const data = getStoredData();
  if (data) {
    updateCanvasTree(data.dayCount);
  } else {
    updateCanvasTree(1);
  }
}

// Window resize olayını dinle
window.addEventListener('resize', resizeCanvas);

// Canvas ağacını güncelle
function updateCanvasTree(days) {
  console.log('updateCanvasTree çağrıldı, days:', days);
  
  if (!treeCtx) {
    console.error('treeCtx bulunamadı!');
    return;
  }

  console.log('Canvas boyutları:', treeCanvas.width, 'x', treeCanvas.height);

  // Canvas'ı temizle
  treeCtx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

  const centerX = treeCanvas.width / 2;
  const centerY = treeCanvas.height / 2;

  console.log('Merkez koordinatları:', centerX, centerY);

  // Toprak çiz - daha büyük
  treeCtx.fillStyle = '#8B4513';
  treeCtx.beginPath();
  treeCtx.ellipse(centerX, centerY + 80, 80, 20, 0, 0, 2 * Math.PI);
  treeCtx.fill();
  console.log('Toprak çizildi');

  // Ağaç gövdesi - daha büyük
  treeCtx.fillStyle = '#654321';
  const trunkHeight = Math.min(days * 6, 50);
  const trunkWidth = 8;
  treeCtx.fillRect(centerX - trunkWidth/2, centerY + 30 - trunkHeight, trunkWidth, trunkHeight);
  console.log('Gövde çizildi, yükseklik:', trunkHeight);

  // Yapraklar - daha büyük
  if (days > 1) {
    const leafSize = Math.min(days * 2.5, 30);
    treeCtx.fillStyle = days > 30 ? '#FF4500' : days > 14 ? '#FF69B4' : '#228B22';
    
    // Ana yaprak
    treeCtx.beginPath();
    treeCtx.arc(centerX, centerY - trunkHeight + 25, leafSize, 0, 2 * Math.PI);
    treeCtx.fill();
    console.log('Ana yaprak çizildi, boyut:', leafSize);

    // Yan yapraklar
    if (days > 7) {
      treeCtx.beginPath();
      treeCtx.arc(centerX - 20, centerY - trunkHeight + 20, leafSize * 0.7, 0, 2 * Math.PI);
      treeCtx.fill();
      
      treeCtx.beginPath();
      treeCtx.arc(centerX + 20, centerY - trunkHeight + 20, leafSize * 0.7, 0, 2 * Math.PI);
      treeCtx.fill();
      console.log('Yan yapraklar çizildi');
    }
  }

  // Güneş/Ay çiz
  drawCelestialBody();
  
  // Bulutları çiz
  drawClouds();
  
  console.log('Ağaç çizimi tamamlandı');
}

// Güneş/Ay çiz
function drawCelestialBody() {
  if (!sunCtx) return;

  sunCtx.clearRect(0, 0, sunCanvas.width, sunCanvas.height);
  
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 18;
  
  sunCtx.fillStyle = isDay ? '#FFD700' : '#F0F8FF';
  sunCtx.shadowColor = isDay ? '#FFD700' : '#F0F8FF';
  sunCtx.shadowBlur = 10;
  
  sunCtx.beginPath();
  sunCtx.arc(sunCanvas.width/2, sunCanvas.height/2, 15, 0, 2 * Math.PI);
  sunCtx.fill();
  
  sunCtx.shadowBlur = 0;
}

// Bulutları çiz
function drawClouds() {
  if (!cloudCtx) return;

  cloudCtx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
  
  // Saydam bulutlar için
  cloudCtx.globalAlpha = 0.7;
  cloudCtx.fillStyle = '#87CEEB';
  
  // Bulut 1 - tam boyutlu
  cloudCtx.beginPath();
  cloudCtx.arc(30, 40, 20, 0, 2 * Math.PI);
  cloudCtx.arc(50, 40, 15, 0, 2 * Math.PI);
  cloudCtx.arc(70, 40, 20, 0, 2 * Math.PI);
  cloudCtx.arc(45, 30, 15, 0, 2 * Math.PI);
  cloudCtx.arc(55, 30, 15, 0, 2 * Math.PI);
  cloudCtx.fill();
  
  // Bulut 2 - tam boyutlu
  cloudCtx.beginPath();
  cloudCtx.arc(80, 35, 15, 0, 2 * Math.PI);
  cloudCtx.arc(95, 35, 12, 0, 2 * Math.PI);
  cloudCtx.arc(110, 35, 15, 0, 2 * Math.PI);
  cloudCtx.arc(90, 25, 12, 0, 2 * Math.PI);
  cloudCtx.arc(100, 25, 12, 0, 2 * Math.PI);
  cloudCtx.fill();
  
  // Saydamlığı geri al
  cloudCtx.globalAlpha = 1.0;
}

// Su animasyonu
function playCanvasWaterAnimation() {
  if (!waterCtx) return;

  waterCanvas.style.display = 'block';
  
  let drops = [];
  const dropCount = 3;
  
  // Su damlaları oluştur - ağacın üstünden başlat
  for (let i = 0; i < dropCount; i++) {
    drops.push({
      x: waterCanvas.width / 2 + (Math.random() - 0.5) * 30,
      y: 50, // Ağacın üstünden başlat
      speed: 1.5 + Math.random() * 2,
      size: 2 + Math.random() * 2
    });
  }
  
  // Animasyon döngüsü
  function animateWater() {
    waterCtx.clearRect(0, 0, waterCanvas.width, waterCanvas.height);
    
    waterCtx.fillStyle = '#4169E1';
    
    drops.forEach(drop => {
      drop.y += drop.speed;
      
      waterCtx.beginPath();
      waterCtx.arc(drop.x, drop.y, drop.size, 0, 2 * Math.PI);
      waterCtx.fill();
    });
    
    // Animasyonu durdur
    if (drops[0].y > waterCanvas.height - 50) {
      waterCanvas.style.display = 'none';
      return;
    }
    
    requestAnimationFrame(animateWater);
  }
  
  animateWater();
}

// Utility fonksiyonlarını en başta tanımla
function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function getStoredData() {
  return JSON.parse(localStorage.getItem("growthData"));
}

function storeData(data) {
  localStorage.setItem("growthData", JSON.stringify(data));
}

function saveUserProfile(profile) {
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

function getUserProfile() {
  return JSON.parse(localStorage.getItem("userProfile"));
}

// Kupalar listesini al
function getAchievements() {
  return JSON.parse(localStorage.getItem("achievements")) || [];
}

// Tab switching function
function switchTab(tabName) {
  // Tüm tab'ları gizle
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });

  // Tüm nav item'ları pasif yap
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Seçilen tab'ı göster
  document.getElementById(tabName + "Tab").classList.add("active");

  // Seçilen nav item'ı aktif yap
  event.target.closest(".nav-item").classList.add("active");
}

// Kupalar sistemini kontrol et
function checkAchievements(dayCount) {
  const achievements = getAchievements();
  const newAchievements = [];

  const milestones = [
    {
      days: 1,
      name: "Seri Başlangıcı",
      icon: "🌱",
      description: "İlk adımı attın!",
      rarity: "common",
    },
    {
      days: 3,
      name: "3 Günlük Başlangıç",
      icon: "🥉",
      description: "İlk 3 günü tamamladın!",
      rarity: "common",
    },
    {
      days: 7,
      name: "1 Haftalık Kahraman",
      icon: "🥈",
      description: "1 haftalık seriyi başardın!",
      rarity: "uncommon",
    },
    {
      days: 14,
      name: "2 Haftalık Savaşçı",
      icon: "🥇",
      description: "2 haftalık güçlü iradeyi gösterdin!",
      rarity: "rare",
    },
    {
      days: 21,
      name: "Alışkanlık Kırıcı",
      icon: "⚡",
      description: "21 günde alışkanlığı kırdın!",
      rarity: "rare",
    },
    {
      days: 30,
      name: "1 Aylık Efsane",
      icon: "🏆",
      description: "Tam 1 ay boyunca kendini yendin!",
      rarity: "epic",
    },
    {
      days: 60,
      name: "2 Aylık Usta",
      icon: "👑",
      description: "2 aylık inanılmaz disiplin!",
      rarity: "epic",
    },
    {
      days: 90,
      name: "3 Aylık Şampiyon",
      icon: "⭐",
      description: "3 aylık mükemmel kontrol!",
      rarity: "legendary",
    },
    {
      days: 180,
      name: "6 Aylık Titan",
      icon: "💎",
      description: "6 aylık efsanevi güç!",
      rarity: "legendary",
    },
    {
      days: 365,
      name: "1 Yıllık Immortal",
      icon: "🔥",
      description: "Tam 1 yıl! Sen bir efsanesin!",
      rarity: "mythic",
    },
  ];

  milestones.forEach((milestone) => {
    if (
      dayCount >= milestone.days &&
      !achievements.some((a) => a.days === milestone.days)
    ) {
      newAchievements.push(milestone);
      achievements.push(milestone);
    }
  });

  if (newAchievements.length > 0) {
    localStorage.setItem("achievements", JSON.stringify(achievements));
    showAchievementNotification(newAchievements);

    // Ana sayfada kupa parıltı efekti göster
    showCupGlowEffect();
  }

  return newAchievements;
}

// Ana sayfada kupa parıltı efekti
function showCupGlowEffect() {
  // Bottom nav'daki kupalar ikonunu parlatır
  const cupsNavItem = document.querySelector(".nav-item:nth-child(2)");
  if (cupsNavItem) {
    cupsNavItem.style.animation = "cupGlow 2s ease-in-out 3";
    cupsNavItem.style.transform = "scale(1.1)";

    setTimeout(() => {
      cupsNavItem.style.animation = "";
      cupsNavItem.style.transform = "";
    }, 6000);
  }
}

// Kupa bildirimini göster (enhanced)
function showAchievementNotification(achievements) {
  achievements.forEach((achievement, index) => {
    setTimeout(() => {
      const notification = document.createElement("div");
      notification.className = `achievement-notification ${achievement.rarity}`;
      notification.innerHTML = `
        <div class="achievement-content">
          <span class="achievement-icon pulse">${achievement.icon}</span>
          <div>
            <strong>🎉 KUPA KAZANDIN!</strong>
            <p><strong>${achievement.name}</strong></p>
            <p>${achievement.description}</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      // Konfeti efekti
      createConfetti();

      setTimeout(() => {
        notification.remove();
      }, 5000);
    }, index * 1000);
  });
}

// Konfeti efekti
function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#f9ca24",
      "#f0932b",
    ][Math.floor(Math.random() * 5)];
    confetti.style.animationDelay = Math.random() * 3 + "s";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
}

// Sorular ve seçenekler
const questions = [
  {
    id: "duration",
    title: "🕐 Kaç yıldır bu alışkanlığın var?",
    type: "select",
    options: [
      { value: "less-than-1", text: "1 yıldan az" },
      { value: "1-3", text: "1-3 yıl" },
      { value: "3-5", text: "3-5 yıl" },
      { value: "5-10", text: "5-10 yıl" },
      { value: "more-than-10", text: "10 yıldan fazla" },
    ],
  },
  {
    id: "frequency",
    title: "📊 Ne sıklıkla mastürbasyon yapıyordun?",
    type: "select",
    options: [
      { value: "daily", text: "Günde birkaç kez" },
      { value: "once-daily", text: "Günde bir kez" },
      { value: "few-times-week", text: "Haftada birkaç kez" },
      { value: "weekly", text: "Haftada bir" },
      { value: "rarely", text: "Nadiren" },
    ],
  },
  {
    id: "weaknesses",
    title: "💭 Kendini hangi yönlerde eksik hissediyorsun?",
    subtitle: "Birden fazla seçebilirsin",
    type: "checkbox",
    options: [
      { value: "confidence", text: "Özgüven eksikliği" },
      { value: "energy", text: "Enerji düşüklüğü" },
      { value: "focus", text: "Odaklanma sorunu" },
      { value: "social", text: "Sosyal ilişkilerde zorluk" },
      { value: "motivation", text: "Motivasyon eksikliği" },
      { value: "guilt", text: "Suçluluk hissi" },
    ],
  },
  {
    id: "mainReason",
    title: "🎯 Bu alışkanlığı bırakmak istemenin en büyük nedeni nedir?",
    type: "textarea",
    placeholder: "Kendi kelimlerinle açıkla...",
  },
];

let currentQuestionIndex = 0;
let userAnswers = {};

// Kullanıcı uygulamayı ilk kez açıyor mu kontrol et
document.addEventListener("DOMContentLoaded", function () {
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
  renderCalendar();
  
  // İlk ağacı ayarla
  setTimeout(() => {
    const data = getStoredData();
    if (data) {
      updateTreeStage(data.dayCount);
    } else {
      updateTreeStage(1);
    }
  }, 100);
}

// Ana ekranı güncelle
function updateMainDisplay() {
  const data = getStoredData();
  if (data) {
    document.getElementById("output").innerText = `Gün ${data.dayCount}`;
    // SVG yüklendikten sonra ağacı güncelle
    setTimeout(() => {
      getTreeStage(data.dayCount);
    }, 100);
  }
}

// Onboarding başlat
function showOnboarding() {
  document.getElementById("onboardingContainer").style.display = "block";
  document.getElementById("mainContainer").style.display = "none";
  currentQuestionIndex = 0;
  userAnswers = {};
  showCurrentQuestion();
}

// Ana uygulamayı göster
function showMainApp() {
  document.getElementById("onboardingContainer").style.display = "none";
  document.getElementById("mainContainer").style.display = "block";
}

// Mevcut soruyu göster
function showCurrentQuestion() {
  const question = questions[currentQuestionIndex];
  const container = document.getElementById("questionContainer");
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Progress bar güncelle
  document.getElementById("progressFill").style.width = `${progress}%`;

  let html = `
    <div class="question-screen">
      <h2>${question.title}</h2>
      ${question.subtitle ? `<p class="subtitle">${question.subtitle}</p>` : ""}
      <div class="question-content">
  `;

  if (question.type === "select") {
    html += '<div class="options-list">';
    question.options.forEach((option) => {
      html += `
        <button class="option-btn" onclick="selectOption('${option.value}')">
          ${option.text}
        </button>
      `;
    });
    html += "</div>";
  } else if (question.type === "checkbox") {
    html += '<div class="checkbox-options">';
    question.options.forEach((option) => {
      html += `
        <label class="checkbox-option">
          <input type="checkbox" value="${option.value}" onchange="updateCheckboxAnswers()">
          <span>${option.text}</span>
        </label>
      `;
    });
    html += "</div>";
    html +=
      '<button class="continue-btn" onclick="continueFromCheckbox()" disabled>Devam Et</button>';
  } else if (question.type === "textarea") {
    html += `
      <textarea id="textareaAnswer" placeholder="${question.placeholder}" rows="4"></textarea>
      <button class="continue-btn" onclick="continueFromTextarea()">Devam Et</button>
    `;
  }

  html += "</div></div>";
  container.innerHTML = html;
}

// Seçenek seçimi (radio button tarzı)
function selectOption(value) {
  const question = questions[currentQuestionIndex];
  userAnswers[question.id] = value;

  // Seçilen seçeneği vurgula
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  event.target.classList.add("selected");

  // Kısa bir süre bekle ve devam et
  setTimeout(() => {
    nextQuestion();
  }, 500);
}

// Checkbox cevaplarını güncelle
function updateCheckboxAnswers() {
  const question = questions[currentQuestionIndex];
  const checkedBoxes = document.querySelectorAll(
    'input[type="checkbox"]:checked',
  );
  const values = Array.from(checkedBoxes).map((cb) => cb.value);

  userAnswers[question.id] = values;

  // En az bir seçenek seçildiyse devam butonunu aktif et
  const continueBtn = document.querySelector(".continue-btn");
  continueBtn.disabled = values.length === 0;
}

// Checkbox'tan devam et
function continueFromCheckbox() {
  nextQuestion();
}

// Textarea'dan devam et
function continueFromTextarea() {
  const textarea = document.getElementById("textareaAnswer");
  if (textarea.value.trim()) {
    const question = questions[currentQuestionIndex];
    userAnswers[question.id] = textarea.value.trim();
    nextQuestion();
  } else {
    alert("Lütfen bir açıklama yazın.");
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
    createdAt: new Date().toISOString(),
  };

  saveUserProfile(profile);

  // Tebrik ekranı göster
  const container = document.getElementById("questionContainer");
  container.innerHTML = `
    <div class="completion-screen">
      <h2>🎉 Harika!</h2>
      <p>Artık sana özel motivasyon mesajları hazırlayabilirim.</p>
      <p>Hadi ağacını yetiştirmeye başla!</p>
      <button onclick="showMainApp(); initializeMainApp();" class="start-btn">🌱 Başla</button>
    </div>
  `;
}

// Enhanced kupalar bölümünü render et
function renderAchievements() {
  const achievements = getAchievements();
  const data = getStoredData();
  const currentDays = data ? data.dayCount : 0;
  const container = document.getElementById("achievementsSection");

  const rarityColors = {
    common: "#95a5a6",
    uncommon: "#27ae60",
    rare: "#3498db",
    epic: "#9b59b6",
    legendary: "#f39c12",
    mythic: "#e74c3c",
  };

  const allMilestones = [
    {
      days: 1,
      name: "Seri Başlangıcı",
      icon: "🌱",
      description: "İlk adımı attın!",
      rarity: "common",
      motivationText: "Her büyük yolculuk tek bir adımla başlar!",
    },
    {
      days: 3,
      name: "3 Günlük Başlangıç",
      icon: "🥉",
      description: "İlk 3 günü tamamladın!",
      rarity: "common",
      motivationText: "İlk engeli aştın, güçlüsün!",
    },
    {
      days: 7,
      name: "1 Haftalık Kahraman",
      icon: "🥈",
      description: "1 haftalık seriyi başardın!",
      rarity: "uncommon",
      motivationText: "Bir hafta tam kontrol! İnanılmazsın!",
    },
    {
      days: 14,
      name: "2 Haftalık Savaşçı",
      icon: "🥇",
      description: "2 haftalık güçlü iradeyi gösterdin!",
      rarity: "rare",
      motivationText: "Güçlü iraden tüm zorluklara galip geliyor!",
    },
    {
      days: 21,
      name: "Alışkanlık Kırıcı",
      icon: "⚡",
      description: "21 günde alışkanlığı kırdın!",
      rarity: "rare",
      motivationText: "Bilim der ki 21 gün yeni alışkanlık oluşturur!",
    },
    {
      days: 30,
      name: "1 Aylık Efsane",
      icon: "🏆",
      description: "Tam 1 ay boyunca kendini yendin!",
      rarity: "epic",
      motivationText: "Efsanevi güç! Sen artık farklı birisin!",
    },
    {
      days: 60,
      name: "2 Aylık Usta",
      icon: "👑",
      description: "2 aylık inanılmaz disiplin!",
      rarity: "epic",
      motivationText: "Usta seviyesindesin! Kimse seni durduramaz!",
    },
    {
      days: 90,
      name: "3 Aylık Şampiyon",
      icon: "⭐",
      description: "3 aylık mükemmel kontrol!",
      rarity: "legendary",
      motivationText: "Şampiyon! Artık hiçbir şey eskisi gibi değil!",
    },
    {
      days: 180,
      name: "6 Aylık Titan",
      icon: "💎",
      description: "6 aylık efsanevi güç!",
      rarity: "legendary",
      motivationText: "Titan gücü! Sen artık başka bir seviyedesin!",
    },
    {
      days: 365,
      name: "1 Yıllık Immortal",
      icon: "🔥",
      description: "Tam 1 yıl! Sen bir efsanesin!",
      rarity: "mythic",
      motivationText: "İMMORTAL! Sen artık efsane statüsündesin!",
    },
  ];

  // Modern istatistikler bölümü
  let html = `
    <div class="achievement-stats">
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-number">${achievements.length}</div>
        <div class="stat-label">Kazanılan Kupa</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-number">${currentDays}</div>
        <div class="stat-label">Mevcut Seri</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-number">${Math.round((achievements.length / allMilestones.length) * 100)}%</div>
        <div class="stat-label">Tamamlama</div>
      </div>
    </div>

    <div class="next-achievement-section">
      ${getNextAchievementHTML(currentDays, allMilestones, achievements)}
    </div>

    <div class="collection-header">
      <h3>🏆 Kupa Koleksiyonum</h3>
      <div class="collection-progress">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${Math.round((achievements.length / allMilestones.length) * 100)}%"></div>
        </div>
        <span class="progress-text">${achievements.length}/${allMilestones.length} kupa</span>
      </div>
    </div>
    
    <div class="achievements-grid">
  `;

  allMilestones.forEach((milestone) => {
    const isEarned = achievements.some((a) => a.days === milestone.days);
    const daysUntil = milestone.days - currentDays;

    html += `
      <div class="achievement-card ${isEarned ? "earned" : "locked"} ${milestone.rarity}" 
           onclick="showAchievementDetail('${milestone.name}', '${milestone.description}', '${milestone.motivationText}', ${isEarned})">
        <div class="achievement-rarity ${milestone.rarity}">${milestone.rarity.toUpperCase()}</div>
        <div class="achievement-icon ${isEarned ? "bounce" : ""}">${isEarned ? milestone.icon : "🔒"}</div>
        <div class="achievement-name">${milestone.name}</div>
        <div class="achievement-desc">${milestone.description}</div>
        ${!isEarned && daysUntil > 0 ? `<div class="days-until">${daysUntil} gün kaldı</div>` : ""}
        <div class="achievement-border" style="border-color: ${rarityColors[milestone.rarity]}"></div>
      </div>
    `;
  });

  html += "</div>";
  container.innerHTML = html;
}

// Sonraki başarı HTML'i
function getNextAchievementHTML(currentDays, milestones, achievements) {
  const nextMilestone = milestones.find((m) => m.days > currentDays);
  if (!nextMilestone) {
    return `
      <div class="next-achievement-card completed">
        <div class="completion-celebration">
          <div class="celebration-icon">🎊</div>
          <h4>Tüm Kupaları Topladın!</h4>
          <p>Sen gerçek bir şampiyonsun! 🌟</p>
        </div>
      </div>
    `;
  }

  const daysLeft = nextMilestone.days - currentDays;
  const progress = Math.min((currentDays / nextMilestone.days) * 100, 100);
  const isReady = progress >= 100;

  return `
    <div class="next-achievement-card ${isReady ? "ready-to-claim" : ""}">
      <div class="next-achievement-header">
        <div class="next-icon ${isReady ? "ready-glow" : ""}">${nextMilestone.icon}</div>
        <div class="next-info">
          <h4>🎯 Sıradaki Hedef</h4>
          <strong>${nextMilestone.name}</strong>
          <p class="next-status">${isReady ? "🎉 Hazır!" : `${daysLeft} gün kaldı!`}</p>
        </div>
      </div>
      <div class="achievement-progress-container">
        <div class="achievement-progress-bar">
          <div class="progress-fill ${isReady ? "progress-complete" : ""}" style="width: ${progress}%"></div>
          <div class="progress-glow ${isReady ? "glow-active" : ""}"></div>
        </div>
        <div class="progress-details">
          <span class="progress-text ${isReady ? "text-ready" : ""}">${currentDays}/${nextMilestone.days} gün</span>
          <span class="progress-percentage">${Math.round(progress)}%</span>
        </div>
      </div>
      ${isReady ? '<div class="ready-indicator">✨ Hazır! ✨</div>' : ""}
    </div>
  `;
}

// Kupa detayını göster
function showAchievementDetail(name, description, motivationText, isEarned) {
  const modal = document.createElement("div");
  modal.className = "achievement-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h3>${isEarned ? "🎉" : "🔒"} ${name}</h3>
      <p>${description}</p>
      ${isEarned ? `<div class="motivation-quote">"${motivationText}"</div>` : "<p>Bu kupayı kazanmak için devam et!</p>"}
    </div>
  `;
  document.body.appendChild(modal);
}

// Profil bölümünü render et
function renderProfile() {
  const profile = getUserProfile();
  const data = getStoredData();
  const achievements = getAchievements();

  if (!profile) return;

  const container = document.getElementById("profileSection");
  const currentDays = data ? data.dayCount : 0;
  const completionRate = Math.round((achievements.length / 10) * 100);

  let html = `
    <div class="profile-header">
      <div class="profile-avatar">
        <div class="avatar-icon">👤</div>
        <div class="avatar-level">Seviye ${Math.floor(currentDays / 7) + 1}</div>
      </div>
      <div class="profile-info">
        <h3>Profilim</h3>
        <p class="profile-subtitle">Kişisel gelişim yolculuğun</p>
      </div>
    </div>

    <div class="profile-stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">🔥</div>
        <div class="stat-number">${currentDays}</div>
        <div class="stat-label">Mevcut Seri</div>
        <div class="stat-progress">
          <div class="progress-bar" style="width: ${Math.min((currentDays / 365) * 100, 100)}%"></div>
        </div>
      </div>
      
      <div class="stat-card secondary">
        <div class="stat-icon">🏆</div>
        <div class="stat-number">${achievements.length}</div>
        <div class="stat-label">Kazanılan Kupa</div>
        <div class="stat-progress">
          <div class="progress-bar" style="width: ${completionRate}%"></div>
        </div>
      </div>
      
      <div class="stat-card tertiary">
        <div class="stat-icon">📊</div>
        <div class="stat-number">${completionRate}%</div>
        <div class="stat-label">Tamamlama Oranı</div>
        <div class="stat-progress">
          <div class="progress-bar" style="width: ${completionRate}%"></div>
        </div>
      </div>
    </div>

    <div class="profile-sections">
      <div class="profile-section">
        <div class="section-header">
          <div class="section-icon">🎯</div>
          <h4>Ana Hedef</h4>
        </div>
        <div class="section-content">
          <p class="goal-text">${profile.mainReason}</p>
        </div>
      </div>

      <div class="profile-section">
        <div class="section-header">
          <div class="section-icon">💪</div>
          <h4>Çalıştığım Alanlar</h4>
        </div>
        <div class="section-content">
          <div class="weaknesses-grid">
  `;

  if (profile.weaknesses && profile.weaknesses.length > 0) {
    const weaknessIcons = {
      confidence: "💪",
      energy: "⚡",
      focus: "🎯",
      social: "👥",
      motivation: "🔥",
      guilt: "😔",
    };

    const weaknessNames = {
      confidence: "Özgüven",
      energy: "Enerji",
      focus: "Odaklanma",
      social: "Sosyal İlişkiler",
      motivation: "Motivasyon",
      guilt: "Suçluluk Hissi",
    };

    profile.weaknesses.forEach((weakness) => {
      html += `
        <div class="weakness-item">
          <div class="weakness-icon">${weaknessIcons[weakness] || "📝"}</div>
          <div class="weakness-name">${weaknessNames[weakness] || weakness}</div>
        </div>
      `;
    });
  }

  html += `
          </div>
        </div>
      </div>
    </div>

    <div class="profile-actions">
      <button onclick="resetProfile()" class="reset-btn">
        <div class="btn-icon">🔄</div>
        <div class="btn-text">Profili Sıfırla</div>
      </button>
    </div>
  `;

  container.innerHTML = html;
}

// Makaleler bölümünü render et
function renderArticles() {
  const container = document.getElementById("articlesSection");

  const articleCategories = [
    {
      title: "Bilimsel Faydalar",
      emoji: "🧠",
      articles: [
        "NoFap'in beyin üzerindeki etkileri araştırmalarla kanıtlanmıştır. Dopamin reseptörleriniz yenilenir ve daha fazla motivasyon hissederiz.",
        "Mastürbasyonu bıraktığınızda testosteron seviyeleriniz %45'e kadar artabilir. Bu da enerji ve güç hissini artırır.",
        "Beyin sisi ortadan kalkar ve daha net düşünmeye başlarsınız. Odaklanma süreniz önemli ölçüde artar.",
        "Serotonin seviyeleriniz yükselir, bu da depresyon ve anksiyete semptomlarını azaltır.",
        "Uyku kaliteniz iyileşir ve daha derin, dinlendirici uyku uyursunuz.",
        "Hafızanız güçlenir ve öğrenme kapasiteniz artar.",
        "Sosyal anksiyete azalır ve insanlarla daha rahat iletişim kurarsınız.",
        "Kendinize olan güveniniz artar ve daha kararlı bir kişilik geliştirirsiniz.",
        "Yaratıcılığınız artar ve yeni fikirler üretmeye başlarsınız.",
        "Genel ruh haliniz iyileşir ve daha pozitif bir bakış açısı geliştirirsiniz."
      ]
    },
    {
      title: "İlk 30 Gün Stratejileri",
      emoji: "🎯",
      articles: [
        "İlk hafta en zor dönemdir. Kendinizi meşgul tutun ve tetikleyicilerden uzak durun.",
        "Soğuk duş almak istekleri azaltır ve disiplin duygunuzu güçlendirir.",
        "Meditasyon yaparak zihninizi kontrol etmeyi öğrenin. Bu süreçte çok yardımcı olur.",
        "Sosyal medyayı sınırlayın ve tetikleyici içeriklerden kaçının.",
        "Egzersiz yaparak fazla enerjinizi atın ve endorfin salgılayın.",
        "Günlük tutarak ilerlemenizi takip edin ve motivasyonunuzu koruyun.",
        "Arkadaşlarınızla daha fazla zaman geçirin ve sosyal aktivitelere katılın.",
        "Yeni bir hobi edinin ve dikkatinizi başka yöne çevirin.",
        "Erken yatın ve düzenli uyku saatleri belirleyin.",
        "Kendinize küçük ödüller verin ve başarılarınızı kutlayın."
      ]
    },
    {
      title: "Dopamin Detoksu",
      emoji: "⚡",
      articles: [
        "Dopamin detoksu, beyninizi aşırı uyarımdan korur ve doğal zevkleri yeniden keşfetmenizi sağlar.",
        "Sosyal medya kullanımınızı günde 30 dakika ile sınırlayın.",
        "Video oyunları yerine kitap okumayı tercih edin.",
        "Fast food yerine sağlıklı yemekler yiyin ve yemek yeme sürecinin tadını çıkarın.",
        "Sürekli müzik dinlemek yerine sessizlik anları yaratın.",
        "Doğada yürüyüş yaparak doğal dopamin kaynaklarını keşfedin.",
        "Teknoloji kullanımınızı azaltın ve gerçek dünya ile bağlantı kurun.",
        "Anlık tatmin arayışından vazgeçin ve uzun vadeli hedeflere odaklanın.",
        "Kendinizi sıkıntıya sokun ve rahatsızlık toleransınızı artırın.",
        "Mindfulness pratikleri yaparak anı yaşamayı öğrenin."
      ]
    },
    {
      title: "Spor ve Egzersiz",
      emoji: "💪",
      articles: [
        "Düzenli egzersiz testosteron seviyelerinizi artırır ve enerjinizi yükseltir.",
        "Ağırlık kaldırmak kas gelişiminizi destekler ve güveninizi artırır.",
        "Kardiyo egzersizleri endorfin salgılar ve stresi azaltır.",
        "Yoga yaparak esnekliğinizi artırın ve zihinsel dengeyi sağlayın.",
        "Günde en az 30 dakika yürüyüş yaparak metabolizmanızı hızlandırın.",
        "Spor salonuna gitmek rutin oluşturur ve disiplin duygunuzu geliştirir.",
        "Takım sporları sosyal becerilerinizi geliştirir ve yalnızlık hissini azaltır.",
        "Doğada koşu yaparak hem fiziksel hem zihinsel sağlığınızı destekleyin.",
        "Esneme hareketleri yaparak vücudunuzu rahatlatın ve stresi azaltın.",
        "Güç antrenmanı yaparak kas kütlenizi artırın ve metabolizmanızı hızlandırın."
      ]
    }
  ];

  let html = `
    <div class="articles-header">
      <h3>📚 Faydalı Makaleler</h3>
      <p>Kategorilere tıklayarak rastgele makaleler okuyun</p>
    </div>
    <div class="articles-grid">
  `;

  articleCategories.forEach((category, index) => {
    html += `
      <div class="article-category" onclick="toggleArticlePanel(${index})">
        <div class="category-header">
          <div class="category-emoji">${category.emoji}</div>
          <div class="category-title">${category.title}</div>
          <div class="category-arrow">▼</div>
        </div>
        <div class="article-panel" id="panel-${index}">
          <div class="loading-spinner" style="display: none;">⏳</div>
          <div class="article-content-panel"></div>
        </div>
      </div>
    `;
  });

  html += "</div>";
  container.innerHTML = html;
}

// Takvim bölümünü render et
function renderCalendar() {
  const container = document.getElementById("calendarSection");
  const data = getStoredData();
  const wateredDates = data ? getWateredDates(data) : [];
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Kullanıcının başlangıç ayını al
  let startMonth = currentMonth;
  let startYear = currentYear;
  
  if (data && data.startDate) {
    const startDate = new Date(data.startDate);
    startMonth = startDate.getMonth();
    startYear = startDate.getFullYear();
  }
  
  let html = `
    <div class="calendar-header-section">
      <h3>📅 Takvim Görünümü</h3>
      <p>Başlangıç ayınız ve şu anki ayınızı görüntüleyin</p>
    </div>
    <div class="calendar-container">
  `;
  
  // Başlangıç ayı (kullanıcının ilk ayı)
  const userStartMonth = new Date(startYear, startMonth, 1);
  html += generateMonthCalendar(userStartMonth, wateredDates, 'start-month');
  
  // Şu anki ay
  const thisMonth = new Date(currentYear, currentMonth, 1);
  html += generateMonthCalendar(thisMonth, wateredDates, 'current-month');
  
  html += '</div>';
  container.innerHTML = html;
}

// Sulama yapılan tarihleri al
function getWateredDates(data) {
  const wateredDates = [];
  if (data && data.lastWatered) {
    // Son sulama tarihinden itibaren günleri hesapla
    const startDate = new Date(data.startDate);
    const lastWatered = new Date(data.lastWatered);
    
    // Başlangıç tarihinden son sulama tarihine kadar olan günleri ekle
    for (let d = new Date(startDate); d <= lastWatered; d.setDate(d.getDate() + 1)) {
      wateredDates.push(d.toISOString().split('T')[0]);
    }
  }
  return wateredDates;
}

// Ay takvimi oluştur
function generateMonthCalendar(date, wateredDates, className) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const monthLabel = className === 'start-month' ? '🌱 Başlangıç Ayı' : '📅 Şu Anki Ay';
  
  let html = `
    <div class="month-calendar ${className}">
      <h3>${monthNames[month]} ${year} - ${monthLabel}</h3>
      <div class="calendar-grid">
        <div class="calendar-header">
          <div>Pzt</div>
          <div>Sal</div>
          <div>Çar</div>
          <div>Per</div>
          <div>Cum</div>
          <div>Cmt</div>
          <div>Paz</div>
        </div>
        <div class="calendar-days">
  `;
  
  const currentDate = new Date();
  const today = currentDate.toISOString().split('T')[0];
  
  for (let i = 0; i < 42; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);
    
    const dayString = currentDay.toISOString().split('T')[0];
    const isCurrentMonth = currentDay.getMonth() === month;
    const isToday = dayString === today;
    const isWatered = wateredDates.includes(dayString);
    
    let dayClass = 'calendar-day';
    if (!isCurrentMonth) dayClass += ' other-month';
    if (isToday) dayClass += ' today';
    if (isWatered) dayClass += ' watered';
    
    html += `<div class="${dayClass}">${currentDay.getDate()}</div>`;
  }
  
  html += `
        </div>
      </div>
    </div>
  `;
  
  return html;
}

// Profili sıfırla
function resetProfile() {
  if (
    confirm(
      "Profili sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.",
    )
  ) {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("growthData");
    localStorage.removeItem("achievements");
    showOnboarding();
  }
}

// Ağaç kuruduğunda sıfırla
function resetTree() {
  localStorage.removeItem("growthData");
  document.getElementById("output").innerText =
    "Ağaç kurudu... Tekrar tohum dikildi.";
  document.getElementById("treeStage").innerText = "🌱";
}

// Ağaç görseli aşamasını belirle
function getTreeStage(days) {
  const treeContainer = document.getElementById("treeStage");
  
  if (!treeContainer) {
    console.log('Tree container bulunamadı');
    return;
  }
  
  const svg = treeContainer.querySelector('.tree-svg-element');
  
  if (!svg) {
    console.log('SVG element bulunamadı');
    return;
  }
  
  const trunk = svg.querySelector('.trunk');
  const leaves = svg.querySelectorAll('.leaves');
  const celestialBody = svg.querySelector('.celestial-body');
  const clouds = svg.querySelectorAll('.cloud');
  
  if (!trunk || !leaves.length) {
    console.log('Ağaç elementleri bulunamadı');
    return;
  }
  
  // Güneş/Ay ayarla
  const currentHour = new Date().getHours();
  if (celestialBody) {
    if (currentHour >= 6 && currentHour < 18) {
      // Gündüz - Güneş
      celestialBody.setAttribute('fill', '#FFD700');
      celestialBody.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))';
    } else {
      // Gece - Ay
      celestialBody.setAttribute('fill', '#F0F8FF');
      celestialBody.style.filter = 'drop-shadow(0 0 10px rgba(240, 248, 255, 0.5))';
    }
  }
  
  // Ağaç boyutunu güncelle
  if (days <= 1) {
    // Tohum - sadece toprak görünür
    trunk.style.display = 'none';
    leaves.forEach(leaf => {
      leaf.style.display = 'none';
    });
  } else if (days <= 3) {
    // Filiz - küçük gövde
    trunk.style.display = 'block';
    trunk.setAttribute('height', '20');
    trunk.setAttribute('y', '160');
    leaves.forEach(leaf => {
      leaf.style.display = 'none';
    });
  } else if (days <= 7) {
    // Küçük fidan
    trunk.style.display = 'block';
    trunk.setAttribute('height', '40');
    trunk.setAttribute('y', '140');
    leaves.forEach((leaf, index) => {
      leaf.style.display = 'block';
      if (index === 0) {
        leaf.setAttribute('r', '15');
        leaf.setAttribute('cy', '120');
      } else {
        leaf.style.display = 'none';
      }
    });
  } else if (days <= 14) {
    // Ağaç
    trunk.style.display = 'block';
    trunk.setAttribute('height', '60');
    trunk.setAttribute('y', '120');
    leaves.forEach((leaf, index) => {
      leaf.style.display = 'block';
      if (index === 0) {
        leaf.setAttribute('r', '25');
        leaf.setAttribute('cy', '100');
      } else {
        leaf.setAttribute('r', '15');
      }
    });
  } else if (days <= 30) {
    // Çiçekli ağaç
    trunk.style.display = 'block';
    trunk.setAttribute('height', '60');
    trunk.setAttribute('y', '120');
    leaves.forEach((leaf, index) => {
      leaf.style.display = 'block';
      if (index === 0) {
        leaf.setAttribute('r', '30');
        leaf.setAttribute('cy', '100');
        leaf.setAttribute('fill', '#FF69B4'); // Çiçek rengi
      } else {
        leaf.setAttribute('r', '20');
      }
    });
  } else {
    // Meyve veren ağaç
    trunk.style.display = 'block';
    trunk.setAttribute('height', '60');
    trunk.setAttribute('y', '120');
    leaves.forEach((leaf, index) => {
      leaf.style.display = 'block';
      if (index === 0) {
        leaf.setAttribute('r', '35');
        leaf.setAttribute('cy', '100');
        leaf.setAttribute('fill', '#FF4500'); // Turuncu meyve
      } else {
        leaf.setAttribute('r', '25');
      }
    });
  }
  
  // Bulut animasyonu (güneş sabit)
  clouds.forEach(cloud => {
    cloud.style.animation = 'cloudMove 20s linear infinite';
  });
}

// Ağaç görseline animasyon sınıfı ekle
function addAnimation(className) {
  const tree = document.getElementById("treeStage");
  tree.classList.remove("animateSeed", "animateWater", "animateDead", "animateAlreadyWatered");
  void tree.offsetWidth; // animasyon resetlemek için
  tree.classList.add(className);
  
  // Sulama animasyonu
  if (className === "animateWater") {
    playWaterAnimation();
  }
}

// Kişiselleştirilmiş motivasyon mesajı oluştur
function getPersonalizedMotivation(dayCount, profile) {
  const weaknessMessages = {
    confidence: [
      "💪 Her geçen gün özgüvenin artıyor! Bu başarın senin gücünü kanıtlıyor.",
      `🌟 ${dayCount} gündür kendine olan saygın büyüyor. Sen güçlü bir insansın!`,
      "⭐ Her 'hayır' dediğin an, içindeki güçlü karakteri ortaya çıkarıyor.",
    ],
    energy: [
      `⚡ Enerjin her gün artıyor! ${dayCount} günde ne kadar değiştiğini hissediyor musun?`,
      "🔋 Temiz enerji sende birikiyor. Bu momentumu kaybetme!",
      "💥 Vücudun ve zihnin artık daha güçlü. Bu enerjiyi koru!",
    ],
    focus: [
      `🎯 Odaklanma becerin her gün gelişiyor. ${dayCount} gün önemli bir süre!`,
      "🧠 Zihnin artık daha berrak. Bu netliği kaybetmek istemezsin.",
      "🔍 Konsantrasyonun artık daha güçlü. Bu gidişatı sürdür!",
    ],
    social: [
      "🤝 İnsanlarla ilişkin artık daha samimi ve doğal. Bu gelişimi koru!",
      `👥 ${dayCount} gündür sosyal özgüvenin artıyor. Bu değişimi hissediyor musun?`,
      "🗣️ Konuşmalarında artık daha rahat ve kendinden emin hissediyorsun.",
    ],
    motivation: [
      `🚀 Motivasyonun her gün daha güçlü! ${dayCount} gün büyük bir başarı!`,
      "💪 İçindeki savaşçı ruhu uyandı. Bu gücü kaybetme!",
      "🔥 Her gün daha kararlı ve motiveli oluyorsun. Devam et!",
    ],
    guilt: [
      "🕊️ Suçluluk hissin azalıyor, temiz vicdanın geri geliyor.",
      `💚 ${dayCount} gündür kendini affetmeyi öğreniyorsun. Bu çok değerli!`,
      "🌈 Geçmişin seni tanımlamıyor, bugünkü seçimlerin tanımlıyor.",
    ],
  };

  const durationMessages = {
    "less-than-1": `1 yıldan kısa süreli bu alışkanlığı ${dayCount} günde büyük oranda kontrol altına aldın!`,
    "1-3": `1-3 yıllık bu alışkanlığa karşı ${dayCount} günde büyük adım attın!`,
    "3-5": `3-5 yıllık bu zorlu alışkanlığı ${dayCount} günde yenmeye başladın!`,
    "5-10": `5-10 yıllık bu derin alışkanlığa karşı ${dayCount} günde inanılmaz güç gösterdin!`,
    "more-than-10": `10+ yıllık bu köklü alışkanlığı ${dayCount} günde sarsmaya başladın! Bu muhteşem!`,
  };

  const frequencyMessages = {
    daily: `Günde birkaç kez olan alışkanlığını ${dayCount} gündür durdurdun. Bu inanılmaz!`,
    "once-daily": `Günlük olan alışkanlığını ${dayCount} gündür yendin. Çok güçlüsün!`,
    "few-times-week": `Haftada birkaç kez olan alışkanlığını ${dayCount} gündür kontrol ediyorsun!`,
    weekly: `Haftalık alışkanlığını ${dayCount} gündür yeniyorsun. Harika gidiyorsun!`,
    rarely: `Zaten az olan alışkanlığını tamamen bırakma yolunda ${dayCount} gün geçti!`,
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
    reason: profile.mainReason,
  };
}

// Panik butonu işlemi
function handlePanic() {
  const panicBtn = document.querySelector('.panic-btn');
  const isExpanded = panicBtn.classList.contains('expanded');
  
  if (isExpanded) {
    // Panik butonunu kapat
    closePanicButton();
  } else {
    // Panik butonunu genişlet
    expandPanicButton();
  }
}

// Panik butonunu genişlet
function expandPanicButton() {
  const panicBtn = document.querySelector('.panic-btn');
  const expandedContent = panicBtn.querySelector('.panic-expanded');
  
  // ESC tuşu ile kapatma olayı ekle
  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      closePanicButton();
      document.removeEventListener('keydown', handleEscKey);
    }
  };
  document.addEventListener('keydown', handleEscKey);
  
  // Butonu genişlet
  expandedContent.style.display = 'block';
  setTimeout(() => {
    panicBtn.classList.add('expanded');
    getPanicAdvice();
  }, 10);
}

// Panik butonunu kapat
function closePanicButton() {
  const panicBtn = document.querySelector('.panic-btn');
  const expandedContent = panicBtn.querySelector('.panic-expanded');
  
  // Butonu kapat
  panicBtn.classList.remove('expanded');
  setTimeout(() => {
    expandedContent.style.display = 'none';
  }, 400);
}

// Panik tavsiyesi al
async function getPanicAdvice() {
  const loadingSpinner = document.querySelector('.loading-spinner');
  const panicAdvice = document.querySelector('.panic-advice');
  
  // Loading göster
  loadingSpinner.style.display = 'block';
  panicAdvice.innerHTML = '';
  
  try {
    const response = await fetch('/api/panic-advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Acil durumda kısa ve etkili bir motivasyon mesajı ve egzersiz tavsiyesi ver. Maksimum 2-3 cümle olsun."
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      loadingSpinner.style.display = 'none';
      
      // Motivasyon mesajını göster
      panicAdvice.innerHTML = `
        <h3>💪 Güçlü Kal!</h3>
        <p>${data.message}</p>
      `;
    } else {
      throw new Error('API yanıt vermedi');
    }
  } catch (error) {
    console.error('Panik tavsiyesi alınamadı:', error);
    loadingSpinner.style.display = 'none';
    panicAdvice.innerHTML = `
      <h3>💪 Güçlü Kal!</h3>
      <p>Derin nefes al ve 10'a kadar say. Bu anı geçecek, sen güçlüsün!</p>
      <p>🏃‍♂️ 10 jumping jack yap veya 5 şınav çek - endorfin salgıla!</p>
    `;
  }
}

// Motivasyon aksiyonları
function handleMotivationAction(action) {
  const motivationText = document.querySelector('.motivation-text');
  
  switch(action) {
    case 'breathe':
      motivationText.textContent = '🫁 Derin nefes al... 4 saniye tut... 6 saniye ver...';
      showBreathingAnimation();
      break;
    case 'distract':
      motivationText.textContent = '🎵 Sakinleştirici müzik dinle... Seni rahatlatacak şarkılar bul...';
      break;
    case 'exercise':
      motivationText.textContent = '🏃‍♂️ 10 şınav çek veya 20 jumping jack yap... Endorfin salgıla...';
      break;
  }
  
  // 3 saniye sonra butonu kapat
  setTimeout(() => {
    const panicBtn = document.querySelector('.panic-btn');
    panicBtn.classList.remove('expanded');
    setTimeout(() => {
      const expandedContent = panicBtn.querySelector('.panic-expanded');
      expandedContent.style.display = 'none';
      motivationText.textContent = 'Sen güçlüsün! Bu anı geçecek.';
    }, 300);
  }, 3000);
}

// Nefes alma animasyonu
function showBreathingAnimation() {
  const motivationText = document.querySelector('.motivation-text');
  let breathCount = 0;
  
  const breathingInterval = setInterval(() => {
    breathCount++;
    if (breathCount <= 3) {
      motivationText.textContent = `🫁 Nefes al... (${breathCount}/3)`;
    } else {
      clearInterval(breathingInterval);
      motivationText.textContent = '🎉 Harika! Şimdi daha sakin hissediyorsun...';
    }
  }, 2000);
}

// Makale panelini aç/kapat
function toggleArticlePanel(index) {
  const panel = document.getElementById(`panel-${index}`);
  const category = document.querySelectorAll('.article-category')[index];
  const arrow = category.querySelector('.category-arrow');
  const contentPanel = panel.querySelector('.article-content-panel');
  const loadingSpinner = panel.querySelector('.loading-spinner');
  
  // Diğer panelleri kapat
  document.querySelectorAll('.article-panel').forEach((p, i) => {
    if (i !== index) {
      p.style.display = 'none';
      document.querySelectorAll('.category-arrow')[i].textContent = '▼';
      document.querySelectorAll('.article-category')[i].classList.remove('active');
    }
  });
  
  if (panel.style.display === 'block') {
    // Paneli kapat
    panel.style.display = 'none';
    arrow.textContent = '▼';
    category.classList.remove('active');
  } else {
    // Paneli aç
    panel.style.display = 'block';
    arrow.textContent = '▲';
    category.classList.add('active');
    
    // Loading göster
    loadingSpinner.style.display = 'block';
    contentPanel.innerHTML = '';
    
    // 1 saniye sonra makaleyi göster
    setTimeout(() => {
      loadingSpinner.style.display = 'none';
      
      // Rastgele makale seç
      const articleCategories = [
        {
          articles: [
            "NoFap'in beyin üzerindeki etkileri araştırmalarla kanıtlanmıştır. Dopamin reseptörleriniz yenilenir ve daha fazla motivasyon hissederiz.",
            "Mastürbasyonu bıraktığınızda testosteron seviyeleriniz %45'e kadar artabilir. Bu da enerji ve güç hissini artırır.",
            "Beyin sisi ortadan kalkar ve daha net düşünmeye başlarsınız. Odaklanma süreniz önemli ölçüde artar.",
            "Serotonin seviyeleriniz yükselir, bu da depresyon ve anksiyete semptomlarını azaltır.",
            "Uyku kaliteniz iyileşir ve daha derin, dinlendirici uyku uyursunuz.",
            "Hafızanız güçlenir ve öğrenme kapasiteniz artar.",
            "Sosyal anksiyete azalır ve insanlarla daha rahat iletişim kurarsınız.",
            "Kendinize olan güveniniz artar ve daha kararlı bir kişilik geliştirirsiniz.",
            "Yaratıcılığınız artar ve yeni fikirler üretmeye başlarsınız.",
            "Genel ruh haliniz iyileşir ve daha pozitif bir bakış açısı geliştirirsiniz."
          ]
        },
        {
          articles: [
            "İlk hafta en zor dönemdir. Kendinizi meşgul tutun ve tetikleyicilerden uzak durun.",
            "Soğuk duş almak istekleri azaltır ve disiplin duygunuzu güçlendirir.",
            "Meditasyon yaparak zihninizi kontrol etmeyi öğrenin. Bu süreçte çok yardımcı olur.",
            "Sosyal medyayı sınırlayın ve tetikleyici içeriklerden kaçının.",
            "Egzersiz yaparak fazla enerjinizi atın ve endorfin salgılayın.",
            "Günlük tutarak ilerlemenizi takip edin ve motivasyonunuzu koruyun.",
            "Arkadaşlarınızla daha fazla zaman geçirin ve sosyal aktivitelere katılın.",
            "Yeni bir hobi edinin ve dikkatinizi başka yöne çevirin.",
            "Erken yatın ve düzenli uyku saatleri belirleyin.",
            "Kendinize küçük ödüller verin ve başarılarınızı kutlayın."
          ]
        },
        {
          articles: [
            "Dopamin detoksu, beyninizi aşırı uyarımdan korur ve doğal zevkleri yeniden keşfetmenizi sağlar.",
            "Sosyal medya kullanımınızı günde 30 dakika ile sınırlayın.",
            "Video oyunları yerine kitap okumayı tercih edin.",
            "Fast food yerine sağlıklı yemekler yiyin ve yemek yeme sürecinin tadını çıkarın.",
            "Sürekli müzik dinlemek yerine sessizlik anları yaratın.",
            "Doğada yürüyüş yaparak doğal dopamin kaynaklarını keşfedin.",
            "Teknoloji kullanımınızı azaltın ve gerçek dünya ile bağlantı kurun.",
            "Anlık tatmin arayışından vazgeçin ve uzun vadeli hedeflere odaklanın.",
            "Kendinizi sıkıntıya sokun ve rahatsızlık toleransınızı artırın.",
            "Mindfulness pratikleri yaparak anı yaşamayı öğrenin."
          ]
        },
        {
          articles: [
            "Düzenli egzersiz testosteron seviyelerinizi artırır ve enerjinizi yükseltir.",
            "Ağırlık kaldırmak kas gelişiminizi destekler ve güveninizi artırır.",
            "Kardiyo egzersizleri endorfin salgılar ve stresi azaltır.",
            "Yoga yaparak esnekliğinizi artırın ve zihinsel dengeyi sağlayın.",
            "Günde en az 30 dakika yürüyüş yaparak metabolizmanızı hızlandırın.",
            "Spor salonuna gitmek rutin oluşturur ve disiplin duygunuzu geliştirir.",
            "Takım sporları sosyal becerilerinizi geliştirir ve yalnızlık hissini azaltır.",
            "Doğada koşu yaparak hem fiziksel hem zihinsel sağlığınızı destekleyin.",
            "Esneme hareketleri yaparak vücudunuzu rahatlatın ve stresi azaltın.",
            "Güç antrenmanı yaparak kas kütlenizi artırın ve metabolizmanızı hızlandırın."
          ]
        }
      ];
      
      const randomArticle = articleCategories[index].articles[Math.floor(Math.random() * articleCategories[index].articles.length)];
      
      contentPanel.innerHTML = `
        <div class="article-text">
          <p>${randomArticle}</p>
        </div>
      `;
    }, 1000);
  }
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
      dayCount: 1,
    };
    storeData(data);
    document.getElementById("output").innerText = "Gün 1";
    updateTreeStage(1);
    playWaterAnimation();
    checkAchievements(data.dayCount);
    renderAchievements();
    return;
  }

  const lastWatered = data.lastWatered;
  const currentDate = new Date(today);
  const lastWateredDate = new Date(lastWatered);
  const diffDays = Math.floor(
    (currentDate - lastWateredDate) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 1) {
    // Normal sulama günü
    data.dayCount += 1;
    data.lastWatered = today;
    storeData(data);
    document.getElementById("output").innerText = `Gün ${data.dayCount}`;
    updateTreeStage(data.dayCount);
    playWaterAnimation();
    checkAchievements(data.dayCount);
    renderAchievements();
    renderCalendar();
  } else if (diffDays === 0) {
    // Bugün zaten sulama yapılmış - uyarı animasyonu
    const waterBtn = document.querySelector('.water-btn');
    waterBtn.classList.add('warning');
    
    // 1 saniye sonra uyarı animasyonunu kaldır
    setTimeout(() => {
      waterBtn.classList.remove('warning');
    }, 1000);
    
    // Ağaç animasyonu da ekle
    tree.classList.add("already-watered");
    setTimeout(() => {
      tree.classList.remove("already-watered");
    }, 3000);
  } else {
    document.getElementById("output").innerText = `Gün ${data.dayCount}`;
  }
}
