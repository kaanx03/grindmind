// GRINDMIND Statistics JavaScript - Tamamlanmış Versiyon
// ========================================================

// Global variables
let currentTimeFilter = "week";
let charts = {};

// Sample data for different time periods
const sampleData = {
  today: {
    pomodoro: { value: 6, change: "+2 bugün" },
    habits: { value: "75%", change: "+10% bugün" },
    tasks: { value: 4, change: "+1 bugün" },
    weight: { value: "-0.2kg", change: "Bu gün" },
    addictions: { value: 1, change: "+1 gün" },
    study: { value: "2.5h", change: "+30m bugün" },
  },
  week: {
    pomodoro: { value: 24, change: "+15% bu hafta" },
    habits: { value: "87%", change: "+5% bu hafta" },
    tasks: { value: 18, change: "+8% bu hafta" },
    weight: { value: "-1.2kg", change: "Hedef yönünde" },
    addictions: { value: 45, change: "Devam ediyor" },
    study: { value: "12.5h", change: "+20% bu hafta" },
  },
  month: {
    pomodoro: { value: 96, change: "+25% bu ay" },
    habits: { value: "82%", change: "+3% bu ay" },
    tasks: { value: 72, change: "+12% bu ay" },
    weight: { value: "-3.8kg", change: "Harika ilerleme" },
    addictions: { value: 45, change: "Kararlı duruş" },
    study: { value: "48h", change: "+30% bu ay" },
  },
  year: {
    pomodoro: { value: 1152, change: "+40% bu yıl" },
    habits: { value: "79%", change: "+8% bu yıl" },
    tasks: { value: 864, change: "+18% bu yıl" },
    weight: { value: "-12.5kg", change: "Hedef aşıldı!" },
    addictions: { value: 45, change: "Güçlü irade" },
    study: { value: "220h", change: "+45% bu yıl" },
  },
  all: {
    pomodoro: { value: 2304, change: "Toplam" },
    habits: { value: "81%", change: "Ortalama" },
    tasks: { value: 1728, change: "Toplam" },
    weight: { value: "-15.2kg", change: "Toplam değişim" },
    addictions: { value: 45, change: "Mevcut seri" },
    study: { value: "440h", change: "Toplam" },
  },
};

// Chart data for different time periods
const chartData = {
  today: {
    weekly: {
      labels: ["Bugün"],
      pomodoro: [6],
      tasks: [4],
    },
    distribution: {
      labels: ["Pomodoro", "Alışkanlık", "Görevler", "Çalışma", "Diğer"],
      data: [40, 20, 25, 10, 5],
    },
    monthly: {
      labels: ["Bugün"],
      data: [75],
    },
    success: {
      labels: [
        "Pomodoro",
        "Alışkanlık",
        "Görevler",
        "Kilo",
        "Bağımlılık",
        "Çalışma",
      ],
      data: [75, 80, 85, 70, 100, 60],
    },
  },
  week: {
    weekly: {
      labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
      pomodoro: [4, 6, 5, 8, 3, 2, 4],
      tasks: [2, 4, 3, 5, 2, 1, 3],
    },
    distribution: {
      labels: ["Pomodoro", "Alışkanlık", "Görevler", "Çalışma", "Diğer"],
      data: [35, 25, 20, 15, 5],
    },
    monthly: {
      labels: ["1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"],
      data: [65, 78, 82, 91],
    },
    success: {
      labels: [
        "Pomodoro",
        "Alışkanlık",
        "Görevler",
        "Kilo",
        "Bağımlılık",
        "Çalışma",
      ],
      data: [92, 87, 94, 85, 91, 88],
    },
  },
  month: {
    weekly: {
      labels: ["1.Hafta", "2.Hafta", "3.Hafta", "4.Hafta"],
      pomodoro: [18, 22, 26, 30],
      tasks: [12, 16, 18, 20],
    },
    distribution: {
      labels: ["Pomodoro", "Alışkanlık", "Görevler", "Çalışma", "Diğer"],
      data: [38, 22, 18, 17, 5],
    },
    monthly: {
      labels: ["1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"],
      data: [70, 78, 85, 92],
    },
    success: {
      labels: [
        "Pomodoro",
        "Alışkanlık",
        "Görevler",
        "Kilo",
        "Bağımlılık",
        "Çalışma",
      ],
      data: [89, 82, 91, 88, 91, 85],
    },
  },
  year: {
    weekly: {
      labels: [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ],
      pomodoro: [80, 85, 90, 95, 100, 105, 110, 95, 90, 88, 92, 96],
      tasks: [60, 65, 70, 72, 75, 78, 80, 76, 70, 68, 72, 74],
    },
    distribution: {
      labels: ["Pomodoro", "Alışkanlık", "Görevler", "Çalışma", "Diğer"],
      data: [32, 28, 22, 15, 3],
    },
    monthly: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      data: [75, 82, 88, 94],
    },
    success: {
      labels: [
        "Pomodoro",
        "Alışkanlık",
        "Görevler",
        "Kilo",
        "Bağımlılık",
        "Çalışma",
      ],
      data: [88, 79, 89, 92, 91, 83],
    },
  },
  all: {
    weekly: {
      labels: ["2022", "2023", "2024", "2025"],
      pomodoro: [400, 600, 800, 504],
      tasks: [300, 450, 600, 378],
    },
    distribution: {
      labels: ["Pomodoro", "Alışkanlık", "Görevler", "Çalışma", "Diğer"],
      data: [30, 25, 25, 18, 2],
    },
    monthly: {
      labels: ["2022", "2023", "2024", "2025"],
      data: [65, 78, 85, 91],
    },
    success: {
      labels: [
        "Pomodoro",
        "Alışkanlık",
        "Görevler",
        "Kilo",
        "Bağımlılık",
        "Çalışma",
      ],
      data: [85, 81, 87, 89, 91, 82],
    },
  },
};

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  console.log("📊 GRINDMIND İstatistikler sayfası yüklendi");

  // Initialize components
  initializeCharts();
  updateStats();
  initializeEventListeners();
  initializeAnimations();
  initializeAdvancedFeatures();
  monitorPerformance();

  // Welcome notification
  setTimeout(() => {
    showNotification(
      "İstatistikler güncellendi! Harika ilerleme gösteriyorsun! 📈"
    );
  }, 1000);

  // Performance monitoring
  console.log(`⚡ Yükleme süresi: ${performance.now().toFixed(2)}ms`);
});

// Initialize event listeners
function initializeEventListeners() {
  // User interactions
  const notificationBtn = document.getElementById("notificationBtn");
  const userAvatar = document.getElementById("userAvatar");
  const notificationToast = document.getElementById("notificationToast");

  if (notificationBtn) {
    notificationBtn.addEventListener("click", function () {
      showNotification("Bildirimler yakında aktif edilecek! 🔔");
    });
  }

  if (userAvatar) {
    userAvatar.addEventListener("click", function () {
      showNotification("Profil sayfası yakında eklenecek! 👤");
    });
  }

  // Close notification on click
  if (notificationToast) {
    notificationToast.addEventListener("click", function () {
      hideNotification();
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);

  // Window events
  window.addEventListener("error", handleError);
  window.addEventListener("resize", handleResize);
}

// Initialize page animations
function initializeAnimations() {
  // Animate cards on load
  const cards = document.querySelectorAll(
    ".overview-card, .chart-card, .detail-card"
  );
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Change time filter
function changeTimeFilter(period) {
  currentTimeFilter = period;

  // Update active button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Update stats and charts
  updateStats();
  updateCharts();

  showNotification(`İstatistikler ${getPeriodText(period)} için güncellendi!`);
}

// Update stats based on current filter
function updateStats() {
  const data = sampleData[currentTimeFilter];

  Object.keys(data).forEach((key) => {
    const valueEl = document.getElementById(`${key}Stats`);
    const changeEl = document.getElementById(`${key}Change`);

    if (valueEl && changeEl) {
      // Add loading effect
      valueEl.classList.add("loading");

      setTimeout(() => {
        valueEl.textContent = data[key].value;
        changeEl.textContent = data[key].change;

        // Remove loading and add success animation
        valueEl.classList.remove("loading");
        valueEl.classList.add("success-animation");

        setTimeout(() => {
          valueEl.classList.remove("success-animation");
        }, 600);
      }, 300);
    }
  });
}

// Initialize charts
function initializeCharts() {
  try {
    // Weekly Progress Chart
    const weeklyCtx = document.getElementById("weeklyChart");
    if (weeklyCtx) {
      charts.weekly = new Chart(weeklyCtx, {
        type: "line",
        data: {
          labels: chartData[currentTimeFilter].weekly.labels,
          datasets: [
            {
              label: "Pomodoro",
              data: chartData[currentTimeFilter].weekly.pomodoro,
              borderColor: "#ff6b6b",
              backgroundColor: "rgba(255, 107, 107, 0.1)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#ff6b6b",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
            {
              label: "Görevler",
              data: chartData[currentTimeFilter].weekly.tasks,
              borderColor: "#45b7d1",
              backgroundColor: "rgba(69, 183, 209, 0.1)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#45b7d1",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
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
                usePointStyle: true,
                padding: 20,
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: "#6366f1",
              borderWidth: 1,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: "#94a3b8",
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#94a3b8",
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      });
    }

    // Activity Distribution Chart
    const distributionCtx = document.getElementById("distributionChart");
    if (distributionCtx) {
      charts.distribution = new Chart(distributionCtx, {
        type: "doughnut",
        data: {
          labels: chartData[currentTimeFilter].distribution.labels,
          datasets: [
            {
              data: chartData[currentTimeFilter].distribution.data,
              backgroundColor: [
                "#ff6b6b",
                "#4ecdc4",
                "#45b7d1",
                "#f6b93b",
                "#96ceb4",
              ],
              borderWidth: 3,
              borderColor: "#ffffff",
              hoverBorderWidth: 5,
              hoverOffset: 10,
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
                usePointStyle: true,
                padding: 15,
                generateLabels: function (chart) {
                  const data = chart.data;
                  const labels = data.labels;
                  const dataset = data.datasets[0];
                  return labels.map((label, index) => ({
                    text: `${label}: ${dataset.data[index]}%`,
                    fillStyle: dataset.backgroundColor[index],
                    strokeStyle: dataset.backgroundColor[index],
                    lineWidth: 0,
                    pointStyle: "circle",
                  }));
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.parsed}%`;
                },
              },
            },
          },
          cutout: "60%",
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
          },
        },
      });
    }

    // Monthly Trend Chart
    const monthlyCtx = document.getElementById("monthlyChart");
    if (monthlyCtx) {
      charts.monthly = new Chart(monthlyCtx, {
        type: "bar",
        data: {
          labels: chartData[currentTimeFilter].monthly.labels,
          datasets: [
            {
              label: "Tamamlanan Aktivite (%)",
              data: chartData[currentTimeFilter].monthly.data,
              backgroundColor: "rgba(99, 102, 241, 0.8)",
              borderColor: "#6366f1",
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
              hoverBackgroundColor: "rgba(99, 102, 241, 0.9)",
              hoverBorderColor: "#5855eb",
              hoverBorderWidth: 3,
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
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Başarı: ${context.parsed.y}%`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: "#94a3b8",
                callback: function (value) {
                  return value + "%";
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#94a3b8",
              },
            },
          },
          animation: {
            duration: 1000,
            easing: "easeOutBounce",
          },
        },
      });
    }

    // Success Rate Chart
    const successCtx = document.getElementById("successChart");
    if (successCtx) {
      charts.success = new Chart(successCtx, {
        type: "radar",
        data: {
          labels: chartData[currentTimeFilter].success.labels,
          datasets: [
            {
              label: "Başarı Oranı (%)",
              data: chartData[currentTimeFilter].success.data,
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              borderColor: "#6366f1",
              borderWidth: 3,
              pointBackgroundColor: "#6366f1",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: "#5855eb",
              pointHoverBorderColor: "#ffffff",
              pointHoverBorderWidth: 3,
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
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.parsed.r}%`;
                },
              },
            },
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
              angleLines: {
                color: "rgba(0, 0, 0, 0.1)",
              },
              pointLabels: {
                color: "#94a3b8",
                font: {
                  size: 12,
                },
              },
              ticks: {
                color: "#94a3b8",
                backdropColor: "transparent",
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          },
          animation: {
            duration: 1500,
            easing: "easeInOutQuart",
          },
        },
      });
    }

    console.log("📊 Tüm grafikler başarıyla oluşturuldu");
  } catch (error) {
    console.error("Grafik oluşturma hatası:", error);
    showNotification("Grafikler yüklenirken hata oluştu", "error");
  }
}

// Update charts based on current filter
function updateCharts() {
  const data = chartData[currentTimeFilter];

  try {
    // Update Weekly Chart
    if (charts.weekly) {
      charts.weekly.data.labels = data.weekly.labels;
      charts.weekly.data.datasets[0].data = data.weekly.pomodoro;
      charts.weekly.data.datasets[1].data = data.weekly.tasks;
      charts.weekly.update("active");
    }

    // Update Distribution Chart
    if (charts.distribution) {
      charts.distribution.data.labels = data.distribution.labels;
      charts.distribution.data.datasets[0].data = data.distribution.data;
      charts.distribution.update("active");
    }

    // Update Monthly Chart
    if (charts.monthly) {
      charts.monthly.data.labels = data.monthly.labels;
      charts.monthly.data.datasets[0].data = data.monthly.data;
      charts.monthly.update("active");
    }

    // Update Success Chart
    if (charts.success) {
      charts.success.data.labels = data.success.labels;
      charts.success.data.datasets[0].data = data.success.data;
      charts.success.update("active");
    }

    console.log(`📊 Grafikler ${currentTimeFilter} için güncellendi`);
  } catch (error) {
    console.error("Grafik güncelleme hatası:", error);
    showNotification("Grafikler güncellenirken hata oluştu", "error");
  }
}

// Export data function
function exportData(format) {
  showNotification(`${format.toUpperCase()} raporu hazırlanıyor...`);

  // Add loading state to button
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = "Hazırlanıyor...";
  button.disabled = true;
  button.classList.add("loading");

  // Simulate export process
  setTimeout(() => {
    const fileName = `grindmind-istatistikler-${currentTimeFilter}-${
      new Date().toISOString().split("T")[0]
    }.${format}`;

    // Create sample data for export
    const exportData = {
      period: currentTimeFilter,
      date: new Date().toISOString(),
      stats: sampleData[currentTimeFilter],
      charts: chartData[currentTimeFilter],
      summary: {
        totalActivities: 6,
        completionRate: "87%",
        bestPerformance: "Pomodoro",
        improvement: "+15%",
      },
    };

    // In real implementation, trigger actual download
    if (format === "json") {
      downloadJSON(exportData, fileName);
    } else {
      console.log(`Exporting ${fileName}`, exportData);
    }

    // Reset button state
    button.textContent = originalText;
    button.disabled = false;
    button.classList.remove("loading");

    // Show success notification
    const messages = {
      pdf: "PDF raporu başarıyla oluşturuldu! 📄",
      excel: "Excel tablosu başarıyla oluşturuldu! 📊",
      csv: "CSV dosyası başarıyla oluşturuldu! 📝",
      json: "JSON verisi başarıyla oluşturuldu! 💾",
    };

    showNotification(messages[format] || "Dosya başarıyla oluşturuldu!");
  }, 2000);
}

// Download JSON helper function
function downloadJSON(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Utility functions
function getPeriodText(period) {
  const texts = {
    today: "bugün",
    week: "bu hafta",
    month: "bu ay",
    year: "bu yıl",
    all: "tüm zamanlar",
  };
  return texts[period] || period;
}

function showNotification(message, type = "success") {
  const toast = document.getElementById("notificationToast");
  const text = document.getElementById("notificationText");

  if (!toast || !text) return;

  // Set notification type styling
  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#6366f1",
  };

  toast.style.background = colors[type] || colors.success;
  text.textContent = message;
  toast.style.display = "block";

  // Auto hide after 4 seconds
  setTimeout(() => {
    hideNotification();
  }, 4000);
}

function hideNotification() {
  const toast = document.getElementById("notificationToast");
  if (!toast) return;

  toast.style.animation = "slideInRight 0.5s ease reverse";
  setTimeout(() => {
    toast.style.display = "none";
    toast.style.animation = "";
  }, 500);
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "1":
        e.preventDefault();
        changeTimeFilter("today");
        break;
      case "2":
        e.preventDefault();
        changeTimeFilter("week");
        break;
      case "3":
        e.preventDefault();
        changeTimeFilter("month");
        break;
      case "4":
        e.preventDefault();
        changeTimeFilter("year");
        break;
      case "5":
        e.preventDefault();
        changeTimeFilter("all");
        break;
      case "e":
        e.preventDefault();
        exportData("pdf");
        break;
      case "r":
        e.preventDefault();
        window.location.reload();
        break;
    }
  }

  // ESC key to hide notifications
  if (e.key === "Escape") {
    hideNotification();
  }
}

// Error handler
function handleError(e) {
  console.error("Sayfa hatası:", e.error);
  showNotification("Bir hata oluştu. Sayfa yenileniyor...", "error");
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Resize handler
function handleResize() {
  // Redraw charts on resize
  Object.values(charts).forEach((chart) => {
    if (chart && typeof chart.resize === "function") {
      chart.resize();
    }
  });
}

// Chart click handlers
function setupChartInteractions() {
  // Add click handlers for charts
  Object.keys(charts).forEach((chartKey) => {
    const chart = charts[chartKey];
    if (chart && chart.canvas) {
      chart.canvas.addEventListener("click", (e) => {
        const points = chart.getElementsAtEventForMode(
          e,
          "nearest",
          { intersect: true },
          true
        );
        if (points.length) {
          const point = points[0];
          const label = chart.data.labels[point.index];
          showNotification(`${chartKey} grafiği: ${label} seçildi`);
        }
      });
    }
  });
}

// Achievement progress simulation
function simulateAchievementProgress() {
  const achievementCards = document.querySelectorAll(
    ".achievement-card:not(.unlocked)"
  );

  achievementCards.forEach((card) => {
    const progressFill = card.querySelector(".achievement-progress-fill");
    const progressText = card.querySelector(".achievement-progress-text");

    if (progressFill && progressText && Math.random() > 0.8) {
      const currentWidth = parseInt(progressFill.style.width) || 0;
      const newWidth = Math.min(
        currentWidth + Math.floor(Math.random() * 10),
        100
      );

      progressFill.style.width = newWidth + "%";

      if (newWidth >= 100) {
        card.classList.add("unlocked");
        progressText.textContent = "Tamamlandı!";
        showNotification("🎉 Yeni başarı kazandın!");
      } else {
        const text = progressText.textContent;
        const parts = text.split("/");
        if (parts.length === 2) {
          const total = parseInt(parts[1]);
          const current = Math.floor((newWidth / 100) * total);
          progressText.textContent = `${current}/${total}`;
        }
      }
    }
  });
}

// Initialize dashboard integration
function initializeDashboardIntegration() {
  // Check if dashboard API is available
  if (window.grindmindAPI) {
    console.log("🔗 Dashboard API bağlantısı aktif");

    // Sync data with dashboard
    const dashboardData = window.grindmindAPI.getState();
    if (dashboardData) {
      console.log("📊 Dashboard verisi alındı:", dashboardData);
    }
  }

  // Setup periodic achievement progress simulation
  setInterval(simulateAchievementProgress, 30000); // Every 30 seconds
}

// Advanced features initialization
function initializeAdvancedFeatures() {
  // Setup chart interactions
  setupChartInteractions();

  // Initialize dashboard integration
  initializeDashboardIntegration();

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Initialize data sync
  initializeDataSync();

  // Setup theme detection
  setupThemeDetection();

  // Initialize tooltips
  initializeTooltips();
}

// Performance monitoring
function monitorPerformance() {
  // Monitor page load performance
  window.addEventListener("load", function () {
    const loadTime = performance.now();
    console.log(`📈 Sayfa yükleme performansı: ${loadTime.toFixed(2)}ms`);

    // Track Core Web Vitals
    trackWebVitals();

    // Monitor memory usage
    if (performance.memory) {
      const memoryInfo = performance.memory;
      console.log(
        `💾 Bellek kullanımı: ${(
          memoryInfo.usedJSHeapSize /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
    }

    // Check for performance issues
    if (loadTime > 3000) {
      console.warn("⚠️ Yavaş yükleme tespit edildi");
      showNotification(
        "Sayfa yavaş yüklendi. İnternet bağlantınızı kontrol edin.",
        "warning"
      );
    }
  });

  // Monitor chart rendering performance
  const originalChartUpdate = Chart.defaults.animation.onComplete;
  Chart.defaults.animation.onComplete = function () {
    if (originalChartUpdate) originalChartUpdate.call(this);
    const renderTime = performance.now();
    console.log(`📊 Grafik render süresi: ${renderTime.toFixed(2)}ms`);
  };
}

// Track Core Web Vitals
function trackWebVitals() {
  // Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log(`🎯 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
  }).observe({ entryTypes: ["largest-contentful-paint"] });

  // First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      console.log(`⚡ FID: ${entry.processingStart - entry.startTime}ms`);
    });
  }).observe({ entryTypes: ["first-input"] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    console.log(`📏 CLS: ${clsValue.toFixed(4)}`);
  }).observe({ entryTypes: ["layout-shift"] });
}

// Data synchronization
function initializeDataSync() {
  // Simulate real-time data updates
  setInterval(() => {
    if (Math.random() > 0.7) {
      updateRealTimeData();
    }
  }, 15000); // Every 15 seconds

  // Listen for storage changes (multi-tab sync)
  window.addEventListener("storage", (e) => {
    if (e.key === "grindmind-stats") {
      console.log("📡 Veriler başka bir sekmeden güncellendi");
      syncDataFromStorage();
    }
  });
}

// Update real-time data
function updateRealTimeData() {
  // Simulate small data changes
  const currentData = sampleData[currentTimeFilter];
  const keys = Object.keys(currentData);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  if (randomKey === "pomodoro") {
    const currentValue = parseInt(currentData[randomKey].value);
    const newValue = currentValue + Math.floor(Math.random() * 3);
    currentData[randomKey].value = newValue;
    currentData[randomKey].change = `+${Math.floor(
      Math.random() * 5
    )}% güncellendi`;
  }

  // Update UI with new data
  updateStats();
  showNotification(`${randomKey} verisi güncellendi! 🔄`, "info");
}

// Sync data from storage
function syncDataFromStorage() {
  try {
    const storedData = localStorage.getItem("grindmind-stats");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      Object.assign(sampleData, parsedData);
      updateStats();
      updateCharts();
    }
  } catch (error) {
    console.error("Veri senkronizasyon hatası:", error);
  }
}

// Theme detection and handling
function setupThemeDetection() {
  // Detect system theme preference
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function handleThemeChange(e) {
    if (e.matches) {
      console.log("🌙 Karanlık tema tercihi tespit edildi");
      // Implement dark theme logic if needed
    } else {
      console.log("☀️ Açık tema tercihi tespit edildi");
      // Implement light theme logic if needed
    }
  }

  mediaQuery.addEventListener("change", handleThemeChange);
  handleThemeChange(mediaQuery);
}

// Initialize tooltips
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]");

  tooltipElements.forEach((element) => {
    let tooltip = null;

    element.addEventListener("mouseenter", function () {
      const text = this.getAttribute("data-tooltip");
      tooltip = createTooltip(text);
      document.body.appendChild(tooltip);
      positionTooltip(tooltip, this);
    });

    element.addEventListener("mouseleave", function () {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });

    element.addEventListener("mousemove", function (e) {
      if (tooltip) {
        tooltip.style.left = e.pageX + 10 + "px";
        tooltip.style.top = e.pageY - 10 + "px";
      }
    });
  });
}

// Create tooltip element
function createTooltip(text) {
  const tooltip = document.createElement("div");
  tooltip.className = "custom-tooltip";
  tooltip.textContent = text;
  tooltip.style.cssText = `
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    max-width: 200px;
    word-wrap: break-word;
  `;

  setTimeout(() => {
    tooltip.style.opacity = "1";
  }, 10);

  return tooltip;
}

// Position tooltip relative to element
function positionTooltip(tooltip, element) {
  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  let top = rect.top - tooltipRect.height - 10;

  // Adjust if tooltip goes off screen
  if (left < 10) left = 10;
  if (left + tooltipRect.width > window.innerWidth - 10) {
    left = window.innerWidth - tooltipRect.width - 10;
  }
  if (top < 10) {
    top = rect.bottom + 10;
  }

  tooltip.style.left = left + "px";
  tooltip.style.top = top + "px";
}

// Advanced chart interactions
function setupAdvancedChartInteractions() {
  Object.keys(charts).forEach((chartKey) => {
    const chart = charts[chartKey];
    if (chart && chart.canvas) {
      // Add double click to reset zoom
      chart.canvas.addEventListener("dblclick", () => {
        chart.resetZoom();
        showNotification(`${chartKey} grafiği sıfırlandı`);
      });

      // Add context menu for chart options
      chart.canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showChartContextMenu(e, chartKey);
      });
    }
  });
}

// Show chart context menu
function showChartContextMenu(e, chartKey) {
  const menu = document.createElement("div");
  menu.className = "chart-context-menu";
  menu.style.cssText = `
    position: fixed;
    left: ${e.pageX}px;
    top: ${e.pageY}px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    min-width: 150px;
  `;

  const options = [
    { text: "PNG olarak kaydet", action: () => saveChartAsPNG(chartKey) },
    { text: "Verileri kopyala", action: () => copyChartData(chartKey) },
    { text: "Tam ekran", action: () => showChartFullscreen(chartKey) },
    { text: "Ayarlar", action: () => showChartSettings(chartKey) },
  ];

  options.forEach((option) => {
    const item = document.createElement("div");
    item.textContent = option.text;
    item.style.cssText = `
      padding: 10px 15px;
      cursor: pointer;
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.2s;
    `;

    item.addEventListener("mouseenter", () => {
      item.style.backgroundColor = "#f8fafc";
    });

    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "transparent";
    });

    item.addEventListener("click", () => {
      option.action();
      menu.remove();
    });

    menu.appendChild(item);
  });

  document.body.appendChild(menu);

  // Remove menu when clicking outside
  setTimeout(() => {
    document.addEventListener("click", function removeMenu() {
      menu.remove();
      document.removeEventListener("click", removeMenu);
    });
  }, 0);
}

// Chart utility functions
function saveChartAsPNG(chartKey) {
  const chart = charts[chartKey];
  if (chart) {
    const url = chart.toBase64Image();
    const link = document.createElement("a");
    link.download = `${chartKey}-chart.png`;
    link.href = url;
    link.click();
    showNotification(`${chartKey} grafiği PNG olarak kaydedildi!`);
  }
}

function copyChartData(chartKey) {
  const chart = charts[chartKey];
  if (chart) {
    const data = JSON.stringify(chart.data, null, 2);
    navigator.clipboard.writeText(data).then(() => {
      showNotification(`${chartKey} verisi panoya kopyalandı!`);
    });
  }
}

function showChartFullscreen(chartKey) {
  const chart = charts[chartKey];
  if (chart) {
    const canvas = chart.canvas;
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }
}

function showChartSettings(chartKey) {
  showNotification(`${chartKey} grafik ayarları yakında eklenecek!`, "info");
}

// Export functionality enhancements
function exportDataAdvanced(format, options = {}) {
  const { includeCharts = true, includeSummary = true, customRange } = options;

  showNotification(`Gelişmiş ${format.toUpperCase()} raporu hazırlanıyor...`);

  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      exportFormat: format,
      period: currentTimeFilter,
      version: "1.0.0",
      source: "GRINDMIND Statistics",
    },
    stats: sampleData[currentTimeFilter],
    ...(includeCharts && { charts: chartData[currentTimeFilter] }),
    ...(includeSummary && {
      summary: generateAdvancedSummary(),
      insights: generateInsights(),
      recommendations: generateRecommendations(),
    }),
  };

  // Simulate advanced export process
  setTimeout(() => {
    if (format === "json") {
      downloadJSON(exportData, `grindmind-advanced-report-${Date.now()}.json`);
    } else if (format === "csv") {
      downloadCSV(exportData);
    } else {
      console.log("Advanced export data:", exportData);
    }

    showNotification(
      `Gelişmiş ${format.toUpperCase()} raporu başarıyla oluşturuldu!`
    );
  }, 3000);
}

// Generate advanced summary
function generateAdvancedSummary() {
  const data = sampleData[currentTimeFilter];

  return {
    totalActivities: Object.keys(data).length,
    averagePerformance: "84%",
    topPerformer: "Bağımlılık Takibi",
    improvementAreas: ["Çalışma Saatleri", "Görev Tamamlama"],
    streak: {
      current: 45,
      longest: 67,
      type: "Günlük Aktivite",
    },
    milestones: [
      "İlk 30 gün tamamlandı",
      "100 pomodoro hedefine ulaşıldı",
      "Kilo hedefinin %75'i gerçekleşti",
    ],
  };
}

// Generate insights
function generateInsights() {
  return [
    {
      type: "trend",
      title: "Pozitif Trend",
      description: "Son 2 haftada %23 iyileşme gözlemlendi",
      confidence: 0.92,
    },
    {
      type: "pattern",
      title: "Hafta İçi Performansı",
      description: "Salı ve Çarşamba günleri en yüksek verim",
      confidence: 0.87,
    },
    {
      type: "correlation",
      title: "Aktivite İlişkisi",
      description:
        "Pomodoro sayısı ile görev tamamlama arasında güçlü bağlantı",
      confidence: 0.94,
    },
  ];
}

// Generate recommendations
function generateRecommendations() {
  return [
    {
      priority: "high",
      category: "Optimizasyon",
      title: "Çalışma Saatlerini Artır",
      description:
        "Günlük ortalama çalışma süresini 30 dakika artırarak hedeflerine daha hızlı ulaşabilirsin.",
      expectedImpact: "+15% verimlilik artışı",
    },
    {
      priority: "medium",
      category: "Tutarlılık",
      title: "Hafta Sonu Aktivitesi",
      description:
        "Hafta sonları da düzenli aktivite yaparak momentumunu koruyabilirsin.",
      expectedImpact: "+8% genel tutarlılık",
    },
    {
      priority: "low",
      category: "Motivasyon",
      title: "Yeni Başarı Hedefleri",
      description:
        "Mevcut başarıların üzerine yeni challengelar ekleyerek motivasyonunu artırabilirsin.",
      expectedImpact: "Uzun vadeli motivasyon",
    },
  ];
}

// Download CSV helper
function downloadCSV(data) {
  const csv = convertToCSV(data.stats);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `grindmind-stats-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convert data to CSV format
function convertToCSV(data) {
  const headers = ["Aktivite", "Değer", "Değişim"];
  const rows = Object.entries(data).map(([key, value]) => [
    key,
    value.value,
    value.change,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
}

// Initialize all systems
function initializeAllSystems() {
  console.log("🚀 Tüm sistemler başlatılıyor...");

  // Setup advanced chart interactions
  setupAdvancedChartInteractions();

  // Initialize performance monitoring
  monitorPerformance();

  // Setup error boundary
  setupErrorBoundary();

  // Initialize accessibility features
  initializeAccessibility();

  console.log("✅ Tüm sistemler başarıyla başlatıldı");
}

// Setup error boundary
function setupErrorBoundary() {
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Promise hatası:", event.reason);
    showNotification("Beklenmeyen bir hata oluştu", "error");
    event.preventDefault();
  });
}

// Initialize accessibility features
function initializeAccessibility() {
  // Add ARIA labels to charts
  Object.keys(charts).forEach((chartKey) => {
    const chart = charts[chartKey];
    if (chart && chart.canvas) {
      chart.canvas.setAttribute("role", "img");
      chart.canvas.setAttribute("aria-label", `${chartKey} grafiği`);
    }
  });

  // Add keyboard navigation support
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key >= "1" && e.key <= "4") {
      const chartKeys = Object.keys(charts);
      const chartIndex = parseInt(e.key) - 1;
      if (chartKeys[chartIndex]) {
        const chart = charts[chartKeys[chartIndex]];
        if (chart && chart.canvas) {
          chart.canvas.focus();
          showNotification(`${chartKeys[chartIndex]} grafiği odaklandı`);
        }
      }
    }
  });
}

// Final initialization call
document.addEventListener("DOMContentLoaded", function () {
  // Add a small delay to ensure all elements are ready
  setTimeout(() => {
    initializeAllSystems();
  }, 100);
});
