// ============================================================================
// GRINDMIND Pomodoro Timer - Düzeltilmiş Navbar & Dashboard Entegre Sistem
// ============================================================================

// ============================================================================
// NAVBAR FUNCTIONS
// ============================================================================

// Mobile Navigation Functions
function toggleMobileNav() {
  console.log("🍔 toggleMobileNav çağrıldı");

  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("navMobile");
  const overlay = document.getElementById("navMobileOverlay");

  // Debug: Elementlerin varlığını kontrol et
  console.log("Elements:", {
    hamburger: !!hamburger,
    mobileNav: !!mobileNav,
    overlay: !!overlay,
  });

  if (hamburger) {
    hamburger.classList.toggle("active");
    console.log("Hamburger active:", hamburger.classList.contains("active"));
  }

  // navMobile toggle
  if (mobileNav) {
    const wasShown = mobileNav.classList.contains("show");
    mobileNav.classList.toggle("show");
    mobileNav.classList.toggle("active");
    console.log("Menu", wasShown ? "kapatıldı" : "açıldı");
  }

  if (overlay) {
    overlay.classList.toggle("show");
    overlay.classList.toggle("active");
  }

  // Body scroll control
  const isMenuOpen =
    mobileNav &&
    (mobileNav.classList.contains("show") ||
      mobileNav.classList.contains("active"));

  document.body.style.overflow = isMenuOpen ? "hidden" : "";
}

function closeMobileNav() {
  console.log("❌ closeMobileNav çağrıldı");

  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("navMobile");
  const overlay = document.getElementById("navMobileOverlay");

  if (hamburger) hamburger.classList.remove("active");
  if (mobileNav) {
    mobileNav.classList.remove("show");
    mobileNav.classList.remove("active");
  }
  if (overlay) {
    overlay.classList.remove("show");
    overlay.classList.remove("active");
  }

  document.body.style.overflow = "";
}

// Profile Dropdown Functions
function toggleProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

// Notification Functions
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

// Logout Function
function logout() {
  if (confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
    showNotification(
      "Çıkış Yapılıyor",
      "Güvenli çıkış yapılıyor... Güle güle! 👋",
      "success"
    );

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
}

// Settings Modal Functions
function openPomodoroSettings() {
  if (window.timer && typeof window.timer.openSettings === "function") {
    window.timer.openSettings();
  } else {
    const settingsModal = document.getElementById("settingsModal");
    if (settingsModal) {
      settingsModal.classList.add("active");
    }
  }
}

function closePomodoroSettings() {
  if (window.timer && typeof window.timer.closeSettingsModal === "function") {
    window.timer.closeSettingsModal();
  } else {
    const settingsModal = document.getElementById("settingsModal");
    if (settingsModal) {
      settingsModal.classList.remove("active");
    }
  }
}

function loadPomodoroSettingsToForm() {
  if (window.timer && typeof window.timer.loadSettingsToForm === "function") {
    window.timer.loadSettingsToForm();
  } else {
    console.log("🔄 Pomodoro ayarları form'a yükleniyor...");
  }
}

function savePomodoroSettings() {
  if (window.timer && typeof window.timer.saveSettingsData === "function") {
    window.timer.saveSettingsData();
  } else {
    showNotification(
      "Ayarlar Kaydedildi",
      "Pomodoro ayarlarınız başarıyla güncellendi! ✅",
      "success"
    );
    closePomodoroSettings();
  }
}

// Update navbar colors based on current timer mode
function updateNavbarColors(mode = "pomodoro") {
  const colorMapping = {
    pomodoro: {
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadow: "rgba(102, 126, 234, 0.3)",
      primary: "#667eea",
      secondary: "#764ba2",
      hoverBg: "rgba(102, 126, 234, 0.1)",
      hoverColor: "#667eea",
    },
    short: {
      gradient: "linear-gradient(135deg, #38858a 0%, #2d6a6f 100%)",
      shadow: "rgba(56, 133, 138, 0.3)",
      primary: "#38858a",
      secondary: "#2d6a6f",
      hoverBg: "rgba(56, 133, 138, 0.1)",
      hoverColor: "#38858a",
    },
    long: {
      gradient: "linear-gradient(135deg, #397097 0%, #2e5a7a 100%)",
      shadow: "rgba(57, 112, 151, 0.3)",
      primary: "#397097",
      secondary: "#2e5a7a",
      hoverBg: "rgba(57, 112, 151, 0.1)",
      hoverColor: "#397097",
    },
  };

  const currentColors = colorMapping[mode];
  const logo = document.querySelector(".logo");
  const settingsBtn = document.getElementById("settingsBtn");
  const mobileSettingsBtn = document.getElementById("mobileSettingsBtn");
  const hamburger = document.getElementById("hamburger");
  const userAvatar = document.getElementById("userAvatar");
  const navItems = document.querySelectorAll(".nav-item");
  const mobileNavItems = document.querySelectorAll(".nav-mobile-item");

  // Update logo gradient
  if (logo) {
    logo.style.background = currentColors.gradient;
    logo.style.webkitBackgroundClip = "text";
    logo.style.webkitTextFillColor = "transparent";
    logo.style.backgroundClip = "text";
  }

  // Update user avatar (T logosu)
  if (userAvatar) {
    userAvatar.style.background = currentColors.gradient;
    userAvatar.style.boxShadow = `0 4px 12px ${currentColors.shadow}`;
  }

  // Update settings buttons
  if (settingsBtn) {
    settingsBtn.style.background = currentColors.gradient;
    settingsBtn.style.boxShadow = `0 4px 12px ${currentColors.shadow}`;
  }

  if (mobileSettingsBtn) {
    mobileSettingsBtn.style.background = currentColors.gradient;
    mobileSettingsBtn.style.boxShadow = `0 4px 12px ${currentColors.shadow}`;
  }

  // Update hamburger menu lines
  if (hamburger) {
    const spans = hamburger.querySelectorAll("span");
    spans.forEach((span) => {
      span.style.background = currentColors.gradient;
    });
  }

  // Update navigation items hover colors - CSS Custom Properties kullanarak
  document.documentElement.style.setProperty(
    "--accent-color",
    currentColors.primary
  );
  document.documentElement.style.setProperty(
    "--accent-light",
    currentColors.hoverBg
  );
  document.documentElement.style.setProperty(
    "--accent-hover",
    currentColors.secondary
  );

  // Manuel hover effect update for navigation items
  navItems.forEach((item) => {
    // Remove existing event listeners
    item.onmouseenter = null;
    item.onmouseleave = null;

    item.addEventListener("mouseenter", function () {
      this.style.color = currentColors.hoverColor;
      this.style.background = currentColors.hoverBg;
    });

    item.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.color = "";
        this.style.background = "";
      }
    });
  });

  // Mobile navigation items hover colors
  mobileNavItems.forEach((item) => {
    item.onmouseenter = null;
    item.onmouseleave = null;

    item.addEventListener("mouseenter", function () {
      this.style.color = currentColors.hoverColor;
    });

    item.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.color = "";
      }
    });
  });

  console.log(
    `🎨 Navbar renkleri ve hover efektleri ${mode} moduna güncellendi`
  );
}

// ============================================================================
// DASHBOARD INTEGRATION FUNCTIONS
// ============================================================================

function getDashboardPomodoroData() {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem("grindmind_pomodoro_last_date");

  // Günlük veri sıfırlama kontrolü
  if (lastDate !== today) {
    localStorage.setItem("grindmind_pomodoro_today", "0");
    localStorage.setItem("grindmind_pomodoro_last_date", today);
  }

  const todayCount = parseInt(
    localStorage.getItem("grindmind_pomodoro_today") || "0"
  );
  const sessions = JSON.parse(
    localStorage.getItem("grindmind_pomodoro_sessions") || "[]"
  );

  // Haftalık sayım (son 7 gün)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyCount = sessions.filter((session) => {
    if (!session.date || session.type !== "pomodoro" || !session.completed) {
      return false;
    }
    const sessionDate = new Date(session.date);
    return sessionDate >= oneWeekAgo;
  }).length;

  // Ortalama süre hesaplama
  const completedSessions = sessions.filter(
    (s) => s.type === "pomodoro" && s.completed
  );
  let averageTime = 0;

  if (completedSessions.length > 0) {
    const totalTime = completedSessions.reduce((sum, session) => {
      return sum + (session.duration || session.sessionLength || 25);
    }, 0);
    averageTime = Math.round(totalTime / completedSessions.length);
  }

  return {
    today: todayCount,
    week: weeklyCount,
    sessions: sessions.length,
    averageTime: averageTime,
  };
}

function notifyDashboardUpdate() {
  // Dashboard sayfası açık mı kontrol et
  if (window.opener && typeof window.opener.dashboardAPI !== "undefined") {
    window.opener.dashboardAPI.refreshData();
  }

  // LocalStorage event'i tetikle
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "grindmind_pomodoro_sessions",
      newValue: localStorage.getItem("grindmind_pomodoro_sessions"),
    })
  );
}

// ============================================================================
// POMODORO TIMER CLASS
// ============================================================================

class PomodoroTimer {
  constructor() {
    // Timer state
    this.timerInterval = null;
    this.timeLeft = 25 * 60;
    this.totalTime = 25 * 60;
    this.isRunning = false;
    this.currentMode = "pomodoro";
    this.sessionCount = 1;
    this.isPaused = false;

    // Settings
    this.settings = {
      pomodoroTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      soundNotifications: true,
      desktopNotifications: true,
    };

    // Tasks
    this.tasks = [];

    // Dashboard entegrasyon için storage keys
    this.STORAGE_KEYS = {
      POMODORO_TODAY: "grindmind_pomodoro_today",
      POMODORO_WEEK: "grindmind_pomodoro_week",
      POMODORO_SESSIONS: "grindmind_pomodoro_sessions",
      POMODORO_LAST_DATE: "grindmind_pomodoro_last_date",
    };

    // Initialize
    this.initElements();
    this.initEventListeners();
    this.loadSettings();
    this.loadTasks();
    this.updateDisplay();
    this.updateBackground();
    this.updateHeaderColors();
    this.updateHamburgerColors();
    this.requestNotificationPermission();
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  getTodayString() {
    return new Date().toDateString();
  }

  getDateString(date = new Date()) {
    return date.toISOString().split("T")[0];
  }

  resetDailyData() {
    const today = this.getTodayString();
    const lastDate = localStorage.getItem(this.STORAGE_KEYS.POMODORO_LAST_DATE);

    if (lastDate !== today) {
      localStorage.setItem(this.STORAGE_KEYS.POMODORO_TODAY, "0");
      localStorage.setItem(this.STORAGE_KEYS.POMODORO_LAST_DATE, today);
    }
  }

  recordPomodoroSession(duration = 25, isCompleted = true) {
    const today = this.getDateString();
    const sessions = JSON.parse(
      localStorage.getItem(this.STORAGE_KEYS.POMODORO_SESSIONS) || "[]"
    );

    // Yeni session ekle
    const newSession = {
      id: Date.now(),
      date: today,
      type: "pomodoro",
      completed: isCompleted,
      duration: duration,
      sessionLength: duration,
      timestamp: new Date().toISOString(),
    };

    sessions.push(newSession);
    localStorage.setItem(
      this.STORAGE_KEYS.POMODORO_SESSIONS,
      JSON.stringify(sessions)
    );

    // Bugünkü sayacı artır
    if (isCompleted) {
      this.resetDailyData();
      const todayCount = parseInt(
        localStorage.getItem(this.STORAGE_KEYS.POMODORO_TODAY) || "0"
      );
      localStorage.setItem(
        this.STORAGE_KEYS.POMODORO_TODAY,
        (todayCount + 1).toString()
      );
      localStorage.setItem(
        this.STORAGE_KEYS.POMODORO_LAST_DATE,
        this.getTodayString()
      );
    }

    // Dashboard'ı güncelle
    notifyDashboardUpdate();

    // Achievement sistemini bilgilendir
    if (window.achievementAPI && isCompleted) {
      window.achievementAPI.markPomodoroCompleted();
    }

    return newSession;
  }

  // ============================================================================
  // INITIALIZATION METHODS
  // ============================================================================

  initElements() {
    // Timer elements
    this.timeDisplay = document.getElementById("timeDisplay");
    this.startBtn = document.getElementById("startBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.skipBtn = document.getElementById("skipBtn");
    this.timerTabs = document.querySelectorAll(".timer-tab");
    this.timerLabel = document.getElementById("timerLabel");
    this.sessionInfo = document.getElementById("sessionInfo");
    this.progressCircle = document.getElementById("progressCircle");
    this.pomodoroSection = document.querySelector(".pomodoro-section");

    // Header elements
    this.logo = document.querySelector(".logo");
    this.settingsBtn = document.getElementById("settingsBtn");
    this.hamburgerBtn = document.getElementById("hamburger");
    this.mobileMenu = document.getElementById("navMobile");
    this.mobileMenuOverlay = document.getElementById("navMobileOverlay");
    this.mobileSettingsBtn = document.getElementById("mobileSettingsBtn");
    this.mobileCloseBtn = document.getElementById("navMobileClose");

    // Settings elements
    this.settingsModal = document.getElementById("settingsModal");
    this.closeSettings = document.getElementById("closeSettings");

    // Settings inputs
    this.pomodoroTimeInput = document.getElementById("pomodoroTime");
    this.shortBreakTimeInput = document.getElementById("shortBreakTime");
    this.longBreakTimeInput = document.getElementById("longBreakTime");
    this.autoStartBreaksInput = document.getElementById("autoStartBreaks");
    this.autoStartPomodorosInput =
      document.getElementById("autoStartPomodoros");
    this.soundNotificationsInput =
      document.getElementById("soundNotifications");
    this.desktopNotificationsInput = document.getElementById(
      "desktopNotifications"
    );

    // Task elements
    this.taskInput = document.getElementById("taskInput");
    this.addTaskBtn = document.getElementById("addTaskBtn");
    this.tasksList = document.getElementById("tasksList");
    this.tasksCounter = document.getElementById("tasksCounter");
  }

  initEventListeners() {
    // Timer controls
    if (this.startBtn) {
      this.startBtn.addEventListener("click", () => this.toggleTimer());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.resetTimer());
    }
    if (this.skipBtn) {
      this.skipBtn.addEventListener("click", () => this.skipSession());
    }

    // Timer tabs
    this.timerTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (!this.isRunning) {
          this.switchMode(tab.dataset.type);
        } else {
          this.resetTimer();
          this.switchMode(tab.dataset.type);
        }
      });
    });

    // Settings
    if (this.settingsBtn) {
      this.settingsBtn.addEventListener("click", () => this.openSettings());
    }
    if (this.closeSettings) {
      this.closeSettings.addEventListener("click", () =>
        this.closeSettingsModal()
      );
    }

    // Save settings button
    const saveSettingsBtn = document.getElementById("saveSettings");
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", () => this.saveSettingsData());
    }

    // Tasks
    if (this.addTaskBtn) {
      this.addTaskBtn.addEventListener("click", () => this.addTask());
    }
    if (this.taskInput) {
      this.taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.addTask();
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) =>
      this.handleKeyboardShortcuts(e)
    );

    // Prevent leaving when timer is running
    window.addEventListener("beforeunload", (e) => {
      if (this.isRunning) {
        e.preventDefault();
        e.returnValue =
          "Timer çalışıyor. Sayfadan çıkmak istediğinizden emin misiniz?";
      }
    });

    // Close modal on outside click
    if (this.settingsModal) {
      this.settingsModal.addEventListener("click", (e) => {
        if (e.target === this.settingsModal) {
          this.closeSettingsModal();
        }
      });
    }
  }

  // ============================================================================
  // TIMER CONTROL METHODS
  // ============================================================================

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.isPaused = false;

    if (this.startBtn) {
      this.startBtn.innerHTML =
        '<span class="btn-icon pause-icon"></span><span class="btn-text">DURAKLAT</span>';
    }
    if (this.resetBtn) {
      this.resetBtn.style.display = "inline-flex";
    }
    if (this.skipBtn) {
      this.skipBtn.classList.add("visible");
    }

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();

      if (this.timeLeft <= 0) {
        this.completeSession();
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.isPaused = true;

    if (this.startBtn) {
      this.startBtn.innerHTML =
        '<span class="btn-icon play-icon"></span><span class="btn-text">DEVAM</span>';
    }
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.isPaused = false;

    if (this.startBtn) {
      this.startBtn.innerHTML =
        '<span class="btn-icon play-icon"></span><span class="btn-text">BAŞLAT</span>';
    }
    if (this.resetBtn) {
      this.resetBtn.style.display = "none";
    }
    if (this.skipBtn) {
      this.skipBtn.classList.remove("visible");
    }

    // Get time from settings
    const timeMapping = {
      pomodoro: this.settings.pomodoroTime,
      short: this.settings.shortBreakTime,
      long: this.settings.longBreakTime,
    };

    this.timeLeft = timeMapping[this.currentMode] * 60;
    this.totalTime = this.timeLeft;
    this.updateDisplay();
    document.title = "Pomodoro Timer - GRINDMIND";
  }

  completeSession() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.isPaused = false;

    if (this.startBtn) {
      this.startBtn.innerHTML =
        '<span class="btn-icon play-icon"></span><span class="btn-text">BAŞLAT</span>';
    }
    if (this.resetBtn) {
      this.resetBtn.style.display = "none";
    }
    if (this.skipBtn) {
      this.skipBtn.classList.remove("visible");
    }

    // Dashboard entegrasyonu - Sadece pomodoro session'ları kaydedilir
    if (this.currentMode === "pomodoro") {
      const sessionDuration = this.settings.pomodoroTime;
      this.recordPomodoroSession(sessionDuration, true);
    }

    // Play notification
    this.playNotificationSound();
    this.showNotification();

    // Auto switch logic
    if (this.currentMode === "pomodoro") {
      this.sessionCount++;
      const nextMode =
        this.sessionCount % 4 === 1 && this.sessionCount > 1 ? "long" : "short";

      if (this.settings.autoStartBreaks) {
        setTimeout(() => this.switchMode(nextMode, true), 1000);
      } else {
        this.switchMode(nextMode);
      }
    } else {
      if (this.settings.autoStartPomodoros) {
        setTimeout(() => this.switchMode("pomodoro", true), 1000);
      } else {
        this.switchMode("pomodoro");
      }
    }
  }

  skipSession() {
    if (this.isRunning) {
      // Skip edildiğinde ayarlanan tam süreyi kaydet
      if (this.currentMode === "pomodoro") {
        const fullSessionDuration = this.settings.pomodoroTime;
        this.recordPomodoroSession(fullSessionDuration, true);
        console.log(
          `⏭️ Pomodoro skip edildi: ${fullSessionDuration} dakika kaydedildi (tam süre)`
        );
      }

      this.completeSessionSkipped();
    }
  }

  completeSessionSkipped() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.isPaused = false;

    if (this.startBtn) {
      this.startBtn.innerHTML =
        '<span class="btn-icon play-icon"></span><span class="btn-text">BAŞLAT</span>';
    }
    if (this.resetBtn) {
      this.resetBtn.style.display = "none";
    }
    if (this.skipBtn) {
      this.skipBtn.classList.remove("visible");
    }

    // Play notification
    this.playNotificationSound();
    this.showNotification();

    // Auto switch logic
    if (this.currentMode === "pomodoro") {
      this.sessionCount++;
      const nextMode =
        this.sessionCount % 4 === 1 && this.sessionCount > 1 ? "long" : "short";

      if (this.settings.autoStartBreaks) {
        setTimeout(() => this.switchMode(nextMode, true), 1000);
      } else {
        this.switchMode(nextMode);
      }
    } else {
      if (this.settings.autoStartPomodoros) {
        setTimeout(() => this.switchMode("pomodoro", true), 1000);
      } else {
        this.switchMode("pomodoro");
      }
    }
  }

  switchMode(mode, autoStart = false) {
    this.resetTimer();

    // Update active tab
    this.timerTabs.forEach((tab) => tab.classList.remove("active"));
    const targetTab = document.querySelector(`[data-type="${mode}"]`);
    if (targetTab) {
      targetTab.classList.add("active");
    }

    // Get time from settings
    const timeMapping = {
      pomodoro: this.settings.pomodoroTime,
      short: this.settings.shortBreakTime,
      long: this.settings.longBreakTime,
    };

    // Update time and mode
    this.timeLeft = timeMapping[mode] * 60;
    this.totalTime = this.timeLeft;
    this.currentMode = mode;
    this.updateDisplay();
    this.updateBackground();
    this.updateHeaderColors();
    this.updateHamburgerColors();
    this.updateButtonColors();
    this.updateSaveButtonColor(); // Kaydet butonunu da güncelle

    // Update navbar colors globally
    updateNavbarColors(mode);

    // Update labels
    const labels = {
      pomodoro: {
        main: `#${this.sessionCount} Odaklanma Zamanı!`,
        info: "Pomodoro Seansı",
      },
      short: {
        main: "Kısa Mola Zamanı!",
        info: "Kısa Mola",
      },
      long: {
        main: "Uzun Mola Zamanı!",
        info: "Uzun Mola",
      },
    };

    if (this.timerLabel) {
      this.timerLabel.textContent = labels[mode].main;
    }
    if (this.sessionInfo) {
      this.sessionInfo.textContent = labels[mode].info;
    }

    if (autoStart) {
      setTimeout(() => this.startTimer(), 500);
    }
  }

  // ============================================================================
  // UI UPDATE METHODS
  // ============================================================================

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (this.timeDisplay) {
      this.timeDisplay.textContent = timeString;
    }

    // Update progress ring
    if (this.progressCircle) {
      const progress =
        ((this.totalTime - this.timeLeft) / this.totalTime) * 628;
      this.progressCircle.style.strokeDashoffset = 628 - progress;
    }

    // Update document title when running
    if (this.isRunning && this.sessionInfo) {
      document.title = `${timeString} - ${this.sessionInfo.textContent}`;
    } else if (!this.isRunning) {
      document.title = "Pomodoro Timer - GRINDMIND";
    }
  }

  updateBackground() {
    if (this.pomodoroSection) {
      this.pomodoroSection.className = `pomodoro-section ${this.currentMode}`;
    }
  }

  updateHeaderColors() {
    const colorMapping = {
      pomodoro: {
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        shadow: "rgba(102, 126, 234, 0.3)",
        primary: "#667eea",
        secondary: "#764ba2",
        hoverBg: "rgba(102, 126, 234, 0.1)",
        hoverColor: "#667eea",
      },
      short: {
        gradient: "linear-gradient(135deg, #38858a 0%, #2d6a6f 100%)",
        shadow: "rgba(56, 133, 138, 0.3)",
        primary: "#38858a",
        secondary: "#2d6a6f",
        hoverBg: "rgba(56, 133, 138, 0.1)",
        hoverColor: "#38858a",
      },
      long: {
        gradient: "linear-gradient(135deg, #397097 0%, #2e5a7a 100%)",
        shadow: "rgba(57, 112, 151, 0.3)",
        primary: "#397097",
        secondary: "#2e5a7a",
        hoverBg: "rgba(57, 112, 151, 0.1)",
        hoverColor: "#397097",
      },
    };

    const currentColors = colorMapping[this.currentMode];

    // Update logo gradient
    if (this.logo) {
      this.logo.style.background = currentColors.gradient;
      this.logo.style.webkitBackgroundClip = "text";
      this.logo.style.webkitTextFillColor = "transparent";
      this.logo.style.backgroundClip = "text";
    }

    // Update user avatar (T logosu)
    const userAvatar = document.getElementById("userAvatar");
    if (userAvatar) {
      userAvatar.style.background = currentColors.gradient;
      userAvatar.style.boxShadow = `0 4px 12px ${currentColors.shadow}`;
    }

    // Update settings button
    if (this.settingsBtn) {
      this.settingsBtn.style.background = currentColors.gradient;
      this.settingsBtn.style.boxShadow = `0 4px 12px ${currentColors.shadow}`;
    }

    // Update mobile settings button
    if (this.mobileSettingsBtn) {
      this.mobileSettingsBtn.style.background = currentColors.gradient;
      this.mobileSettingsBtn.style.boxShadow = `0 4px 12px ${currentColors.shadow}`;
    }

    // Update CSS Custom Properties for global hover effects
    document.documentElement.style.setProperty(
      "--accent-color",
      currentColors.primary
    );
    document.documentElement.style.setProperty(
      "--accent-light",
      currentColors.hoverBg
    );
    document.documentElement.style.setProperty(
      "--accent-hover",
      currentColors.secondary
    );

    // Update navigation items hover colors
    const navItems = document.querySelectorAll(".nav-item");
    const mobileNavItems = document.querySelectorAll(".nav-mobile-item");

    // Desktop navigation hover
    navItems.forEach((item) => {
      // Clear existing listeners
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);

      newItem.addEventListener("mouseenter", function () {
        this.style.color = currentColors.hoverColor;
        this.style.background = currentColors.hoverBg;
      });

      newItem.addEventListener("mouseleave", function () {
        if (!this.classList.contains("active")) {
          this.style.color = "";
          this.style.background = "";
        }
      });
    });

    // Mobile navigation hover
    mobileNavItems.forEach((item) => {
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);

      newItem.addEventListener("mouseenter", function () {
        this.style.color = currentColors.hoverColor;
      });

      newItem.addEventListener("mouseleave", function () {
        if (!this.classList.contains("active")) {
          this.style.color = "";
        }
      });
    });

    console.log(
      `🎨 Header renkleri ve hover efektleri ${this.currentMode} moduna güncellendi`
    );
  }

  updateHamburgerColors() {
    const colorMapping = {
      pomodoro: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      short: "linear-gradient(135deg, #38858a 0%, #2d6a6f 100%)",
      long: "linear-gradient(135deg, #397097 0%, #2e5a7a 100%)",
    };

    const currentGradient = colorMapping[this.currentMode];

    // Update hamburger menu lines
    if (this.hamburgerBtn) {
      const spans = this.hamburgerBtn.querySelectorAll("span");
      spans.forEach((span) => {
        span.style.background = currentGradient;
      });
    }
  }

  updateButtonColors() {
    if (!this.startBtn) return;

    const colorMapping = {
      pomodoro: "#667eea",
      short: "#38858a",
      long: "#397097",
    };

    const currentColor = colorMapping[this.currentMode];
    this.startBtn.style.color = currentColor;
  }

  // ============================================================================
  // NOTIFICATION METHODS
  // ============================================================================

  playNotificationSound() {
    if (!this.settings.soundNotifications) return;

    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.8
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (e) {
      // Audio not supported
    }
  }

  showNotification() {
    if (!this.settings.desktopNotifications) return;

    const messages = {
      pomodoro: "🎉 Pomodoro tamamlandı! Mola zamanı.",
      short: "⚡ Kısa mola bitti! Tekrar odaklanma zamanı.",
      long: "🚀 Uzun mola bitti! Yeni seansa hazır mısın?",
    };

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("GRINDMIND Timer", {
        body: messages[this.currentMode],
        icon: "/favicon.ico",
        tag: "grindmind-timer",
      });
    }
  }

  requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  // ============================================================================
  // SETTINGS METHODS
  // ============================================================================

  openSettings() {
    if (this.settingsModal) {
      this.settingsModal.classList.add("active");
      this.loadSettingsToForm();
      this.updateSaveButtonColor(); // Modal açıldığında kaydet butonunu güncelle
    }
  }

  closeSettingsModal() {
    if (this.settingsModal) {
      this.settingsModal.classList.remove("active");
    }
  }

  loadSettingsToForm() {
    if (this.pomodoroTimeInput) {
      this.pomodoroTimeInput.value = this.settings.pomodoroTime;
    }
    if (this.shortBreakTimeInput) {
      this.shortBreakTimeInput.value = this.settings.shortBreakTime;
    }
    if (this.longBreakTimeInput) {
      this.longBreakTimeInput.value = this.settings.longBreakTime;
    }
    if (this.autoStartBreaksInput) {
      this.autoStartBreaksInput.checked = this.settings.autoStartBreaks;
    }
    if (this.autoStartPomodorosInput) {
      this.autoStartPomodorosInput.checked = this.settings.autoStartPomodoros;
    }
    if (this.soundNotificationsInput) {
      this.soundNotificationsInput.checked = this.settings.soundNotifications;
    }
    if (this.desktopNotificationsInput) {
      this.desktopNotificationsInput.checked =
        this.settings.desktopNotifications;
    }
  }

  saveSettingsData() {
    // Validate inputs
    const pomodoroTime = Math.max(
      1,
      parseInt(this.pomodoroTimeInput?.value) || 25
    );
    const shortBreakTime = Math.max(
      1,
      parseInt(this.shortBreakTimeInput?.value) || 5
    );
    const longBreakTime = Math.max(
      1,
      parseInt(this.longBreakTimeInput?.value) || 15
    );

    this.settings = {
      pomodoroTime: pomodoroTime,
      shortBreakTime: shortBreakTime,
      longBreakTime: longBreakTime,
      autoStartBreaks: this.autoStartBreaksInput?.checked || false,
      autoStartPomodoros: this.autoStartPomodorosInput?.checked || false,
      soundNotifications: this.soundNotificationsInput?.checked || true,
      desktopNotifications: this.desktopNotificationsInput?.checked || true,
    };

    this.updateBackground();
    this.updateHeaderColors();
    this.updateHamburgerColors();
    this.updateSaveButtonColor(); // Kaydet butonunu güncelle
    this.closeSettingsModal();

    // Reset current timer if not running
    if (!this.isRunning) {
      this.resetTimer();
    }

    // Use global notification system
    showNotification(
      "Ayarlar Kaydedildi",
      "Pomodoro ayarlarınız başarıyla güncellendi! ✅",
      "success"
    );
  }

  // Kaydet butonu renk güncelleme fonksiyonu
  updateSaveButtonColor() {
    const colorMapping = {
      pomodoro: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      short: "linear-gradient(135deg, #38858a 0%, #2d6a6f 100%)",
      long: "linear-gradient(135deg, #397097 0%, #2e5a7a 100%)",
    };

    const saveBtn = document.getElementById("saveSettings");
    if (saveBtn) {
      saveBtn.style.background = colorMapping[this.currentMode];
      console.log(`💾 Kaydet butonu ${this.currentMode} moduna güncellendi`);
    }
  }

  loadSettings() {
    // Settings are stored in memory for this demo
    // Could be extended to use localStorage
  }

  // ============================================================================
  // TASK MANAGEMENT METHODS
  // ============================================================================

  addTask() {
    const taskText = this.taskInput?.value?.trim();
    if (taskText && taskText.length <= 100) {
      const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      this.tasks.unshift(task);
      if (this.taskInput) {
        this.taskInput.value = "";
      }
      this.renderTasks();
      this.updateTasksCounter();
    }
  }

  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.renderTasks();
      this.updateTasksCounter();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.renderTasks();
    this.updateTasksCounter();
  }

  renderTasks() {
    if (!this.tasksList) return;

    this.tasksList.innerHTML = "";

    if (this.tasks.length === 0) {
      this.tasksList.innerHTML = `
        <div class="empty-tasks">
          <span class="empty-icon">📋</span>
          <p>Henüz görev eklenmedi</p>
          <small>Yukarıdan yeni görev ekleyebilirsin</small>
        </div>
      `;
      return;
    }

    this.tasks.forEach((task, index) => {
      const taskElement = document.createElement("div");
      taskElement.className = "task-item";
      taskElement.style.animationDelay = `${index * 0.1}s`;
      taskElement.innerHTML = `
        <div class="task-checkbox ${task.completed ? "completed" : ""}" 
             onclick="window.timer.toggleTask(${task.id})"></div>
        <span class="task-text ${
          task.completed ? "completed" : ""
        }">${this.escapeHtml(task.text)}</span>
        <span class="task-delete" onclick="window.timer.deleteTask(${
          task.id
        })" title="Görevi sil">×</span>
      `;
      this.tasksList.appendChild(taskElement);
    });
  }

  updateTasksCounter() {
    if (!this.tasksCounter) return;

    const completed = this.tasks.filter((t) => t.completed).length;
    const total = this.tasks.length;
    this.tasksCounter.textContent = `${completed}/${total}`;
  }

  saveTasks() {
    // Tasks are stored in memory for this demo
    // Could be extended to use localStorage
  }

  loadTasks() {
    // Tasks are loaded from memory for this demo
    // Could be extended to use localStorage
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  showSuccessMessage(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 24px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      font-weight: 500;
      z-index: 10001;
      transform: translateX(120%);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    const checkIcon = document.createElement("div");
    checkIcon.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    `;
    checkIcon.innerHTML = "✓";

    const textSpan = document.createElement("span");
    textSpan.textContent = message;

    notification.appendChild(checkIcon);
    notification.appendChild(textSpan);
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
      notification.style.opacity = "1";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(120%)";
      notification.style.opacity = "0";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }

  handleKeyboardShortcuts(e) {
    // Prevent shortcuts when typing in inputs
    if (e.target.matches("input")) return;

    switch (e.code) {
      case "Space":
        e.preventDefault();
        this.toggleTimer();
        break;
      case "KeyR":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.resetTimer();
        }
        break;
      case "KeyS":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.openSettings();
        }
        break;
      case "KeyN":
        e.preventDefault();
        this.skipSession();
        break;
      case "Escape":
        if (this.settingsModal?.classList.contains("active")) {
          this.closeSettingsModal();
        } else if (this.mobileMenu?.classList.contains("active")) {
          closeMobileNav();
        }
        break;
      case "Digit1":
        if (!this.isRunning) this.switchMode("pomodoro");
        break;
      case "Digit2":
        if (!this.isRunning) this.switchMode("short");
        break;
      case "Digit3":
        if (!this.isRunning) this.switchMode("long");
        break;
    }
  }
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM yüklendi, sistem başlatılıyor...");

  // Initialize the timer first
  window.timer = new PomodoroTimer();
  console.log("✅ Timer class başlatıldı");

  // Hamburger Menu Event Listeners - DÜZELTME
  const hamburger = document.getElementById("hamburger");
  const mobileClose = document.getElementById("navMobileClose");
  const mobileOverlay = document.getElementById("navMobileOverlay");
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
  const mobileSettingsBtn = document.getElementById("mobileSettingsBtn");

  console.log("🔍 Element kontrolü:");
  console.log("  hamburger:", !!hamburger);
  console.log("  mobileClose:", !!mobileClose);
  console.log("  mobileOverlay:", !!mobileOverlay);

  // Hamburger menu - TEMIZ EVENT LISTENER
  if (hamburger) {
    // Önceki event listener'ları temizle
    hamburger.onclick = null;
    hamburger.replaceWith(hamburger.cloneNode(true));

    // Yeni element referansı al
    const newHamburger = document.getElementById("hamburger");

    newHamburger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("🍔 Hamburger'a tıklandı!");
      toggleMobileNav();
    });

    console.log("✅ Hamburger event listener eklendi");
  } else {
    console.error("❌ Hamburger elementi bulunamadı!");
  }

  // Mobile Close Button
  if (mobileClose) {
    mobileClose.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("❌ Close button'a tıklandı!");
      closeMobileNav();
    });
    console.log("✅ Close button event listener eklendi");
  }

  // Mobile Overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("🔳 Overlay'e tıklandı!");
      closeMobileNav();
    });
    console.log("✅ Overlay event listener eklendi");
  }

  // Mobile Logout Button
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
      closeMobileNav();
    });
    console.log("✅ Mobile logout event listener eklendi");
  }

  // Mobile Settings Button - Timer class ile entegre
  if (mobileSettingsBtn) {
    mobileSettingsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeMobileNav();
      setTimeout(() => {
        if (window.timer && window.timer.openSettings) {
          window.timer.openSettings();
        } else {
          openPomodoroSettings();
        }
      }, 300);
    });
    console.log("✅ Mobile settings event listener eklendi");
  }

  // Profile dropdown
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleProfileDropdown();
    });
  }

  // Desktop Settings ve logout butonları
  const settingsBtn = document.getElementById("settingsBtn");
  const userSettingsBtn = document.getElementById("userSettingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userSettingsBtn) {
    userSettingsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "settings.html";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
      toggleProfileDropdown();
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

  // Global keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideNotification();
      closeMobileNav();
      const settingsModal = document.getElementById("settingsModal");
      if (settingsModal && settingsModal.classList.contains("active")) {
        closePomodoroSettings();
      }
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "h":
          e.preventDefault();
          window.location.href = "dashboard.html";
          break;
        case "r":
          e.preventDefault();
          window.location.reload();
          break;
        case ",":
          e.preventDefault();
          window.location.href = "settings.html";
          break;
      }
    }
  });

  // Window resize handler
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      closeMobileNav();
    }
  });

  // Dashboard ile senkronizasyon için storage listener
  window.addEventListener("storage", (e) => {
    if (e.key === "grindmind_pomodoro_sessions" && window.dashboardAPI) {
      window.dashboardAPI.refreshData();
    }
  });

  console.log("🎉 Tüm event listener'lar başarıyla eklendi!");
});

// ============================================================================
// GLOBAL FUNCTIONS FOR HTML ONCLICK EVENTS
// ============================================================================

// Global functions for HTML onclick events
function toggleTask(id) {
  if (window.timer) {
    window.timer.toggleTask(id);
  }
}

function deleteTask(id) {
  if (window.timer) {
    window.timer.deleteTask(id);
  }
}

// ============================================================================
// GLOBAL API OBJECTS
// ============================================================================

// Global functions for external access
window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.logout = logout;
window.openPomodoroSettings = openPomodoroSettings;
window.closePomodoroSettings = closePomodoroSettings;
window.updateNavbarColors = updateNavbarColors;
window.getDashboardPomodoroData = getDashboardPomodoroData;
window.notifyDashboardUpdate = notifyDashboardUpdate;

// Global API objesi - Navbar
window.pomodoroNavbarAPI = {
  toggleMobileNav,
  closeMobileNav,
  showNotification,
  hideNotification,
  logout,
  openSettings: openPomodoroSettings,
  closeSettings: closePomodoroSettings,
  updateColors: updateNavbarColors,
  getDashboardData: getDashboardPomodoroData,
  notifyDashboard: notifyDashboardUpdate,
};

// Global API objesi - Dashboard
window.pomodoroAPI = {
  getDashboardData: getDashboardPomodoroData,
  notifyDashboard: notifyDashboardUpdate,
};

// ============================================================================
// DEBUG FUNCTIONS
// ============================================================================

// Debug fonksiyonları
window.debugHamburger = {
  test: function () {
    console.log("🧪 Hamburger menu test başlatılıyor...");
    toggleMobileNav();
  },

  checkElements: function () {
    const elements = {
      hamburger: document.getElementById("hamburger"),
      mobileNav: document.getElementById("navMobile"),
      overlay: document.getElementById("navMobileOverlay"),
      closeBtn: document.getElementById("navMobileClose"),
    };

    console.log("🔍 Element durumları:");
    Object.entries(elements).forEach(([name, element]) => {
      console.log(`  ${name}:`, element ? "✅ Mevcut" : "❌ Bulunamadı");
      if (element) {
        console.log(`    Classes:`, element.className);
      }
    });

    return elements;
  },

  forceOpen: function () {
    console.log("🔓 Menüyü zorla açma...");
    const mobileNav = document.getElementById("navMobile");
    const overlay = document.getElementById("navMobileOverlay");
    const hamburger = document.getElementById("hamburger");

    if (mobileNav) {
      mobileNav.classList.add("show", "active");
      mobileNav.style.right = "0";
    }
    if (overlay) {
      overlay.classList.add("show", "active");
      overlay.style.display = "block";
      overlay.style.opacity = "1";
    }
    if (hamburger) {
      hamburger.classList.add("active");
    }

    document.body.style.overflow = "hidden";
    console.log("✅ Menu zorla açıldı");
  },

  forceClose: function () {
    console.log("🔒 Menüyü zorla kapatma...");
    closeMobileNav();
  },
};

console.log(
  "🚀 Hamburger menu script yüklendi! Test için: window.debugHamburger.test()"
);
