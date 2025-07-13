// GRINDMIND Achievements Page - Modern Pagination & JSON Integration
// ================================================================

// Global variables for achievements
let achievementDatabase = null;
let currentPage = 1;
const itemsPerPage = 12;

// CHARACTER EVOLUTION DATA
const CHARACTER_EVOLUTION = {
  1: {
    emoji: "😊",
    title: "Yeni Başlayan",
    equipment: "",
    background: "linear-gradient(135deg, #ff9a9e, #fecfef)",
  },
  2: {
    emoji: "😎",
    title: "Gelişen Öğrenci",
    equipment: "🕶️",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  3: {
    emoji: "🤓",
    title: "Bilgi Avcısı",
    equipment: "👓",
    background: "linear-gradient(135deg, #10b981, #059669)",
  },
  4: {
    emoji: "🧠",
    title: "Usta Zihin",
    equipment: "🧠",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  },
  5: {
    emoji: "🚀",
    title: "Uzay Kâşifi",
    equipment: "🚀",
    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  },
  6: {
    emoji: "⚡",
    title: "Şimşek Ustası",
    equipment: "⚡",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  7: {
    emoji: "🔥",
    title: "Ateş Efendisi",
    equipment: "🔥",
    background: "linear-gradient(135deg, #eab308, #ca8a04)",
  },
  8: {
    emoji: "👑",
    title: "Efsanevi Kral",
    equipment: "👑",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
};

// Mobile Navigation Functions
function toggleMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("navMobile");
  const overlay = document.getElementById("navMobileOverlay");

  if (hamburger) hamburger.classList.toggle("active");
  if (mobileNav) mobileNav.classList.toggle("show");
  if (overlay) overlay.classList.toggle("show");

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

// Get achievement data from localStorage
function getAchievementData() {
  const saved = localStorage.getItem("grindmind_achievements");
  if (saved) {
    const data = JSON.parse(saved);
    return data;
  }
  return { level: 1, points: 0, unlocked: [] };
}

// Load achievements from JSON file
async function loadAchievements() {
  const grid = document.getElementById("achievementsGrid");

  try {
    console.log("🔄 Achievements yükleniyor...");

    // Show loading state
    if (grid) {
      grid.innerHTML = `
        <div class="loading-message">
          <div class="loading-spinner"></div>
          <p>Başarılar yükleniyor...</p>
        </div>
      `;
    }

    // Try to get from window.achievementAPI first (if available)
    if (window.achievementAPI && window.achievementAPI.getAchievementDatabase) {
      achievementDatabase = window.achievementAPI.getAchievementDatabase();
      console.log("✅ Achievements API'den alındı");
    }

    // If not available, fetch from JSON file
    if (!achievementDatabase) {
      console.log("📡 achievements.json dosyasından yükleniyor...");
      const response = await fetch("./achievements.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      achievementDatabase = data.ACHIEVEMENT_DATABASE;
      console.log(
        "✅ achievements.json başarıyla yüklendi:",
        achievementDatabase
      );
    }

    if (achievementDatabase) {
      displayAchievements();
      updateAchievementStats();
      setupCategoryFilters();

      showNotification(
        "Başarılar Yüklendi",
        "Tüm başarılar başarıyla yüklendi! 🎯",
        "success"
      );
    } else {
      throw new Error("Achievement database bulunamadı");
    }
  } catch (error) {
    console.error("❌ Achievement yükleme hatası:", error);

    if (grid) {
      grid.innerHTML = `
        <div class="loading-message">
          <p>❌ Başarılar yüklenemedi</p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">
            ${error.message}
          </p>
          <button onclick="loadAchievements()" 
                  style="margin-top: 1rem; padding: 0.5rem 1rem; 
                         background: var(--accent-color); color: white; 
                         border: none; border-radius: 0.5rem; cursor: pointer;">
            🔄 Tekrar Dene
          </button>
        </div>
      `;
    }

    showNotification(
      "Yükleme Hatası",
      `Başarılar yüklenemedi: ${error.message}`,
      "error"
    );
  }
}

// Display achievements with pagination
function displayAchievements(categoryFilter = "all") {
  if (!achievementDatabase) {
    console.error("❌ Achievement database mevcut değil");
    return;
  }

  const grid = document.getElementById("achievementsGrid");
  if (!grid) return;

  const achievementData = getAchievementData();
  const unlockedIds = achievementData.unlocked
    ? achievementData.unlocked.map((a) => a.id)
    : [];

  // Collect all achievements
  const allAchievements = [];
  Object.keys(achievementDatabase).forEach((category) => {
    achievementDatabase[category].forEach((achievement) => {
      if (categoryFilter === "all" || category === categoryFilter) {
        const isUnlocked = unlockedIds.includes(achievement.id);
        allAchievements.push({
          ...achievement,
          category: category,
          isUnlocked: isUnlocked,
        });
      }
    });
  });

  // Sort: unlocked first
  allAchievements.sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;
    return 0;
  });

  console.log(
    `📊 Toplam ${allAchievements.length} achievement bulundu (kategori: ${categoryFilter})`
  );

  // Handle empty state
  if (allAchievements.length === 0) {
    grid.innerHTML = `
      <div class="empty-achievements">
        <h3>🔍 Başarı Bulunamadı</h3>
        <p>Bu kategoride henüz başarı bulunmuyor.</p>
        <button onclick="displayAchievements('all')">Tüm Başarıları Göster</button>
      </div>
    `;
    return;
  }

  // Pagination
  const totalPages = Math.ceil(allAchievements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageAchievements = allAchievements.slice(startIndex, endIndex);

  // Create achievement cards
  const achievementCards = pageAchievements
    .map((achievement) => createAchievementCard(achievement))
    .join("");

  // Create pagination
  const paginationHTML = createPaginationControls(
    currentPage,
    totalPages,
    allAchievements.length
  );

  grid.innerHTML = `
    <div class="achievements-container">
      <div class="achievements-list">
        ${achievementCards}
      </div>
      ${paginationHTML}
    </div>
  `;

  // Add animations
  setTimeout(() => {
    const cards = grid.querySelectorAll(".achievement-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 50);
    });
  }, 100);

  // Setup pagination events
  setupPaginationEvents(allAchievements, categoryFilter);
}

// Create achievement card
function createAchievementCard(achievement) {
  const statusClass = achievement.isUnlocked ? "unlocked" : "locked";
  const statusIcon = achievement.isUnlocked ? "✅" : "🔒";

  return `
    <div class="achievement-card ${statusClass}" data-category="${achievement.category}" 
         style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">
      <div class="achievement-header">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <h3>${achievement.title} ${statusIcon}</h3>
          <p>${achievement.description}</p>
        </div>
      </div>
      <div class="achievement-footer">
        <div class="achievement-points">+${achievement.points} XP</div>
        <div class="achievement-rarity ${achievement.rarity}">${achievement.rarity}</div>
      </div>
    </div>
  `;
}

// Create pagination controls
function createPaginationControls(currentPage, totalPages, totalItems) {
  if (totalPages <= 1) return "";

  return `
    <div class="pagination-controls">
      <div class="pagination-wrapper">
        <button class="pagination-btn ${currentPage === 1 ? "disabled" : ""}" 
                data-page="${currentPage - 1}" 
                ${currentPage === 1 ? "disabled" : ""}>
          ← Önceki
        </button>
        
        <div class="page-numbers">
          ${createPageNumbers(currentPage, totalPages)}
        </div>
        
        <button class="pagination-btn ${
          currentPage === totalPages ? "disabled" : ""
        }" 
                data-page="${currentPage + 1}"
                ${currentPage === totalPages ? "disabled" : ""}>
          Sonraki →
        </button>
      </div>
      
      <div class="pagination-info">
        <span>Sayfa ${currentPage} / ${totalPages} • Toplam ${totalItems} başarı</span>
      </div>
    </div>
  `;
}

// Create page numbers
function createPageNumbers(currentPage, totalPages) {
  let pages = "";
  const maxVisible = window.innerWidth < 768 ? 3 : 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // First page
  if (startPage > 1) {
    pages += `<button class="page-num" data-page="1">1</button>`;
    if (startPage > 2) {
      pages += `<span class="dots">...</span>`;
    }
  }

  // Middle pages
  for (let i = startPage; i <= endPage; i++) {
    const active = i === currentPage ? "active" : "";
    pages += `<button class="page-num ${active}" data-page="${i}">${i}</button>`;
  }

  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages += `<span class="dots">...</span>`;
    }
    pages += `<button class="page-num" data-page="${totalPages}">${totalPages}</button>`;
  }

  return pages;
}

// Setup pagination events
function setupPaginationEvents(allAchievements, categoryFilter) {
  const paginationBtns = document.querySelectorAll(".pagination-btn");
  const pageNums = document.querySelectorAll(".page-num");

  paginationBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page);
      if (page && !btn.disabled) {
        currentPage = page;
        displayAchievements(categoryFilter);
        scrollToTop();
      }
    });
  });

  pageNums.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page);
      if (page) {
        currentPage = page;
        displayAchievements(categoryFilter);
        scrollToTop();
      }
    });
  });
}

// Scroll to top of achievements section
function scrollToTop() {
  const achievementsSection = document.querySelector(".achievements-section");
  if (achievementsSection) {
    achievementsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Setup category filters
function setupCategoryFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Reset to first page
      currentPage = 1;

      // Filter achievements
      const category = btn.dataset.category;
      displayAchievements(category);

      console.log(`🔍 Kategori filtresi: ${category}`);

      showNotification(
        "Filtre Uygulandı",
        `${getCategoryName(category)} kategorisi seçildi`,
        "info"
      );
    });
  });
}

// Get category display name
function getCategoryName(category) {
  const categoryNames = {
    all: "Tüm Başarılar",
    pomodoro: "Pomodoro",
    habits: "Alışkanlıklar",
    addiction: "Temizlik",
    tasks: "Görevler",
    general: "Genel",
  };
  return categoryNames[category] || category;
}

// Update achievement statistics
function updateAchievementStats() {
  if (!achievementDatabase) return;

  const achievementData = getAchievementData();
  const unlockedCount = achievementData.unlocked
    ? achievementData.unlocked.length
    : 0;

  let totalCount = 0;
  Object.keys(achievementDatabase).forEach((category) => {
    totalCount += achievementDatabase[category].length;
  });

  const completionRate =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const unlockedElement = document.getElementById("unlockedCount");
  const totalElement = document.getElementById("totalCount");
  const completionElement = document.getElementById("completionRate");

  if (unlockedElement) {
    animateNumber(unlockedElement, 0, unlockedCount, 1000);
  }
  if (totalElement) {
    animateNumber(totalElement, 0, totalCount, 1200);
  }
  if (completionElement) {
    setTimeout(() => {
      if (completionElement)
        completionElement.textContent = `${completionRate}%`;
    }, 800);
  }

  console.log(
    `📈 İstatistikler: ${unlockedCount}/${totalCount} (${completionRate}%)`
  );
}

// Animate number counting
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = Math.floor(start + (end - start) * progress);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Update character display
function updateCharacterDisplay() {
  const achievementData = getAchievementData();
  const currentLevel = achievementData.level || 1;
  const currentXP = achievementData.points || 0;

  updateCharacterInfo(currentLevel, currentXP);
  updateCharacterVisual(currentLevel);
  updateEvolutionPath(currentLevel);
  updateLevelProgress(currentLevel, currentXP);
  updateEvolutionCards(currentLevel);
}

// Update character info
function updateCharacterInfo(level, xp) {
  const character = CHARACTER_EVOLUTION[level] || CHARACTER_EVOLUTION[1];
  const levelElement = document.getElementById("characterLevel");
  const titleElement = document.getElementById("characterTitle");

  if (levelElement) levelElement.textContent = `Level ${level}`;
  if (titleElement) titleElement.textContent = character.title;
}

// Update character visual
function updateCharacterVisual(level) {
  const character = CHARACTER_EVOLUTION[level] || CHARACTER_EVOLUTION[1];
  const characterAvatar = document.getElementById("characterAvatar");
  const characterFace = characterAvatar?.querySelector(".character-face");
  const characterEquipment = document.getElementById("characterEquipment");

  if (characterFace) characterFace.textContent = character.emoji;
  if (characterEquipment) characterEquipment.textContent = character.equipment;
  if (characterAvatar) characterAvatar.style.background = character.background;
}

// Update evolution path
function updateEvolutionPath(currentLevel) {
  const evolutionSteps = document.querySelectorAll(".evolution-step");

  evolutionSteps.forEach((step) => {
    const stepLevel = parseInt(step.dataset.level);
    step.classList.remove("active", "completed");

    if (stepLevel === currentLevel) {
      step.classList.add("active");
    } else if (stepLevel < currentLevel) {
      step.classList.add("completed");
    }
  });
}

// Update evolution cards
function updateEvolutionCards(currentLevel) {
  const evolutionCards = document.querySelectorAll(".evolution-card");

  evolutionCards.forEach((card, index) => {
    const cardLevel = index + 1;

    // Clear all classes
    card.classList.remove("current-level", "completed-level");

    if (cardLevel === currentLevel) {
      card.classList.add("current-level");
    } else if (cardLevel < currentLevel) {
      card.classList.add("completed-level");
    }
  });
}

// Update level progress
function updateLevelProgress(level, currentXP) {
  const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200];

  let progress = 0;
  let nextLevelXP = 100;

  if (level >= 8) {
    progress = 100;
    nextLevelXP = "MAX";
  } else {
    nextLevelXP = levelThresholds[level];
    progress = Math.min((currentXP / nextLevelXP) * 100, 100);
  }

  const currentXPElement = document.getElementById("currentXP");
  const nextLevelXPElement = document.getElementById("nextLevelXP");
  const progressFill = document.getElementById("levelProgressFill");
  const progressText = document.getElementById("progressText");
  const nextRewardElement = document.getElementById("nextReward");

  if (currentXPElement) currentXPElement.textContent = currentXP;
  if (nextLevelXPElement) nextLevelXPElement.textContent = nextLevelXP;

  if (progressFill) {
    progressFill.style.transition = "none";
    progressFill.style.width = `${progress}%`;
    setTimeout(() => {
      progressFill.style.transition = "width 0.3s ease";
    }, 50);
  }

  if (progressText) {
    progressText.textContent = `${Math.round(progress)}%`;
  }

  if (nextRewardElement) {
    const nextReward = getNextReward(level);
    nextRewardElement.textContent = nextReward;
  }
}

// Get next reward text
function getNextReward(level) {
  const rewards = {
    1: "Güneş gözlüğü (Level 2)",
    2: "Akıllı gözlük (Level 3)",
    3: "Beyin gücü (Level 4)",
    4: "Roket gücü (Level 5)",
    5: "Elektrik gücü (Level 6)",
    6: "Ateş gücü (Level 7)",
    7: "Altın taç (Level 8)",
    8: "Maksimum seviye!",
  };
  return rewards[level] || "Yeni karakter görünümü";
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  console.log("🏆 GRINDMIND Başarılar sayfası yüklendi");

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
      logout();
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
      closeMobileNav();
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
        case "1":
          e.preventDefault();
          document.querySelector('[data-category="all"]')?.click();
          break;
        case "2":
          e.preventDefault();
          document.querySelector('[data-category="pomodoro"]')?.click();
          break;
        case "3":
          e.preventDefault();
          document.querySelector('[data-category="habits"]')?.click();
          break;
      }
    }
  });

  // Window resize handler
  window.addEventListener("resize", () => {
    // Re-render pagination if needed
    if (achievementDatabase) {
      const activeFilter =
        document.querySelector(".filter-btn.active")?.dataset.category || "all";
      displayAchievements(activeFilter);
    }
  });

  // Initialize achievements
  setTimeout(() => {
    updateCharacterDisplay();
    loadAchievements();

    showNotification(
      "Sayfa Yüklendi",
      "Başarılar sayfası hazır! Karakterin ve başarıların yükleniyor... 🚀",
      "success"
    );
  }, 500);
});

// Global functions for external access
window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.logout = logout;
window.loadAchievements = loadAchievements;
window.updateCharacterDisplay = updateCharacterDisplay;
