// GRINDMIND Pomodoro-Dashboard Entegrasyon Kodu
// ================================================

// Dashboard API'sini Pomodoro timer'a entegre et
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

    console.log(
      "🍅 GRINDMIND Pomodoro Timer initialized with dashboard integration"
    );
  }

  // Tarih yardımcı fonksiyonları
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

  // Dashboard'a Pomodoro session kaydetme
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

    console.log("✅ Pomodoro session kaydedildi:", newSession);

    // Dashboard'ı güncelle (eğer dashboard API'si varsa)
    if (
      window.dashboardAPI &&
      typeof window.dashboardAPI.refreshData === "function"
    ) {
      window.dashboardAPI.refreshData();
    }

    // Achievement sistemini bilgilendir
    if (window.achievementAPI && isCompleted) {
      window.achievementAPI.markPomodoroCompleted();
    }

    return newSession;
  }

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
    this.hamburgerBtn = document.getElementById("hamburgerBtn");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    this.mobileSettingsBtn = document.getElementById("mobileSettingsBtn");
    this.mobileCloseBtn = document.getElementById("mobileCloseBtn");

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

    // Mobile menu
    if (this.hamburgerBtn) {
      this.hamburgerBtn.addEventListener("click", () =>
        this.toggleMobileMenu()
      );
    }
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.addEventListener("click", () =>
        this.closeMobileMenu()
      );
    }
    if (this.mobileCloseBtn) {
      this.mobileCloseBtn.addEventListener("click", () =>
        this.closeMobileMenu()
      );
    }

    // Settings
    if (this.settingsBtn) {
      this.settingsBtn.addEventListener("click", () => this.openSettings());
    }
    if (this.mobileSettingsBtn) {
      this.mobileSettingsBtn.addEventListener("click", () => {
        this.closeMobileMenu();
        this.openSettings();
      });
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

    // Close mobile menu on window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const isActive = this.mobileMenu.classList.contains("active");
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.hamburgerBtn.classList.add("active");
    this.mobileMenu.classList.add("active");
    this.mobileMenuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeMobileMenu() {
    this.hamburgerBtn.classList.remove("active");
    this.mobileMenu.classList.remove("active");
    this.mobileMenuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

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

  // GÜNCELLENMIŞ completeSession - Dashboard entegrasyonu eklendi
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

    // ✅ Dashboard entegrasyonu - Sadece pomodoro session'ları kaydedilir
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
        const fullSessionDuration = this.settings.pomodoroTime; // Tam ayarlanan süre
        this.recordPomodoroSession(fullSessionDuration, true);
        console.log(
          `⏭️ Pomodoro skip edildi: ${fullSessionDuration} dakika kaydedildi (tam süre)`
        );
      }

      // Normal complete session işlemini çalıştır (ancak tekrar kaydetme)
      this.completeSessionSkipped();
    }
  }

  // Skip için özel complete fonksiyonu (tekrar veri kaydetmesin)
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
      },
      short: {
        gradient: "linear-gradient(135deg, #38858a 0%, #2d6a6f 100%)",
        shadow: "rgba(56, 133, 138, 0.3)",
      },
      long: {
        gradient: "linear-gradient(135deg, #397097 0%, #2e5a7a 100%)",
        shadow: "rgba(57, 112, 151, 0.3)",
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
      console.log("Audio not supported");
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

  openSettings() {
    if (this.settingsModal) {
      this.settingsModal.classList.add("active");
      this.loadSettingsToForm();
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
    this.closeSettingsModal();

    // Reset current timer if not running
    if (!this.isRunning) {
      this.resetTimer();
    }

    this.showSuccessMessage("Ayarlar kaydedildi! ✅");
  }

  loadSettings() {
    // Settings are stored in memory for this demo
  }

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
  }

  loadTasks() {
    // Tasks are loaded from memory for this demo
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

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
          this.closeMobileMenu();
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
// Dashboard API Entegrasyon Fonksiyonları
// ============================================================================

// Dashboard'dan çağrılabilecek fonksiyonlar
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
    averageTime: averageTime,
  };
}

// Dashboard'a bildirim gönderme fonksiyonu
function notifyDashboardUpdate() {
  // Dashboard sayfası açık mı kontrol et
  if (window.opener && typeof window.opener.dashboardAPI !== "undefined") {
    window.opener.dashboardAPI.refreshData();
  }

  // LocalStorage event'i tetikle (aynı origin'deki diğer sekmeler için)
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "grindmind_pomodoro_sessions",
      newValue: localStorage.getItem("grindmind_pomodoro_sessions"),
    })
  );
}

// ============================================================================
// Event Listeners ve Global API
// ============================================================================

// Initialize the timer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.timer = new PomodoroTimer();

  // Dashboard ile senkronizasyon için storage listener
  window.addEventListener("storage", (e) => {
    if (e.key === "grindmind_pomodoro_sessions" && window.dashboardAPI) {
      window.dashboardAPI.refreshData();
    }
  });
});

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
// Dashboard Test ve Debug Fonksiyonları
// ============================================================================

// Test için dashboard entegrasyonunu simüle et
function simulateDashboardIntegration() {
  console.log("🧪 Dashboard entegrasyonu test ediliyor...");

  // Test data ekle
  if (window.timer) {
    window.timer.recordPomodoroSession(25, true);
    window.timer.recordPomodoroSession(30, true);
    console.log("✅ Test pomodoro sessions eklendi");
  }

  // Dashboard data'yı kontrol et
  const data = getDashboardPomodoroData();
  console.log("📊 Dashboard verisi:", data);

  return data;
}

// Global API objesi
window.pomodoroAPI = {
  getDashboardData: getDashboardPomodoroData,
  notifyDashboard: notifyDashboardUpdate,
  simulateTest: simulateDashboardIntegration,
};

// Debug fonksiyonları
window.debugPomodoro = {
  addSession: (duration = 25) => {
    if (window.timer) {
      return window.timer.recordPomodoroSession(duration, true);
    }
  },
  addMultipleSessions: (count = 3, duration = 25) => {
    if (window.timer) {
      for (let i = 0; i < count; i++) {
        window.timer.recordPomodoroSession(duration, true);
      }
    }
  },
  showData: () => console.log(getDashboardPomodoroData()),
  clearData: () => {
    localStorage.removeItem("grindmind_pomodoro_today");
    localStorage.removeItem("grindmind_pomodoro_sessions");
    localStorage.removeItem("grindmind_pomodoro_last_date");
    console.log("🗑️ Pomodoro verileri temizlendi");
  },
  testIntegration: simulateDashboardIntegration,
};
