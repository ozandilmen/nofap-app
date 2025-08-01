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

// Panik butonu işlevi
function handlePanic() {
  const motivationDiv = document.getElementById("motivationOutput");
  const data = getStoredData();
  const dayCount = data ? data.dayCount : 0;
  
  // Motivasyon mesajları
  const motivationMessages = [
    `🌱 ${dayCount} gündür ne kadar güçlü olduğunu kanıtladın! Bu ağacın büyümesi senin iradenin kanıtı. Şimdi pes etme, ağacın daha da büyük meyveler verecek!`,
    "💪 Kötü alışkanlıklar geçicidir, ama güçlü karakterin kalıcıdır. Sen bunu yapabilirsin!",
    "🔥 Her panik anı aslında seni daha güçlü yapan bir fırsattır. Bu zorluğu da aşacaksın!",
    "🌱 Ağacın büyümesi için sabır gerekir, sen de sabırlı ol. Başarın yakında gelecek!",
    "⭐ Bugüne kadar geldiğin yol boşa gitmeyecek. Sen çok değerlisin, pes etme!",
    "🏆 Her zor an seni hedefe bir adım daha yaklaştırıyor. Güçlüsün!",
    "🌟 Bu anı geçiştirmek seni daha da güçlü yapacak. İnan kendine!",
    "💎 Değerli bir insan olduğunu unutma. Bu zorluğu da aşacaksın!"
  ];
  
  const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
  
  motivationDiv.style.display = "block";
  motivationDiv.innerHTML = `💪 <strong>Güçlü kal!</strong><br><br>${randomMessage}`;
}
