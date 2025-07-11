// Save state to localStorage
function saveState() {
  try {
    const stateToSave = {
      user: state.user,
      challenge: state.challenge,
      posts: state.posts.slice(0, 5), // Sadece son 5 postu kaydet
      ai: {
        lastReport: state.ai.lastReport,
      },
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem(
      "grindmind_dashboard_state",
      JSON.stringify(stateToSave)
    );
  } catch (error) {
    console.error("Error saving state:", error);
  }
}

// Load state from localStorage
function loadState() {
  try {
    const savedState = localStorage.getItem("grindmind_dashboard_state");
    if (savedState) {
      const parsed = JSON.parse(savedState);

      // Merge saved state with current state
      if (parsed.user) {
        Object.assign(state.user, parsed.user);
      }

      if (parsed.challenge) {
        Object.assign(state.challenge, parsed.challenge);
      }

      if (parsed.posts && Array.isArray(parsed.posts)) {
        state.posts = parsed.posts;
      }

      if (parsed.ai && parsed.ai.lastReport) {
        state.ai.lastReport = parsed.ai.lastReport;

        // AI mesajını güncelle
        const messageEl = document.getElementById("aiCoachMessage");
        if (messageEl && parsed.ai.lastReport.content) {
          messageEl.textContent = parsed.ai.lastReport.content;
        }
      }

      console.log("✅ State loaded from localStorage");
      return true;
    }
  } catch (error) {
    console.error("Error loading state:", error);
  }
  return false;
}

// Update UI with loaded state
function updateUIWithState() {
  // Update user info
  const profileName = document.getElementById("profileName");
  const userLevel = document.getElementById("userLevel");
  const userXP = document.getElementById("userXP");

  if (profileName) profileName.textContent = state.user.name;
  if (userLevel) userLevel.textContent = state.user.level;
  if (userXP) userXP.textContent = formatNumber(state.user.xp);

  // Update challenge UI
  if (state.challenge.isJoined) {
    document.getElementById("challengeJoin").style.display = "none";
    document.getElementById("challengeActive").style.display = "block";
    updateProgressRing();
    updateLeaderboard();
  }

  // Restore posts
  const feedPosts = document.querySelector(".feed-posts");
  if (feedPosts && state.posts.length > 0) {
    // Clear existing posts except sample posts
    const existingPosts = feedPosts.querySelectorAll(
      ".post-item[data-post-id]"
    );
    existingPosts.forEach((post) => {
      const postId = post.getAttribute("data-post-id");
      if (!state.posts.find((p) => p.id == postId)) {
        post.remove();
      }
    });

    // Add saved posts
    state.posts.forEach((post) => {
      if (!document.querySelector(`[data-post-id="${post.id}"]`)) {
        const postElement = createPostElement(post);
        feedPosts.insertBefore(postElement, feedPosts.firstChild);
      }
    });
  }
}

// Real-time data simulation
function updateMiniActivities() {
  const activities = {
    miniPomodoro: () => {
      const current = Math.min(state.challenge.progress, 8);
      return `${current}/8`;
    },
    miniHabits: () => {
      const completed = Math.floor(Math.random() * 3) + 7;
      return `${completed}/9`;
    },
    miniTasks: () => {
      const completed = Math.floor(Math.random() * 5) + 10;
      return `${completed}/15`;
    },
    miniWeight: () => {
      const changes = ["-2.3kg", "-1.8kg", "-2.1kg", "-2.5kg"];
      return changes[Math.floor(Math.random() * changes.length)];
    },
    miniClean: () => {
      const days = Math.floor(Math.random() * 10) + 40;
      return `${days} gün`;
    },
    miniStudy: () => {
      const topics = Math.floor(Math.random() * 3) + 2;
      return `${topics} konu`;
    },
  };

  Object.entries(activities).forEach(([id, getValue]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = getValue();
    }
  });
}

// Community stats simulation
function updateCommunityStats() {
  const stats = {
    totalMembers: () => 15000 + Math.floor(Math.random() * 500),
    todayPomodoros: () => 3000 + Math.floor(Math.random() * 1000),
    challengeParticipants: () => 800 + Math.floor(Math.random() * 100),
    todayPosts: () => 100 + Math.floor(Math.random() * 50),
  };

  Object.entries(stats).forEach(([id, getValue]) => {
    const element = document.getElementById(id);
    if (element) {
      const newValue = getValue();
      element.textContent = newValue.toLocaleString();

      // Add animation if value changed
      if (element.textContent !== newValue.toString()) {
        element.classList.add("success-animation");
        setTimeout(() => {
          element.classList.remove("success-animation");
        }, 600);
      }
    }
  });
}

// Streak simulation
function updateStreaks() {
  const streaks = {
    pomodoroStreak: () => Math.floor(Math.random() * 3) + 5 + " gün",
    waterStreak: () => Math.floor(Math.random() * 5) + 10 + " gün",
    exerciseStreak: () => Math.floor(Math.random() * 2) + 2 + " gün",
    cleanStreak: () => Math.floor(Math.random() * 10) + 40 + " gün",
  };

  Object.entries(streaks).forEach(([id, getValue]) => {
    const element = document.getElementById(id);
    if (element && Math.random() > 0.9) {
      // 10% chance to update
      element.textContent = getValue();
      element.classList.add("success-animation");
      setTimeout(() => {
        element.classList.remove("success-animation");
      }, 600);
    }
  });
}

// Enhanced activity simulation
function enhancedActivitySimulation() {
  // Update mini activities
  updateMiniActivities();

  // Update community stats occasionally
  if (Math.random() > 0.8) {
    updateCommunityStats();
  }

  // Update streaks occasionally
  if (Math.random() > 0.85) {
    updateStreaks();
  }

  // Simulate pomodoro completion
  if (Math.random() > 0.98 && state.challenge.isJoined) {
    updateChallengeProgress(1);
    showNotification(
      "Pomodoro Tamamlandı!",
      "Harika! Challenge'da bir adım daha ilerledin! ⏱️",
      "success"
    );
  }

  // Random motivational notifications
  if (Math.random() > 0.995) {
    const motivations = [
      "Bugün harika gidiyorsun! Devam et! 💪",
      "Hedeflerine bir adım daha yaklaştın! 🎯",
      "Tutarlılığın seni başarıya götürecek! ⭐",
      "Her küçük adım büyük değişimlere yol açar! 🌟",
    ];

    const randomMotivation =
      motivations[Math.floor(Math.random() * motivations.length)];
    showNotification("Motivasyon", randomMotivation, "info");
  }
}

// AI Report Templates
const aiReportTemplates = [
  {
    condition: () => state.challenge.progress > 30,
    message:
      "Challenge'da çok iyi performans sergiliyorsun! 🔥 Mevcut hızınla hedefe ulaşacaksın. Odaklanma sürelerini biraz daha artırabilirsen daha da iyi olur.",
  },
  {
    condition: () => state.user.xp > 8000,
    message:
      "XP seviyen harika! 🌟 Bu hafta özellikle alışkanlık takibinde başarılısın. Şimdi pomodoro tekniğine daha çok odaklanman zamanı.",
  },
  {
    condition: () => state.challenge.progress < 10,
    message:
      "Challenge'da daha aktif olabilirsin! 🎯 Günde en az 3-4 pomodoro yaparsan hedefe rahatça ulaşırsın. Küçük adımlarla başla!",
  },
  {
    condition: () => true, // default
    message:
      "Genel performansın dengeli! 📊 Tüm alanlarda istikrarlı ilerleme var. Özellikle sabah saatlerinde daha odaklı olduğunu fark ettim.",
  },
];

function getPersonalizedAIReport() {
  for (const template of aiReportTemplates) {
    if (template.condition()) {
      return template.message;
    }
  }
  return aiReportTemplates[aiReportTemplates.length - 1].message;
}

// Enhanced AI report generation
async function generatePersonalizedAIReport() {
  const personalizedMessage = getPersonalizedAIReport();

  const messageEl = document.getElementById("aiCoachMessage");
  if (messageEl) {
    messageEl.textContent = personalizedMessage;
  }

  state.ai.lastReport = {
    content: personalizedMessage,
    timestamp: new Date(),
  };

  // Save updated state
  saveState();
}

// Page visibility and focus handling
function handleVisibilityChange() {
  if (!document.hidden) {
    // Page became visible, refresh data
    updateMiniActivities();
    updateCommunityStats();

    // Update welcome message
    updateWelcomeMessage();

    // Show welcome back notification if user was away for more than 30 minutes
    const lastActivity = localStorage.getItem("grindmind_last_activity");
    if (lastActivity) {
      const timeDiff = Date.now() - parseInt(lastActivity);
      if (timeDiff > 30 * 60 * 1000) {
        // 30 minutes
        setTimeout(() => {
          showNotification(
            "Tekrar Hoş Geldin! 👋",
            "Seni tekrar burada görmek güzel! Hedeflerine devam etmeye hazır mısın?",
            "info"
          );
        }, 1000);
      }
    }
  }

  // Update last activity timestamp
  localStorage.setItem("grindmind_last_activity", Date.now().toString());
}

// Enhanced initialization with state management
function enhancedInitialization() {
  console.log("🚀 Enhanced GRINDMIND Dashboard initializing...");

  try {
    // Load saved state first
    const stateLoaded = loadState();

    // Setup event handlers
    setupEventHandlers();

    // Update UI with loaded state
    if (stateLoaded) {
      updateUIWithState();
    }

    // Update welcome message
    updateWelcomeMessage();

    // Initialize progress ring
    updateProgressRing();

    // Start enhanced activity simulation
    setInterval(enhancedActivitySimulation, 3000); // Every 3 seconds

    // Save state periodically
    setInterval(saveState, 30000); // Every 30 seconds

    // Handle page visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    // Generate initial AI report if none exists
    if (!state.ai.lastReport) {
      setTimeout(() => {
        generatePersonalizedAIReport();
      }, 2000);
    }

    // Welcome notification
    setTimeout(() => {
      const messages = [
        "GRINDMIND'a hoş geldin! Bugün hangi hedefini gerçekleştireceksin? 🎯",
        "Harika! Dashboard'ın hazır. Hemen bir pomodoro ile başlamaya ne dersin? ⏱️",
        "Merhaba! Bugün kendini geliştirmek için mükemmel bir gün! 🌟",
      ];

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      showNotification("Hoş Geldin! 🎉", randomMessage, "success");
    }, 1500);

    console.log("✅ Enhanced Dashboard loaded successfully!");
  } catch (error) {
    console.error("❌ Error initializing enhanced dashboard:", error);
    showNotification(
      "Başlatma Hatası",
      "Dashboard yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.",
      "error"
    );
  }
}

// Enhanced cleanup on page unload
window.addEventListener("beforeunload", () => {
  saveState();
  localStorage.setItem("grindmind_last_activity", Date.now().toString());
});

// Override the basic initialization with enhanced version
document.removeEventListener("DOMContentLoaded", initializeDashboard);
document.addEventListener("DOMContentLoaded", enhancedInitialization);

// Enhanced Global API
window.grindmindAPI = {
  // Basic functions
  createPost,
  updateChallengeProgress,
  updateUserXP,
  showNotification,
  hideNotification,
  generateAIReport,
  joinChallenge,

  // Enhanced functions
  generatePersonalizedAIReport,
  saveState,
  loadState,
  updateMiniActivities,
  updateCommunityStats,
  updateStreaks,

  // State management
  getState: () => ({ ...state }),
  setState: (newState) => {
    Object.assign(state, newState);
    saveState();
  },

  // Integration hooks for other pages
  onPomodoroCompleted: (duration = 25) => {
    updateChallengeProgress(1);
    updateUserXP(50);
    showNotification(
      "Pomodoro Tamamlandı!",
      `${duration} dakikalık odaklanma seansı tamamlandı! Harika! ⏱️`,
      "success"
    );
    saveState();
  },

  onHabitCompleted: (habitName) => {
    updateUserXP(25);
    showNotification(
      "Alışkanlık Tamamlandı!",
      `${habitName} alışkanlığın başarıyla tamamlandı! ✅`,
      "success"
    );
    updateStreaks();
    saveState();
  },

  onTaskCompleted: (taskName, priority = "normal") => {
    const xpBonus = priority === "high" ? 50 : 30;
    updateUserXP(xpBonus);
    showNotification(
      "Görev Tamamlandı!",
      `${taskName} görevi başarıyla tamamlandı! 📝`,
      "success"
    );
    saveState();
  },

  onWeightLogged: (weight, change) => {
    updateUserXP(20);
    const message =
      change > 0
        ? `Kilo takibi güncellendi: ${weight}kg (+${change}kg)`
        : `Kilo takibi güncellendi: ${weight}kg (${change}kg)`;
    showNotification("Kilo Kaydedildi!", message, "info");
    saveState();
  },

  onStudyCompleted: (subject, duration) => {
    updateUserXP(40);
    showNotification(
      "Çalışma Tamamlandı!",
      `${subject} konusunda ${duration} dakika çalıştın! 📚`,
      "success"
    );
    saveState();
  },

  onAddictionDayPassed: (days) => {
    updateUserXP(100);
    showNotification(
      "Temiz Kalma Günü!",
      `${days} gündür temiz kalıyorsun! Harika disiplin! 🚫`,
      "success"
    );
    updateStreaks();
    saveState();
  },

  // Debug functions
  debug: {
    clearState: () => {
      localStorage.removeItem("grindmind_dashboard_state");
      location.reload();
    },
    addXP: (amount) => updateUserXP(amount),
    joinChallenge: () => joinChallenge(),
    completeChallenge: () => {
      state.challenge.progress = state.challenge.total;
      updateProgressRing();
      updateLeaderboard();
      showNotification("Debug", "Challenge tamamlandı!", "success");
    },
    showState: () => console.log(state),
  },
};
// Global State
const state = {
  user: {
    name: "Test User",
    email: "test@test.com",
    level: 28,
    xp: 8200,
    isLoggedIn: true,
  },
  challenge: {
    isJoined: false,
    progress: 0,
    total: 50,
    timeLeft: "2 gün",
  },
  posts: [],
  notifications: [],
  ai: {
    isGenerating: false,
    lastReport: null,
  },
};

// Utility Functions
function formatTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "şimdi";
  if (diff < 3600) return Math.floor(diff / 60) + "dk";
  if (diff < 86400) return Math.floor(diff / 3600) + "s";
  return Math.floor(diff / 86400) + "g";
}

function showNotification(title, message, type = "info") {
  const toast = document.getElementById("notificationToast");
  const titleEl = toast.querySelector(".notification-title");
  const messageEl = toast.querySelector(".notification-message");
  const iconEl = toast.querySelector(".notification-icon");

  const icons = {
    success: "🎉",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  titleEl.textContent = title;
  messageEl.textContent = message;
  iconEl.textContent = icons[type] || icons.info;

  toast.classList.add("show");

  setTimeout(() => {
    hideNotification();
  }, 4000);
}

function hideNotification() {
  const toast = document.getElementById("notificationToast");
  toast.classList.remove("show");
}

function updateWelcomeMessage() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Günaydın";
  } else if (hour < 18) {
    greeting = "İyi öğleden sonra";
  } else {
    greeting = "İyi akşamlar";
  }

  const welcomeTitle = document.getElementById("welcomeTitle");
  if (welcomeTitle) {
    welcomeTitle.innerHTML = `${greeting}, ${state.user.name}! 👋`;
  }
}

// Profile Dropdown Functions
function toggleProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.classList.toggle("show");
}

function handleSettings() {
  showNotification("Ayarlar", "Ayarlar sayfası yakında eklenecek!", "info");
  toggleProfileDropdown();
}

function handleLogout() {
  if (confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
    showNotification("Çıkış", "Başarıyla çıkış yapıldı. Güle güle!", "success");
    setTimeout(() => {
      window.location.href = "login.html"; // Login sayfasına yönlendir
    }, 2000);
  }
  toggleProfileDropdown();
}

// Challenge Functions
function joinChallenge() {
  state.challenge.isJoined = true;

  // UI'ı güncelle
  document.getElementById("challengeJoin").style.display = "none";
  document.getElementById("challengeActive").style.display = "block";

  // Notification göster
  showNotification(
    "Challenge'a Katıldın!",
    "Artık Odak Savaşçısı challenge'ının bir parçasısın! 🔥",
    "success"
  );

  // Lider tablosunu güncelle
  updateLeaderboard();

  // XP ver
  updateUserXP(50);
}

function updateChallengeProgress(increment = 1) {
  if (!state.challenge.isJoined) return;

  state.challenge.progress = Math.min(
    state.challenge.progress + increment,
    state.challenge.total
  );

  // Progress ring'i güncelle
  updateProgressRing();

  // Lider tablosunu güncelle
  updateLeaderboard();

  // Challenge tamamlandı mı kontrol et
  if (state.challenge.progress >= state.challenge.total) {
    showNotification(
      "Challenge Tamamlandı!",
      "Tebrikler! Odak Savaşçısı challenge'ını tamamladın! 🏆",
      "success"
    );
    updateUserXP(500);
  }
}

function updateProgressRing() {
  const progressEl = document.getElementById("challengeProgress");
  const progressRing = document.querySelector(".progress-ring");

  if (progressEl) {
    progressEl.textContent = `${state.challenge.progress}/${state.challenge.total}`;
  }

  if (progressRing) {
    const percentage = (state.challenge.progress / state.challenge.total) * 360;
    progressRing.style.background = `conic-gradient(
      var(--accent-color) 0deg ${percentage}deg,
      var(--secondary-bg) ${percentage}deg 360deg
    )`;
  }
}

function updateLeaderboard() {
  const currentUserItem = document.querySelector(
    ".leaderboard-mini .current-user"
  );
  if (currentUserItem) {
    const userHours = state.challenge.progress;
    currentUserItem.innerHTML = `🥈 Sen - ${state.challenge.progress}/${state.challenge.total} (${userHours} saat)`;
  }
}

// AI Coach Functions
async function generateAIReport() {
  // Gerçek AI entegrasyonunu kullan
  if (window.aiCoach) {
    await window.aiCoach.generatePersonalizedReport();
  } else {
    // AI Coach yüklenmemişse hata mesajı
    showNotification(
      "AI Hata",
      "AI Coach henüz yüklenmedi. Lütfen sayfayı yenileyin.",
      "error"
    );
  }
}

// Post Functions
function createPost() {
  const input = document.querySelector(".post-input");
  const content = input.value.trim();

  if (!content) {
    showNotification("Hata", "Paylaşım içeriği boş olamaz!", "error");
    return;
  }

  if (content.length > 500) {
    showNotification("Hata", "Paylaşım çok uzun! (Max 500 karakter)", "error");
    return;
  }

  const post = {
    id: Date.now(),
    content: content,
    author: "Sen",
    timestamp: new Date(),
    likes: 0,
    comments: [],
    isLiked: false,
  };

  addPostToFeed(post);
  input.value = "";

  showNotification(
    "Başarılı!",
    "Paylaşımın toplulukla paylaşıldı! 🎉",
    "success"
  );

  // XP ver
  updateUserXP(25);
}

function addPostToFeed(post) {
  const feedPosts = document.querySelector(".feed-posts");
  if (!feedPosts) return;

  const postElement = createPostElement(post);
  feedPosts.insertBefore(postElement, feedPosts.firstChild);

  state.posts.unshift(post);

  // En fazla 10 post tut
  const posts = feedPosts.querySelectorAll(".post-item");
  if (posts.length > 10) {
    posts[posts.length - 1].remove();
    state.posts.pop();
  }
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "post-item fade-in-up";
  postElement.setAttribute("data-post-id", post.id);

  postElement.innerHTML = `
    <div class="user-info">
      <div class="user-avatar-small" style="background: var(--gradient-primary);"></div>
      <span><strong>${post.author}</strong> · ${formatTime(
    post.timestamp
  )}</span>
    </div>
    <div class="post-content">${post.content}</div>
    <div class="post-actions">
      <button class="post-action-btn like-btn ${
        post.isLiked ? "active" : ""
      }" data-post-id="${post.id}" onclick="toggleLikePost(this)">
        ❤️ <span class="count">${post.likes}</span>
      </button>
      <button class="post-action-btn comment-btn" data-post-id="${
        post.id
      }" onclick="toggleComments('${post.id}')">
        💬 <span class="count">${post.comments.length}</span>
      </button>
    </div>
    <div class="post-comments" id="comments-${post.id}" style="display: none;">
      <div class="comments-container">
        ${post.comments
          .map(
            (comment) => `
          <div class="comment">
            <strong>${comment.author}:</strong> ${comment.content}
          </div>
        `
          )
          .join("")}
      </div>
      <div class="add-comment">
        <input type="text" class="comment-input" placeholder="Yorum yazın..." onkeypress="handleCommentSubmit(event, '${
          post.id
        }')">
        <button class="comment-submit-btn" onclick="submitComment('${
          post.id
        }')">Gönder</button>
      </div>
    </div>
  `;

  return postElement;
}

function toggleLikePost(button) {
  const postId = button.getAttribute("data-post-id");
  const countEl = button.querySelector(".count");
  const currentCount = parseInt(countEl.textContent);

  // State'de post bul
  let post = state.posts.find((p) => p.id == postId);

  // Eğer state'de yoksa (sample postlar için) DOM'dan çalış
  if (!post) {
    const isLiked = button.classList.contains("active");
    const newCount = isLiked ? currentCount - 1 : currentCount + 1;

    button.classList.toggle("active", !isLiked);
    countEl.textContent = newCount;

    // Animasyon ekle
    button.classList.add("success-animation");
    setTimeout(() => {
      button.classList.remove("success-animation");
    }, 600);

    if (!isLiked) {
      updateUserXP(5);
    }
    return;
  }

  // State'deki post için
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;

  button.classList.toggle("active", post.isLiked);
  countEl.textContent = post.likes;

  // Animasyon ekle
  button.classList.add("success-animation");
  setTimeout(() => {
    button.classList.remove("success-animation");
  }, 600);

  if (post.isLiked) {
    updateUserXP(5);
  }
}

function toggleComments(postId) {
  const commentsContainer = document.getElementById(`comments-${postId}`);
  if (commentsContainer) {
    const isVisible = commentsContainer.style.display !== "none";
    commentsContainer.style.display = isVisible ? "none" : "block";

    // Eğer açılıyorsa comment input'a focus yap
    if (!isVisible) {
      setTimeout(() => {
        const commentInput = commentsContainer.querySelector(".comment-input");
        if (commentInput) {
          commentInput.focus();
        }
      }, 100);
    }
  }
}

function handleCommentSubmit(event, postId) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitComment(postId);
  }
}

function submitComment(postId) {
  const commentsContainer = document.getElementById(`comments-${postId}`);
  const commentInput = commentsContainer.querySelector(".comment-input");
  const content = commentInput.value.trim();

  if (!content) {
    showNotification("Hata", "Yorum içeriği boş olamaz!", "error");
    return;
  }

  if (content.length > 200) {
    showNotification("Hata", "Yorum çok uzun! (Max 200 karakter)", "error");
    return;
  }

  const comment = {
    id: Date.now(),
    author: state.user.name,
    content: content,
    timestamp: new Date(),
  };

  // State'de post bul
  let post = state.posts.find((p) => p.id == postId);

  if (post) {
    post.comments.push(comment);
  }

  // UI'ı güncelle
  const commentBtn = document.querySelector(
    `[data-post-id="${postId}"].comment-btn`
  );
  const countEl = commentBtn.querySelector(".count");
  const currentCount = parseInt(countEl.textContent);
  countEl.textContent = currentCount + 1;

  // Yorumu ekle
  const commentsDiv = commentsContainer.querySelector(".comments-container");
  const commentEl = document.createElement("div");
  commentEl.className = "comment";
  commentEl.innerHTML = `<strong>${comment.author}:</strong> ${comment.content}`;
  commentsDiv.appendChild(commentEl);

  // Input'u temizle
  commentInput.value = "";

  showNotification("Başarılı!", "Yorumun eklendi! 💬", "success");
  updateUserXP(10);
  saveState();
}

// User Functions
function updateUserXP(points) {
  state.user.xp += points;

  const xpEl = document.getElementById("userXP");
  if (xpEl) {
    xpEl.textContent = formatNumber(state.user.xp);
    xpEl.classList.add("success-animation");
    setTimeout(() => {
      xpEl.classList.remove("success-animation");
    }, 600);
  }

  // Level kontrolü
  checkLevelUp();
}

function checkLevelUp() {
  const newLevel = Math.floor(state.user.xp / 300) + 1;

  if (newLevel > state.user.level) {
    state.user.level = newLevel;

    const levelEl = document.getElementById("userLevel");
    if (levelEl) {
      levelEl.textContent = state.user.level;
    }

    showNotification(
      "Level Up!",
      `Tebrikler! Level ${state.user.level}'e ulaştın! 🎉`,
      "success"
    );
  }
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

// Activity Simulation
function simulateActivity() {
  // Pomodoro simülasyonu
  if (Math.random() > 0.95) {
    // %5 şans
    updateChallengeProgress(1);
    showNotification(
      "Pomodoro Tamamlandı!",
      "Tebrikler! Bir pomodoro daha tamamladın! ⏱️",
      "success"
    );
    updateUserXP(50);
  }

  // Rastgele bildirimler
  if (Math.random() > 0.98) {
    // %2 şans
    const activities = [
      "Su içme alışkanlığın tamamlandı! 💧",
      "Egzersiz alışkanlığın güncellendi! 🏃",
      "Yeni bir arkadaşın seni takip etmeye başladı! 👥",
      "Haftalık hedefin %80'ini tamamladın! 🎯",
    ];

    const randomActivity =
      activities[Math.floor(Math.random() * activities.length)];
    showNotification("Aktivite Güncellemesi", randomActivity, "info");
  }
}

// Event Handlers
function setupEventHandlers() {
  // Post oluşturma
  const postSubmit = document.querySelector(".post-submit");
  const postInput = document.querySelector(".post-input");

  if (postSubmit) {
    postSubmit.addEventListener("click", createPost);
  }

  if (postInput) {
    postInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        createPost();
      }
    });

    // Auto-resize
    postInput.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  }

  // Post etkileşimleri - sadece like ve comment toggle
  document.addEventListener("click", function (e) {
    // Diğer click handler'lar burada kalacak ama post interactions kaldırıldı
    // çünkü artık inline onclick handlers kullanıyoruz
  });

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

  // Bildirim kapatma
  const notificationClose = document.querySelector(".notification-close");
  if (notificationClose) {
    notificationClose.addEventListener("click", hideNotification);
  }

  // Modal kapatma
  const modal = document.getElementById("commentModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeCommentModal();
      }
    });
  }

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

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideNotification();
      closeCommentModal();
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "Enter":
          if (
            document.getElementById("commentModal").classList.contains("show")
          ) {
            submitComment();
          }
          break;
        case "n":
          if (!e.target.closest("input, textarea")) {
            e.preventDefault();
            postInput?.focus();
          }
          break;
      }
    }
  });
}

// Initialization
function initializeDashboard() {
  console.log("🚀 GRINDMIND Dashboard initializing...");

  try {
    // Event handlers'ı kur
    setupEventHandlers();

    // Hoş geldin mesajını güncelle
    updateWelcomeMessage();

    // Progress ring'i başlat
    updateProgressRing();

    // Aktivite simülasyonunu başlat
    setInterval(simulateActivity, 5000); // Her 5 saniyede bir

    // Hoş geldin bildirimi
    setTimeout(() => {
      showNotification(
        "Hoş Geldin! 🎉",
        "GRINDMIND Dashboard'a hoş geldin! Hedeflerini takip etmeye hazır mısın?",
        "success"
      );
    }, 1000);

    console.log("✅ Dashboard loaded successfully!");
  } catch (error) {
    console.error("❌ Error initializing dashboard:", error);
    showNotification(
      "Başlatma Hatası",
      "Dashboard yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.",
      "error"
    );
  }
}

// Global API
window.grindmindAPI = {
  // Public methods
  createPost,
  updateChallengeProgress,
  updateUserXP,
  showNotification,
  hideNotification,
  generateAIReport,
  joinChallenge,

  // State access
  getState: () => ({ ...state }),

  // Integration hooks
  onPomodoroCompleted: () => {
    updateChallengeProgress(1);
    updateUserXP(50);
    showNotification(
      "Pomodoro Tamamlandı!",
      "Harika! Bir pomodoro daha tamamladın! ⏱️",
      "success"
    );
  },

  onHabitCompleted: (habitName) => {
    updateUserXP(25);
    showNotification(
      "Alışkanlık Tamamlandı!",
      `${habitName} alışkanlığın tamamlandı! ✅`,
      "success"
    );
  },

  onTaskCompleted: (taskName) => {
    updateUserXP(30);
    showNotification(
      "Görev Tamamlandı!",
      `${taskName} görevi tamamlandı! 📝`,
      "success"
    );
  },
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeDashboard);

//
