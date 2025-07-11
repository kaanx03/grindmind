// Global değişkenler
let availableAddictions = [];
let userAddictions = [];
let selectedAddiction = null;
let currentCheckinAddiction = null;
let currentDetailsAddiction = null;
let isCustomMode = false;

// Örnek bağımlılıklar verisi (fallback)
const sampleAddictions = [
  {
    id: 1,
    name: "Sigara",
    icon: "🚬",
    category: "substance",
    description: "Nikotin bağımlılığı",
  },
  {
    id: 2,
    name: "Sosyal Medya",
    icon: "📱",
    category: "digital",
    description: "Aşırı sosyal medya kullanımı",
  },
  {
    id: 3,
    name: "Şeker",
    icon: "🍭",
    category: "food",
    description: "Aşırı şeker tüketimi",
  },
  {
    id: 4,
    name: "Alkol",
    icon: "🍷",
    category: "substance",
    description: "Alkol bağımlılığı",
  },
  {
    id: 5,
    name: "Kahve",
    icon: "☕",
    category: "substance",
    description: "Kafein bağımlılığı",
  },
  {
    id: 6,
    name: "Fast Food",
    icon: "🍔",
    category: "food",
    description: "Aşırı fast food tüketimi",
  },
  {
    id: 7,
    name: "Oyun",
    icon: "🎮",
    category: "digital",
    description: "Video oyun bağımlılığı",
  },
  {
    id: 8,
    name: "Netflix",
    icon: "📺",
    category: "digital",
    description: "Aşırı dizi/film izleme",
  },
];

// DÜZELTME: Basitleştirilmiş ve doğru temiz gün hesaplama
function calculateCleanDays(addiction) {
  const today = new Date().toISOString().split("T")[0];
  const todayCheckin = addiction.checkins.find((c) => c.date === today);

  // Bugün nüks varsa 0 döndür
  if (todayCheckin && !todayCheckin.isClean) {
    return 0;
  }

  // Tüm check-in'leri tarihe göre sırala
  const sortedCheckins = [...addiction.checkins].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Son nüksten sonraki temiz günleri say
  let cleanDays = 0;
  let foundRelapse = false;

  // Tersine döngü ile son nüksten itibaren temiz günleri say
  for (let i = sortedCheckins.length - 1; i >= 0; i--) {
    const checkin = sortedCheckins[i];
    if (!checkin.isClean) {
      foundRelapse = true;
      break;
    }
    if (checkin.isClean) {
      cleanDays++;
    }
  }

  // Eğer hiç nüks yoksa tüm temiz günleri say
  if (!foundRelapse) {
    cleanDays = sortedCheckins.filter((c) => c.isClean).length;
  }

  return cleanDays;
}

// Mevcut bağımlılıkları JSON'dan yükle
async function loadAvailableAddictions() {
  try {
    const response = await fetch("addictions.json");
    if (!response.ok) {
      throw new Error("JSON dosyası bulunamadı");
    }
    const data = await response.json();
    availableAddictions = data.addictions;
  } catch (error) {
    console.warn("JSON bulunamadı, örnek veriler kullanılıyor:", error);
    availableAddictions = sampleAddictions;
  }
  renderAvailableAddictions();
}

// Kullanıcı bağımlılıklarını localStorage'dan yükle
function loadUserAddictions() {
  const saved = localStorage.getItem("grindmind_user_addictions");
  if (saved) {
    userAddictions = JSON.parse(saved);
  }
  renderUserAddictions();
  checkForDailyCheckIns();
}

// Kullanıcı bağımlılıklarını localStorage'a kaydet
function saveUserAddictions() {
  localStorage.setItem(
    "grindmind_user_addictions",
    JSON.stringify(userAddictions)
  );
}

// Aramaya göre bağımlılıkları filtrele
function filterAddictions() {
  const searchTerm = document
    .getElementById("addictionSearch")
    .value.toLowerCase();
  const container = document.getElementById("availableAddictions");

  if (searchTerm.length < 2) {
    container.innerHTML =
      '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Aramak için en az 2 karakter yazın</div>';
    return;
  }

  const filtered = availableAddictions.filter(
    (addiction) =>
      addiction.name.toLowerCase().includes(searchTerm) ||
      addiction.description.toLowerCase().includes(searchTerm)
  );

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML =
      '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Aradığınız bağımlılık bulunamadı. Özel bağımlılık oluşturabilirsiniz.</div>';
    return;
  }

  filtered.forEach((addiction) => {
    // Zaten eklenmiş olanları atla
    if (userAddictions.find((a) => a.name === addiction.name)) {
      return;
    }

    const item = document.createElement("div");
    item.className = "addiction-item";
    item.onclick = () => selectAddiction(addiction.id);
    item.id = `addiction-${addiction.id}`;

    item.innerHTML = `
      <div class="item-icon">${addiction.icon}</div>
      <div class="item-info">
          <h4>${addiction.name}</h4>
          <p>${addiction.description}</p>
      </div>
    `;

    container.appendChild(item);
  });
}

// Modal'da mevcut bağımlılıkları göster (başlangıçta boş)
function renderAvailableAddictions() {
  const container = document.getElementById("availableAddictions");
  container.innerHTML =
    '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Aramak için en az 2 karakter yazın</div>';
}

// Özel bağımlılık input'unu aç/kapat
function toggleCustom() {
  const box = document.getElementById("customAddictionBox");
  const input = document.getElementById("customAddictionInput");

  if (!isCustomMode) {
    isCustomMode = true;
    box.classList.add("active");
    input.style.display = "block";
    input.focus();
    selectedAddiction = null;
    // Diğer seçimleri temizle
    document.querySelectorAll(".addiction-item").forEach((item) => {
      item.classList.remove("selected");
    });
  }
}

// Eklemek için bağımlılık seç
function selectAddiction(id) {
  // Özel modu temizle
  isCustomMode = false;
  document.getElementById("customAddictionBox").classList.remove("active");
  document.getElementById("customAddictionInput").style.display = "none";
  document.getElementById("customAddictionInput").value = "";

  // Önceki seçimi kaldır
  document.querySelectorAll(".addiction-item").forEach((item) => {
    item.classList.remove("selected");
  });

  // Tıklanan öğeye seçim ekle
  const selectedElement = document.getElementById(`addiction-${id}`);
  if (selectedElement) {
    selectedElement.classList.add("selected");
    selectedAddiction = availableAddictions.find((a) => a.id === id);
  }
}

// Kullanıcı bağımlılıklarını göster
function renderUserAddictions() {
  const container = document.getElementById("addictionsGrid");
  const emptyState = document.getElementById("emptyState");

  if (userAddictions.length === 0) {
    container.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  container.style.display = "grid";
  emptyState.style.display = "none";
  container.innerHTML = "";

  userAddictions.forEach((addiction) => {
    const card = document.createElement("div");
    card.className = "addiction-card";

    // DÜZELTME: Temiz gün hesaplama
    const cleanDays = calculateCleanDays(addiction);

    // Bugün check-in yapıldı mı kontrol et
    const today = new Date().toISOString().split("T")[0];
    const hasCheckedInToday = addiction.checkins.some((c) => c.date === today);

    // JSON'dan tips bilgisini al
    const addictionData = availableAddictions.find(
      (a) => a.name === addiction.name
    );
    const tips = addictionData?.tips || [];

    card.innerHTML = `
      <div class="addiction-header">
          <div class="addiction-icon">${addiction.icon}</div>
          <div class="addiction-info">
              <h3>${addiction.name}</h3>
              <p>${addiction.description || "Özel bağımlılık"}</p>
          </div>
      </div>
      
      <div class="addiction-stats">
          <div class="stat-box">
              <span class="stat-number">${cleanDays}</span>
              <span class="stat-label">Temiz Gün</span>
          </div>
          <div class="stat-box">
              <span class="stat-number">${addiction.checkins.length}</span>
              <span class="stat-label">Check-in</span>
          </div>
      </div>
      
      ${
        tips.length > 0
          ? `
      <div class="addiction-tips">
          <h4>💡 İpuçları</h4>
          <div class="tips-list">
              ${tips
                .slice(0, 2)
                .map(
                  (tip) => `
                  <div class="tip-item">• ${tip}</div>
              `
                )
                .join("")}
              ${
                tips.length > 2
                  ? `<div class="tip-more">+${tips.length - 2} daha...</div>`
                  : ""
              }
          </div>
      </div>
      `
          : ""
      }
      
      <div class="addiction-actions">
          <button class="card-btn ${
            hasCheckedInToday ? "secondary" : "success"
          }" 
                  onclick="showCheckinModal(${addiction.id})"
                  ${hasCheckedInToday ? "disabled" : ""}>
              ${hasCheckedInToday ? "Tamamlandı ✓" : "Check-in"}
          </button>
          <button class="card-btn secondary" onclick="viewAddictionDetails(${
            addiction.id
          })">
              Detaylar
          </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Bağımlılık ekleme modal'ını göster
function showAddAddictionModal() {
  document.getElementById("addAddictionModal").style.display = "block";
  selectedAddiction = null;
  isCustomMode = false;
  document.getElementById("addictionSearch").value = "";
  document.getElementById("customAddictionInput").value = "";
  document.getElementById("customAddictionBox").classList.remove("active");
  document.getElementById("customAddictionInput").style.display = "none";
  renderAvailableAddictions();
}

// Check-in modal'ını göster
function showCheckinModal(addictionId) {
  const addiction = userAddictions.find((a) => a.id === addictionId);
  if (!addiction) return;

  // Bugün zaten check-in yapıldı mı kontrol et
  const today = new Date().toISOString().split("T")[0];
  const hasCheckedInToday = addiction.checkins.some((c) => c.date === today);

  if (hasCheckedInToday) {
    showNotification("Bugün zaten check-in yaptınız!", "warning");
    return;
  }

  currentCheckinAddiction = addiction;
  document.getElementById(
    "checkinQuestion"
  ).textContent = `${addiction.name} için bugünkü check-in. Bugün temiz kaldın mı?`;

  document.getElementById("checkinModal").style.display = "block";
}

// Bağımlılık detaylarını göster
function viewAddictionDetails(addictionId) {
  const addiction = userAddictions.find((a) => a.id === addictionId);
  if (!addiction) return;

  currentDetailsAddiction = addiction;

  // Temiz gün hesaplama
  const cleanDays = calculateCleanDays(addiction);
  const totalCheckins = addiction.checkins.length;
  const cleanCheckins = addiction.checkins.filter((c) => c.isClean).length;
  const successRate =
    totalCheckins > 0 ? Math.round((cleanCheckins / totalCheckins) * 100) : 0;

  // JSON'dan tips bilgisini al
  const addictionData = availableAddictions.find(
    (a) => a.name === addiction.name
  );
  const tips = addictionData?.tips || [];

  document.getElementById(
    "detailsTitle"
  ).textContent = `${addiction.name} Detayları`;

  const detailsBody = document.getElementById("detailsBody");
  detailsBody.innerHTML = `
    <div class="details-section">
      <h4>📊 Genel Bilgiler</h4>
      <div class="addiction-stats">
        <div class="stat-box">
          <span class="stat-number">${cleanDays}</span>
          <span class="stat-label">Temiz Gün</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">${totalCheckins}</span>
          <span class="stat-label">Toplam Check-in</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">%${successRate}</span>
          <span class="stat-label">Başarı Oranı</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">${new Date(
            addiction.startDate
          ).toLocaleDateString("tr-TR")}</span>
          <span class="stat-label">Başlangıç</span>
        </div>
      </div>
    </div>

    ${
      tips.length > 0
        ? `
    <div class="details-section">
      <h4>💡 Faydalı İpuçları</h4>
      <div class="tips-container">
        ${tips
          .map(
            (tip, index) => `
          <div class="tip-card">
            <span class="tip-number">${index + 1}</span>
            <span class="tip-text">${tip}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <div class="details-section">
      <h4>📈 Son Check-in'ler</h4>
      <div class="timeline" style="max-height: 150px; overflow-y: auto;">
        ${
          addiction.checkins.length === 0
            ? '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Henüz check-in yapılmamış</div>'
            : addiction.checkins
                .slice(-5)
                .reverse()
                .map(
                  (checkin) => `
            <div class="timeline-item">
              <div class="timeline-icon ${
                checkin.isClean ? "success" : "danger"
              }">
                ${checkin.isClean ? "✓" : "✗"}
              </div>
              <div class="timeline-content">
                <div class="timeline-date">${new Date(
                  checkin.date
                ).toLocaleDateString("tr-TR")}</div>
                <div class="timeline-text">
                  ${checkin.isClean ? "Temiz kaldı" : "Nüks yaşadı"} 
                  ${checkin.mood ? `• ${getMoodEmoji(checkin.mood)}` : ""}
                  ${checkin.notes ? `<br><small>${checkin.notes}</small>` : ""}
                </div>
              </div>
            </div>
          `
                )
                .join("")
        }
      </div>
    </div>
  `;

  document.getElementById("detailsModal").style.display = "block";
}

// Mood emoji'si al
function getMoodEmoji(mood) {
  const moods = {
    excellent: "Mükemmel 😊",
    good: "İyi 🙂",
    neutral: "Normal 😐",
    bad: "Kötü 😔",
    terrible: "Berbat 😞",
  };
  return moods[mood] || mood;
}

// Modal'ı kapat
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";

  // Formları temizle
  if (modalId === "checkinModal") {
    document.getElementById("moodSelect").value = "good";
    document.getElementById("checkinNotes").value = "";
  }
}

// Yeni bağımlılık ekle
function addAddiction() {
  let newAddictionData;

  if (isCustomMode) {
    const customName = document
      .getElementById("customAddictionInput")
      .value.trim();
    if (!customName) {
      showNotification("Lütfen bağımlılık adını yazın!", "error");
      return;
    }

    newAddictionData = {
      name: customName,
      icon: "🚫",
      category: "custom",
      description: "Özel bağımlılık",
    };
  } else {
    if (!selectedAddiction) {
      showNotification(
        "Lütfen bir bağımlılık seçin veya özel bağımlılık oluşturun!",
        "error"
      );
      return;
    }
    newAddictionData = selectedAddiction;
  }

  // Zaten var mı kontrol et
  if (
    userAddictions.find(
      (a) => a.name.toLowerCase() === newAddictionData.name.toLowerCase()
    )
  ) {
    showNotification("Bu bağımlılık zaten takip ediliyor!", "error");
    return;
  }

  const newAddiction = {
    id: Date.now(),
    name: newAddictionData.name,
    icon: newAddictionData.icon,
    category: newAddictionData.category,
    description: newAddictionData.description,
    startDate: new Date().toISOString(),
    checkins: [],
  };

  userAddictions.push(newAddiction);
  saveUserAddictions();
  renderUserAddictions();
  closeModal("addAddictionModal");

  showNotification(
    `🎉 ${newAddictionData.name} bağımlılığı eklendi! Artık günlük takip edebilirsin.`,
    "success"
  );
}

// Check-in gönder
function submitCheckin(isClean) {
  if (!currentCheckinAddiction) return;

  const mood = document.getElementById("moodSelect").value;
  const notes = document.getElementById("checkinNotes").value;
  const today = new Date().toISOString().split("T")[0];

  // Bugün zaten check-in yapıldı mı kontrol et
  const existingCheckin = currentCheckinAddiction.checkins.find(
    (c) => c.date === today
  );
  if (existingCheckin) {
    showNotification("Bugün zaten check-in yaptınız!", "warning");
    closeModal("checkinModal");
    return;
  }

  // Check-in ekle
  const checkin = {
    date: today,
    isClean: isClean,
    mood: mood,
    notes: notes,
    timestamp: new Date().toISOString(),
  };

  currentCheckinAddiction.checkins.push(checkin);

  // Verileri kaydet ve görünümü güncelle
  saveUserAddictions();

  // Check-in sonrası temiz gün sayısını hesapla
  const cleanDays = calculateCleanDays(currentCheckinAddiction);

  // Görünümü güncelle
  renderUserAddictions();
  closeModal("checkinModal");

  if (isClean) {
    showNotification(
      `✅ Harika! ${cleanDays} gündür temizsin! Böyle devam et! 💪`,
      "success"
    );
  } else {
    showNotification(
      `Sorun değil, herkes hata yapar. Yarın yeni bir başlangıç! 🌅`,
      "info"
    );
  }
}

// Bağımlılığı sil
function deleteAddiction() {
  if (!currentDetailsAddiction) return;

  if (
    confirm(
      `${currentDetailsAddiction.name} bağımlılığını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
    )
  ) {
    userAddictions = userAddictions.filter(
      (a) => a.id !== currentDetailsAddiction.id
    );
    saveUserAddictions();
    renderUserAddictions();
    closeModal("detailsModal");
    showNotification(
      `${currentDetailsAddiction.name} bağımlılığı silindi.`,
      "info"
    );
  }
}

// İstatistikler için grafik oluştur
function createProgressChart(canvasId, labels, data, title) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: data,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(226, 232, 240, 0.5)",
          },
          ticks: {
            color: "#64748b",
          },
        },
        x: {
          grid: {
            color: "rgba(226, 232, 240, 0.5)",
          },
          ticks: {
            color: "#64748b",
          },
        },
      },
    },
  });
}

function createSuccessRateChart(canvasId, addictions) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  const labels = addictions.map((a) => a.name);
  const data = addictions.map((a) => {
    const total = a.checkins.length;
    const clean = a.checkins.filter((c) => c.isClean).length;
    return total > 0 ? Math.round((clean / total) * 100) : 0;
  });

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#06b6d4",
            "#f97316",
          ],
          borderColor: "#ffffff",
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            color: "#64748b",
          },
        },
      },
    },
  });
}

function createWeeklyActivityChart(canvasId) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Son 7 gün
  const last7Days = [];
  const cleanData = [];
  const relapseData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    last7Days.push(date.toLocaleDateString("tr-TR", { weekday: "short" }));

    const allCheckins = userAddictions.flatMap((a) => a.checkins);
    const dayCheckins = allCheckins.filter((c) => c.date === dateStr);

    cleanData.push(dayCheckins.filter((c) => c.isClean).length);
    relapseData.push(dayCheckins.filter((c) => !c.isClean).length);
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: last7Days,
      datasets: [
        {
          label: "Temiz Kaldım",
          data: cleanData,
          backgroundColor: "#10b981",
          borderRadius: 6,
        },
        {
          label: "Nüks Yaşadım",
          data: relapseData,
          backgroundColor: "#ef4444",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            padding: 20,
            usePointStyle: true,
            color: "#64748b",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(226, 232, 240, 0.5)",
          },
          ticks: {
            color: "#64748b",
            stepSize: 1,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#64748b",
          },
        },
      },
    },
  });
}

// Grafiklerle istatistikleri göster
function showStats() {
  if (userAddictions.length === 0) {
    showNotification("Henüz takip ettiğiniz bir bağımlılık yok.", "info");
    return;
  }

  const totalAddictions = userAddictions.length;
  const totalCleanDays = userAddictions.reduce(
    (sum, addiction) => sum + calculateCleanDays(addiction),
    0
  );
  const avgCleanDays = Math.round(totalCleanDays / totalAddictions);

  const allCheckins = userAddictions.flatMap((a) => a.checkins);
  const totalCheckins = allCheckins.length;
  const cleanCheckins = allCheckins.filter((c) => c.isClean).length;
  const overallSuccessRate =
    totalCheckins > 0 ? Math.round((cleanCheckins / totalCheckins) * 100) : 0;

  // Son 7 günde yapılan check-in sayısı
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split("T")[0]);
  }

  const weeklyCheckins = last7Days.reduce((sum, date) => {
    return sum + allCheckins.filter((c) => c.date === date).length;
  }, 0);

  // En uzun temiz süre
  const longestStreak = Math.max(
    ...userAddictions.map((addiction) => {
      let maxStreak = 0;
      let currentStreak = 0;
      const sortedCheckins = addiction.checkins.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      sortedCheckins.forEach((checkin) => {
        if (checkin.isClean) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

      return Math.max(maxStreak, calculateCleanDays(addiction));
    }),
    0
  );

  // En iyi performans gösteren bağımlılıklar
  const sortedAddictions = [...userAddictions].sort(
    (a, b) => calculateCleanDays(b) - calculateCleanDays(a)
  );

  const statisticsBody = document.getElementById("statisticsBody");
  statisticsBody.innerHTML = `
    <div class="stats-grid">
      <div class="stats-card">
        <span class="stat-number primary">${totalAddictions}</span>
        <span class="stat-label">Takip Edilen</span>
      </div>
      <div class="stats-card">
        <span class="stat-number success">${totalCleanDays}</span>
        <span class="stat-label">Toplam Temiz Gün</span>
      </div>

      <div class="stats-card">
        <span class="stat-number ${
          overallSuccessRate >= 80
            ? "success"
            : overallSuccessRate >= 60
            ? "warning"
            : "danger"
        }">${overallSuccessRate}%</span>
        <span class="stat-label">Başarı Oranı</span>
      </div>
      <div class="stats-card">
        <span class="stat-number primary">${totalCheckins}</span>
        <span class="stat-label">Toplam Check-in</span>
      </div>
      <div class="stats-card">
        <span class="stat-number success">${longestStreak}</span>
        <span class="stat-label">En Uzun Seri</span>
      </div>
    </div>

    <!-- Grafikler -->
    <div class="chart-container">
      <h4>📈 Son 7 Gün Aktivitesi</h4>
      <div class="chart-wrapper">
        <canvas id="weeklyActivityChart"></canvas>
      </div>
    </div>

    ${
      totalCheckins > 0
        ? `
    <div class="chart-container">
      <h4>🎯 Başarı Oranları</h4>
      <div class="chart-wrapper">
        <canvas id="successRateChart"></canvas>
      </div>
    </div>
    `
        : ""
    }

    ${
      totalCheckins > 7
        ? `
    <div class="chart-container">
      <h4>📊 İlerleme Trendi (Son 30 Gün)</h4>
      <div class="chart-wrapper">
        <canvas id="progressChart"></canvas>
      </div>
    </div>
    `
        : ""
    }

    <div class="details-section">
      <h4>📈 Son 7 Gün Aktivitesi</h4>
      <div class="progress-container">
        <div class="progress-label">
          <span>Haftalık Check-in: ${weeklyCheckins}/${
    totalAddictions * 7
  }</span>
          <span>${Math.round(
            (weeklyCheckins / (totalAddictions * 7)) * 100
          )}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min(
            (weeklyCheckins / (totalAddictions * 7)) * 100,
            100
          )}%"></div>
        </div>
      </div>
    </div>

    ${
      totalAddictions > 1
        ? `
    <div class="details-section">
      <h4>🏆 Performans Sıralaması</h4>
      <div class="leaderboard">
        ${sortedAddictions
          .map((addiction, index) => {
            const cleanDays = calculateCleanDays(addiction);
            const checkins = addiction.checkins.length;
            const successRate =
              checkins > 0
                ? Math.round(
                    (addiction.checkins.filter((c) => c.isClean).length /
                      checkins) *
                      100
                  )
                : 0;

            let rankClass = "";
            if (index === 0) rankClass = "gold";
            else if (index === 1) rankClass = "silver";
            else if (index === 2) rankClass = "bronze";

            return `
            <div class="leaderboard-item">
              <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
              <div class="item-icon">${addiction.icon}</div>
              <div class="item-info">
                <h4>${addiction.name}</h4>
                <p>${cleanDays} gün temiz • %${successRate} başarı</p>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
    `
        : ""
    }
  `;

  document.getElementById("statisticsModal").style.display = "block";

  // Grafikleri oluştur
  setTimeout(() => {
    // Haftalık aktivite grafiği
    createWeeklyActivityChart("weeklyActivityChart");

    // Başarı oranları grafiği (sadece check-in varsa)
    if (totalCheckins > 0) {
      createSuccessRateChart("successRateChart", userAddictions);
    }

    // İlerleme trendi grafiği (yeterli veri varsa)
    if (totalCheckins > 7) {
      const last30Days = [];
      const progressData = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        last30Days.push(date.getDate() + "/" + (date.getMonth() + 1));

        // O günkü toplam temiz gün sayısı
        const dayTotalClean = userAddictions.reduce((sum, addiction) => {
          const checkins = addiction.checkins.filter((c) => c.date <= dateStr);
          if (checkins.length === 0) return sum;

          // Son check-in'e kadar temiz mi?
          const lastCheckin = checkins[checkins.length - 1];
          if (lastCheckin.isClean) {
            // Son nüksten sonraki günleri say
            const lastRelapse = checkins.reverse().find((c) => !c.isClean);
            const referenceDate = lastRelapse
              ? new Date(lastRelapse.date)
              : new Date(addiction.startDate);

            const diffTime = new Date(dateStr) - referenceDate;
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return sum + Math.max(0, days);
          }
          return sum;
        }, 0);

        progressData.push(dayTotalClean);
      }

      createProgressChart(
        "progressChart",
        last30Days,
        progressData,
        "Toplam Temiz Gün"
      );
    }
  }, 100);
}

// Bildirim göster
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = "notification";

  // Türe göre renk ayarla
  const colors = {
    success: "var(--success-color)",
    error: "var(--danger-color)",
    warning: "var(--warning-color)",
    info: "#6366f1",
  };

  notification.style.background = colors[type] || colors.success;
  notification.textContent = message;

  document.body.appendChild(notification);

  // 5 saniye sonra kaldır
  setTimeout(() => {
    notification.style.animation = "slideIn 0.5s ease reverse";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 5000);

  // Tıklanınca kaldır
  notification.addEventListener("click", () => {
    notification.style.animation = "slideIn 0.5s ease reverse";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  });
}

// Günlük check-in'leri kontrol et
function checkForDailyCheckIns() {
  const today = new Date().toISOString().split("T")[0];
  const lastReminderDate = localStorage.getItem("grindmind_last_reminder_date");

  if (lastReminderDate === today) return;

  const pendingCheckIns = userAddictions.filter((addiction) => {
    return !addiction.checkins.some((c) => c.date === today);
  });

  if (pendingCheckIns.length > 0) {
    setTimeout(() => {
      showNotification(
        `🔔 ${pendingCheckIns.length} bağımlılık için günlük check-in yapmayı unutma!`,
        "info"
      );
      localStorage.setItem("grindmind_last_reminder_date", today);
    }, 2000);
  }
}

// Modal dışına tıklanınca kapat
window.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});

// Klavye kısayolları
document.addEventListener("keydown", function (e) {
  // Escape tuşu - tüm modal'ları kapat
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
    });
  }

  // Ctrl/Cmd + N - Yeni bağımlılık ekle
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    showAddAddictionModal();
  }

  // Ctrl/Cmd + S - İstatistikleri göster
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    showStats();
  }
});

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚫 Bağımlılık Bırakma sayfası yüklendi");
  loadAvailableAddictions();
  loadUserAddictions();
});

// Debug fonksiyonu
window.debugCleanDays = function (addictionName) {
  const addiction = userAddictions.find((a) => a.name === addictionName);
  if (addiction) {
    console.log("=== DEBUG CLEAN DAYS ===");
    console.log("Addiction:", addiction.name);
    console.log("Check-ins:", addiction.checkins);
    console.log("Calculated clean days:", calculateCleanDays(addiction));
  }
};
