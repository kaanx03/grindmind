// Navbar işlevleri - Weight Tracker'dan alındı
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

function logout() {
  if (confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
    showNotification("Çıkış yapılıyor... Güle güle! 👋", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
}

// Event Handler'ları kur
function setupEventHandlers() {
  // Mobile Navigation
  const hamburger = document.getElementById("hamburger");
  const mobileClose = document.getElementById("navMobileClose");
  const mobileOverlay = document.getElementById("navMobileOverlay");

  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileNav);
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", closeMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileNav);
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
        "Bildirimler aktif! Yeni özellikler yakında gelecek.",
        "info"
      );
    });
  }

  // Klavye kısayolları
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMobileNav();
    }
  });
}

// Global değişkenler
let tasks = [];
let currentView = "kanban";
let currentWeekOffset = 0;
let draggedTask = null;
let currentTaskDetails = null;

// Görev şablonları
const taskTemplates = {
  daily: [
    {
      title: "Sabah meditasyonu",
      category: "personal",
      priority: "medium",
      estimate: 15,
    },
    {
      title: "Egzersiz yap",
      category: "health",
      priority: "high",
      estimate: 30,
    },
    {
      title: "Günlük planlama",
      category: "work",
      priority: "medium",
      estimate: 15,
    },
    {
      title: "Su içmeyi unutma",
      category: "health",
      priority: "low",
      estimate: 5,
    },
    {
      title: "Akşam değerlendirmesi",
      category: "personal",
      priority: "low",
      estimate: 10,
    },
  ],
  work: [
    {
      title: "E-postaları kontrol et",
      category: "work",
      priority: "medium",
      estimate: 30,
    },
    {
      title: "Proje raporunu hazırla",
      category: "work",
      priority: "high",
      estimate: 120,
    },
    {
      title: "Takım toplantısı",
      category: "work",
      priority: "high",
      estimate: 60,
    },
    {
      title: "Sunum hazırlığı",
      category: "work",
      priority: "medium",
      estimate: 90,
    },
    {
      title: "Müşteri geri dönüşlerini değerlendir",
      category: "work",
      priority: "medium",
      estimate: 45,
    },
  ],
  study: [
    {
      title: "Ders notlarını gözden geçir",
      category: "learning",
      priority: "high",
      estimate: 60,
    },
    { title: "Ödev yap", category: "learning", priority: "high", estimate: 90 },
    {
      title: "Konu tekrarı",
      category: "learning",
      priority: "medium",
      estimate: 45,
    },
    {
      title: "Sınav için çalış",
      category: "learning",
      priority: "high",
      estimate: 120,
    },
    {
      title: "Araştırma yap",
      category: "learning",
      priority: "medium",
      estimate: 60,
    },
  ],
  fitness: [
    {
      title: "Kardiyo antrenmanı",
      category: "health",
      priority: "high",
      estimate: 30,
    },
    {
      title: "Güç antrenmanı",
      category: "health",
      priority: "high",
      estimate: 45,
    },
    {
      title: "Yoga seansı",
      category: "health",
      priority: "medium",
      estimate: 30,
    },
    { title: "Yürüyüş yap", category: "health", priority: "low", estimate: 30 },
    {
      title: "Spor programını planla",
      category: "health",
      priority: "medium",
      estimate: 15,
    },
  ],
  weekend: [
    {
      title: "Ailenle vakit geçir",
      category: "personal",
      priority: "high",
      estimate: 120,
    },
    {
      title: "Film izle",
      category: "personal",
      priority: "low",
      estimate: 120,
    },
    {
      title: "Arkadaşlarla buluş",
      category: "personal",
      priority: "medium",
      estimate: 180,
    },
    {
      title: "Hobi zamanı",
      category: "personal",
      priority: "medium",
      estimate: 60,
    },
    {
      title: "Dinlen ve rahatlat",
      category: "personal",
      priority: "high",
      estimate: 60,
    },
  ],
  cleaning: [
    {
      title: "Evi temizle",
      category: "other",
      priority: "medium",
      estimate: 60,
    },
    {
      title: "Çamaşır yıka",
      category: "other",
      priority: "medium",
      estimate: 30,
    },
    { title: "Bulaşık yıka", category: "other", priority: "low", estimate: 15 },
    {
      title: "Süpür ve paspasla",
      category: "other",
      priority: "low",
      estimate: 30,
    },
    {
      title: "Düzenleme yap",
      category: "other",
      priority: "low",
      estimate: 45,
    },
  ],
};

// Kategori ikonları
const categoryIcons = {
  work: "💼",
  personal: "👤",
  health: "🏥",
  learning: "📚",
  other: "📋",
};

// Görevleri localStorage'dan yükle
function loadTasks() {
  const saved = localStorage.getItem("grindmind_tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
  renderCurrentView();
  updateTaskCounts();
}

// Görevleri localStorage'a kaydet
function saveTasks() {
  localStorage.setItem("grindmind_tasks", JSON.stringify(tasks));
}

// Görünüm değiştir
function switchView(view) {
  currentView = view;

  // Toggle butonlarını güncelle
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-view="${view}"]`).classList.add("active");

  // Görünümleri değiştir
  document
    .querySelectorAll(".kanban-view, .calendar-view, .stats-view")
    .forEach((el) => {
      el.classList.remove("active");
    });
  document.getElementById(`${view}View`).classList.add("active");

  renderCurrentView();
}

// Mevcut görünümü render et
function renderCurrentView() {
  switch (currentView) {
    case "kanban":
      renderKanbanBoard();
      break;
    case "calendar":
      renderWeeklyCalendar();
      break;
    case "stats":
      renderStatistics();
      break;
  }

  // Her render'dan sonra drag&drop listener'larını yeniden kur
  setTimeout(setupDragDropListeners, 100);
}

// Kanban board'u render et - sadece scheduledDay olmayan görevleri göster
function renderKanbanBoard() {
  const todoList = document.getElementById("todoList");
  const inProgressList = document.getElementById("inProgressList");
  const doneList = document.getElementById("doneList");

  // Listeleri temizle
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  // Sadece scheduledDay'i olmayan görevleri kanban'da göster
  const kanbanTasks = tasks.filter((task) => !task.scheduledDay);

  kanbanTasks.forEach((task) => {
    const taskElement = createTaskCard(task);

    switch (task.status) {
      case "todo":
        todoList.appendChild(taskElement);
        break;
      case "in-progress":
        inProgressList.appendChild(taskElement);
        break;
      case "done":
        doneList.appendChild(taskElement);
        break;
    }
  });

  updateTaskCounts();
}

// Görev kartı oluştur
function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.draggable = true;
  card.dataset.taskId = task.id;

  // Bitiş tarihi kontrolü
  let dueDateClass = "";
  let dueDateText = "";
  if (task.dueDate) {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      dueDateClass = "overdue";
      dueDateText = `${Math.abs(diffDays)} gün gecikmiş`;
    } else if (diffDays === 0) {
      dueDateClass = "today";
      dueDateText = "Bugün";
    } else {
      dueDateText = dueDate.toLocaleDateString("tr-TR");
    }
  }

  card.innerHTML = `
    <div class="task-header">
      <div class="task-priority ${task.priority}">${getPriorityText(
    task.priority
  )}</div>
    </div>
    <div class="task-title">${task.title}</div>
    ${
      task.description
        ? `<div class="task-description">${task.description}</div>`
        : ""
    }
    <div class="task-meta">
      <span class="task-category">${
        categoryIcons[task.category]
      } ${getCategoryText(task.category)}</span>
      ${
        task.dueDate
          ? `<span class="task-due-date ${dueDateClass}">${dueDateText}</span>`
          : ""
      }
    </div>
  `;

  // Event listeners
  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);
  card.addEventListener("click", () => showTaskDetails(task.id));

  return card;
}

// Görüntülenen haftaya ait tarihleri hesapla
function getCurrentWeekDates() {
  const today = new Date();
  // currentWeekOffset'i kullanarak doğru haftayı hesapla
  const targetWeek = new Date(
    today.getTime() + currentWeekOffset * 7 * 24 * 60 * 60 * 1000
  );

  // Haftanın pazartesisini bul
  const monday = new Date(targetWeek);
  const dayOfWeek = monday.getDay();
  const diff = monday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Pazar günü 0 olduğu için özel durum
  monday.setDate(diff);

  const weekDates = {};
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  days.forEach((day, index) => {
    const date = new Date(monday.getTime() + index * 24 * 60 * 60 * 1000);
    weekDates[day] = date.toISOString().split("T")[0]; // YYYY-MM-DD formatında
  });

  return weekDates;
}

// Haftalık takvimi render et - tarihe göre filtrelenmiş görevler
function renderWeeklyCalendar() {
  updateWeekDates();

  // Günlük görev listelerini temizle
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  days.forEach((day) => {
    document.getElementById(`${day}Tasks`).innerHTML = "";
  });

  // Mevcut görüntülenen haftanın tarihlerini al
  const weekDates = getCurrentWeekDates();

  console.log("Görüntülenen hafta tarihleri:", weekDates);
  console.log("Current week offset:", currentWeekOffset);

  // Görevleri günlere dağıt
  tasks.forEach((task) => {
    let targetDay = null;

    // 1. Önce scheduledDay'e bak - eğer varsa ve görüntülenen haftadaysa göster
    if (task.scheduledDay && weekDates[task.scheduledDay]) {
      // ScheduledDay varsa ama dueDate de varsa, dueDate'in bu haftada olup olmadığını kontrol et
      if (task.dueDate) {
        const taskDate = task.dueDate;
        // DueDate görüntülenen haftada mı?
        const isInCurrentWeek = Object.values(weekDates).includes(taskDate);
        if (isInCurrentWeek) {
          targetDay = task.scheduledDay;
        }
      } else {
        // DueDate yoksa sadece scheduledDay'e göre göster (eski davranış için)
        // Ama bunun için de bir hafta kontrolü yapalım
        targetDay = task.scheduledDay;
      }
    }
    // 2. ScheduledDay yoksa ama dueDate varsa, tarihe göre yerleştir
    else if (!task.scheduledDay && task.dueDate) {
      const taskDate = task.dueDate;

      // Bu tarih görüntülenen haftada hangi güne denk geliyor?
      Object.keys(weekDates).forEach((day) => {
        if (weekDates[day] === taskDate) {
          targetDay = day;
        }
      });
    }

    // Hedef gün bulunduysa ve scheduledDay varsa görevi yerleştir
    if (targetDay && task.scheduledDay) {
      const dayTasks = document.getElementById(`${targetDay}Tasks`);
      if (dayTasks) {
        const taskElement = createDayTaskCard(task);
        dayTasks.appendChild(taskElement);
      }
    }
  });
}

// Günlük görev kartı oluştur
function createDayTaskCard(task) {
  const card = document.createElement("div");
  card.className = "day-task";
  card.draggable = true;
  card.dataset.taskId = task.id;

  card.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-meta">
      <span class="task-priority ${task.priority}">${getPriorityText(
    task.priority
  )}</span>
      <span class="task-category">${categoryIcons[task.category]}</span>
    </div>
  `;

  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);
  card.addEventListener("click", () => showTaskDetails(task.id));

  return card;
}

// Hafta tarihlerini güncelle
function updateWeekDates() {
  const today = new Date();
  const currentWeek = new Date(
    today.getTime() + currentWeekOffset * 7 * 24 * 60 * 60 * 1000
  );

  // Haftanın pazartesisini bul
  const monday = new Date(currentWeek);
  monday.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);

  // Hafta başlığını güncelle
  const weekStart = monday.toLocaleDateString("tr-TR");
  const weekEnd = new Date(
    monday.getTime() + 6 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("tr-TR");
  document.getElementById(
    "currentWeek"
  ).textContent = `${weekStart} - ${weekEnd}`;

  // Günlük tarihleri güncelle
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  days.forEach((day, index) => {
    const date = new Date(monday.getTime() + index * 24 * 60 * 60 * 1000);
    document.getElementById(`${day}Date`).textContent =
      date.toLocaleDateString("tr-TR");

    // Bugünü vurgula (sadece mevcut haftadaysa)
    const dayElement = document.querySelector(`[data-day="${day}"]`);
    if (
      currentWeekOffset === 0 &&
      date.toDateString() === today.toDateString()
    ) {
      dayElement.classList.add("today");
    } else {
      dayElement.classList.remove("today");
    }
  });
}

// Hafta değiştir
function changeWeek(direction) {
  currentWeekOffset += direction;
  renderWeeklyCalendar();
}

// İstatistikleri render et
function renderStatistics() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const pendingTasks = tasks.filter(
    (t) => t.status === "todo" || t.status === "in-progress"
  ).length;

  // Geciken görevleri hesapla
  const today = new Date();
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;
    const dueDate = new Date(t.dueDate);
    return dueDate < today;
  }).length;

  // İstatistik kartlarını güncelle
  document.getElementById("totalTasks").textContent = totalTasks;
  document.getElementById("completedTasks").textContent = completedTasks;
  document.getElementById("pendingTasks").textContent = pendingTasks;
  document.getElementById("overdueTasks").textContent = overdueTasks;

  // Grafikleri oluştur
  setTimeout(() => {
    createWeeklyPerformanceChart();
    createTaskDistributionChart();
  }, 100);
}

// Haftalık performans grafiği
function createWeeklyPerformanceChart() {
  const ctx = document
    .getElementById("weeklyPerformanceChart")
    .getContext("2d");

  // Son 7 günün verilerini hazırla
  const last7Days = [];
  const completedData = [];
  const createdData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    last7Days.push(date.toLocaleDateString("tr-TR", { weekday: "short" }));

    const completed = tasks.filter(
      (t) =>
        t.status === "done" &&
        t.completedDate &&
        t.completedDate.startsWith(dateStr)
    ).length;

    const created = tasks.filter(
      (t) => t.createdDate && t.createdDate.startsWith(dateStr)
    ).length;

    completedData.push(completed);
    createdData.push(created);
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: last7Days,
      datasets: [
        {
          label: "Tamamlanan",
          data: completedData,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Oluşturulan",
          data: createdData,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

// Görev dağılım grafiği
function createTaskDistributionChart() {
  const ctx = document.getElementById("taskDistributionChart").getContext("2d");

  const statusCounts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Yapılacak", "Devam Ediyor", "Tamamlandı"],
      datasets: [
        {
          data: [
            statusCounts.todo,
            statusCounts["in-progress"],
            statusCounts.done,
          ],
          backgroundColor: ["#f59e0b", "#6366f1", "#10b981"],
          borderWidth: 3,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// Görev sayılarını güncelle - sadece kanban görevleri
function updateTaskCounts() {
  const kanbanTasks = tasks.filter((task) => !task.scheduledDay);

  const todoCount = kanbanTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = kanbanTasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const doneCount = kanbanTasks.filter((t) => t.status === "done").length;

  document.getElementById("todoCount").textContent = todoCount;
  document.getElementById("inProgressCount").textContent = inProgressCount;
  document.getElementById("doneCount").textContent = doneCount;
}

// Yeni görev modal'ını göster
function showAddTaskModal(defaultStatus = "todo", defaultDay = "") {
  document.getElementById("addTaskModal").style.display = "block";

  // Formu temizle
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskPriority").value = "medium";
  document.getElementById("taskCategory").value = "work";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("taskEstimate").value = "60";
  document.getElementById("taskDay").value = defaultDay;

  // Eğer belirli bir gün için görev ekleniyorsa, o günün tarihini dueDate olarak ayarla
  if (defaultDay) {
    const weekDates = getCurrentWeekDates();
    if (weekDates[defaultDay]) {
      document.getElementById("taskDueDate").value = weekDates[defaultDay];
    }
  }

  // Varsayılan durumu sakla
  document.getElementById("addTaskModal").dataset.defaultStatus = defaultStatus;
}

// Yeni görev ekle
function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  if (!title) {
    showNotification("Görev başlığı gerekli!", "error");
    return;
  }

  const defaultStatus =
    document.getElementById("addTaskModal").dataset.defaultStatus || "todo";

  const scheduledDay = document.getElementById("taskDay").value;
  const dueDate = document.getElementById("taskDueDate").value;

  const newTask = {
    id: Date.now(),
    title: title,
    description: document.getElementById("taskDescription").value.trim(),
    priority: document.getElementById("taskPriority").value,
    category: document.getElementById("taskCategory").value,
    status: defaultStatus,
    dueDate: dueDate,
    estimatedTime: parseInt(document.getElementById("taskEstimate").value),
    scheduledDay: scheduledDay,
    createdDate: new Date().toISOString(),
    completedDate: null,
  };

  tasks.push(newTask);
  saveTasks();
  renderCurrentView();
  closeModal("addTaskModal");

  showNotification("🎉 Görev başarıyla eklendi!", "success");
}

// Görev detaylarını göster
function showTaskDetails(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  currentTaskDetails = task;

  document.getElementById("taskDetailsTitle").textContent = task.title;

  const detailsBody = document.getElementById("taskDetailsBody");
  detailsBody.innerHTML = `
    <div class="task-detail-section">
      <h4>📋 Genel Bilgiler</h4>
      <div class="detail-info">
        <strong>Durum:</strong> ${getStatusText(task.status)}<br>
        <strong>Öncelik:</strong> ${getPriorityText(task.priority)}<br>
        <strong>Kategori:</strong> ${
          categoryIcons[task.category]
        } ${getCategoryText(task.category)}<br>
        ${
          task.estimatedTime
            ? `<strong>Tahmini Süre:</strong> ${task.estimatedTime} dakika<br>`
            : ""
        }
        ${
          task.scheduledDay
            ? `<strong>Planlanan Gün:</strong> ${getDayText(
                task.scheduledDay
              )}<br>`
            : ""
        }
        ${
          task.dueDate
            ? `<strong>Bitiş Tarihi:</strong> ${new Date(
                task.dueDate
              ).toLocaleDateString("tr-TR")}<br>`
            : ""
        }
      </div>
    </div>
    
    ${
      task.description
        ? `
    <div class="task-detail-section">
      <h4>📝 Açıklama</h4>
      <div class="detail-info">${task.description}</div>
    </div>
    `
        : ""
    }
    
    <div class="task-detail-section">
      <h4>📅 Zaman Bilgileri</h4>
      <div class="detail-info">
        <strong>Oluşturulma:</strong> ${new Date(
          task.createdDate
        ).toLocaleString("tr-TR")}<br>
        ${
          task.completedDate
            ? `<strong>Tamamlanma:</strong> ${new Date(
                task.completedDate
              ).toLocaleString("tr-TR")}`
            : ""
        }
      </div>
    </div>
  `;

  document.getElementById("taskDetailsModal").style.display = "block";
}

// Görev düzenle
function editTask() {
  if (!currentTaskDetails) return;

  // Düzenleme modal'ını göster (add modal'ını kullan)
  document.getElementById("taskTitle").value = currentTaskDetails.title;
  document.getElementById("taskDescription").value =
    currentTaskDetails.description || "";
  document.getElementById("taskPriority").value = currentTaskDetails.priority;
  document.getElementById("taskCategory").value = currentTaskDetails.category;
  document.getElementById("taskDueDate").value =
    currentTaskDetails.dueDate || "";
  document.getElementById("taskEstimate").value =
    currentTaskDetails.estimatedTime || 60;
  document.getElementById("taskDay").value =
    currentTaskDetails.scheduledDay || "";

  // Modal'ı düzenleme moduna al
  document.getElementById("addTaskModal").dataset.editingId =
    currentTaskDetails.id;
  document.querySelector("#addTaskModal .modal-header h3").textContent =
    "Görev Düzenle";
  document.querySelector("#addTaskModal .modal-btn.btn-primary").textContent =
    "Güncelle";

  closeModal("taskDetailsModal");
  document.getElementById("addTaskModal").style.display = "block";
}

// Görev sil
function deleteTask() {
  if (!currentTaskDetails) return;

  if (
    confirm(
      `"${currentTaskDetails.title}" görevini silmek istediğinizden emin misiniz?`
    )
  ) {
    tasks = tasks.filter((t) => t.id !== currentTaskDetails.id);
    saveTasks();
    renderCurrentView();
    closeModal("taskDetailsModal");
    showNotification("Görev silindi.", "info");
  }
}

// Şablonları göster
function showTemplatesModal() {
  document.getElementById("templatesModal").style.display = "block";
}

// Şablon yükle
function loadTemplate(templateType) {
  const template = taskTemplates[templateType];
  if (!template) return;

  const newTasks = template.map((taskData) => ({
    id: Date.now() + Math.random(),
    title: taskData.title,
    description: "",
    priority: taskData.priority,
    category: taskData.category,
    status: "todo",
    dueDate: "",
    estimatedTime: taskData.estimate,
    scheduledDay: "",
    createdDate: new Date().toISOString(),
    completedDate: null,
  }));

  tasks.push(...newTasks);
  saveTasks();
  renderCurrentView();
  closeModal("templatesModal");

  showNotification(
    `🎉 ${template.length} görev ${getTemplateText(
      templateType
    )} şablonundan eklendi!`,
    "success"
  );
}

// Görevleri dışa aktar
function exportTasks() {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `grindmind-tasks-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification("Görevler dışa aktarıldı!", "success");
}

// Drag & Drop işlemleri
function handleDragStart(e) {
  draggedTask = e.target;
  draggedTask.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", e.target.dataset.taskId);
}

function handleDragEnd(e) {
  if (draggedTask) {
    draggedTask.classList.remove("dragging");

    // Tüm drag-over sınıflarını temizle
    document.querySelectorAll(".task-list, .day-tasks").forEach((list) => {
      list.classList.remove("drag-over");
    });

    draggedTask = null;
  }
}

function allowDrop(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function drop(e) {
  e.preventDefault();

  const taskId = e.dataTransfer.getData("text/plain");
  if (!taskId) return;

  const taskList = e.currentTarget;
  const newStatus = taskList.parentElement.dataset.status;

  // Görsel geri bildirimi kaldır
  taskList.classList.remove("drag-over");

  // Görev durumunu güncelle
  const task = tasks.find((t) => t.id == taskId);
  if (task && task.status !== newStatus) {
    task.status = newStatus;

    // Kanban board'a taşınırsa scheduledDay'i temizle
    if (taskList.closest(".kanban-column")) {
      task.scheduledDay = "";
    }

    if (newStatus === "done" && !task.completedDate) {
      task.completedDate = new Date().toISOString();
    } else if (newStatus !== "done") {
      task.completedDate = null;
    }

    saveTasks();
    renderCurrentView();

    showNotification(
      `Görev "${getStatusText(newStatus)}" durumuna taşındı.`,
      "success"
    );
  }
}

function dropToDay(e, day) {
  e.preventDefault();

  const taskId = e.dataTransfer.getData("text/plain");
  if (!taskId) return;

  const task = tasks.find((t) => t.id == taskId);

  // Görsel geri bildirimi kaldır
  e.currentTarget.classList.remove("drag-over");

  if (task) {
    // Mevcut haftanın tarihlerini al
    const weekDates = getCurrentWeekDates();

    // Görevin planlanan gününü ve tarihini güncelle
    task.scheduledDay = day;
    task.dueDate = weekDates[day]; // Tarihi de otomatik ayarla

    saveTasks();
    renderCurrentView();

    showNotification(`Görev ${getDayText(day)} gününe planlandı.`, "success");
  }
}

// Drag over efektleri için yardımcı fonksiyonlar
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add("drag-over");
}

function handleDragLeave(e) {
  // Sadece gerçekten element'ten çıkıldığında kaldır
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    e.currentTarget.classList.remove("drag-over");
  }
}

// Event listener'ları ayarla
function setupDragDropListeners() {
  // Kanban kolonları için
  document.querySelectorAll(".task-list").forEach((list) => {
    list.addEventListener("dragover", handleDragOver);
    list.addEventListener("dragleave", handleDragLeave);
    list.addEventListener("drop", drop);
  });

  // Haftalık takvim günleri için
  document.querySelectorAll(".day-tasks").forEach((dayTask) => {
    const day = dayTask.parentElement.dataset.day;
    dayTask.addEventListener("dragover", handleDragOver);
    dayTask.addEventListener("dragleave", handleDragLeave);
    dayTask.addEventListener("drop", (e) => dropToDay(e, day));
  });
}

// Yardımcı fonksiyonlar
function getPriorityText(priority) {
  const priorities = {
    low: "Düşük 🟢",
    medium: "Orta 🟡",
    high: "Yüksek 🔴",
  };
  return priorities[priority] || priority;
}

function getCategoryText(category) {
  const categories = {
    work: "İş",
    personal: "Kişisel",
    health: "Sağlık",
    learning: "Öğrenme",
    other: "Diğer",
  };
  return categories[category] || category;
}

function getStatusText(status) {
  const statuses = {
    todo: "Yapılacak",
    "in-progress": "Devam Ediyor",
    done: "Tamamlandı",
  };
  return statuses[status] || status;
}

function getDayText(day) {
  const days = {
    monday: "Pazartesi",
    tuesday: "Salı",
    wednesday: "Çarşamba",
    thursday: "Perşembe",
    friday: "Cuma",
    saturday: "Cumartesi",
    sunday: "Pazar",
  };
  return days[day] || day;
}

function getTemplateText(template) {
  const templates = {
    daily: "Günlük Rutin",
    work: "İş Görevleri",
    study: "Çalışma Planı",
    fitness: "Fitness Programı",
    weekend: "Hafta Sonu",
    cleaning: "Ev İşleri",
  };
  return templates[template] || template;
}

// Modal işlemleri
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";

  // Add modal'ını temizle
  if (modalId === "addTaskModal") {
    delete document.getElementById("addTaskModal").dataset.editingId;
    document.querySelector("#addTaskModal .modal-header h3").textContent =
      "Yeni Görev Ekle";
    document.querySelector("#addTaskModal .modal-btn.btn-primary").textContent =
      "Görev Ekle";
  }
}

// Bildirim göster - Weight Tracker'dan alındı
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = "notification";

  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#6366f1",
  };

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type] || colors.success};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    animation: slideIn 0.5s ease;
    cursor: pointer;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // 5 saniye sonra kaldır
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideIn 0.5s ease reverse";
      setTimeout(() => {
        notification.parentNode.removeChild(notification);
      }, 500);
    }
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

  // Ctrl/Cmd + N - Yeni görev ekle
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    showAddTaskModal();
  }

  // Ctrl/Cmd + S - İstatistikleri göster
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    switchView("stats");
  }

  // Ctrl/Cmd + K - Kanban görünümü
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    switchView("kanban");
  }

  // Ctrl/Cmd + W - Haftalık takvim görünümü
  if ((e.ctrlKey || e.metaKey) && e.key === "w") {
    e.preventDefault();
    switchView("calendar");
  }
});

// Add Task modal'ındaki form submit işlemi
document.addEventListener("DOMContentLoaded", function () {
  const addTaskForm = document.querySelector("#addTaskModal .modal-body");
  if (addTaskForm) {
    addTaskForm.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();

        // Düzenleme modunda mı kontrol et
        const editingId =
          document.getElementById("addTaskModal").dataset.editingId;
        if (editingId) {
          updateTask(parseInt(editingId));
        } else {
          addTask();
        }
      }
    });
  }
});

// Görev güncelleme fonksiyonu
function updateTask(taskId) {
  const title = document.getElementById("taskTitle").value.trim();
  if (!title) {
    showNotification("Görev başlığı gerekli!", "error");
    return;
  }

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  const scheduledDay = document.getElementById("taskDay").value;
  const dueDate = document.getElementById("taskDueDate").value;

  // Görev bilgilerini güncelle
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title,
    description: document.getElementById("taskDescription").value.trim(),
    priority: document.getElementById("taskPriority").value,
    category: document.getElementById("taskCategory").value,
    dueDate: dueDate,
    estimatedTime: parseInt(document.getElementById("taskEstimate").value),
    scheduledDay: scheduledDay,
    updatedDate: new Date().toISOString(),
  };

  saveTasks();
  renderCurrentView();
  closeModal("addTaskModal");

  showNotification("🎉 Görev başarıyla güncellendi!", "success");
}

// Görev arama fonksiyonu
function searchTasks(query) {
  if (!query) return tasks;

  query = query.toLowerCase();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      getCategoryText(task.category).toLowerCase().includes(query)
  );
}

// Otomatik kaydetme sistemi
let autoSaveTimeout;
function autoSave() {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    saveTasks();
  }, 1000);
}

// Performans istatistikleri
function getProductivityStats() {
  const today = new Date();
  const thisWeek = [];

  // Bu haftanın günlerini al
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    thisWeek.push(date.toISOString().split("T")[0]);
  }

  const thisWeekCompleted = tasks.filter(
    (t) =>
      t.status === "done" &&
      t.completedDate &&
      thisWeek.some((day) => t.completedDate.startsWith(day))
  ).length;

  const thisWeekCreated = tasks.filter(
    (t) =>
      t.createdDate && thisWeek.some((day) => t.createdDate.startsWith(day))
  ).length;

  return {
    weeklyCompletion: thisWeekCompleted,
    weeklyCreation: thisWeekCreated,
    completionRate:
      thisWeekCreated > 0
        ? Math.round((thisWeekCompleted / thisWeekCreated) * 100)
        : 0,
  };
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", function () {
  console.log("📋 Planlama & Görevler sayfası yüklendi");

  // Event handler'ları kur
  setupEventHandlers();

  // Görevleri yükle
  loadTasks();

  // Varsayılan olarak kanban görünümünü göster
  switchView("kanban");

  // Haftalık takvim için bugünün tarihini ayarla
  updateWeekDates();

  // Otomatik kaydetme için event listener'lar ekle
  document.addEventListener("input", autoSave);
  document.addEventListener("change", autoSave);
});

// Debug fonksiyonu
window.debugTasks = function () {
  console.log("=== GÖREV LİSTESİ DEBUG ===");
  console.log("Toplam görev sayısı:", tasks.length);
  console.log("Görevler:", tasks);
  console.log("Performans istatistikleri:", getProductivityStats());
  console.log(
    "Kanban görevleri:",
    tasks.filter((task) => !task.scheduledDay)
  );
  console.log(
    "Planlı görevler:",
    tasks.filter((task) => task.scheduledDay)
  );
  console.log("Mevcut hafta offset:", currentWeekOffset);
  console.log("Mevcut hafta tarihleri:", getCurrentWeekDates());

  // Haftalık program için detaylı debug
  console.log("--- HAFTALIK PROGRAM DEBUG ---");
  const weekDates = getCurrentWeekDates();
  Object.keys(weekDates).forEach((day) => {
    const dayTasks = tasks.filter((task) => {
      return (
        task.scheduledDay === day &&
        task.dueDate &&
        Object.values(weekDates).includes(task.dueDate)
      );
    });
    console.log(
      `${day} (${weekDates[day]}):`,
      dayTasks.length,
      "görev",
      dayTasks
    );
  });
};
