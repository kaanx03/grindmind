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

// Navbar işlevleri
function toggleMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("navMobile");
  const overlay = document.getElementById("navMobileOverlay");

  if (hamburger) hamburger.classList.toggle("active");
  if (mobileNav) mobileNav.classList.toggle("show");
  if (overlay) overlay.classList.toggle("show");

  // Body scroll kontrolü
  if (mobileNav && mobileNav.classList.contains("show")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

function closeMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("navMobile");
  const overlay = document.getElementById("navMobileOverlay");

  if (hamburger) hamburger.classList.remove("active");
  if (mobileNav) mobileNav.classList.remove("show");
  if (overlay) overlay.classList.remove("show");
  document.body.style.overflow = "";
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

function handleSettings() {
  showNotification("Ayarlar", "Ayarlar sayfası yakında eklenecek!", "info");
  toggleProfileDropdown();
}

function handleLogout() {
  if (confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
    showNotification("Çıkış", "Başarıyla çıkış yapıldı. Güle güle!", "success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);
  }
  toggleProfileDropdown();
}

// Bildirim sistemi
function showNotification(title, message, type = "info") {
  const toast = document.getElementById("notificationToast");
  if (!toast) return;

  const titleEl = toast.querySelector(".notification-title");
  const messageEl = toast.querySelector(".notification-message");
  const iconEl = toast.querySelector(".notification-icon");

  const icons = {
    success: "🎉",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;
  if (iconEl) iconEl.textContent = icons[type] || icons.info;

  toast.classList.add("show");

  setTimeout(() => {
    hideNotification();
  }, 4000);
}

function hideNotification() {
  const toast = document.getElementById("notificationToast");
  if (toast) {
    toast.classList.remove("show");
  }
}

// Alışkanlık yönetim fonksiyonları
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

function loadUserHabits() {
  try {
    const saved = localStorage.getItem("grindmind_user_habits");
    if (saved) {
      userHabits = JSON.parse(saved);
    }
  } catch (error) {
    console.error("Kullanıcı alışkanlıkları yüklenemedi:", error);
    userHabits = [];
  }
  renderUserHabits();
  checkForDailyReminder();
}

function saveUserHabits() {
  try {
    localStorage.setItem("grindmind_user_habits", JSON.stringify(userHabits));
  } catch (error) {
    console.error("Alışkanlıklar kaydedilemedi:", error);
  }
}

function filterHabits() {
  const searchInput = document.getElementById("habitSearch");
  const container = document.getElementById("availableHabits");

  if (!searchInput || !container) return;

  const searchTerm = searchInput.value.toLowerCase();

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

function renderAvailableHabits() {
  const container = document.getElementById("availableHabits");
  if (container) {
    container.innerHTML =
      '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Aramak için en az 2 karakter yazın</div>';
  }
}

function toggleCustomHabit() {
  const customBox = document.getElementById("customHabitBox");
  const customInput = document.getElementById("customHabitInput");

  if (!customBox || !customInput) return;

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

function renderUserHabits() {
  const container = document.getElementById("habitsGrid");
  const emptyState = document.getElementById("emptyState");

  if (!container || !emptyState) return;

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
    generateStreakCalendar(habit);
  });
}

function generateStreakCalendar(habit) {
  const calendar = document.getElementById(`calendar-${habit.id}`);
  if (!calendar) return;

  calendar.innerHTML = "";

  const today = new Date();
  for (let i = 20; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";

    if (i === 0) {
      dayElement.classList.add("today");
    }

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

function calculateCurrentStreak(habit) {
  if (!habit.completions || habit.completions.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < habit.targetDays; i++) {
    const checkDate = new Date();
    checkDate.setDate(today.getDate() - i);
    const dateString = checkDate.toISOString().split("T")[0];

    const isCompleted = habit.completions.some((c) => c.date === dateString);

    if (isCompleted) {
      streak++;
    } else if (i === 0) {
      break;
    } else {
      break;
    }
  }

  return streak;
}

function isHabitCompletedToday(habit) {
  if (!habit.completions) return false;
  const today = new Date().toISOString().split("T")[0];
  return habit.completions.some((c) => c.date === today);
}

// Modal işlevleri
function showAddHabitModal() {
  const modal = document.getElementById("addHabitModal");
  if (!modal) return;

  modal.style.display = "block";
  selectedHabit = null;
  isCustomHabitMode = false;

  const targetDaysInput = document.getElementById("targetDays");
  const habitSearchInput = document.getElementById("habitSearch");

  if (targetDaysInput) targetDaysInput.value = 21;
  if (habitSearchInput) habitSearchInput.value = "";

  const customBox = document.getElementById("customHabitBox");
  const customInput = document.getElementById("customHabitInput");

  if (customBox) customBox.classList.remove("active");
  if (customInput) {
    customInput.style.display = "none";
    customInput.value = "";
  }

  renderAvailableHabits();
}

function showCompleteModal(habitId) {
  const habit = userHabits.find((h) => h.id === habitId);
  if (!habit || isHabitCompletedToday(habit)) return;

  currentHabitToComplete = habit;

  const modal = document.getElementById("completeHabitModal");
  const questionEl = document.getElementById("completeQuestion");
  const moodSelect = document.getElementById("moodSelect");
  const notesInput = document.getElementById("completionNotes");

  if (questionEl)
    questionEl.textContent = `${habit.name} alışkanlığını bugün tamamladın mı?`;
  if (moodSelect) moodSelect.value = "good";
  if (notesInput) notesInput.value = "";
  if (modal) modal.style.display = "block";
}

function viewHabitDetails(habitId) {
  const habit = userHabits.find((h) => h.id === habitId);
  if (!habit) return;

  currentDetailsHabit = habit;

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

  const habitData = availableHabits.find((h) => h.name === habit.name);
  const tips = habitData?.tips || [];

  const detailsTitle = document.getElementById("detailsTitle");
  const detailsBody = document.getElementById("detailsBody");

  if (detailsTitle) detailsTitle.textContent = `${habit.name} Detayları`;

  if (detailsBody) {
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
                    ${
                      completion.mood
                        ? `• ${getMoodEmoji(completion.mood)}`
                        : ""
                    }
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
  }

  const modal = document.getElementById("detailsModal");
  if (modal) modal.style.display = "block";
}

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

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }

  // Formları temizle
  if (modalId === "completeHabitModal") {
    const moodSelect = document.getElementById("moodSelect");
    const notesInput = document.getElementById("completionNotes");
    if (moodSelect) moodSelect.value = "good";
    if (notesInput) notesInput.value = "";
  }

  if (modalId === "addHabitModal") {
    isCustomHabitMode = false;
    const customBox = document.getElementById("customHabitBox");
    const customInput = document.getElementById("customHabitInput");
    const searchInput = document.getElementById("habitSearch");

    if (customBox) customBox.classList.remove("active");
    if (customInput) {
      customInput.style.display = "none";
      customInput.value = "";
    }
    if (searchInput) searchInput.value = "";
    selectedHabit = null;
  }
}

function addHabit() {
  let habitToAdd = null;
  let habitName = "";

  if (isCustomHabitMode) {
    const customInput = document.getElementById("customHabitInput");
    if (!customInput) return;

    habitName = customInput.value.trim();

    if (!habitName) {
      showNotification("Hata", "Lütfen alışkanlık adını girin!", "error");
      return;
    }

    if (habitName.length < 2) {
      showNotification(
        "Hata",
        "Alışkanlık adı en az 2 karakter olmalı!",
        "error"
      );
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
    if (!selectedHabit) {
      showNotification("Hata", "Lütfen bir alışkanlık seçin!", "error");
      return;
    }
    habitToAdd = selectedHabit;
    habitName = selectedHabit.name;
  }

  const targetDaysInput = document.getElementById("targetDays");
  if (!targetDaysInput) return;

  const targetDays = parseInt(targetDaysInput.value);
  if (targetDays < 1) {
    showNotification("Hata", "Hedef gün sayısı en az 1 olmalı!", "error");
    return;
  }

  // Zaten var mı kontrol et
  if (
    userHabits.find((h) => h.name.toLowerCase() === habitName.toLowerCase())
  ) {
    showNotification("Hata", "Bu alışkanlık zaten takip ediliyor!", "error");
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
    "Başarılı!",
    `${habitToAdd.name} alışkanlığı eklendi! ${targetDays} gün hedefine doğru ilerlemeye başla.`,
    "success"
  );

  // Dashboard'a bildir
  if (window.grindmindAPI && window.grindmindAPI.onHabitCompleted) {
    window.grindmindAPI.onHabitCompleted(habitToAdd.name);
  }
}

function completeHabit() {
  if (!currentHabitToComplete) return;

  const moodSelect = document.getElementById("moodSelect");
  const notesInput = document.getElementById("completionNotes");

  if (!moodSelect || !notesInput) return;

  const mood = moodSelect.value;
  const notes = notesInput.value;
  const today = new Date().toISOString().split("T")[0];

  if (isHabitCompletedToday(currentHabitToComplete)) {
    showNotification(
      "Uyarı",
      "Bu alışkanlığı bugün zaten tamamladınız!",
      "warning"
    );
    closeModal("completeHabitModal");
    return;
  }

  if (!currentHabitToComplete.completions) {
    currentHabitToComplete.completions = [];
  }

  currentHabitToComplete.completions.push({
    date: today,
    mood: mood,
    notes: notes,
    timestamp: new Date().toISOString(),
  });

  const currentStreak = calculateCurrentStreak(currentHabitToComplete);
  if (currentStreak > (currentHabitToComplete.bestStreak || 0)) {
    currentHabitToComplete.bestStreak = currentStreak;
  }

  saveUserHabits();
  renderUserHabits();
  closeModal("completeHabitModal");

  const newStreak = calculateCurrentStreak(currentHabitToComplete);
  let message = `Harika! ${currentHabitToComplete.name} tamamlandı! Mevcut serin: ${newStreak} gün`;

  if (newStreak === currentHabitToComplete.targetDays) {
    message += ` 🏆 TEBRİKLER! ${currentHabitToComplete.targetDays} günlük hedefini tamamladın!`;
  } else if (newStreak % 7 === 0) {
    message += ` 🔥 ${newStreak} günlük seri! Süper gidiyorsun!`;
  }

  showNotification("Tebrikler!", message, "success");

  if (window.grindmindAPI && window.grindmindAPI.onHabitCompleted) {
    window.grindmindAPI.onHabitCompleted(currentHabitToComplete.name);
  }
}

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
      "Silindi",
      `${currentDetailsHabit.name} alışkanlığı silindi.`,
      "info"
    );
  }
}

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
          "Hatırlatma",
          `${incompleteHabits.length} alışkanlığın bugün için bekliyor! Tamamlamayı unutma.`,
          "info"
        );
        localStorage.setItem("grindmind_habits_last_reminder", today);
      }
    }, 3000);
  }
}

// İstatistikler
function showStats() {
  if (userHabits.length === 0) {
    showNotification(
      "Bilgi",
      "Henüz takip ettiğiniz bir alışkanlık yok.",
      "info"
    );
    return;
  }

  const totalHabits = userHabits.length;
  const totalCompletions = userHabits.reduce(
    (sum, habit) => sum + (habit.completions ? habit.completions.length : 0),
    0
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

  // Son 7 gün
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

  const sortedHabits = [...userHabits].sort(
    (a, b) => calculateCurrentStreak(b) - calculateCurrentStreak(a)
  );

  const statisticsBody = document.getElementById("statisticsBody");
  if (!statisticsBody) return;

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

            return `
            <div class="leaderboard-item">
              <div class="leaderboard-rank">${index + 1}</div>
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

  const modal = document.getElementById("statisticsModal");
  if (modal) {
    modal.style.display = "block";
  }
}

// Event Handler'ları kur
function setupEventHandlers() {
  // Mobile Navigation
  const hamburger = document.getElementById("hamburger");
  const mobileClose = document.getElementById("navMobileClose");
  const mobileOverlay = document.getElementById("navMobileOverlay");
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileNav);
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", closeMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileNav);
  }

  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
        showNotification(
          "Çıkış",
          "Başarıyla çıkış yapıldı. Güle güle!",
          "success"
        );
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 2000);
      }
      closeMobileNav();
    });
  }

  // Profile dropdown
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleProfileDropdown();
    });
  }

  // Settings ve logout butonları
  const settingsBtn = document.getElementById("settingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (settingsBtn) {
    settingsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handleSettings();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handleLogout();
    });
  }

  // Dropdown dışına tıklama
  document.addEventListener("click", function (e) {
    const dropdown = document.getElementById("profileDropdown");
    const userAvatar = document.getElementById("userAvatar");

    if (dropdown && !dropdown.contains(e.target) && e.target !== userAvatar) {
      dropdown.classList.remove("show");
    }
  });

  // Bildirim butonu
  const notificationBtn = document.getElementById("notificationBtn");
  if (notificationBtn) {
    notificationBtn.addEventListener("click", function () {
      showNotification(
        "Bildirimler",
        "Bildirim sistemi aktif! Yeni özellikler yakında gelecek.",
        "info"
      );
    });
  }

  // Modal dışına tıklama
  window.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  // Klavye kısayolları
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      // Tüm modal'ları kapat
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.style.display = "none";
      });
      hideNotification();
      closeMobileNav();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      showAddHabitModal();
    }
  });
}

// Chart.js ile grafik oluşturma fonksiyonları
function createProgressChart(canvasId, labels, data, title) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");

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
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(226, 232, 240, 0.5)" },
          ticks: { color: "#64748b", stepSize: 1 },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#64748b" },
        },
      },
    },
  });
}

function createSuccessRateChart(canvasId, habits) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");
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
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");
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
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(226, 232, 240, 0.5)" },
          ticks: { color: "#64748b", stepSize: 1 },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#64748b" },
        },
      },
    },
  });
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", function () {
  console.log("✨ Yeni Alışkanlıklar sayfası yüklendi");

  try {
    // Event handler'ları kur
    setupEventHandlers();

    // Verileri yükle
    loadAvailableHabits();
    loadUserHabits();

    // Hoş geldin bildirimi
    setTimeout(() => {
      showNotification(
        "Alışkanlıklar",
        "Pozitif alışkanlıklarını takip etmeye başla! 🌟",
        "info"
      );
    }, 1500);

    console.log("✅ Alışkanlıklar sayfası başarıyla yüklendi!");
  } catch (error) {
    console.error("❌ Sayfa yüklenirken hata:", error);
    showNotification("Hata", "Sayfa yüklenirken bir hata oluştu.", "error");
  }
});
