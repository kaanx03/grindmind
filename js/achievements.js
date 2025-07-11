// GRINDMIND Achievement System - Modern Notifications
// ================================================

// Modern Achievement Notification System
class ModernAchievementNotifications {
  constructor() {
    this.addNotificationStyles();
  }

  addNotificationStyles() {
    if (document.getElementById("modern-achievement-styles")) return;

    const style = document.createElement("style");
    style.id = "modern-achievement-styles";
    style.textContent = `
      /* MODERN ACHIEVEMENT NOTIFICATION STYLES */
      .achievement-notification {
        position: fixed;
        top: 24px;
        right: 24px;
        width: 320px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 16px;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10000;
        cursor: pointer;
        overflow: hidden;
      }

      .achievement-notification.show {
        transform: translateX(0);
        opacity: 1;
      }

      .achievement-notification::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 16px 16px 0 0;
      }

      .achievement-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .achievement-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .achievement-info {
        flex: 1;
      }

      .achievement-title {
        font-size: 14px;
        font-weight: 600;
        color: #667eea;
        margin-bottom: 2px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .achievement-name {
        font-size: 16px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 4px;
        line-height: 1.2;
      }

      .achievement-description {
        font-size: 13px;
        color: #64748b;
        line-height: 1.3;
      }

      .achievement-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
      }

      .achievement-points {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
      }

      .achievement-close {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.05);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #64748b;
        transition: all 0.2s ease;
      }

      .achievement-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #1a202c;
      }

      /* LEVEL UP NOTIFICATION */
      .levelup-notification {
        position: fixed;
        top: 24px;
        right: 24px;
        width: 340px;
        background: linear-gradient(135deg, #f39c12, #e67e22);
        border-radius: 16px;
        box-shadow: 0 12px 40px rgba(243, 156, 18, 0.4);
        padding: 20px;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10001;
        cursor: pointer;
        color: white;
        overflow: hidden;
      }

      .levelup-notification.show {
        transform: translateX(0);
        opacity: 1;
      }

      .levelup-notification::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .levelup-content {
        position: relative;
        z-index: 1;
        text-align: center;
      }

      .levelup-icon {
        font-size: 48px;
        margin-bottom: 12px;
        animation: bounce 1s ease-in-out;
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
      }

      .levelup-title {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .levelup-subtitle {
        font-size: 16px;
        opacity: 0.9;
        font-weight: 500;
      }

      /* TOAST NOTIFICATION (EN KÜÇÜK) */
      .toast-notification {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: rgba(26, 32, 44, 0.95);
        backdrop-filter: blur(20px);
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10000;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 300px;
      }

      .toast-notification.show {
        transform: translateY(0);
        opacity: 1;
      }

      .toast-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
      }

      .toast-content {
        flex: 1;
      }

      .toast-title {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .toast-message {
        font-size: 12px;
        opacity: 0.8;
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        .achievement-notification,
        .levelup-notification {
          left: 16px;
          right: 16px;
          width: auto;
          transform: translateY(-100px);
        }

        .achievement-notification.show,
        .levelup-notification.show {
          transform: translateY(0);
        }

        .toast-notification {
          left: 16px;
          right: 16px;
          bottom: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Modern Achievement Bildirimi Göster
  showAchievement(achievement) {
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
      <div class="achievement-header">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <div class="achievement-title">Başarı Kazanıldı!</div>
          <div class="achievement-name">${achievement.title}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
      </div>
      <div class="achievement-footer">
        <div class="achievement-points">+${achievement.points} XP</div>
        <button class="achievement-close">×</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Show animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hideNotification(notification);
    }, 5000);

    // Click to close
    notification.addEventListener("click", () => {
      this.hideNotification(notification);
    });

    // Close button
    const closeBtn = notification.querySelector(".achievement-close");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.hideNotification(notification);
    });
  }

  // Level Up Bildirimi Göster
  showLevelUp(newLevel) {
    const notification = document.createElement("div");
    notification.className = "levelup-notification";
    notification.innerHTML = `
      <div class="levelup-content">
        <div class="levelup-icon">🎉</div>
        <div class="levelup-title">LEVEL UP!</div>
        <div class="levelup-subtitle">Level ${newLevel}'e Ulaştın!</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Show animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto hide after 6 seconds
    setTimeout(() => {
      this.hideNotification(notification);
    }, 6000);

    // Click to close
    notification.addEventListener("click", () => {
      this.hideNotification(notification);
    });

    // Konfeti efekti ekle
    this.createConfetti();
  }

  // Mini Toast Bildirimi Göster
  showToast(title, message, icon = "✨") {
    const notification = document.createElement("div");
    notification.className = "toast-notification";
    notification.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Show animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.hideNotification(notification);
    }, 3000);

    // Click to close
    notification.addEventListener("click", () => {
      this.hideNotification(notification);
    });
  }

  hideNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 400);
  }

  // Konfeti efekti
  createConfetti() {
    const colors = [
      "#667eea",
      "#764ba2",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
    ];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.style.cssText = `
          position: fixed;
          top: -10px;
          left: ${Math.random() * 100}vw;
          width: 8px;
          height: 8px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          z-index: 10000;
          pointer-events: none;
          border-radius: 50%;
        `;

        // Falling animation
        confetti.animate(
          [
            { transform: "translateY(-10px) rotate(0deg)", opacity: 1 },
            { transform: "translateY(100vh) rotate(360deg)", opacity: 0 },
          ],
          {
            duration: 3000,
            easing: "ease-out",
          }
        );

        document.body.appendChild(confetti);

        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 3000);
      }, i * 50);
    }
  }
}

// Updated Achievement System with Modern Notifications
class SimplifiedAchievementSystem {
  constructor() {
    this.achievements = this.loadAchievements();
    this.bestRecords = this.loadBestRecords();
    this.statistics = this.loadStatistics();
    this.allAchievements = getAllAchievements();

    // Modern bildirim sistemi
    this.notificationSystem = new ModernAchievementNotifications();

    this.setupSystem();

    // Event listener ekle
    window.addEventListener("storage", (e) => {
      if (e.key === "grindmind_achievements") {
        this.achievements = this.loadAchievements();
        this.updateWidget();
        this.broadcastUpdate();
      }
    });
  }

  // Mevcut fonksiyonları koru
  loadAchievements() {
    const saved = localStorage.getItem("grindmind_achievements");
    return saved
      ? JSON.parse(saved)
      : {
          unlocked: [],
          points: 0,
          level: 1,
          lastUpdate: new Date().toISOString(),
        };
  }

  loadBestRecords() {
    const saved = localStorage.getItem("grindmind_best_records");
    return saved
      ? JSON.parse(saved)
      : {
          bestDailyPomodoros: 0,
          bestWeeklyPomodoros: 0,
          bestMonthlyPomodoros: 0,
          bestPomodoroSession: 0,
          bestHabitCompletionRate: 0,
          mostActiveHabits: 0,
          bestHabitWeek: 0,
          bestDailyTasks: 0,
          bestWeeklyTasks: 0,
          bestTaskCompletionRate: 0,
          fastestTaskCompletion: 0,
          bestCleanRate: 0,
          bestDayOverall: 0,
          bestWeekOverall: 0,
          recordDates: {},
        };
  }

  loadStatistics() {
    const saved = localStorage.getItem("grindmind_statistics");
    return saved
      ? JSON.parse(saved)
      : {
          totalPomodoroSessions: 0,
          totalPomodoroMinutes: 0,
          totalHabitCompletions: 0,
          totalTasksCompleted: 0,
          totalCleanDays: 0,
          totalAppUsageDays: 0,
          firstUsageDate: new Date().toISOString(),
          lastUpdateDate: new Date().toISOString(),
          weeklyData: [],
          monthlyData: [],
          pomodorosByDay: {},
          habitsByCategory: {},
          tasksByPriority: {},
        };
  }

  saveData() {
    this.achievements.lastUpdate = new Date().toISOString();

    localStorage.setItem(
      "grindmind_achievements",
      JSON.stringify(this.achievements)
    );
    localStorage.setItem(
      "grindmind_best_records",
      JSON.stringify(this.bestRecords)
    );
    localStorage.setItem(
      "grindmind_statistics",
      JSON.stringify(this.statistics)
    );

    this.broadcastUpdate();
  }

  broadcastUpdate() {
    window.dispatchEvent(
      new CustomEvent("achievementUpdate", {
        detail: {
          achievements: this.achievements,
          bestRecords: this.bestRecords,
          stats: this.getCurrentStats(),
        },
      })
    );

    if (window.updateCharacterDisplay) {
      window.updateCharacterDisplay();
    }
  }

  calculateLevel(points) {
    const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200];

    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (points >= levelThresholds[i]) {
        return Math.min(i + 1, 8);
      }
    }
    return 1;
  }

  getLevelProgress(points, level) {
    const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200];

    if (level >= 8) {
      return {
        current: points,
        needed: levelThresholds[7],
        progress: 100,
        nextLevelTotal: "MAX",
      };
    }

    const nextLevelStart = levelThresholds[level];
    const progress = Math.min((points / nextLevelStart) * 100, 100);

    return {
      current: points,
      needed: nextLevelStart,
      progress: Math.round(progress),
      nextLevelTotal: nextLevelStart,
    };
  }

  // GÜNCELLENMIŞ - Modern bildirimlerle widget güncelleme
  updateWidget() {
    const calculatedLevel = this.calculateLevel(this.achievements.points);

    if (calculatedLevel !== this.achievements.level) {
      const oldLevel = this.achievements.level;
      this.achievements.level = calculatedLevel;

      if (calculatedLevel > oldLevel) {
        // Modern level up bildirimi
        this.notificationSystem.showLevelUp(calculatedLevel);
      }

      this.saveData();
    }

    // Widget elementlerini güncelle
    const levelElement = document.getElementById("userLevel");
    const pointsElement = document.getElementById("userPoints");
    const progressBar = document.getElementById("levelProgressBar");

    if (levelElement)
      levelElement.textContent = `Level ${this.achievements.level}`;
    if (pointsElement)
      pointsElement.textContent = `${this.achievements.points} XP`;

    const levelProgress = this.getLevelProgress(
      this.achievements.points,
      this.achievements.level
    );
    if (progressBar) {
      progressBar.style.width = `${levelProgress.progress}%`;
    }

    this.updateRecentAchievements();
  }

  updateRecentAchievements() {
    const container = document.getElementById("recentAchievementsList");
    if (!container) return;

    const recent = this.achievements.unlocked.slice(-3).reverse();

    if (recent.length === 0) {
      container.innerHTML = `
        <div class="no-achievements">
          Henüz başarı kazanılmadı. İlk görevini tamamla!
        </div>
      `;
      return;
    }

    container.innerHTML = recent
      .map(
        (achievement) => `
      <div class="recent-achievement">
        <span class="achievement-icon">${achievement.icon}</span>
        <span class="achievement-name">${achievement.title}</span>
        <span class="achievement-points">+${achievement.points} XP</span>
      </div>
    `
      )
      .join("");
  }

  // GÜNCELLENMIŞ - Modern bildirimlerle achievement ekleme
  addAchievement(achievementId) {
    const achievementData = findAchievementById(achievementId);
    if (!achievementData) {
      return;
    }

    if (this.achievements.unlocked.find((a) => a.id === achievementId)) {
      return;
    }

    const reducedPoints = Math.max(2, Math.floor(achievementData.points * 0.3));

    const newAchievement = {
      ...achievementData,
      points: reducedPoints,
      unlockedAt: new Date().toISOString(),
    };

    this.achievements.unlocked.push(newAchievement);
    this.achievements.points += reducedPoints;

    this.saveData();
    this.updateWidget();

    // Modern bildirim göster
    this.notificationSystem.showAchievement(newAchievement);
  }

  // Rekor bildirimi göster
  showRecordNotification(title, value) {
    // Mini toast bildirim kullan
    this.notificationSystem.showToast(
      "YENİ REKOR!",
      `${title}: ${value}`,
      "🏆"
    );

    this.createConfetti();
  }

  // Konfeti efekti
  createConfetti() {
    this.notificationSystem.createConfetti();
  }

  // Diğer tüm mevcut fonksiyonları koru...
  updateBestRecords() {
    const currentStats = this.getCurrentStats();
    const today = new Date().toDateString();
    let recordBroken = false;

    if (currentStats.todayPomodoros > this.bestRecords.bestDailyPomodoros) {
      this.bestRecords.bestDailyPomodoros = currentStats.todayPomodoros;
      this.bestRecords.recordDates.bestDailyPomodoros = today;
      recordBroken = true;
      this.showRecordNotification(
        "Günlük Pomodoro Rekoru",
        currentStats.todayPomodoros
      );
    }

    if (currentStats.weeklyPomodoros > this.bestRecords.bestWeeklyPomodoros) {
      this.bestRecords.bestWeeklyPomodoros = currentStats.weeklyPomodoros;
      this.bestRecords.recordDates.bestWeeklyPomodoros = today;
      recordBroken = true;
      this.showRecordNotification(
        "Haftalık Pomodoro Rekoru",
        currentStats.weeklyPomodoros
      );
    }

    if (currentStats.activeHabits > this.bestRecords.mostActiveHabits) {
      this.bestRecords.mostActiveHabits = currentStats.activeHabits;
      this.bestRecords.recordDates.mostActiveHabits = today;
      recordBroken = true;
    }

    if (currentStats.todayTasks > this.bestRecords.bestDailyTasks) {
      this.bestRecords.bestDailyTasks = currentStats.todayTasks;
      this.bestRecords.recordDates.bestDailyTasks = today;
      recordBroken = true;
      this.showRecordNotification(
        "Günlük Görev Rekoru",
        currentStats.todayTasks
      );
    }

    if (recordBroken) {
      this.saveData();
      this.updateWidget();
    }

    return recordBroken;
  }

  checkAchievements() {
    if (!ACHIEVEMENT_DATABASE) {
      return;
    }

    const stats = this.getCurrentStats();

    this.allAchievements.forEach((achievement) => {
      if (this.checkAchievementCondition(achievement, stats)) {
        this.addAchievement(achievement.id);
      }
    });
  }

  checkAchievementCondition(achievement, stats) {
    const condition = achievement.condition;

    switch (condition.type) {
      case "pomodoro_total":
        return stats.totalPomodoros >= condition.value;
      case "pomodoro_daily":
        return stats.todayPomodoros >= condition.value;
      case "pomodoro_hours":
        return stats.totalPomodoroHours >= condition.value;
      case "habit_created":
        return stats.totalHabits >= condition.value;
      case "active_habits":
        return stats.activeHabits >= condition.value;
      case "habit_completion_rate":
        return stats.habitCompletionRate >= condition.value;
      case "habit_total_completions":
        return stats.totalHabitCompletions >= condition.value;
      case "task_completed":
      case "task_total":
        return stats.totalTasks >= condition.value;
      case "daily_completion":
        return stats.taskCompletionRate >= condition.value;
      case "daily_task_count":
        return stats.todayTasks >= condition.value;
      case "clean_days":
        return stats.totalCleanDays >= condition.value;
      case "addiction_tracking":
        return stats.activeAddictions >= condition.value;
      case "success_rate":
        return stats.addictionSuccessRate >= condition.value;
      case "level_reached":
        return this.achievements.level >= condition.value;
      case "total_points":
        return this.achievements.points >= condition.value;
      case "achievement_count":
        return this.achievements.unlocked.length >= condition.value;
      case "all_modules_used":
        return this.checkAllModulesUsed(stats);
      case "time_range":
        return this.checkTimeRange(condition.value);
      case "weekend_pomodoro":
        return this.checkWeekendUsage();
      case "session_duration":
        return this.checkLongSession(condition.value);
      default:
        return false;
    }
  }

  checkAllModulesUsed(stats) {
    return (
      stats.totalPomodoros > 0 &&
      stats.totalHabits > 0 &&
      stats.totalTasks > 0 &&
      stats.activeAddictions > 0
    );
  }

  checkTimeRange(timeRange) {
    const now = new Date();
    const currentHour = now.getHours();
    const [startTime, endTime] = timeRange.split("-");
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);

    return currentHour >= startHour && currentHour < endHour;
  }

  checkWeekendUsage() {
    const today = new Date().getDay();
    return today === 0 || today === 6;
  }

  checkLongSession(minDuration) {
    const sessions = JSON.parse(
      localStorage.getItem("grindmind_pomodoro_sessions") || "[]"
    );
    const latestSession = sessions[sessions.length - 1];
    return latestSession && latestSession.duration >= minDuration;
  }

  getCurrentStats() {
    const sessions = JSON.parse(
      localStorage.getItem("grindmind_pomodoro_sessions") || "[]"
    );
    const habits = JSON.parse(
      localStorage.getItem("grindmind_user_habits") || "[]"
    );
    const tasks = JSON.parse(localStorage.getItem("grindmind_tasks") || "[]");
    const addictions = JSON.parse(
      localStorage.getItem("grindmind_user_addictions") || "[]"
    );

    const completedPomodoros = sessions.filter(
      (s) => s.type === "pomodoro" && s.completed
    );

    const today = new Date().toDateString();
    const todayPomodoros = completedPomodoros.filter(
      (s) => new Date(s.date).toDateString() === today
    ).length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyPomodoros = completedPomodoros.filter(
      (s) => new Date(s.date) >= oneWeekAgo
    ).length;

    const activeHabits = habits.length;
    const totalHabitCompletions = habits.reduce((sum, habit) => {
      return sum + (habit.completions ? habit.completions.length : 0);
    }, 0);

    let habitCompletionRate = 0;
    if (activeHabits > 0) {
      const totalPossibleCompletions = habits.reduce((sum, habit) => {
        const daysActive =
          Math.floor(
            (new Date() - new Date(habit.startDate)) / (1000 * 60 * 60 * 24)
          ) + 1;
        return sum + daysActive;
      }, 0);
      habitCompletionRate =
        totalPossibleCompletions > 0
          ? Math.round((totalHabitCompletions / totalPossibleCompletions) * 100)
          : 0;
    }

    const completedTasks = tasks.filter((t) => t.status === "done");
    const todayTasksCompleted = completedTasks.filter(
      (t) => new Date(t.completedDate || t.createdDate).toDateString() === today
    ).length;

    const todayTasks = tasks.filter((task) => {
      const taskDate = task.scheduledDate || task.createdDate?.split("T")[0];
      const dueDate = task.dueDate;
      return (
        taskDate === new Date().toISOString().split("T")[0] ||
        dueDate === new Date().toISOString().split("T")[0]
      );
    }).length;

    const taskCompletionRate =
      todayTasks > 0 ? Math.round((todayTasksCompleted / todayTasks) * 100) : 0;

    const activeAddictions = addictions.length;
    let totalCleanDays = 0;
    let addictionSuccessRate = 0;

    if (activeAddictions > 0) {
      totalCleanDays = addictions.reduce((sum, addiction) => {
        return sum + this.calculateCleanDays(addiction);
      }, 0);

      const totalCheckins = addictions.reduce(
        (sum, a) => sum + (a.checkins?.length || 0),
        0
      );
      const cleanCheckins = addictions.reduce((sum, a) => {
        return sum + (a.checkins?.filter((c) => c.isClean).length || 0);
      }, 0);
      addictionSuccessRate =
        totalCheckins > 0
          ? Math.round((cleanCheckins / totalCheckins) * 100)
          : 0;
    }

    return {
      totalPomodoros: completedPomodoros.length,
      todayPomodoros: todayPomodoros,
      weeklyPomodoros: weeklyPomodoros,
      totalPomodoroMinutes: completedPomodoros.reduce(
        (sum, s) => sum + (s.duration || 25),
        0
      ),
      totalPomodoroHours:
        completedPomodoros.reduce((sum, s) => sum + (s.duration || 25), 0) / 60,

      totalHabits: habits.length,
      activeHabits: activeHabits,
      totalHabitCompletions: totalHabitCompletions,
      habitCompletionRate: habitCompletionRate,

      totalTasks: completedTasks.length,
      todayTasks: todayTasks,
      todayTasksCompleted: todayTasksCompleted,
      taskCompletionRate: taskCompletionRate,

      activeAddictions: activeAddictions,
      totalCleanDays: totalCleanDays,
      addictionSuccessRate: addictionSuccessRate,
    };
  }

  calculateCleanDays(addiction) {
    if (!addiction.checkins || addiction.checkins.length === 0) return 0;

    const today = new Date().toISOString().split("T")[0];
    const todayCheckin = addiction.checkins.find((c) => c.date === today);

    if (todayCheckin && !todayCheckin.isClean) {
      return 0;
    }

    const sortedCheckins = [...addiction.checkins].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let cleanDays = 0;
    let foundRelapse = false;

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

    if (!foundRelapse) {
      cleanDays = sortedCheckins.filter((c) => c.isClean).length;
    }

    return cleanDays;
  }

  setupSystem() {
    this.updateWidget();
    this.updateBestRecords();
    this.checkAchievements();
  }
}

// Global değişkenler ve fonksiyonlar (mevcut koddan)
let achievementSystem;
let ACHIEVEMENT_DATABASE = null;
let RARITY_CONFIG = null;

// JSON'dan achievement database'i yükle
async function loadAchievementDatabase() {
  try {
    const response = await fetch("./achievements.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    ACHIEVEMENT_DATABASE = data.ACHIEVEMENT_DATABASE;
    RARITY_CONFIG = data.RARITY_CONFIG;

    return true;
  } catch (error) {
    return false;
  }
}

function getAllAchievements() {
  if (!ACHIEVEMENT_DATABASE) {
    return [];
  }

  const allAchievements = [];
  Object.keys(ACHIEVEMENT_DATABASE).forEach((category) => {
    ACHIEVEMENT_DATABASE[category].forEach((achievement) => {
      allAchievements.push({
        ...achievement,
        category: category,
      });
    });
  });

  return allAchievements;
}

function findAchievementById(id) {
  const allAchievements = getAllAchievements();
  return allAchievements.find((achievement) => achievement.id === id);
}

// JSON'dan veri yükleyip sistemi başlat
async function initializeAchievements() {
  try {
    const databaseLoaded = await loadAchievementDatabase();

    if (!databaseLoaded) {
      return;
    }

    achievementSystem = new SimplifiedAchievementSystem();
  } catch (error) {
    // Hata durumunda sessizce devam et
  }
}

// Dashboard'dan achievements sayfasına yönlendirme
function showAchievementsModal() {
  window.location.href = "achievements.html";
}

// API FUNCTIONS - Güncellenmiş
window.achievementAPI = {
  markPomodoroCompleted: () => {
    if (achievementSystem) {
      achievementSystem.updateBestRecords();
      achievementSystem.checkAchievements();
    }
  },

  markHabitCompleted: () => {
    if (achievementSystem) {
      achievementSystem.updateBestRecords();
      achievementSystem.checkAchievements();
    }
  },

  markTaskCompleted: () => {
    if (achievementSystem) {
      achievementSystem.updateBestRecords();
      achievementSystem.checkAchievements();
    }
  },

  markCleanDay: () => {
    if (achievementSystem) {
      achievementSystem.updateBestRecords();
      achievementSystem.checkAchievements();
    }
  },

  checkAchievements: () => {
    if (achievementSystem) {
      return achievementSystem.checkAchievements();
    }
  },

  getStats: () => {
    if (achievementSystem) {
      return {
        achievements: achievementSystem.achievements,
        bestRecords: achievementSystem.bestRecords,
        statistics: achievementSystem.statistics,
        currentStats: achievementSystem.getCurrentStats(),
      };
    }
    return null;
  },

  getBestRecords: () => {
    if (achievementSystem) {
      return achievementSystem.bestRecords;
    }
    return null;
  },

  getAchievementDatabase: () => {
    return ACHIEVEMENT_DATABASE;
  },

  getRarityConfig: () => {
    return RARITY_CONFIG;
  },

  // GÜNCELLENMIŞ - Modern bildirimlerle test
  testAchievement: (achievementId = null) => {
    if (achievementSystem) {
      if (achievementId) {
        achievementSystem.addAchievement(achievementId);
      } else {
        // Test achievement oluştur
        const testAchievement = {
          id: "test_achievement",
          title: "Test Başarısı",
          description: "Bu bir test bildirimidir",
          icon: "🎉",
          points: 25,
        };
        achievementSystem.notificationSystem.showAchievement(testAchievement);
      }
    }
  },

  // Modern bildirim test fonksiyonları
  testModernNotifications: () => {
    if (achievementSystem) {
      // Achievement bildirimi
      setTimeout(() => {
        const testAchievement = {
          title: "İlk Pomodoro",
          description: "İlk pomodoro seansını başarıyla tamamladın!",
          icon: "🍅",
          points: 25,
        };
        achievementSystem.notificationSystem.showAchievement(testAchievement);
      }, 1000);

      // Level up bildirimi
      setTimeout(() => {
        achievementSystem.notificationSystem.showLevelUp(3);
      }, 3000);

      // Toast bildirimi
      setTimeout(() => {
        achievementSystem.notificationSystem.showToast(
          "Alışkanlık Tamamlandı",
          "Günlük su içme hedefin tamamlandı",
          "💧"
        );
      }, 5000);
    }
  },

  forceUpdateWidget: () => {
    if (achievementSystem) {
      achievementSystem.updateWidget();
    }
  },

  forceUpdateBestRecords: () => {
    if (achievementSystem) {
      achievementSystem.updateBestRecords();
    }
  },

  calculateLevel: (points) => {
    if (achievementSystem) {
      return achievementSystem.calculateLevel(points);
    }
    return 1;
  },

  getLevelProgress: (points, level) => {
    if (achievementSystem) {
      return achievementSystem.getLevelProgress(points, level);
    }
    return { current: 0, needed: 100, progress: 0 };
  },

  refreshData: () => {
    if (achievementSystem) {
      achievementSystem.achievements = achievementSystem.loadAchievements();
      achievementSystem.updateWidget();
      achievementSystem.broadcastUpdate();
    }
  },
};

// DEBUG FUNCTIONS - Güncellenmiş
window.debugAchievements = {
  showDatabase: () => {
    if (ACHIEVEMENT_DATABASE) {
      return { ACHIEVEMENT_DATABASE, RARITY_CONFIG };
    }
  },

  testLoad: async () => {
    const result = await loadAchievementDatabase();
    return result;
  },

  addTestAchievement: (achievementId = "first_pomodoro") => {
    window.achievementAPI.testAchievement(achievementId);
  },

  // Modern bildirim testleri
  testModernAchievement: () => {
    if (achievementSystem) {
      const testAchievement = {
        title: "Süper Başarı",
        description: "Modern bildirim sistemi çalışıyor!",
        icon: "✨",
        points: 50,
      };
      achievementSystem.notificationSystem.showAchievement(testAchievement);
    }
  },

  testLevelUp: () => {
    if (achievementSystem) {
      achievementSystem.notificationSystem.showLevelUp(5);
    }
  },

  testToast: () => {
    if (achievementSystem) {
      achievementSystem.notificationSystem.showToast(
        "Test Başarılı",
        "Modern toast bildirimi çalışıyor",
        "🚀"
      );
    }
  },

  testAllNotifications: () => {
    window.achievementAPI.testModernNotifications();
  },

  showStats: () => {
    const stats = window.achievementAPI.getStats();
    return stats;
  },

  showBestRecords: () => {
    const records = window.achievementAPI.getBestRecords();
    return records;
  },

  addXP: (amount = 50) => {
    if (achievementSystem) {
      achievementSystem.achievements.points += amount;
      achievementSystem.saveData();
      achievementSystem.updateWidget();
    }
  },

  testLevelUpXP: () => {
    window.debugAchievements.addXP(200);
  },

  showLevelInfo: () => {
    if (achievementSystem) {
      const points = achievementSystem.achievements.points;
      const level = achievementSystem.achievements.level;
      const progress = achievementSystem.getLevelProgress(points, level);
      return { level, points, progress };
    }
  },

  resetAll: () => {
    if (confirm("TÜM ACHIEVEMENT VERİLERİ SİLİNECEK! Emin misiniz?")) {
      const achievementKeys = [
        "grindmind_achievements",
        "grindmind_best_records",
        "grindmind_statistics",
      ];
      achievementKeys.forEach((key) => localStorage.removeItem(key));
      location.reload();
    }
  },

  // Sıralı test - tüm bildirimleri sırayla göster
  runSequentialTest: () => {
    console.log("🧪 Sıralı bildirim testi başlatılıyor...");

    // 1. Achievement bildirimi
    setTimeout(() => {
      const achievement1 = {
        title: "İlk Başarı",
        description: "İlk achievement bildirimini gördün",
        icon: "🎯",
        points: 25,
      };
      achievementSystem.notificationSystem.showAchievement(achievement1);
    }, 1000);

    // 2. Toast bildirimi
    setTimeout(() => {
      achievementSystem.notificationSystem.showToast(
        "Küçük Adım",
        "Her küçük adım önemlidir",
        "👣"
      );
    }, 4000);

    // 3. Achievement bildirimi 2
    setTimeout(() => {
      const achievement2 = {
        title: "Pomodoro Ustası",
        description: "5 pomodoro seansı tamamladın",
        icon: "🍅",
        points: 50,
      };
      achievementSystem.notificationSystem.showAchievement(achievement2);
    }, 7000);

    // 4. Level up bildirimi
    setTimeout(() => {
      achievementSystem.notificationSystem.showLevelUp(4);
    }, 10000);

    // 5. Toast bildirimi 2
    setTimeout(() => {
      achievementSystem.notificationSystem.showToast(
        "Test Tamamlandı",
        "Tüm bildirim türleri test edildi",
        "✅"
      );
    }, 15000);
  },
};

// Initialize system
document.addEventListener("DOMContentLoaded", () => {
  initializeAchievements();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SimplifiedAchievementSystem,
    ModernAchievementNotifications,
    initializeAchievements,
  };
}
