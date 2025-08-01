// Sayfa yüklendiğinde kontrol et
window.addEventListener('DOMContentLoaded', function() {
  const userProfile = getUserProfile();
  if (userProfile) {
    showMainApp();
  } else {
    showOnboarding();
  }
});

// Onboarding formunu göster
function showOnboarding() {
  document.getElementById('onboardingContainer').style.display = 'block';
  document.getElementById('mainContainer').style.display = 'none';
}

// Ana uygulamayı göster
function showMainApp() {
  document.getElementById('onboardingContainer').style.display = 'none';
  document.getElementById('mainContainer').style.display = 'block';
}

// Kullanıcı profilini kaydet
function saveUserProfile(profile) {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

// Kullanıcı profilini çek
function getUserProfile() {
  return JSON.parse(localStorage.getItem('userProfile'));
}

// Form submit olayını yönet
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('onboardingForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const weaknesses = formData.getAll('weaknesses');
      
      const profile = {
        frequency: formData.get('frequency'),
        duration: formData.get('duration'),
        weaknesses: weaknesses,
        mainReason: formData.get('mainReason'),
        createdAt: new Date().toISOString()
      };
      
      saveUserProfile(profile);
      showMainApp();
    });
  }
});

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
      "🌟 ${dayCount} gündür kendine olan saygın büyüyor. Sen güçlü bir insansın!",
      "⭐ Her 'hayır' dediğin an, içindeki güçlü karakteri ortaya çıkarıyor."
    ],
    energy: [
      "⚡ Enerjin her gün artıyor! ${dayCount} günde ne kadar değiştiğini hissediyor musun?",
      "🔋 Temiz enerji sende birikiyor. Bu momentumu kaybetme!",
      "💥 Vücudun ve zihnin artık daha güçlü. Bu enerjiyi koru!"
    ],
    focus: [
      "🎯 Odaklanma becerin her gün gelişiyor. ${dayCount} gün önemli bir süre!",
      "🧠 Zihnin artık daha berrak. Bu netliği kaybetmek istemezsin.",
      "🔍 Konsantrasyonun artık daha güçlü. Bu gidişatı sürdür!"
    ],
    social: [
      "🤝 İnsanlarla ilişkin artık daha samimi ve doğal. Bu gelişimi koru!",
      "👥 ${dayCount} gündür sosyal özgüvenin artıyor. Bu değişimi hissediyor musun?",
      "🗣️ Konuşmalarında artık daha rahat ve kendinden emin hissediyorsun."
    ],
    motivation: [
      "🚀 Motivasyonun her gün daha güçlü! ${dayCount} gün büyük bir başarı!",
      "💪 İçindeki savaşçı ruhu uyandı. Bu gücü kaybetme!",
      "🔥 Her gün daha kararlı ve motiveli oluyorsun. Devam et!"
    ],
    guilt: [
      "🕊️ Suçluluk hissin azalıyor, temiz vicdanın geri geliyor.",
      "💚 ${dayCount} gündür kendini affetmeyi öğreniyorsun. Bu çok değerli!",
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
      personalMessage = messages[Math.floor(Math.random() * messages.length)]
        .replace('${dayCount}', dayCount);
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
