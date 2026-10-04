/**
 * SeminarQuiz - Core Application Controller
 * Handles routing, student assessment flow, neutral answer selection,
 * scoring engine, results analytics, review drawer, organizer QR generator & poster.
 */

(function () {
  'use strict';

  // --- State Store ---
  const state = {
    currentRoute: 'home',
    quizId: 'ds-fundamentals',
    quiz: null,
    currentQuestionIndex: 0,
    answers: {},       // { [questionId]: 'A' | 'B' | 'C' | 'D' }
    bookmarks: new Set(), // Set of questionIds marked for review
    timeRemaining: 8 * 60, // seconds
    timerInterval: null,
    startTime: null,
    endTime: null,
    isTimerRunning: false,
    results: null,
    qrInstance: null,
    posterQrInstance: null,
    participantName: "Student"
  };

  // --- DOM Elements Cache ---
  const views = {
    home: document.getElementById('view-landing'),
    welcome: document.getElementById('view-welcome'),
    quiz: document.getElementById('view-quiz'),
    results: document.getElementById('view-results')
  };

  // --- Router ---
  function initRouter() {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
  }

  function navigateTo(hash) {
    if (window.location.hash === hash) {
      handleRouteChange();
    } else {
      window.location.hash = hash;
    }
  }

  function handleRouteChange() {
    let hash = window.location.hash || '#/';
    if (hash.startsWith('#')) hash = hash.slice(1);
    if (!hash.startsWith('/')) hash = '/' + hash;

    // Check query params for quick access, e.g., ?quiz=ds-fundamentals
    const searchParams = new URLSearchParams(window.location.search);
    const quizParam = searchParams.get('quiz');
    if (quizParam && hash === '/') {
      hash = `/quiz/${quizParam}`;
    }

    const segments = hash.split('/').filter(Boolean);
    const primary = segments[0] || '';

    // Route matching: first screen is the Welcome Page with photo and animation
    if (!primary || primary === 'welcome' || primary === 'home') {
      showView('welcome');
      renderWelcomeScreen();
      updateNavActive('quiz');
    } else if (primary === 'quiz') {
      const qId = segments[1] || 'ds-fundamentals';
      state.quizId = qId;
      state.quiz = window.SEMINARQUIZ_DATA.getQuiz(qId);

      const subRoute = segments[2] || '';
      if (subRoute === 'active') {
        showView('quiz');
        renderActiveQuestion();
        updateNavActive('quiz');
      } else if (subRoute === 'results') {
        if (!state.results) {
          computeResults();
        }
        showView('results');
        renderResultsView();
        updateNavActive('results');
      } else {
        // Welcome room
        showView('welcome');
        renderWelcomeScreen();
        updateNavActive('quiz');
      }
    } else if (primary === 'landing' || primary === 'about') {
      showView('home');
      updateNavActive('home');
    } else {
      showView('welcome');
      renderWelcomeScreen();
      updateNavActive('quiz');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showView(viewName) {
    state.currentRoute = viewName;
    Object.keys(views).forEach(key => {
      if (views[key]) {
        if (key === viewName) {
          views[key].classList.remove('hidden');
        } else {
          views[key].classList.add('hidden');
        }
      }
    });

    // Control global header/footer visibility based on view
    const globalHeader = document.getElementById('global-header');
    
    // In active quiz, keep header ultra clean
    if (globalHeader) {
      if (viewName === 'quiz') {
        globalHeader.classList.add('hidden');
      } else {
        globalHeader.classList.remove('hidden');
      }
    }
  }

  function updateNavActive(routeName) {
    const navLinks = document.querySelectorAll('#global-nav [data-path]');
    navLinks.forEach(link => {
      const path = link.getAttribute('data-path');
      if (path === routeName) {
        link.classList.remove('text-on-surface-variant');
        link.classList.add('text-primary', 'font-bold');
      } else {
        link.classList.remove('text-primary', 'font-bold');
        link.classList.add('text-on-surface-variant');
      }
    });
  }

  // --- Welcome Screen Logic ---
  function renderWelcomeScreen() {
    const quiz = state.quiz || window.SEMINARQUIZ_DATA.getQuiz(state.quizId);
    state.quiz = quiz;

    const titleEl = document.getElementById('welcome-quiz-title');
    const descEl = document.getElementById('welcome-quiz-desc');
    const moduleEl = document.getElementById('welcome-quiz-module');
    const questionsCountEl = document.getElementById('welcome-questions-count');
    const durationEl = document.getElementById('welcome-duration');
    const roomCodeEl = document.getElementById('welcome-room-code');

    if (titleEl) titleEl.textContent = quiz.title;
    if (descEl) descEl.textContent = quiz.description;
    if (moduleEl) moduleEl.textContent = quiz.module;
    if (questionsCountEl) questionsCountEl.textContent = `${quiz.totalQuestions} Questions`;
    if (durationEl) durationEl.textContent = `${quiz.durationMinutes} Minutes`;
    if (roomCodeEl) roomCodeEl.innerHTML = '<span class="material-symbols-outlined text-[15px]">timer</span><span>15 Questions • 8 Min</span>';

    // Welcome celebration animation
    if (typeof confetti === 'function' && !state._welcomeBurstFired) {
      state._welcomeBurstFired = true;
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.35 },
          colors: ['#635bff', '#493ee5', '#00845d', '#ffb703', '#e8e5ff']
        });
      }, 350);
    }

    // Reset student session
    state.answers = {};
    state.bookmarks.clear();
    state.currentQuestionIndex = 0;
    state.results = null;
    state.timeRemaining = quiz.durationMinutes * 60;
    clearInterval(state.timerInterval);
    state.isTimerRunning = false;
  }

  function startQuizSession() {
    state.startTime = new Date();
    state.timeRemaining = (state.quiz ? state.quiz.durationMinutes : 8) * 60;
    startTimer();
    navigateTo(`#/quiz/${state.quizId}/active`);
  }

  // --- Timer Engine ---
  function startTimer() {
    clearInterval(state.timerInterval);
    state.isTimerRunning = true;
    updateTimerDisplay();

    state.timerInterval = setInterval(() => {
      if (state.timeRemaining > 0) {
        state.timeRemaining--;
        updateTimerDisplay();
      } else {
        clearInterval(state.timerInterval);
        state.isTimerRunning = false;
        showToast('Time expired! Submitting your answers...', 'warning');
        submitQuizFinal();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const timerDisplay = document.getElementById('active-timer-display');
    const timerPill = document.getElementById('timer-pill');
    const timerIcon = document.getElementById('timer-icon');

    if (!timerDisplay) return;

    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formatted;

    // Visual warning when under 2 minutes
    if (state.timeRemaining <= 120 && timerPill) {
      timerPill.classList.remove('bg-surface-container-high');
      timerPill.classList.add('bg-error-container', 'text-error');
      if (timerIcon) timerIcon.classList.add('text-error');
    } else if (timerPill) {
      timerPill.classList.remove('bg-error-container', 'text-error');
      timerPill.classList.add('bg-surface-container-high');
      if (timerIcon) timerIcon.classList.remove('text-error');
    }
  }

  // --- Active Quiz Rendering ---
  function renderActiveQuestion() {
    const quiz = state.quiz || window.SEMINARQUIZ_DATA.getQuiz(state.quizId);
    state.quiz = quiz;
    const questions = quiz.questions;
    const currentQ = questions[state.currentQuestionIndex];

    if (!currentQ) return;

    // Update Quiz Title & Question Indices
    const qIndexDisplay = document.getElementById('active-q-index');
    const qTotalDisplay = document.getElementById('active-q-total');
    const qCategoryBadge = document.getElementById('active-category-badge');
    const qPrompt = document.getElementById('active-question-prompt');
    const qContextStep = document.getElementById('active-context-step');
    const progressBar = document.getElementById('active-progress-bar');
    const answeredCounter = document.getElementById('active-answered-counter');

    if (qIndexDisplay) qIndexDisplay.textContent = `Question ${state.currentQuestionIndex + 1}`;
    if (qTotalDisplay) qTotalDisplay.textContent = `of ${questions.length}`;
    if (qCategoryBadge) qCategoryBadge.textContent = currentQ.categoryName;
    if (qPrompt) qPrompt.textContent = currentQ.question;
    if (qContextStep) qContextStep.textContent = currentQ.subContext || "Data Science Pipeline";

    // Progress Bar
    const progressPercent = ((state.currentQuestionIndex + 1) / questions.length) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    // Answered counter
    const answeredCount = Object.keys(state.answers).length;
    if (answeredCounter) answeredCounter.textContent = `${answeredCount} / ${questions.length} answered`;

    // Bookmark / Mark for Review button state
    const reviewBtn = document.getElementById('active-review-btn');
    const reviewIcon = document.getElementById('active-review-icon');
    const reviewText = document.getElementById('active-review-text');
    const isBookmarked = state.bookmarks.has(currentQ.id);

    if (reviewBtn && reviewIcon && reviewText) {
      if (isBookmarked) {
        reviewBtn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
        reviewBtn.classList.add('bg-primary-fixed', 'text-primary', 'font-semibold');
        reviewIcon.textContent = 'bookmark';
        reviewIcon.classList.add('fill-1');
        reviewText.textContent = 'Marked for Review';
      } else {
        reviewBtn.classList.remove('bg-primary-fixed', 'text-primary', 'font-semibold');
        reviewBtn.classList.add('bg-surface-container-low', 'text-on-surface-variant');
        reviewIcon.textContent = 'bookmark_border';
        reviewIcon.classList.remove('fill-1');
        reviewText.textContent = 'Mark for Review';
      }
    }

    // Render Answer Options
    const optionsContainer = document.getElementById('active-options-list');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    const selectedKey = state.answers[currentQ.id] || null;

    currentQ.options.forEach(opt => {
      const isSelected = selectedKey === opt.key;
      const optionCard = document.createElement('button');
      optionCard.type = 'button';
      optionCard.className = `option-card w-full text-left p-space-md rounded-xl shadow-sm transition-all flex items-start gap-space-md group relative overflow-hidden ${
        isSelected ? 'selected bg-surface-container-low' : 'bg-surface-container-lowest hover:bg-surface-container-low'
      }`;
      optionCard.setAttribute('data-key', opt.key);

      optionCard.innerHTML = `
        <div class="option-indicator-bar absolute left-0 top-0 bottom-0 w-1.5 ${isSelected ? 'bg-primary-container' : 'bg-transparent'}"></div>
        <div class="option-badge w-9 h-9 rounded-lg ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant group-hover:bg-surface-container-high'} font-headline-sm text-headline-sm flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
          ${opt.key}
        </div>
        <div class="flex-1 min-w-0 pt-0.5">
          <p class="font-body-md text-body-md ${isSelected ? 'text-on-surface font-semibold' : 'text-on-surface'} leading-snug">
            ${escapeHtml(opt.text)}
          </p>
        </div>
        <div class="option-check-icon w-6 h-6 rounded-full ${isSelected ? 'bg-primary-container text-on-primary opacity-100' : 'bg-surface-container-highest text-transparent opacity-0'} flex items-center justify-center flex-shrink-0 mt-0.5 transition-all">
          <span class="material-symbols-outlined text-[16px] ${isSelected ? 'fill-1' : ''}">check</span>
        </div>
      `;

      optionCard.addEventListener('click', () => {
        selectOptionNeutral(currentQ.id, opt.key);
      });

      optionsContainer.appendChild(optionCard);
    });

    // Render Question Navigator Strip (Dots)
    renderNavigatorStrip(questions);

    // Update Inline Next/Previous Buttons directly after the Question & Answers
    const inlinePrevBtn = document.getElementById('inline-prev-btn');
    const inlineNextBtn = document.getElementById('inline-next-btn');
    const inlineNextText = document.getElementById('inline-next-text');
    const inlineNextIcon = document.getElementById('inline-next-icon');

    if (inlinePrevBtn) {
      if (state.currentQuestionIndex === 0) {
        inlinePrevBtn.classList.add('hidden');
      } else {
        inlinePrevBtn.classList.remove('hidden');
      }
    }

    if (inlineNextBtn) {
      if (state.currentQuestionIndex === questions.length - 1) {
        if (inlineNextText) inlineNextText.textContent = "Review & Submit";
        if (inlineNextIcon) inlineNextIcon.textContent = "assignment_turned_in";
        inlineNextBtn.classList.remove('bg-primary-container');
        inlineNextBtn.classList.add('bg-tertiary-container');
      } else {
        if (inlineNextText) inlineNextText.textContent = "Next Question";
        if (inlineNextIcon) inlineNextIcon.textContent = "arrow_forward";
        inlineNextBtn.classList.remove('bg-tertiary-container');
        inlineNextBtn.classList.add('bg-primary-container');
      }
    }

    // Update Navigation Buttons (Previous / Next / Submit)
    const prevBtn = document.getElementById('active-prev-btn');
    const nextBtn = document.getElementById('active-next-btn');

    if (prevBtn) {
      prevBtn.disabled = state.currentQuestionIndex === 0;
      prevBtn.style.opacity = state.currentQuestionIndex === 0 ? '0.4' : '1';
    }

    if (nextBtn) {
      if (state.currentQuestionIndex === questions.length - 1) {
        nextBtn.innerHTML = `<span>Review & Submit</span><span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>`;
      } else {
        nextBtn.innerHTML = `<span>Next Question</span><span class="material-symbols-outlined text-[20px]">chevron_right</span>`;
      }
    }
  }

  /**
   * Neutral Option Selection:
   * Saves the chosen option without revealing whether it is right or wrong.
   */
  function selectOptionNeutral(questionId, selectedKey) {
    state.answers[questionId] = selectedKey;

    // Trigger visual auto-saved indicator
    const autoSaved = document.getElementById('active-autosaved-pill');
    if (autoSaved) {
      autoSaved.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span><span>Saved</span>`;
      setTimeout(() => {
        autoSaved.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span><span>Auto-saved</span>`;
      }, 500);
    }

    // Re-render active question to update selection styling
    renderActiveQuestion();
  }

  function toggleCurrentBookmark() {
    const quiz = state.quiz || window.SEMINARQUIZ_DATA.getQuiz(state.quizId);
    const currentQ = quiz.questions[state.currentQuestionIndex];
    if (!currentQ) return;

    if (state.bookmarks.has(currentQ.id)) {
      state.bookmarks.delete(currentQ.id);
      showToast('Removed from review bookmarks', 'info');
    } else {
      state.bookmarks.add(currentQ.id);
      showToast('Question marked for review', 'info');
    }
    renderActiveQuestion();
  }

  function nextQuestion() {
    const quiz = state.quiz || window.SEMINARQUIZ_DATA.getQuiz(state.quizId);
    if (state.currentQuestionIndex < quiz.questions.length - 1) {
      state.currentQuestionIndex++;
      renderActiveQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openSubmitModal();
    }
  }

  function prevQuestion() {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderActiveQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goToQuestion(index) {
    const quiz = state.quiz || window.SEMINARQUIZ_DATA.getQuiz(state.quizId);
    if (index >= 0 && index < quiz.questions.length) {
      state.currentQuestionIndex = index;
      renderActiveQuestion();
      closeSubmitModal();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function renderNavigatorStrip(questions) {
    const container = document.getElementById('active-navigator-strip');
    if (!container) return;
    container.innerHTML = '';

    questions.forEach((q, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('title', `Question ${idx + 1}`);

      const isCurrent = idx === state.currentQuestionIndex;
      const isAnswered = Boolean(state.answers[q.id]);
      const isBookmarked = state.bookmarks.has(q.id);

      let classes = 'rounded-full transition-all duration-200 relative flex items-center justify-center ';

      if (isCurrent) {
        classes += 'w-6 h-3 bg-primary-container ring-2 ring-primary/40 ';
      } else if (isBookmarked) {
        classes += 'w-3 h-3 bg-secondary-fixed-dim ring-1 ring-secondary ';
      } else if (isAnswered) {
        classes += 'w-3 h-3 bg-primary ';
      } else {
        classes += 'w-3 h-3 bg-surface-container-highest hover:bg-surface-variant ';
      }

      dot.className = classes;

      dot.addEventListener('click', () => {
        goToQuestion(idx);
      });

      container.appendChild(dot);
    });
  }

  // --- Submit Modal (Confirmation) ---
  function openSubmitModal() {
    const quiz = state.quiz || window.SEMINARQUIZ_DATA.getQuiz(state.quizId);
    const questions = quiz.questions;
    const total = questions.length;
    const answeredCount = Object.keys(state.answers).length;
    const unansweredCount = total - answeredCount;
    const reviewCount = state.bookmarks.size;

    const modal = document.getElementById('submit-modal');
    const modalTotal = document.getElementById('modal-total-questions');
    const modalAnswered = document.getElementById('modal-answered-count');
    const modalUnanswered = document.getElementById('modal-unanswered-count');
    const modalReview = document.getElementById('modal-review-count');
    const modalUnansweredList = document.getElementById('modal-unanswered-list');

    if (modalTotal) modalTotal.textContent = total;
    if (modalAnswered) modalAnswered.textContent = answeredCount;
    if (modalReview) modalReview.textContent = `${reviewCount} ${reviewCount === 1 ? 'question' : 'questions'}`;

    if (modalUnanswered) {
      if (unansweredCount === 0) {
        modalUnanswered.textContent = '0 (All questions answered!)';
        modalUnanswered.className = 'font-label-md text-label-md text-tertiary';
      } else {
        modalUnanswered.textContent = `${unansweredCount} remaining`;
        modalUnanswered.className = 'font-label-md text-label-md text-error';
      }
    }

    // List unanswered question buttons for quick jumping
    if (modalUnansweredList) {
      modalUnansweredList.innerHTML = '';
      if (unansweredCount > 0) {
        const titleSpan = document.createElement('div');
        titleSpan.className = 'text-xs text-on-surface-variant font-medium mt-1';
        titleSpan.textContent = 'Jump to unanswered:';
        modalUnansweredList.appendChild(titleSpan);

        const btnRow = document.createElement('div');
        btnRow.className = 'flex flex-wrap gap-1.5 mt-1';

        questions.forEach((q, idx) => {
          if (!state.answers[q.id]) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'px-2 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded text-xs font-bold transition-all';
            btn.textContent = `Q${idx + 1}`;
            btn.addEventListener('click', () => {
              goToQuestion(idx);
            });
            btnRow.appendChild(btn);
          }
        });
        modalUnansweredList.appendChild(btnRow);
      }
    }

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex', 'open');
    }
  }

  function closeSubmitModal() {
    const modal = document.getElementById('submit-modal');
    if (modal) {
      modal.classList.remove('open');
      setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }, 200);
    }
  }

  // --- Score Engine & Results Evaluation ---
  function computeResults() {
    const quiz = state.quiz || window.SEMINARQUIZ_DATA.getQuiz(state.quizId);
    state.quiz = quiz;
    state.endTime = new Date();

    const questions = quiz.questions;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const detailedAnswers = [];

    // Category accumulator
    const categoryStats = {};
    quiz.categories.forEach(cat => {
      categoryStats[cat.id] = {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        total: 0,
        correct: 0
      };
    });

    questions.forEach(q => {
      const selected = state.answers[q.id] || null;
      const isCorrect = selected === q.correctAnswer;

      if (!categoryStats[q.category]) {
        categoryStats[q.category] = {
          id: q.category,
          name: q.categoryName || q.category,
          icon: 'category',
          total: 0,
          correct: 0
        };
      }

      categoryStats[q.category].total++;

      if (selected === null) {
        unansweredCount++;
      } else if (isCorrect) {
        score++;
        correctCount++;
        categoryStats[q.category].correct++;
      } else {
        incorrectCount++;
      }

      detailedAnswers.push({
        id: q.id,
        category: q.category,
        categoryName: q.categoryName,
        question: q.question,
        options: q.options,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        explanation: q.explanation
      });
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Compute duration spent
    const totalTimeSpentSeconds = state.startTime
      ? Math.max(1, Math.round((state.endTime - state.startTime) / 1000))
      : 8 * 60 - state.timeRemaining;

    const minutesSpent = Math.floor(totalTimeSpentSeconds / 60);
    const secondsSpent = totalTimeSpentSeconds % 60;
    const timeFormatted = `${minutesSpent}m ${secondsSpent}s`;

    state.results = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      participantName: state.participantName || "Anonymous Participant",
      score: score,
      totalQuestions: totalQuestions,
      percentage: percentage,
      passPercentage: quiz.passPercentage || 60,
      passed: percentage >= (quiz.passPercentage || 60),
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      unansweredCount: unansweredCount,
      timeFormatted: timeFormatted,
      timeSpentSeconds: totalTimeSpentSeconds,
      categories: Object.values(categoryStats),
      detailedAnswers: detailedAnswers
    };

    return state.results;
  }

  async function submitQuizFinal() {
    clearInterval(state.timerInterval);
    state.isTimerRunning = false;
    closeSubmitModal();

    const results = computeResults();

    // Trigger asynchronous Formspree dispatch (non-blocking)
    if (window.SeminarQuizFormspree) {
      window.SeminarQuizFormspree.submitResults(results).catch(e => {
        console.warn("Formspree dispatch background error:", e);
      });
    }

    navigateTo(`#/quiz/${state.quizId}/results`);
  }

  // --- Results View Rendering ---
  function renderResultsView() {
    const results = state.results;
    if (!results) return;

    // Percentage & Circular SVG Gauge
    const scorePercentEl = document.getElementById('results-score-percent');
    const scoreBadgeEl = document.getElementById('results-score-badge');
    const scoreSummarySubtitle = document.getElementById('results-summary-subtitle');
    const feedbackTitle = document.getElementById('results-feedback-title');
    const feedbackDesc = document.getElementById('results-feedback-desc');

    if (scorePercentEl) scorePercentEl.innerHTML = `${results.percentage}<span class="text-secondary text-headline-md">%</span>`;
    if (scoreBadgeEl) scoreBadgeEl.textContent = `${results.score} of ${results.totalQuestions} Correct`;
    if (scoreSummarySubtitle) scoreSummarySubtitle.innerHTML = `Here's how you performed in <span class="font-label-md text-on-surface">${results.quizTitle}</span>`;

    // SVG Circle Animation
    // Circumference = 2 * PI * 68 ≈ 427.25
    const circleGauge = document.getElementById('results-score-circle');
    if (circleGauge) {
      const circumference = 427.25;
      const offset = circumference * (1 - results.percentage / 100);
      circleGauge.style.strokeDashoffset = circumference;
      setTimeout(() => {
        circleGauge.style.strokeDashoffset = offset;
      }, 100);
    }

    // Dynamic Feedback Banner
    if (feedbackTitle && feedbackDesc) {
      if (results.percentage >= 85) {
        feedbackTitle.textContent = "Top Tier Mastery";
        feedbackDesc.textContent = "Exceptional performance! You demonstrated comprehensive command over data science pipelines, algorithms, and evaluation metrics.";
      } else if (results.percentage >= 70) {
        feedbackTitle.textContent = "Solid Understanding";
        feedbackDesc.textContent = "Great work! You scored well across the core topics with a few specific concepts that can be sharpened in your next session.";
      } else if (results.percentage >= 50) {
        feedbackTitle.textContent = "Foundations in Progress";
        feedbackDesc.textContent = "Good attempt! Review the answered questions below to clarify key lifecycle steps and model evaluation distinctions.";
      } else {
        feedbackTitle.textContent = "Learning Opportunity";
        feedbackDesc.textContent = "Every test is a step toward mastery. Take a look at the comprehensive answer key to improve.";
      }
    }

    // 4 Key Metric Cards
    const metricCorrect = document.getElementById('metric-correct');
    const metricIncorrect = document.getElementById('metric-incorrect');
    const metricUnanswered = document.getElementById('metric-unanswered');
    const metricTime = document.getElementById('metric-time');

    if (metricCorrect) metricCorrect.textContent = results.correctCount;
    if (metricIncorrect) metricIncorrect.textContent = results.incorrectCount;
    if (metricUnanswered) metricUnanswered.textContent = results.unansweredCount;
    if (metricTime) metricTime.textContent = results.timeFormatted;

    // Accuracy Analysis Bars
    const barWeight = document.getElementById('results-bar-weight');
    const barAccuracy = document.getElementById('results-bar-accuracy');
    const barAttempted = document.getElementById('results-bar-attempted');
    const textWeight = document.getElementById('results-text-weight');
    const textAccuracy = document.getElementById('results-text-accuracy');
    const textAttempted = document.getElementById('results-text-attempted');

    const accuracyRate = results.totalQuestions - results.unansweredCount > 0
      ? Math.round((results.correctCount / (results.totalQuestions - results.unansweredCount)) * 100)
      : 0;

    const attemptedCount = results.totalQuestions - results.unansweredCount;
    const attemptedPercent = Math.round((attemptedCount / results.totalQuestions) * 100);

    if (barWeight) barWeight.style.width = `${results.percentage}%`;
    if (textWeight) textWeight.textContent = `${results.percentage}%`;
    if (barAccuracy) barAccuracy.style.width = `${accuracyRate}%`;
    if (textAccuracy) textAccuracy.textContent = `${accuracyRate}%`;
    if (barAttempted) barAttempted.style.width = `${attemptedPercent}%`;
    if (textAttempted) textAttempted.textContent = `${attemptedCount} / ${results.totalQuestions} (${attemptedPercent}%)`;

    // Dynamic Topic Performance Breakdown
    renderTopicBreakdown(results.categories);

    // Confetti celebration if passed!
    if (results.percentage >= 60 && typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function renderTopicBreakdown(categories) {
    const container = document.getElementById('results-topic-container');
    if (!container) return;
    container.innerHTML = '';

    categories.forEach((cat, index) => {
      const percent = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
      const topicCard = document.createElement('div');
      topicCard.className = 'p-3 rounded-lg bg-surface-container-low flex flex-col gap-2 shadow-xs';

      // Pick accent theme per category
      const colors = [
        { text: 'text-tertiary', bg: 'bg-tertiary' },
        { text: 'text-primary', bg: 'bg-primary' },
        { text: 'text-secondary', bg: 'bg-secondary' },
        { text: 'text-primary-container', bg: 'bg-primary-container' }
      ];
      const color = colors[index % colors.length];

      // Build segmented mini bars
      let segmentsHtml = '';
      for (let i = 0; i < cat.total; i++) {
        const isFilled = i < cat.correct;
        segmentsHtml += `<div class="${isFilled ? color.bg : 'bg-surface-container-highest'} rounded-full"></div>`;
      }

      topicCard.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] ${color.text}">${cat.icon || 'category'}</span>
            <span class="font-label-md text-label-md text-on-surface">${escapeHtml(cat.name)}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">${cat.correct} of ${cat.total}</span>
            <span class="px-2 py-0.5 rounded-full bg-surface-container-lowest font-label-sm text-label-sm ${color.text} font-bold">${percent}%</span>
          </div>
        </div>
        <div class="grid gap-1.5 h-2 w-full" style="grid-template-columns: repeat(${cat.total}, minmax(0, 1fr));">
          ${segmentsHtml}
        </div>
      `;

      container.appendChild(topicCard);
    });
  }

  // --- Answer Review Drawer / Modal ---
  function openReviewModal() {
    const modal = document.getElementById('review-drawer');
    const container = document.getElementById('review-drawer-content');
    if (!modal || !container || !state.results) return;

    container.innerHTML = '';
    const detailed = state.results.detailedAnswers;

    detailed.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col gap-3 shadow-xs';

      const statusBadge = item.selectedAnswer === null
        ? `<span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-xs font-bold">Unanswered</span>`
        : item.isCorrect
        ? `<span class="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">check</span> Correct</span>`
        : `<span class="px-2 py-0.5 rounded bg-error-container text-on-error-container text-xs font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">close</span> Incorrect</span>`;

      let optionsListHtml = '';
      item.options.forEach(opt => {
        const isSelected = item.selectedAnswer === opt.key;
        const isKeyCorrect = opt.key === item.correctAnswer;

        let optClasses = 'p-2.5 rounded-lg flex items-center justify-between text-sm transition-all ';
        let badgeClasses = 'w-6 h-6 rounded flex items-center justify-center font-bold text-xs mr-2 flex-shrink-0 ';

        if (isKeyCorrect) {
          optClasses += 'bg-tertiary-fixed/40 text-on-surface border border-tertiary ';
          badgeClasses += 'bg-tertiary text-on-tertiary ';
        } else if (isSelected && !item.isCorrect) {
          optClasses += 'bg-error-container/40 text-on-surface border border-error ';
          badgeClasses += 'bg-error text-on-error ';
        } else {
          optClasses += 'bg-surface-container-low text-on-surface-variant ';
          badgeClasses += 'bg-surface-container text-on-surface-variant ';
        }

        optionsListHtml += `
          <div class="${optClasses}">
            <div class="flex items-center min-w-0">
              <span class="${badgeClasses}">${opt.key}</span>
              <span class="truncate">${escapeHtml(opt.text)}</span>
            </div>
            ${
              isKeyCorrect
                ? `<span class="material-symbols-outlined text-tertiary text-[18px] ml-1">check_circle</span>`
                : (isSelected ? `<span class="material-symbols-outlined text-error text-[18px] ml-1">cancel</span>` : '')
            }
          </div>
        `;
      });

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-label-sm text-label-sm text-primary font-bold">Question ${idx + 1}</span>
          ${statusBadge}
        </div>
        <h4 class="font-headline-sm text-headline-sm text-on-surface leading-snug">
          ${escapeHtml(item.question)}
        </h4>
        <div class="flex flex-col gap-2">
          ${optionsListHtml}
        </div>
        <div class="p-3 rounded-lg bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
          <strong class="text-primary block mb-0.5">Explanation:</strong>
          ${escapeHtml(item.explanation)}
        </div>
      `;

      container.appendChild(card);
    });

    modal.classList.remove('hidden');
    modal.classList.add('flex', 'open');
  }

  function closeReviewModal() {
    const modal = document.getElementById('review-drawer');
    if (modal) {
      modal.classList.remove('open');
      setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }, 200);
    }
  }

  // --- Organizer View & QR Generator ---
  function renderOrganizerView() {
    const quiz = window.SEMINARQUIZ_DATA.getQuiz(state.quizId);
    state.quiz = quiz;

    // Public URL to the quiz welcome room
    const currentBase = window.location.href.split('#')[0].split('?')[0];
    const publicQuizUrl = `${currentBase}#/quiz/${quiz.id}`;

    const urlDisplay = document.getElementById('organizer-public-url');
    if (urlDisplay) urlDisplay.value = publicQuizUrl;

    // Load saved Formspree endpoint into input
    const formspreeInput = document.getElementById('organizer-formspree-input');
    if (formspreeInput && window.SeminarQuizFormspree) {
      formspreeInput.value = window.SeminarQuizFormspree.getEndpoint();
    }

    // Generate Scannable QR Code
    const qrContainer = document.getElementById('organizer-qr-canvas');
    if (qrContainer && typeof QRCode !== 'undefined') {
      qrContainer.innerHTML = '';
      state.qrInstance = new QRCode(qrContainer, {
        text: publicQuizUrl,
        width: 200,
        height: 200,
        colorDark: "#1a1a2d",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    // Generate Printable Poster QR Code
    const posterQrContainer = document.getElementById('poster-qr-canvas');
    if (posterQrContainer && typeof QRCode !== 'undefined') {
      posterQrContainer.innerHTML = '';
      state.posterQrInstance = new QRCode(posterQrContainer, {
        text: publicQuizUrl,
        width: 240,
        height: 240,
        colorDark: "#1a1a2d",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    // Update Poster details
    const posterTitle = document.getElementById('poster-quiz-title');
    const posterPin = document.getElementById('poster-session-pin');
    const posterUrlText = document.getElementById('poster-url-text');
    if (posterTitle) posterTitle.textContent = quiz.title;
    if (posterPin) posterPin.textContent = `Room #${quiz.roomCode}`;
    if (posterUrlText) posterUrlText.textContent = publicQuizUrl;
  }

  function copyPublicUrl() {
    const urlDisplay = document.getElementById('organizer-public-url');
    if (!urlDisplay) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(urlDisplay.value).then(() => {
        showToast('Public Quiz URL copied to clipboard!', 'success');
      }).catch(() => {
        fallbackCopyText(urlDisplay.value);
      });
    } else {
      fallbackCopyText(urlDisplay.value);
    }
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Public Quiz URL copied!', 'success');
  }

  function downloadQrCode() {
    const qrContainer = document.getElementById('organizer-qr-canvas');
    if (!qrContainer) return;

    const img = qrContainer.querySelector('img');
    const canvas = qrContainer.querySelector('canvas');

    let dataUrl = '';
    if (img && img.src) {
      dataUrl = img.src;
    } else if (canvas) {
      dataUrl = canvas.toDataURL('image/png');
    }

    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `seminarquiz-${state.quizId}-qr.png`;
      link.href = dataUrl;
      link.click();
      showToast('QR Code downloaded successfully!', 'success');
    } else {
      showToast('Unable to extract QR image', 'error');
    }
  }

  function saveFormspreeConfig() {
    const input = document.getElementById('organizer-formspree-input');
    if (!input || !window.SeminarQuizFormspree) return;

    const savedEndpoint = window.SeminarQuizFormspree.setEndpoint(input.value);
    if (savedEndpoint) {
      showToast(`Formspree endpoint saved: ${savedEndpoint}`, 'success');
    } else {
      showToast('Formspree endpoint cleared. Submissions will be kept in local session.', 'info');
    }
  }

  function printQrPoster() {
    renderOrganizerView();
    setTimeout(() => {
      window.print();
    }, 200);
  }

  // --- Share Result Utility ---
  function shareResult() {
    if (!state.results) return;

    const shareData = {
      title: `SeminarQuiz: ${state.results.quizTitle}`,
      text: `I just completed the ${state.results.quizTitle} quiz on SeminarQuiz and scored ${state.results.percentage}% (${state.results.score}/${state.results.totalQuestions} correct)! Can you beat my score?`,
      url: window.location.href.split('#')[0] + `#/quiz/${state.quizId}`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareData.text} Check it out: ${shareData.url}`).then(() => {
        showToast('Result summary copied to clipboard!', 'success');
      });
    } else {
      showToast('Sharing link prepared!', 'info');
    }
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'info') {
    const toast = document.getElementById('toast-container');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast || !toastText) return;

    toastText.textContent = message;

    if (toastIcon) {
      if (type === 'success') {
        toastIcon.textContent = 'check_circle';
        toastIcon.className = 'material-symbols-outlined text-[18px] text-tertiary fill-1';
      } else if (type === 'warning') {
        toastIcon.textContent = 'warning';
        toastIcon.className = 'material-symbols-outlined text-[18px] text-amber-500 fill-1';
      } else if (type === 'error') {
        toastIcon.textContent = 'error';
        toastIcon.className = 'material-symbols-outlined text-[18px] text-error fill-1';
      } else {
        toastIcon.textContent = 'info';
        toastIcon.className = 'material-symbols-outlined text-[18px] text-primary fill-1';
      }
    }

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // --- Helper Utilities ---
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Event Bindings ---
  function attachEventHandlers() {
    // Welcome screen start button
    const startBtn = document.getElementById('start-quiz-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const nameModal = document.getElementById('name-modal');
        if (nameModal) {
          nameModal.classList.remove('hidden');
          nameModal.classList.add('flex');
        } else {
          startQuizSession();
        }
      });
    }

    const nameModalCancel = document.getElementById('name-modal-cancel');
    if (nameModalCancel) {
      nameModalCancel.addEventListener('click', () => {
        const nameModal = document.getElementById('name-modal');
        nameModal.classList.remove('flex');
        nameModal.classList.add('hidden');
      });
    }

    const nameModalStart = document.getElementById('name-modal-start');
    if (nameModalStart) {
      nameModalStart.addEventListener('click', () => {
        const nameInput = document.getElementById('participant-name-input');
        if (nameInput && nameInput.value.trim()) {
          const newName = nameInput.value.trim();
          let usedNames = JSON.parse(localStorage.getItem('seminarquiz_used_names') || '[]');
          if (usedNames.includes(newName.toLowerCase())) {
            alert('user name already exits');
            return;
          }
          usedNames.push(newName.toLowerCase());
          localStorage.setItem('seminarquiz_used_names', JSON.stringify(usedNames));
          
          state.participantName = newName;
          const nameModal = document.getElementById('name-modal');
          nameModal.classList.remove('flex');
          nameModal.classList.add('hidden');
          startQuizSession();
        } else {
          if (nameInput) nameInput.focus();
        }
      });
    }

    // Active Quiz navigation buttons
    const prevBtn = document.getElementById('active-prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', prevQuestion);

    const nextBtn = document.getElementById('active-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);

    const inlinePrevBtn = document.getElementById('inline-prev-btn');
    if (inlinePrevBtn) inlinePrevBtn.addEventListener('click', prevQuestion);

    const inlineNextBtn = document.getElementById('inline-next-btn');
    if (inlineNextBtn) inlineNextBtn.addEventListener('click', nextQuestion);

    const finishBtn = document.getElementById('active-finish-top-btn');
    if (finishBtn) finishBtn.addEventListener('click', openSubmitModal);

    const reviewBtn = document.getElementById('active-review-btn');
    if (reviewBtn) reviewBtn.addEventListener('click', toggleCurrentBookmark);

    // Submit Modal buttons
    const modalSubmitBtn = document.getElementById('modal-submit-btn');
    if (modalSubmitBtn) modalSubmitBtn.addEventListener('click', submitQuizFinal);

    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeSubmitModal);

    // Results Actions
    const btnReviewAnswers = document.getElementById('btn-review-answers');
    if (btnReviewAnswers) btnReviewAnswers.addEventListener('click', openReviewModal);


    const btnShareResult = document.getElementById('btn-share-result');
    if (btnShareResult) btnShareResult.addEventListener('click', shareResult);

    const closeReviewDrawerBtn = document.getElementById('close-review-drawer-btn');
    if (closeReviewDrawerBtn) closeReviewDrawerBtn.addEventListener('click', closeReviewModal);

    // Organizer buttons
    const copyUrlBtn = document.getElementById('organizer-copy-url-btn');
    if (copyUrlBtn) copyUrlBtn.addEventListener('click', copyPublicUrl);

    const downloadQrBtn = document.getElementById('organizer-download-qr-btn');
    if (downloadQrBtn) downloadQrBtn.addEventListener('click', downloadQrCode);

    const saveFormspreeBtn = document.getElementById('organizer-save-formspree-btn');
    if (saveFormspreeBtn) saveFormspreeBtn.addEventListener('click', saveFormspreeConfig);

    const printPosterBtn = document.getElementById('organizer-print-poster-btn');
    if (printPosterBtn) printPosterBtn.addEventListener('click', printQrPoster);
  }

  // --- Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    attachEventHandlers();
    initRouter();
  });

  // Expose API for debug & console interaction
  window.SeminarQuizApp = {
    state: state,
    navigateTo: navigateTo,
    selectOption: selectOptionNeutral,
    submitQuiz: submitQuizFinal,
    showToast: showToast
  };

})();
