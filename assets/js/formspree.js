/**
 * QuizNova - Formspree Service
 * Secure client-side dispatch for quiz submission summaries.
 * 
 * Rules:
 * - Never expose private API keys. Formspree public endpoint format: https://formspree.io/f/{form_id}
 * - Formspree is used ONLY for aggregate record collection, NOT for score calculation.
 * - Non-blocking: Submissions gracefully resolve even if network or Formspree is unconfigured.
 */

window.QuizNovaFormspree = (function () {
  const STORAGE_KEY = "quiznova_formspree_endpoint";
  const DEFAULT_FORM_ID = "meaoyyep"; // Optional default Formspree form ID

  function getStoredEndpoint() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored.trim();
    } catch (e) {
      console.warn("Storage access restricted:", e);
    }
    // Check URL parameters for organizer override
    const params = new URLSearchParams(window.location.search);
    const urlFormId = params.get("formspree");
    if (urlFormId) {
      return sanitizeEndpoint(urlFormId);
    }
    return DEFAULT_FORM_ID ? sanitizeEndpoint(DEFAULT_FORM_ID) : "";
  }

  function sanitizeEndpoint(idOrUrl) {
    if (!idOrUrl) return "";
    idOrUrl = idOrUrl.trim();
    if (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://")) {
      return idOrUrl;
    }
    // Clean alphanumeric form ID
    const cleanId = idOrUrl.replace(/[^a-zA-Z0-9_-]/g, "");
    return `https://formspree.io/f/${cleanId}`;
  }

  function setEndpoint(idOrUrl) {
    const endpoint = sanitizeEndpoint(idOrUrl);
    try {
      if (endpoint) {
        localStorage.setItem(STORAGE_KEY, endpoint);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Unable to save to localStorage:", e);
    }
    return endpoint;
  }

  async function submitResults(payload) {
    const endpoint = getStoredEndpoint();
    const resultMeta = {
      attempted: true,
      sentToFormspree: false,
      endpoint: endpoint || null,
      error: null
    };

    if (!endpoint) {
      console.info("[QuizNova Formspree] No Formspree endpoint configured. Result recorded locally.");
      return resultMeta;
    }

    try {
        const requestBody = {
          _subject: `QuizNova Submission: ${payload.quizTitle} (${payload.percentage}%)`,
          quizId: payload.quizId,
          quizTitle: payload.quizTitle,
          participant: payload.participantName || "Anonymous Participant",
          score: `${payload.score} / ${payload.totalQuestions}`,
          percentage: `${payload.percentage}%`,
          passed: payload.percentage >= payload.passPercentage ? "YES" : "NO",
          correctCount: payload.correctCount,
          incorrectCount: payload.incorrectCount,
          unansweredCount: payload.unansweredCount,
          timeTaken: payload.timeFormatted,
          timestamp: new Date().toISOString()
        };

        // Add each question and answer to the body root for readable Formspree emails
        if (payload.detailedAnswers && payload.detailedAnswers.length > 0) {
          payload.detailedAnswers.forEach((ans, index) => {
            requestBody[`Q${index + 1}: ${ans.question}`] = `Selected: ${ans.selectedAnswer || 'Unanswered'} (Correct: ${ans.correctAnswer})`;
          });
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

      if (response.ok) {
        resultMeta.sentToFormspree = true;
        console.log("[QuizNova Formspree] Submission successfully sent to Formspree.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        resultMeta.error = errorData.error || `HTTP ${response.status}`;
        console.warn("[QuizNova Formspree] Submission returned error:", resultMeta.error);
      }
    } catch (err) {
      resultMeta.error = err.message;
      console.warn("[QuizNova Formspree] Submission request failed (offline/CORS):", err);
    }

    return resultMeta;
  }

  return {
    getEndpoint: getStoredEndpoint,
    setEndpoint: setEndpoint,
    sanitizeEndpoint: sanitizeEndpoint,
    submitResults: submitResults
  };
})();
