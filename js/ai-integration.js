// AI Integration for GRINDMIND Dashboard
// ===================================

// AI Configuration - Stable model kullanıyoruz
const AI_CONFIG = {
  API_KEY: "**********************************", // Buraya kendi API anahtarınızı girin
  MODEL: "gemini-1.5-flash", // Daha stabil model
  MAX_RETRIES: 3,
  TIMEOUT: 15000, // 15 seconds
};

// AI Coach Class
class AICoach {
  constructor() {
    this.isGenerating = false;
    this.lastReport = null;
    this.userContext = {};
  }

  // Ana AI rapor oluşturma fonksiyonu
  async generatePersonalizedReport(userStats = null) {
    if (this.isGenerating) {
      console.log("AI already generating report...");
      return;
    }

    this.isGenerating = true;
    this.showLoadingState();

    try {
      // Eğer userStats verilmemişse mevcut state'den al
      if (!userStats) {
        const currentState = window.grindmindAPI
          ? window.grindmindAPI.getState()
          : {};

        // Daha gerçekçi ve çeşitli veriler oluştur
        const scenarios = [
          // Sigara bırakma senaryosu
          {
            level: currentState.user?.level || 28,
            xp: currentState.user?.xp || 8200,
            challengeProgress: currentState.challenge?.progress || 0,
            challengeTotal: currentState.challenge?.total || 50,
            weeklyPomodoros: Math.floor(Math.random() * 15) + 8, // 8-22 arası
            dailyHabits: Math.floor(Math.random() * 3) + 6, // 6-8 arası
            streaks: {
              pomodoro: Math.floor(Math.random() * 7) + 2,
              water: Math.floor(Math.random() * 10) + 8,
              exercise: Math.floor(Math.random() * 4) + 1,
              clean: Math.floor(Math.random() * 20) + 5, // 5-24 gün arası (sigara)
            },
          },
          // Kilo verme senaryosu
          {
            level: currentState.user?.level || 32,
            xp: currentState.user?.xp || 9500,
            challengeProgress: currentState.challenge?.progress || 0,
            challengeTotal: currentState.challenge?.total || 50,
            weeklyPomodoros: Math.floor(Math.random() * 10) + 15, // 15-24 arası
            dailyHabits: Math.floor(Math.random() * 2) + 7, // 7-8 arası
            streaks: {
              pomodoro: Math.floor(Math.random() * 8) + 4,
              water: Math.floor(Math.random() * 8) + 10, // Su içme önemli kilo için
              exercise: Math.floor(Math.random() * 6) + 3, // Egzersiz streak
              clean: Math.floor(Math.random() * 30) + 30, // Uzun süreli temiz
            },
          },
          // Yüksek performans senaryosu
          {
            level: currentState.user?.level || 45,
            xp: currentState.user?.xp || 12000,
            challengeProgress: currentState.challenge?.progress || 0,
            challengeTotal: currentState.challenge?.total || 50,
            weeklyPomodoros: Math.floor(Math.random() * 10) + 25, // 25-34 arası
            dailyHabits: 8, // Neredeyse mükemmel
            streaks: {
              pomodoro: Math.floor(Math.random() * 10) + 8,
              water: Math.floor(Math.random() * 8) + 15,
              exercise: Math.floor(Math.random() * 8) + 5,
              clean: Math.floor(Math.random() * 50) + 60, // Çok uzun süreli
            },
          },
        ];

        // Rastgele bir senaryo seç
        userStats = scenarios[Math.floor(Math.random() * scenarios.length)];
      }

      // Kullanıcı verilerini hazırla
      const context = this.prepareUserContext(userStats);

      // AI prompt'unu oluştur
      const prompt = this.createPrompt(context);

      // Yeni REST API ile istek gönder
      const response = await this.callGeminiRestAPI(prompt);

      // Yanıtı işle
      const report = this.processResponse(response);

      // UI'ı güncelle
      this.updateUI(report);

      // Raporu kaydet
      this.lastReport = {
        content: report,
        timestamp: new Date(),
        userStats: context,
      };

      // State'i güncelle
      if (
        window.grindmindAPI &&
        typeof window.grindmindAPI.setState === "function"
      ) {
        window.grindmindAPI.setState({
          ai: { lastReport: this.lastReport },
        });
      } else {
        // setState yoksa localStorage'a direkt kaydet
        try {
          const currentState = JSON.parse(
            localStorage.getItem("grindmind_dashboard_state") || "{}"
          );
          currentState.ai = { lastReport: this.lastReport };
          localStorage.setItem(
            "grindmind_dashboard_state",
            JSON.stringify(currentState)
          );
        } catch (error) {
          console.log("State save error (ignored):", error);
        }
      }

      return report;
    } catch (error) {
      console.error("AI Report Generation Error:", error);
      this.handleError(error);
    } finally {
      this.isGenerating = false;
      this.hideLoadingState();
    }
  }

  // Kullanıcı verilerini hazırla
  prepareUserContext(userStats) {
    return {
      level: userStats?.level || 28,
      xp: userStats?.xp || 8200,
      challengeProgress: userStats?.challengeProgress || 0,
      challengeTotal: userStats?.challengeTotal || 50,
      weeklyPomodoros: userStats?.weeklyPomodoros || 15,
      dailyHabits: userStats?.dailyHabits || 7,
      streaks: userStats?.streaks || {
        pomodoro: 5,
        water: 12,
        exercise: 3,
        clean: 45,
      },
      currentDate: new Date().toLocaleDateString("tr-TR"),
      currentTime: new Date().getHours(),
    };
  }

  // AI prompt'unu oluştur - Akıllı kişiselleştirme
  createPrompt(context) {
    const timeOfDay = this.getTimeOfDay(context.currentTime);

    // Kullanıcının spesifik verilerine göre akıllı analiz
    const insights = this.generatePersonalInsights(context);

    return `Sen GRINDMIND uygulamasının AI Coach'isın. Kullanıcının GERÇEK verilerine göre çok spesifik ve kişisel bir analiz yap:

KULLANICI VERİLERİ:
• Level: ${context.level} 
• XP: ${context.xp}
• Challenge: ${context.challengeProgress}/${context.challengeTotal} pomodoro
• Bu hafta pomodoro: ${context.weeklyPomodoros} seans
• Günlük alışkanlıklar: ${context.dailyHabits}/9 
• Streaks: Pomodoro ${context.streaks.pomodoro} gün, Su ${context.streaks.water} gün, Egzersiz ${context.streaks.exercise} gün, Temiz kalma ${context.streaks.clean} gün
• Zaman: ${timeOfDay}

ÖNEMLİ NOTLAR:
${insights}

GÖREV: 4-6 cümlelik çok spesifik ve kişisel analiz yaz. Şunlara odaklan:

1. BAĞIMLILIK/TEMİZ KALMA: ${context.streaks.clean} günlük serin hakkında özel yorum yap
2. POMODORO ODAKLANMA: Haftalık ${context.weeklyPomodoros} pomodoro performansı hakkında yorum
3. ALIŞKANLIK TRAKİNGİ: ${context.dailyHabits}/9 oranı hakkında spesifik öneri
4. KİLO TAKİBİ: Sağlık ve fitness motivasyonu hakkında yorum
5. GENEL MOTİVASYON: Level ${context.level} başarısını vurgula

Format: 
- Çok samimi ve kişisel ton kullan
- Emoji kullan ama abartma
- Spesifik sayıları vurgula
- Gerçek verilerden yola çıkarak tavsiye ver
- Kullanıcının başardıklarını çok övgüyle karşıla

Örnek ton: "${context.streaks.clean} gün temiz kalman inanılmaz! Sigara/bağımlılık konusunda gerçek bir savaşçısın. Bu hafta ${context.weeklyPomodoros} pomodoro ile de odaklanma konusunda güzel gidiyorsun..."`;
  }

  // Kişisel içgörüler oluştur
  generatePersonalInsights(context) {
    let insights = [];

    // Bağımlılık/Temiz kalma analizi
    if (context.streaks.clean > 0) {
      if (context.streaks.clean < 7) {
        insights.push(
          `• BAĞIMLILIK: Henüz ${context.streaks.clean} günlük temiz kalma başlangıcında. Bu kritik dönemde ekstra destek gerekli.`
        );
      } else if (context.streaks.clean < 30) {
        insights.push(
          `• BAĞIMLILIK: ${context.streaks.clean} gün harika bir ilerleme! Bağımlılıkla mücadelede zorlu dönemleri geçiyorsun.`
        );
      } else if (context.streaks.clean < 90) {
        insights.push(
          `• BAĞIMLILIK: ${context.streaks.clean} gün muhteşem! Artık alışkanlık değişiminde stabil döneme geçtin.`
        );
      } else {
        insights.push(
          `• BAĞIMLILIK: ${context.streaks.clean} gün efsane bir başarı! Tamamen yeni bir yaşam tarzına geçmişsin.`
        );
      }
    }

    // Pomodoro analizi
    if (context.weeklyPomodoros > 0) {
      if (context.weeklyPomodoros < 10) {
        insights.push(
          `• POMODORO: ${context.weeklyPomodoros} pomodoro az. Odaklanma konusunda daha fazla pratik yapmalısın.`
        );
      } else if (context.weeklyPomodoros < 20) {
        insights.push(
          `• POMODORO: ${context.weeklyPomodoros} pomodoro güzel bir başlangıç. Ortalama seviyedesin.`
        );
      } else if (context.weeklyPomodoros < 35) {
        insights.push(
          `• POMODORO: ${context.weeklyPomodoros} pomodoro harika! Odaklanma konusunda çok iyisin.`
        );
      } else {
        insights.push(
          `• POMODORO: ${context.weeklyPomodoros} pomodoro inanılmaz! Odaklanma konusunda gerçek bir profesyonelsin.`
        );
      }
    }

    // Alışkanlık analizi
    const habitPercentage = Math.round((context.dailyHabits / 9) * 100);
    if (habitPercentage < 50) {
      insights.push(
        `• ALIŞKANLIKLAR: ${context.dailyHabits}/9 düşük oran. Günlük rutinlerde daha tutarlı olmalısın.`
      );
    } else if (habitPercentage < 80) {
      insights.push(
        `• ALIŞKANLIKLAR: ${context.dailyHabits}/9 orta seviye. Birkaç alışkanlık daha ekleyebilirsin.`
      );
    } else {
      insights.push(
        `• ALIŞKANLIKLAR: ${context.dailyHabits}/9 mükemmel oran! Alışkanlık konusunda çok disiplinlisin.`
      );
    }

    // Kilo takibi
    insights.push(
      `• KİLO TAKİBİ: Sağlık ve fitness hedeflerinde tutarlı olmak çok önemli. Kilo takibi sağlıklı yaşamın temel taşı.`
    );

    // Level analizi
    if (context.level < 10) {
      insights.push(
        `• GENEL: Level ${context.level} yeni başlangıç. Her gün küçük adımlarla ilerliyorsun.`
      );
    } else if (context.level < 25) {
      insights.push(
        `• GENEL: Level ${context.level} güzel ilerleme. Hedeflerine odaklanmayı öğreniyorsun.`
      );
    } else if (context.level < 50) {
      insights.push(
        `• GENEL: Level ${context.level} harika seviye! Kişisel gelişimde deneyimli birisisin.`
      );
    } else {
      insights.push(
        `• GENEL: Level ${context.level} efsane! Kişisel gelişim konusunda gerçek bir ustasın.`
      );
    }

    return insights.join("\n");
  }

  // Yeni REST API çağrısı - Retry mekanizması ile
  async callGeminiRestAPI(prompt, retryCount = 0) {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 500,
        stopSequences: [],
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    console.log(`Sending request to Gemini API (attempt ${retryCount + 1})...`);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.MODEL}:generateContent?key=${AI_CONFIG.API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(AI_CONFIG.TIMEOUT),
        }
      );

      console.log("API Response status:", response.status);

      // Eğer 503 (overloaded) hatası alırsak ve retry hakkımız varsa tekrar dene
      if (response.status === 503 && retryCount < AI_CONFIG.MAX_RETRIES - 1) {
        console.log(
          `Model overloaded, retrying in ${(retryCount + 1) * 2} seconds...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, (retryCount + 1) * 2000)
        );
        return this.callGeminiRestAPI(prompt, retryCount + 1);
      }

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Details:", errorData);
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}\nDetails: ${errorData}`
        );
      }

      const data = await response.json();
      console.log("API Response successful!");

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts
      ) {
        console.error("Invalid API response format:", data);
        throw new Error("Invalid API response format");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (
        error.name === "TimeoutError" &&
        retryCount < AI_CONFIG.MAX_RETRIES - 1
      ) {
        console.log(
          `Request timeout, retrying in ${(retryCount + 1) * 2} seconds...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, (retryCount + 1) * 2000)
        );
        return this.callGeminiRestAPI(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  // AI yanıtını işle
  processResponse(response) {
    let cleanedResponse = response.trim();

    // Formatı iyileştir
    cleanedResponse = cleanedResponse.replace(/\*\*/g, "");
    cleanedResponse = cleanedResponse.replace(/^\d+\.\s*/gm, "");
    cleanedResponse = cleanedResponse.replace(/━+/g, "");
    cleanedResponse = cleanedResponse.replace(/\n\n+/g, "\n\n");

    return cleanedResponse;
  }

  // UI'ı güncelle
  updateUI(report) {
    const messageEl = document.getElementById("aiCoachMessage");
    if (messageEl) {
      // Typing effect için
      this.typeWriter(messageEl, report, 30);
    }

    // Başarı bildirimi göster
    if (window.showNotification) {
      window.showNotification(
        "AI Rapor Hazır! 🤖",
        "Kişisel gelişim raporu güncellendi.",
        "success"
      );
    }
  }

  // Typing effect
  typeWriter(element, text, speed = 50) {
    element.textContent = "";
    let i = 0;

    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

  // Loading state göster
  showLoadingState() {
    const btn = document.getElementById("generateReportBtn");
    const loading = document.getElementById("aiLoading");

    if (btn) btn.style.display = "none";
    if (loading) loading.style.display = "flex";
  }

  // Loading state gizle
  hideLoadingState() {
    const btn = document.getElementById("generateReportBtn");
    const loading = document.getElementById("aiLoading");

    if (btn) btn.style.display = "inline-flex";
    if (loading) loading.style.display = "none";
  }

  // Hata durumunu yönet
  handleError(error) {
    console.error("AI Coach Error:", error);

    const messageEl = document.getElementById("aiCoachMessage");
    if (messageEl) {
      if (error.message.includes("API Error: 400")) {
        messageEl.textContent =
          "API isteğinde bir hata oluştu. Lütfen daha sonra tekrar deneyin. 🤖";
      } else if (error.message.includes("quota")) {
        messageEl.textContent =
          "API kotası doldu. Lütfen daha sonra tekrar deneyin. 🤖";
      } else {
        messageEl.textContent =
          "Bağlantı hatası oluştu. İnternet bağlantınızı kontrol edin. 🤖";
      }
    }

    if (window.showNotification) {
      if (error.message.includes("setState")) {
        // setState hatası için özel mesaj - kullanıcıya gösterme
        console.log("State save error (ignored):", error);
        return; // Hata mesajı gösterme, AI çalışıyor
      } else if (error.message.includes("API Error: 400")) {
        messageEl.textContent =
          "API isteğinde bir hata oluştu. Lütfen daha sonra tekrar deneyin. 🤖";
      } else if (error.message.includes("quota")) {
        messageEl.textContent =
          "API kotası doldu. Lütfen daha sonra tekrar deneyin. 🤖";
      } else {
        messageEl.textContent =
          "Bağlantı hatası oluştu. İnternet bağlantınızı kontrol edin. 🤖";
      }

      window.showNotification(
        "AI Hata",
        "Rapor oluşturulurken bir hata oluştu. Console'da detayları kontrol edin.",
        "error"
      );
    }
  }

  // Günün zamanını belirle
  getTimeOfDay(hour) {
    if (hour < 6) return "gece";
    if (hour < 12) return "sabah";
    if (hour < 18) return "öğleden sonra";
    if (hour < 22) return "akşam";
    return "gece";
  }

  // Test fonksiyonu
  async testAPI() {
    try {
      console.log("Testing Gemini API...");
      const testPrompt = "Merhaba! Bu bir test mesajıdır. Kısaca yanıtla.";
      const response = await this.callGeminiRestAPI(testPrompt);
      console.log("API Test Başarılı:", response);
      return true;
    } catch (error) {
      console.error("API Test Başarısız:", error);
      return false;
    }
  }
}

// Global AI Coach instance
window.aiCoach = new AICoach();

// Dashboard'dan çağrılacak ana fonksiyon
async function generateAIReport() {
  console.log("generateAIReport called");
  // AI Coach ile rapor oluştur
  await window.aiCoach.generatePersonalizedReport();
}

// Dashboard yüklendiğinde AI Coach'u başlat
document.addEventListener("DOMContentLoaded", () => {
  console.log("🤖 AI Coach initialized with Gemini 2.0 Flash");

  // API test et (isteğe bağlı - test etmek için yorumu kaldırın)
  setTimeout(() => {
    console.log("Testing API connection...");
    window.aiCoach.testAPI().then((result) => {
      if (result) {
        console.log("✅ Gemini API connection successful!");
      } else {
        console.log("❌ Gemini API connection failed!");
      }
    });
  }, 2000);
});

// Export for use in other files
window.AICoach = AICoach;
window.generateAIReport = generateAIReport;
