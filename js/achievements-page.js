// GRINDMIND Achievements Page - Tam Modern Pagination Kodu
// =============================================================

// Karakter gelişim aşamaları - 8 Level
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

// Sayfa yüklendiğinde
document.addEventListener("DOMContentLoaded", function () {
  initializeAchievementsPage();
});

// Achievement güncellemelerini dinle
window.addEventListener("achievementUpdate", (e) => {
  updateCharacterDisplay();
  updateAchievementDisplay();
});

// Storage değişikliklerini dinle
window.addEventListener("storage", (e) => {
  if (e.key === "grindmind_achievements") {
    updateCharacterDisplay();
    updateAchievementDisplay();
  }
});

// Ana başlatma fonksiyonu
function initializeAchievementsPage() {
  addModernPaginationStyles();
  updateCharacterDisplay();
  loadAchievements();
  setupEventListeners();
}

// FORCE PROGRESS BAR FIX
function forceFixProgressBar() {
  const savedData = localStorage.getItem("grindmind_achievements");
  if (!savedData) return;

  const data = JSON.parse(savedData);
  const level = data.level || 1;
  const points = data.points || 0;
  const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200];

  let progress = 0;
  let nextLevelXP = 100;

  if (level >= 8) {
    progress = 100;
    nextLevelXP = "MAX";
  } else {
    nextLevelXP = levelThresholds[level];
    progress = Math.min((points / nextLevelXP) * 100, 100);
  }

  const elements = {
    currentXP: document.getElementById("currentXP"),
    nextLevelXP: document.getElementById("nextLevelXP"),
    progressFill: document.getElementById("levelProgressFill"),
    progressText: document.getElementById("progressText"),
  };

  if (elements.currentXP) elements.currentXP.textContent = points;
  if (elements.nextLevelXP) elements.nextLevelXP.textContent = nextLevelXP;
  if (elements.progressFill) {
    elements.progressFill.style.transition = "none";
    elements.progressFill.style.width = progress + "%";
    setTimeout(() => {
      elements.progressFill.style.transition = "width 0.3s ease";
    }, 100);
  }
  if (elements.progressText) {
    elements.progressText.textContent = Math.round(progress) + "%";
  }
}

// Karakter görünümünü güncelle
function updateCharacterDisplay() {
  const forceData = localStorage.getItem("grindmind_achievements");
  let achievementData;

  if (forceData) {
    achievementData = JSON.parse(forceData);
  } else {
    achievementData = { level: 1, points: 0, unlocked: [] };
  }

  const currentLevel = achievementData.level || 1;
  const currentXP = achievementData.points || 0;

  updateCharacterInfo(currentLevel, currentXP);
  updateCharacterVisual(currentLevel);
  updateEvolutionPath(currentLevel);
  updateLevelProgress(currentLevel, currentXP);
  updateEvolutionCards(currentLevel);
  forceFixProgressBar();
}

// Karakter bilgilerini güncelle
function updateCharacterInfo(level, xp) {
  const character = CHARACTER_EVOLUTION[level] || CHARACTER_EVOLUTION[1];
  const levelElement = document.getElementById("characterLevel");
  const titleElement = document.getElementById("characterTitle");

  if (levelElement) levelElement.textContent = `Level ${level}`;
  if (titleElement) titleElement.textContent = character.title;
}

// Karakter görselini güncelle
function updateCharacterVisual(level) {
  const character = CHARACTER_EVOLUTION[level] || CHARACTER_EVOLUTION[1];
  const characterAvatar = document.getElementById("characterAvatar");
  const characterFace = characterAvatar?.querySelector(".character-face");
  const characterEquipment = document.getElementById("characterEquipment");

  if (characterFace) characterFace.textContent = character.emoji;
  if (characterEquipment) characterEquipment.textContent = character.equipment;
  if (characterAvatar) characterAvatar.style.background = character.background;
}

// Evrim yolunu güncelle
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

// Evolution kartlarını güncelle - DÜZELTİLDİ
function updateEvolutionCards(currentLevel) {
  const evolutionCards = document.querySelectorAll(".evolution-card");

  evolutionCards.forEach((card, index) => {
    const cardLevel = index + 1;

    // Tüm class'ları temizle
    card.classList.remove("current-level", "completed-level");

    if (cardLevel === currentLevel) {
      // Mevcut level - sarı arka plan
      card.classList.add("current-level");
    } else if (cardLevel < currentLevel) {
      // Geçilmiş level'lar - yeşil arka plan
      card.classList.add("completed-level");
    }
    // Henüz ulaşılmamış level'lar - varsayılan gri arka plan
  });
}

// Level ilerlemesini güncelle
function updateLevelProgress(level, currentXP) {
  const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200];

  let levelProgress;
  if (window.achievementAPI && window.achievementAPI.getLevelProgress) {
    levelProgress = window.achievementAPI.getLevelProgress(currentXP, level);
  } else {
    const nextLevelStart =
      levelThresholds[level] || levelThresholds[levelThresholds.length - 1];
    const progress = Math.min((currentXP / nextLevelStart) * 100, 100);

    levelProgress = {
      current: currentXP,
      needed: nextLevelStart,
      progress: Math.round(progress),
      nextLevelTotal: nextLevelStart,
    };
  }

  const currentXPElement = document.getElementById("currentXP");
  const nextLevelXPElement = document.getElementById("nextLevelXP");

  if (currentXPElement) currentXPElement.textContent = currentXP;
  if (nextLevelXPElement) {
    if (level >= 8) {
      nextLevelXPElement.textContent = "MAX";
    } else {
      nextLevelXPElement.textContent = levelProgress.nextLevelTotal;
    }
  }

  const progressFill = document.getElementById("levelProgressFill");
  const progressText = document.getElementById("progressText");

  if (progressFill) {
    progressFill.style.transition = "none";
    progressFill.style.width = `${levelProgress.progress}%`;
    setTimeout(() => {
      progressFill.style.transition = "width 0.3s ease";
    }, 50);
  }
  if (progressText) {
    progressText.textContent = `${levelProgress.progress}%`;
  }

  const nextReward = getNextReward(level);
  const nextRewardElement = document.getElementById("nextReward");
  if (nextRewardElement) nextRewardElement.textContent = nextReward;
}

// Sonraki ödülü belirle
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

// Achievement verilerini al
function getAchievementData() {
  const saved = localStorage.getItem("grindmind_achievements");
  if (saved) {
    const data = JSON.parse(saved);
    return data;
  }
  return { level: 1, points: 0, unlocked: [] };
}

// Achievement'ları yükle
async function loadAchievements() {
  try {
    let achievementDatabase;

    if (window.achievementAPI) {
      achievementDatabase = window.achievementAPI.getAchievementDatabase();
    }

    if (!achievementDatabase) {
      const response = await fetch("./achievements.json");
      const data = await response.json();
      achievementDatabase = data.ACHIEVEMENT_DATABASE;
    }

    if (achievementDatabase) {
      displayAchievements(achievementDatabase);
      updateAchievementStats(achievementDatabase);
    }
  } catch (error) {
    const grid = document.getElementById("achievementsGrid");
    if (grid) {
      grid.innerHTML = `
        <div class="loading-message">
          <p>❌ Achievement'lar yüklenemedi</p>
        </div>
      `;
    }
  }
}

// MODERN PAGINATION - Achievement'ları göster
function displayAchievements(database) {
  const grid = document.getElementById("achievementsGrid");
  if (!grid) return;

  const achievementData = getAchievementData();
  const unlockedIds = achievementData.unlocked
    ? achievementData.unlocked.map((a) => a.id)
    : [];

  // Tüm achievement'ları topla ve sırala
  const allAchievements = [];
  Object.keys(database).forEach((category) => {
    database[category].forEach((achievement) => {
      const isUnlocked = unlockedIds.includes(achievement.id);
      allAchievements.push({
        ...achievement,
        category: category,
        isUnlocked: isUnlocked,
      });
    });
  });

  // Unlocked olanları önce göster
  allAchievements.sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;
    return 0;
  });

  // İlk 12 achievement'ı göster
  const itemsPerPage = 12;
  const totalPages = Math.ceil(allAchievements.length / itemsPerPage);

  function renderPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageAchievements = allAchievements.slice(startIndex, endIndex);

    const achievementCards = pageAchievements
      .map((achievement) => createAchievementCard(achievement))
      .join("");

    const paginationControls = createModernPaginationControls(
      page,
      totalPages,
      allAchievements.length
    );

    grid.innerHTML = `
      <div class="achievements-container">
        <div class="achievements-list">
          ${achievementCards}
        </div>
        ${paginationControls}
      </div>
    `;

    // Animasyon
    setTimeout(() => {
      const cards = grid.querySelectorAll(".achievement-card");
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 50);
      });
    }, 100);

    // Event listeners
    setupModernPaginationEvents(allAchievements, itemsPerPage);
  }

  // İlk sayfayı render et
  renderPage(1);
}

// Modern pagination kontrollerini oluştur - YENİ MİNİMAL TASARIM
function createModernPaginationControls(currentPage, totalPages, totalItems) {
  if (totalPages <= 1) return "";

  return `
    <div class="clean-pagination">
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
      
      <button class="show-all-simple" id="showAllBtn">
        Tümünü Göster (${totalItems})
      </button>
    </div>
  `;
}

// Sayfa numaralarını oluştur - BASİT
function createPageNumbers(currentPage, totalPages) {
  let pages = "";
  const maxVisible = window.innerWidth < 768 ? 3 : 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  // Eğer sağ tarafta boşluk varsa, sol tarafa kaydır
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // İlk sayfa
  if (startPage > 1) {
    pages += `<button class="page-num" data-page="1">1</button>`;
    if (startPage > 2) {
      pages += `<span class="dots">...</span>`;
    }
  }

  // Orta sayfalar
  for (let i = startPage; i <= endPage; i++) {
    const active = i === currentPage ? "active" : "";
    pages += `<button class="page-num ${active}" data-page="${i}">${i}</button>`;
  }

  // Son sayfa
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages += `<span class="dots">...</span>`;
    }
    pages += `<button class="page-num" data-page="${totalPages}">${totalPages}</button>`;
  }

  return pages;
}

// Sayfa numaralarını da dinle
function setupModernPaginationEvents(allAchievements, itemsPerPage) {
  const paginationBtns = document.querySelectorAll(".pagination-btn");
  const pageNums = document.querySelectorAll(".page-num");
  const showAllBtn = document.getElementById("showAllBtn");

  // Navigation butonları
  paginationBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page);
      if (page && !btn.disabled) {
        renderAchievementPage(allAchievements, page, itemsPerPage);
      }
    });
  });

  // Sayfa numaraları
  pageNums.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page);
      if (page) {
        renderAchievementPage(allAchievements, page, itemsPerPage);
      }
    });
  });

  // Tümünü göster butonu
  if (showAllBtn) {
    showAllBtn.addEventListener("click", () => {
      showAllAchievements(allAchievements);
    });
  }
}

// Belirli bir sayfayı render et
function renderAchievementPage(allAchievements, page, itemsPerPage) {
  const grid = document.getElementById("achievementsGrid");
  const totalPages = Math.ceil(allAchievements.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageAchievements = allAchievements.slice(startIndex, endIndex);

  const achievementCards = pageAchievements
    .map((achievement) => createAchievementCard(achievement))
    .join("");

  const paginationControls = createModernPaginationControls(
    page,
    totalPages,
    allAchievements.length
  );

  grid.innerHTML = `
    <div class="achievements-container">
      <div class="achievements-list">
        ${achievementCards}
      </div>
      ${paginationControls}
    </div>
  `;

  // Animasyon
  setTimeout(() => {
    const cards = grid.querySelectorAll(".achievement-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 50);
    });
  }, 100);

  // Event listener'ları tekrar kur
  setupModernPaginationEvents(allAchievements, itemsPerPage);

  // Sayfanın başına kaydır
  document.querySelector(".achievements-section").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Tüm achievement'ları göster
function showAllAchievements(allAchievements) {
  const grid = document.getElementById("achievementsGrid");

  // Loading göster
  grid.innerHTML = `
    <div class="loading-message">
      <div class="loading-spinner"></div>
      <p>Tüm başarılar yükleniyor...</p>
    </div>
  `;

  // Biraz bekle, sonra tümünü göster
  setTimeout(() => {
    const achievementCards = allAchievements
      .map((achievement) => createAchievementCard(achievement))
      .join("");

    grid.innerHTML = `
      <div class="achievements-container">
        <div class="achievements-all-header">
          <h3>📋 Tüm Başarılar (${allAchievements.length})</h3>
          <button class="back-to-pages-btn" id="backToPagesBtn">
            ← Sayfalara Dön
          </button>
        </div>
        <div class="achievements-list all-achievements">
          ${achievementCards}
        </div>
      </div>
    `;

    // Sayfalara dön butonu
    document.getElementById("backToPagesBtn").addEventListener("click", () => {
      const database = window.achievementAPI?.getAchievementDatabase();
      if (database) {
        displayAchievements(database);
      }
    });

    // Animasyon (daha hızlı)
    setTimeout(() => {
      const cards = grid.querySelectorAll(".achievement-card");
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, Math.min(index * 10, 500));
      });
    }, 100);
  }, 500);
}

// Achievement kartı oluştur
function createAchievementCard(achievement) {
  const statusClass = achievement.isUnlocked ? "unlocked" : "locked";
  const statusIcon = achievement.isUnlocked ? "✅" : "🔒";

  return `
    <div class="achievement-card ${statusClass}" data-category="${achievement.category}" style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">
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

// Achievement istatistiklerini güncelle
function updateAchievementStats(database) {
  const achievementData = getAchievementData();
  const unlockedCount = achievementData.unlocked
    ? achievementData.unlocked.length
    : 0;

  let totalCount = 0;
  Object.keys(database).forEach((category) => {
    totalCount += database[category].length;
  });

  const completionRate =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const unlockedElement = document.getElementById("unlockedCount");
  const totalElement = document.getElementById("totalCount");
  const completionElement = document.getElementById("completionRate");

  if (unlockedElement) unlockedElement.textContent = unlockedCount;
  if (totalElement) totalElement.textContent = totalCount;
  if (completionElement) completionElement.textContent = `${completionRate}%`;
}

// Achievement display'i güncelle
function updateAchievementDisplay() {
  if (window.achievementAPI) {
    const database = window.achievementAPI.getAchievementDatabase();
    if (database) {
      displayAchievements(database);
      updateAchievementStats(database);
    }
  } else {
    loadAchievements();
  }
}

// Event listener'ları kur
function setupEventListeners() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;
      filterAchievements(category);
    });
  });
}

// Achievement'ları filtrele
function filterAchievements(category) {
  const cards = document.querySelectorAll(".achievement-card");

  cards.forEach((card) => {
    const cardCategory = card.dataset.category;

    if (category === "all" || cardCategory === category) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 50);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// Modern pagination CSS'lerini ekle - YENİ MİNİMAL TASARIM
function addModernPaginationStyles() {
  if (document.getElementById("modern-pagination-styles")) return;

  const style = document.createElement("style");
  style.id = "modern-pagination-styles";
  style.textContent = `
    .achievements-container {
      width: 100%;
    }

    .achievements-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.2rem;
      margin-bottom: 2rem;
    }

    .achievements-list.all-achievements {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.2rem;
    }

    /* CLEAN MINIMAL PAGINATION */
    .clean-pagination {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .pagination-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .pagination-btn {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #374151;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .page-num {
      width: 32px;
      height: 32px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      color: #374151;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-num:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .page-num.active {
      background: #6366f1;
      border-color: #6366f1;
      color: white;
    }

    .dots {
      padding: 0 0.5rem;
      color: #9ca3af;
      font-size: 0.9rem;
    }

    .show-all-simple {
      padding: 0.75rem 1.5rem;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #374151;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .show-all-simple:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    .achievements-all-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .achievements-all-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .back-to-pages-btn {
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #374151;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .back-to-pages-btn:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    @media (max-width: 768px) {
      .achievements-list {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .pagination-wrapper {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
      }

      .page-numbers {
        order: -1;
        margin-bottom: 0.5rem;
      }

      .pagination-btn {
        flex: 1;
        min-width: 100px;
        justify-content: center;
      }

      .achievements-all-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .show-all-simple {
        width: 100%;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);
}

// Geri dönüş fonksiyonu
function goBack() {
  window.location.href = "dashboard.html";
}

// Dashboard butonunu güncelle
function updateDashboardButton() {
  window.showAchievementsModal = function () {
    window.location.href = "achievements.html";
  };
}

// Sayfa odaklandığında güncelle
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateCharacterDisplay();
    updateAchievementDisplay();

    if (window.achievementAPI && window.achievementAPI.refreshData) {
      window.achievementAPI.refreshData();
    }
  }
});

// Global fonksiyonlar
window.goBack = goBack;
window.updateDashboardButton = updateDashboardButton;
window.updateCharacterDisplay = updateCharacterDisplay;
window.updateAchievementDisplay = updateAchievementDisplay;
window.forceFixProgressBar = forceFixProgressBar;
