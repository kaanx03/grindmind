// Global değişkenler
let availableHabits = [];
let userHabits = [];
let selectedHabit = null;
let currentHabitToComplete = null;
let currentDetailsHabit = null;
let isCustomHabitMode = false;

// Örnek alışkanlıklar verisi (fallback)
const sampleHabits = [
  {
    id: 1,
    name: "Sabah Meditasyonu",
    icon: "🧘‍♀️",
    category: "mindfulness",
    description: "Günü sakin başlatmak için meditasyon",
    tips: [
      "Sessiz ve rahat bir ortam seçin",
      "5-10 dakika ile başlayın",
      "Nefes egzersizlerine odaklanın",
      "Düzenli saatlerde yapın",
    ],
  },
  {
    id: 2,
    name: "Günlük Egzersiz",
    icon: "💪",
    category: "fitness",
    description: "Her gün fiziksel aktivite",
    tips: [
      "Küçük adımlarla başlayın",
      "Sevdiğiniz aktiviteyi seçin",
      "Isınma ve soğuma yapmayı unutmayın",
      "Düzenli uyku ve beslenmeye dikkat edin",
    ],
  },
  {
    id: 3,
    name: "Su İçme",
    icon: "💧",
    category: "health",
    description: "Günde 2-3 litre su içmek",
    tips: [
      "Gün boyunca küçük yudumlarda için",
      "Su şişenizi yanınızda taşıyın",
      "Alarm kurarak hatırlatıcı ayarlayın",
      "Meyve ekleyerek tadını çeşitlendirebilirsiniz",
    ],
  },
  {
    id: 4,
    name: "Kitap Okuma",
    icon: "📖",
    category: "learning",
    description: "Günlük kitap okuma alışkanlığı",
    tips: [
      "Sabit bir okuma saati belirleyin",
      "İlginizi çeken konulardan başlayın",
      "Günde 15-30 dakika yeterli",
      "Okudukları hakkında not alın",
    ],
  },
  {
    id: 5,
    name: "Erken Kalkma",
    icon: "🌅",
    category: "routine",
    description: "Sabah erken saatlerde uyanmak",
    tips: [
      "Yavaş yavaş uyku saatinizi ayarlayın",
      "Akşam elektronik cihazları kapatın",
      "Sabah rutininizi planlayın",
      "Düzenli uyku saatleri belirleyin",
    ],
  },
];

// Mevcut alışkanlıkları JSON'dan yükle
async function loadAvailableHabits() {
  try {
    const response = await fetch("habits.json");
    if (!response.ok) {
      throw new Error("JSON dosyası bulunamadı");
    }
    const data = await response.json();
    availableHabits = data.habits;
  } catch (error) {
    console.warn("JSON bulunamadı, örnek veriler kullanılıyor:", error);
    availableHabits = sampleHabits;
  }
  renderAvailableHabits();
}

// Kullanıcı alışkanlıklarını localStorage'dan yükle
function loadUserHabits() {
  const saved = localStorage.getItem("grindmind_user_habits");
  if (saved) {
    userHabits = JSON.parse(saved);
  }
  renderUserHabits();
  checkForDailyReminder();
}

// Kullanıcı alışkanlıklarını localStorage'a kaydet
function saveUserHabits() {
  localStorage.setItem("grindmind_user_habits", JSON.stringify(userHabits));
}

// Aramaya göre alışkanlıkları filtrele
function filterHabits() {
  const searchTerm = document.getElementById("habitSearch").value.toLowerCase();
  const container = document.getElementById("availableHabits");

  if (searchTerm.length < 2) {
    container.innerHTML =
      '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Aramak için en az 2 karakter yazın</div>';
    return;
  }

  const filtered = availableHabits.filter(
    (habit) =>
      habit.name.toLowerCase().includes(searchTerm) ||
      habit.description.toLowerCase().includes(searchTerm) ||
      habit.category.toLowerCase().includes(searchTerm)
  );

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML =
      '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Aradığınız alışkanlık bulunamadı. Özel alışkanlık oluşturabilirsiniz.</div>';
    return;
  }

  filtered.forEach((habit) => {
    // Zaten eklenmiş olanları atla
    if (userHabits.find((h) => h.name === habit.name)) {
      return;
    }

    const item = document.createElement("div");
    item.className = "habit-item";
    item.onclick = () => selectHabit(habit.id);
    item.id = `habit-${habit.id}`;

    item.innerHTML = `
      <div class="item-icon">${habit.icon}</div>
      <div class="item-info">
          <h4>${habit.name}</h4>
          <p>${habit.description}</p>
      </div>
    `;

    container.appendChild(item);
  });
}

// Modal'da mevcut alışkanlıkları göster (başlangıçta boş)
function renderAvailableHabits() {
  const container = document.getElementById("availableHabits");
  container.innerHTML =
    '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Aramak için en az 2 karakter yazın</div>';
}

// Özel alışkanlık modunu aç/kapat
function toggleCustomHabit() {
  const customBox = document.getElementById("customHabitBox");
  const customInput = document.getElementById("customHabitInput");

  isCustomHabitMode = !isCustomHabitMode;

  if (isCustomHabitMode) {
    customBox.classList.add("active");
    customInput.style.display = "block";
    customInput.focus();
    // Diğer seçimleri temizle
    document.querySelectorAll(".habit-item").forEach((item) => {
      item.classList.remove("selected");
    });
    selectedHabit = null;
  } else {
    customBox.classList.remove("active");
    customInput.style.display = "none";
    customInput.value = "";
  }
}

// Eklemek için alışkanlık seç
function selectHabit(id) {
  // Özel alışkanlık modunu kapat
  if (isCustomHabitMode) {
    toggleCustomHabit();
  }

  // Önceki seçimi kaldır
  document.querySelectorAll(".habit-item").forEach((item) => {
    item.classList.remove("selected");
  });

  // Tıklanan öğeye seçim ekle
  const selectedElement = document.getElementById(`habit-${id}`);
  if (selectedElement) {
    selectedElement.classList.add("selected");
    selectedHabit = availableHabits.find((h) => h.id === id);
  }
}

// Kullanıcı alışkanlıklarını göster
function renderUserHabits() {
  const container = document.getElementById("habitsGrid");
  const emptyState = document.getElementById("emptyState");

  if (userHabits.length === 0) {
    container.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  container.style.display = "grid";
  emptyState.style.display = "none";
  container.innerHTML = "";

  userHabits.forEach((habit) => {
    const card = document.createElement("div");
    card.className = "habit-card";

    // Mevcut seri ve ilerleme hesaplama
    const currentStreak = calculateCurrentStreak(habit);
    const progressPercent = Math.min(
      (currentStreak / habit.targetDays) * 100,
      100
    );
    const isCompletedToday = isHabitCompletedToday(habit);

    if (isCompletedToday) {
      card.classList.add("completed-today");
    }

    card.innerHTML = `
      <div class="habit-header">
          <div class="habit-icon">${habit.icon}</div>
          <div class="habit-info">
              <h3>${habit.name}</h3>
              <p>Hedef: ${habit.targetDays} gün</p>
          </div>
      </div>
      
      <div class="habit-progress">
          <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div class="progress-text">${currentStreak}/${
      habit.targetDays
    } gün tamamlandı</div>
      </div>
      
      <div class="habit-stats">
          <div class="stat-box">
              <span class="stat-number">${currentStreak}</span>
              <span class="stat-label">Mevcut Seri</span>
          </div>
          <div class="stat-box">
              <span class="stat-number">${habit.bestStreak || 0}</span>
              <span class="stat-label">En İyi Seri</span>
          </div>
          <div class="stat-box">
              <span class="stat-number">${
                habit.completions ? habit.completions.length : 0
              }</span>
              <span class="stat-label">Toplam</span>
          </div>
      </div>
      
      <div class="streak-calendar" id="calendar-${habit.id}">
          <!-- Calendar will be generated here -->
      </div>
      
      <div class="habit-actions">
          <button class="card-btn success" onclick="showCompleteModal(${
            habit.id
          })" ${isCompletedToday ? "disabled" : ""}>
              ${isCompletedToday ? "Bugün Tamamlandı" : "Tamamla"}
          </button>
          <button class="card-btn secondary" onclick="viewHabitDetails(${
            habit.id
          })">Detaylar</button>
      </div>
    `;

    container.appendChild(card);

    // Bu alışkanlık için takvim oluştur
    generateStreakCalendar(habit);
  });
}
// Seri takvimi oluştur
function generateStreakCalendar(habit) {
  const calendar = document.getElementById(`calendar-${habit.id}`);
  if (!calendar) return;

  calendar.innerHTML = "";

  // Son 21 günü al
  const today = new Date();
  for (let i = 20; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";

    if (i === 0) {
      dayElement.classList.add("today");
    }

    // Bu tarihte tamamlandı mı kontrol et
    const dateString = date.toISOString().split("T")[0];
    const isCompleted =
      habit.completions && habit.completions.some((c) => c.date === dateString);

    if (isCompleted) {
      dayElement.classList.add("completed");
      dayElement.textContent = "✓";
    } else {
      dayElement.textContent = date.getDate();
    }

    calendar.appendChild(dayElement);
  }
}

// Mevcut seriyi hesapla
function calculateCurrentStreak(habit) {
  if (!habit.completions || habit.completions.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  // Bugünden geriye doğru kontrol et
  for (let i = 0; i < habit.targetDays; i++) {
    const checkDate = new Date();
    checkDate.setDate(today.getDate() - i);
    const dateString = checkDate.toISOString().split("T")[0];

    const isCompleted = habit.completions.some((c) => c.date === dateString);

    if (isCompleted) {
      streak++;
    } else if (i === 0) {
      // Eğer bugün tamamlanmadıysa, dün tamamlandı mı kontrol et
      break;
    } else {
      // Seriyi kır
      break;
    }
  }

  return streak;
}

// Alışkanlık bugün tamamlandı mı kontrol et
function isHabitCompletedToday(habit) {
  if (!habit.completions) return false;

  const today = new Date().toISOString().split("T")[0];
  return habit.completions.some((c) => c.date === today);
}

// Alışkanlık ekleme modal'ını göster
function showAddHabitModal() {
  document.getElementById("addHabitModal").style.display = "block";
  selectedHabit = null;
  isCustomHabitMode = false;
  document.getElementById("targetDays").value = 21;
  document.getElementById("habitSearch").value = "";

  // Özel alışkanlık kutusunu sıfırla
  const customBox = document.getElementById("customHabitBox");
  const customInput = document.getElementById("customHabitInput");
  customBox.classList.remove("active");
  customInput.style.display = "none";
  customInput.value = "";

  renderAvailableHabits();
}

// Tamamlama modal'ını göster
function showCompleteModal(habitId) {
  const habit = userHabits.find((h) => h.id === habitId);
  if (!habit || isHabitCompletedToday(habit)) return;

  currentHabitToComplete = habit;
  document.getElementById(
    "completeQuestion"
  ).textContent = `${habit.name} alışkanlığını bugün tamamladın mı?`;
  document.getElementById("moodSelect").value = "good";
  document.getElementById("completionNotes").value = "";

  document.getElementById("completeHabitModal").style.display = "block";
}

// Alışkanlık detaylarını göster
function viewHabitDetails(habitId) {
  const habit = userHabits.find((h) => h.id === habitId);
  if (!habit) return;

  currentDetailsHabit = habit;

  // İstatistikleri hesapla
  const currentStreak = calculateCurrentStreak(habit);
  const totalCompletions = habit.completions ? habit.completions.length : 0;
  const daysActive =
    Math.floor(
      (new Date() - new Date(habit.startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;
  const completionRate =
    daysActive > 0
      ? Math.min(Math.round((totalCompletions / daysActive) * 100), 100)
      : 0;

  // JSON'dan tips bilgisini al
  const habitData = availableHabits.find((h) => h.name === habit.name);
  const tips = habitData?.tips || [];

  document.getElementById(
    "detailsTitle"
  ).textContent = `${habit.name} Detayları`;

  const detailsBody = document.getElementById("detailsBody");
  detailsBody.innerHTML = `
    <div class="details-section">
      <h4>📊 Genel Bilgiler</h4>
      <div class="habit-stats">
        <div class="stat-box">
          <span class="stat-number">${currentStreak}</span>
          <span class="stat-label">Mevcut Seri</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">${habit.bestStreak || 0}</span>
          <span class="stat-label">En İyi Seri</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">${totalCompletions}</span>
          <span class="stat-label">Toplam Tamamlama</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">%${completionRate}</span>
          <span class="stat-label">Başarı Oranı</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">${habit.targetDays}</span>
          <span class="stat-label">Hedef Gün</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">${new Date(
            habit.startDate
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
      <h4>📈 Son Tamamlamalar</h4>
      <div class="timeline" style="max-height: 150px; overflow-y: auto;">
        ${
          habit.completions && habit.completions.length > 0
            ? habit.completions
                .slice(-5)
                .reverse()
                .map(
                  (completion) => `
            <div class="timeline-item">
              <div class="timeline-icon success">✓</div>
              <div class="timeline-content">
                <div class="timeline-date">${new Date(
                  completion.date
                ).toLocaleDateString("tr-TR")}</div>
                <div class="timeline-text">
                  Tamamlandı
                  ${completion.mood ? `• ${getMoodEmoji(completion.mood)}` : ""}
                  ${
                    completion.notes
                      ? `<br><small>${completion.notes}</small>`
                      : ""
                  }
                </div>
              </div>
            </div>
          `
                )
                .join("")
            : '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Henüz tamamlama yapılmamış</div>'
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
  if (modalId === "completeHabitModal") {
    document.getElementById("moodSelect").value = "good";
    document.getElementById("completionNotes").value = "";
  }

  if (modalId === "addHabitModal") {
    // Özel alışkanlık modunu sıfırla
    isCustomHabitMode = false;
    const customBox = document.getElementById("customHabitBox");
    const customInput = document.getElementById("customHabitInput");
    customBox.classList.remove("active");
    customInput.style.display = "none";
    customInput.value = "";
    selectedHabit = null;
    document.getElementById("habitSearch").value = "";
  }
}

// Yeni alışkanlık ekle
function addHabit() {
  let habitToAdd = null;
  let habitName = "";

  if (isCustomHabitMode) {
    // Özel alışkanlık
    const customInput = document.getElementById("customHabitInput");
    habitName = customInput.value.trim();

    if (!habitName) {
      showNotification("Lütfen alışkanlık adını girin!", "error");
      return;
    }

    if (habitName.length < 2) {
      showNotification("Alışkanlık adı en az 2 karakter olmalı!", "error");
      return;
    }

    habitToAdd = {
      id: Date.now(),
      name: habitName,
      icon: "⭐",
      category: "custom",
      description: "Özel alışkanlık",
      tips: [],
    };
  } else {
    // Hazır alışkanlık
    if (!selectedHabit) {
      showNotification("Lütfen bir alışkanlık seçin!", "error");
      return;
    }
    habitToAdd = selectedHabit;
    habitName = selectedHabit.name;
  }

  const targetDays = parseInt(document.getElementById("targetDays").value);
  if (targetDays < 1) {
    showNotification("Hedef gün sayısı en az 1 olmalı!", "error");
    return;
  }

  // Zaten var mı kontrol et
  if (
    userHabits.find((h) => h.name.toLowerCase() === habitName.toLowerCase())
  ) {
    showNotification("Bu alışkanlık zaten takip ediliyor!", "error");
    return;
  }

  const newHabit = {
    id: Date.now(),
    name: habitToAdd.name,
    icon: habitToAdd.icon,
    category: habitToAdd.category,
    description: habitToAdd.description,
    startDate: new Date().toISOString(),
    targetDays: targetDays,
    completions: [],
    bestStreak: 0,
  };

  userHabits.push(newHabit);
  saveUserHabits();
  renderUserHabits();
  closeModal("addHabitModal");

  showNotification(
    `🎉 ${habitToAdd.name} alışkanlığı eklendi! ${targetDays} gün hedefine doğru ilerlemeye başla.`,
    "success"
  );
}

// Alışkanlığı tamamla
function completeHabit() {
  if (!currentHabitToComplete) return;

  const mood = document.getElementById("moodSelect").value;
  const notes = document.getElementById("completionNotes").value;
  const today = new Date().toISOString().split("T")[0];

  // Bugün zaten tamamlandı mı kontrol et
  if (isHabitCompletedToday(currentHabitToComplete)) {
    showNotification("Bu alışkanlığı bugün zaten tamamladınız!", "warning");
    closeModal("completeHabitModal");
    return;
  }

  // Tamamlama ekle
  if (!currentHabitToComplete.completions) {
    currentHabitToComplete.completions = [];
  }

  currentHabitToComplete.completions.push({
    date: today,
    mood: mood,
    notes: notes,
    timestamp: new Date().toISOString(),
  });

  // En iyi seriyi güncelle
  const currentStreak = calculateCurrentStreak(currentHabitToComplete);
  if (currentStreak > (currentHabitToComplete.bestStreak || 0)) {
    currentHabitToComplete.bestStreak = currentStreak;
  }

  saveUserHabits();
  renderUserHabits();
  closeModal("completeHabitModal");

  const newStreak = calculateCurrentStreak(currentHabitToComplete);
  let message = `🎉 Harika! ${currentHabitToComplete.name} tamamlandı!\n\n`;
  message += `Mevcut serin: ${newStreak} gün`;

  if (newStreak === currentHabitToComplete.targetDays) {
    message += `\n\n🏆 TEBRİKLER! ${currentHabitToComplete.targetDays} günlük hedefini tamamladın!`;
  } else if (newStreak % 7 === 0) {
    message += `\n\n🔥 ${newStreak} günlük seri! Süper gidiyorsun!`;
  }

  showNotification(message, "success");
}

// Alışkanlığı sil
function deleteHabit() {
  if (!currentDetailsHabit) return;

  if (
    confirm(
      `${currentDetailsHabit.name} alışkanlığını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
    )
  ) {
    userHabits = userHabits.filter((h) => h.id !== currentDetailsHabit.id);
    saveUserHabits();
    renderUserHabits();
    closeModal("detailsModal");
    showNotification(
      `${currentDetailsHabit.name} alışkanlığı silindi.`,
      "info"
    );
  }
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

// Günlük hatırlatıcı kontrol et
function checkForDailyReminder() {
  const lastReminder = localStorage.getItem("grindmind_habits_last_reminder");
  const today = new Date().toDateString();

  if (lastReminder !== today && userHabits.length > 0) {
    setTimeout(() => {
      const incompleteHabits = userHabits.filter(
        (h) => !isHabitCompletedToday(h)
      );
      if (incompleteHabits.length > 0) {
        showNotification(
          `🔔 ${incompleteHabits.length} alışkanlığın bugün için bekliyor! Tamamlamayı unutma.`,
          "info"
        );
        localStorage.setItem("grindmind_habits_last_reminder", today);
      }
    }, 3000);
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

  // Ctrl/Cmd + N - Yeni alışkanlık ekle
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    showAddHabitModal();
  }
});

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", function () {
  console.log("✨ Yeni Alışkanlıklar sayfası yüklendi");
  loadAvailableHabits();
  loadUserHabits();
});
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

function createSuccessRateChart(canvasId, habits) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  const labels = habits.map((h) => h.name);
  const data = habits.map((h) => {
    const total = h.completions ? h.completions.length : 0;
    const daysActive =
      Math.floor((new Date() - new Date(h.startDate)) / (1000 * 60 * 60 * 24)) +
      1;
    return daysActive > 0
      ? Math.min(Math.round((total / daysActive) * 100), 100)
      : 0;
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
  const completionData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    last7Days.push(date.toLocaleDateString("tr-TR", { weekday: "short" }));

    const allCompletions = userHabits.flatMap((h) => h.completions || []);
    const dayCompletions = allCompletions.filter((c) => c.date === dateStr);

    completionData.push(dayCompletions.length);
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: last7Days,
      datasets: [
        {
          label: "Tamamlanan Alışkanlıklar",
          data: completionData,
          backgroundColor: "#10b981",
          borderRadius: 6,
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
  if (userHabits.length === 0) {
    showNotification("Henüz takip ettiğiniz bir alışkanlık yok.", "info");
    return;
  }

  const totalHabits = userHabits.length;
  const totalCompletions = userHabits.reduce(
    (sum, habit) => sum + (habit.completions ? habit.completions.length : 0),
    0
  );
  const avgStreak = Math.round(
    userHabits.reduce((sum, habit) => sum + calculateCurrentStreak(habit), 0) /
      totalHabits
  );
  const bestOverallStreak = Math.max(
    ...userHabits.map((h) => h.bestStreak || 0)
  );

  const completedHabits = userHabits.filter(
    (h) => calculateCurrentStreak(h) >= h.targetDays
  ).length;
  const activeHabits = userHabits.filter(
    (h) => calculateCurrentStreak(h) > 0
  ).length;

  // Son 7 günde yapılan tamamlama sayısı
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split("T")[0]);
  }

  const weeklyCompletions = last7Days.reduce((sum, date) => {
    const allCompletions = userHabits.flatMap((h) => h.completions || []);
    return sum + allCompletions.filter((c) => c.date === date).length;
  }, 0);

  // En iyi performans gösteren alışkanlıklar
  const sortedHabits = [...userHabits].sort(
    (a, b) => calculateCurrentStreak(b) - calculateCurrentStreak(a)
  );

  const statisticsBody = document.getElementById("statisticsBody");
  statisticsBody.innerHTML = `
    <div class="stats-grid">
      <div class="stats-card">
        <span class="stat-number primary">${totalHabits}</span>
        <span class="stat-label">Toplam Alışkanlık</span>
      </div>
      <div class="stats-card">
        <span class="stat-number success">${bestOverallStreak}</span>
        <span class="stat-label">En İyi Seri</span>
      </div>
      <div class="stats-card">
        <span class="stat-number primary">${completedHabits}</span>
        <span class="stat-label">Tamamlanan Hedef</span>
      </div>
      <div class="stats-card">
        <span class="stat-number ${
          activeHabits === totalHabits
            ? "success"
            : activeHabits >= totalHabits / 2
            ? "warning"
            : "danger"
        }">${activeHabits}/${totalHabits}</span>
        <span class="stat-label">Aktif Seri</span>
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
      totalCompletions > 0
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
      totalCompletions > 10
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
          <span>Haftalık Tamamlama: ${weeklyCompletions}/${
    totalHabits * 7
  }</span>
          <span>${Math.round(
            (weeklyCompletions / (totalHabits * 7)) * 100
          )}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min(
            (weeklyCompletions / (totalHabits * 7)) * 100,
            100
          )}%"></div>
        </div>
      </div>
    </div>

    ${
      totalHabits > 1
        ? `
    <div class="details-section">
      <h4>🏆 Performans Sıralaması</h4>
      <div class="leaderboard">
        ${sortedHabits
          .map((habit, index) => {
            const currentStreak = calculateCurrentStreak(habit);
            const totalCompletions = habit.completions
              ? habit.completions.length
              : 0;
            const daysActive =
              Math.floor(
                (new Date() - new Date(habit.startDate)) / (1000 * 60 * 60 * 24)
              ) + 1;
            const successRate =
              daysActive > 0
                ? Math.min(
                    Math.round((totalCompletions / daysActive) * 100),
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
              <div class="item-icon">${habit.icon}</div>
              <div class="item-info">
                <h4>${habit.name}</h4>
                <p>${currentStreak} gün seri • %${successRate} başarı</p>
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

    // Başarı oranları grafiği (sadece tamamlama varsa)
    if (totalCompletions > 0) {
      createSuccessRateChart("successRateChart", userHabits);
    }

    // İlerleme trendi grafiği (yeterli veri varsa)
    if (totalCompletions > 10) {
      const last30Days = [];
      const progressData = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        last30Days.push(date.getDate() + "/" + (date.getMonth() + 1));

        // O günkü toplam tamamlama sayısı
        const allCompletions = userHabits.flatMap((h) => h.completions || []);
        const dayCompletions = allCompletions.filter((c) => c.date === dateStr);
        progressData.push(dayCompletions.length);
      }

      createProgressChart(
        "progressChart",
        last30Days,
        progressData,
        "Günlük Tamamlama"
      );
    }
  }, 100);
}
