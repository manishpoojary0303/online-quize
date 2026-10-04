# QuizNova — High-Performance QR-Based Assessment Platform

QuizNova is a lightweight, zero-friction, browser-native assessment platform designed for live classrooms, conference stages, corporate seminars, and self-paced trivia.

Built faithfully upon the **Google Stitch** design system, QuizNova delivers an editorial-grade experience featuring vibrant digital purple accents, high-contrast typography, and thumb-friendly mobile layouts.

---

## 🚀 Key Features

### 1. Student Flow (Zero Friction)
- **Zero Account / No Login:** Students jump straight in with a single tap in their browser.
- **Dedicated Welcome Room:** Displays the quiz title (*Data Science Fundamentals*), length (*15 Questions*), time limit (*20 Minutes*), format (*Multiple Choice*), and before-you-begin instructions.
- **Neutral Focus Mode Answering:**
  - While answering, students can freely select, toggle, and change choices.
  - **No correctness reveal during the test:** Options highlight in neutral purple states without indicating right or wrong answers, preventing bias and guessing.
  - Auto-saved indicator ensures participants feel secure about their inputs.
- **Prominent Next Button After Every Question:**
  - Directly underneath each question's answer options, a large, thumb-friendly **"Next Question"** button allows students to advance effortlessly.
  - On Question 1, the Next button expands full width.
  - On Questions 2 through 14, both **"Previous"** and **"Next Question"** buttons are available directly beneath the options.
  - On Question 15, the button dynamically transforms to **"Review & Submit"**.
- **Submission Confirmation Modal:**
  - Displays Total Questions (15), Answered count, Unanswered count (with direct jump-to shortcuts), and Marked for Review count before final confirmation.
- **Instant Result Analytics:**
  - Animated SVG circular score ring showing final score and percentage.
  - Performance feedback banner (*Top Tier Mastery*, *Solid Understanding*, etc.).
  - 4 Key metric cards: Correct count, Incorrect count, Unanswered count, and Time Taken.
  - Detailed Accuracy Analysis progress gauges.
  - Dynamic 4-domain topic breakdown:
    1. *Data Science Foundations* (4 questions)
    2. *Data Cleaning & Preprocessing* (3 questions)
    3. *Machine Learning & Algorithms* (5 questions)
    4. *Model Evaluation & Applied AI* (3 questions)
  - Full **Answer Review Drawer** with explanations for each question.
  - Retake Quiz and Share Result utilities.

### 2. Organizer & Presenter Tools
- **Live QR Studio:**
  - Real-time scannable QR code generation encoding the exact public quiz URL.
  - Instant **"Copy Quiz URL"** button with clipboard toast notification.
  - High-resolution **"Download PNG"** QR code button.
- **Printable Stage / Classroom Poster:**
  - Dedicated `@media print` layout formatting an 8.5x11 / A4 printable poster.
  - Includes high-contrast QuizNova branding, big scannable QR code, session PIN (`#4829`), and 3-step instructions for participants.
- **Formspree Integration:**
  - Non-blocking client-side dispatch of submission summaries.
  - Formspree endpoint can be customized and saved right in the Host Studio.
  - Scoring is verified locally using the verified answer key.

---

## 📚 Question Dataset (Data Science Fundamentals)

The platform includes all 15 authentic Data Science questions, answer keys, and pedagogical explanations in [assets/js/quiz-data.js](file:///assets/js/quiz-data.js):

| # | Question Summary | Options | Correct Answer | Domain |
|---|------------------|---------|----------------|--------|
| 1 | What is Data Science? | A, B, C, D | **B** (Stats, CS & Domain) | Foundations |
| 2 | Not one of three pillars of Data Science? | A, B, C, D | **D** (Graphic Design) | Foundations |
| 3 | First step in Data Science lifecycle? | A, B, C, D | **C** (Define business question) | Foundations |
| 4 | Data organized in rows and columns? | A, B, C, D | **B** (Structured) | Cleaning & Prep |
| 5 | Technique to handle missing data? | A, B, C, D | **A** (Imputation) | Cleaning & Prep |
| 6 | Best chart for trend over time? | A, B, C, D | **C** (Line chart) | Visualization |
| 7 | What does Bayes' theorem help us do? | A, B, C, D | **B** (Update probability) | ML Core |
| 8 | ML using labeled data? | A, B, C, D | **C** (Supervised learning) | ML Core |
| 9 | Example of classification? | A, B, C, D | **C** (Spam detection) | ML Core |
| 10 | Commonly used clustering algorithm? | A, B, C, D | **A** (K-Means) | ML Core |
| 11 | In RL, an agent learns through? | A, B, C, D | **B** (Trial & error rewards) | ML Core |
| 12 | What is overfitting? | A, B, C, D | **B** (Memorizes noise) | Model Evaluation |
| 13 | Metric for actual positives correctly identified? | A, B, C, D | **B** (Recall) | Model Evaluation |
| 14 | What does NLP stand for? | A, B, C, D | **B** (Natural Language Processing) | Applied AI |
| 15 | One of the 5 V's of Big Data? | A, B, C, D | **A** (Volume) | Big Data |

---

## 💻 How to Run Locally

### Option 1: Native Windows PowerShell Server (Recommended)
You do not need Node.js or Python. Run the included PowerShell server script:

```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 3000
```

- Web App: `http://localhost:3000/`
- Direct Quiz Welcome: `http://localhost:3000/#/quiz/ds-fundamentals`
- Host QR Studio: `http://localhost:3000/#/organizer`

### Option 2: Direct Browser Opening
Because QuizNova is built with pure web technologies and client-side hash routing, you can directly double-click or open [index.html](file:///index.html) in Chrome, Edge, Safari, or Firefox.

### Option 3: Standard Static Web Servers
If you have Python, Node, or VS Code Live Server:
- **Python:** `python -m http.server 3000`
- **Node/npx:** `npx serve .`

---

## 🌐 Deploying Online (Free & Instant)

Deploy QuizNova to the web in under 2 minutes so audiences worldwide can scan the QR code from their mobile devices:

### GitHub Pages
1. Push this directory to a GitHub repository.
2. In the repository settings, go to **Pages** > Select `main` branch > `/ (root)` folder > Click **Save**.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Vercel / Netlify / Cloudflare Pages
- **Vercel:** Drag and drop this folder into the Vercel dashboard or run `vercel`.
- **Netlify:** Drag and drop this folder into [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages:** Connect Git or direct upload.

---

## 🛡️ Formspree Setup (Optional)

1. Create a free form at [formspree.io](https://formspree.io).
2. Copy your Form ID (e.g., `xpzgqxxx` or endpoint `https://formspree.io/f/xpzgqxxx`).
3. Open **Host Hub** (`#/organizer`) in QuizNova, paste your Formspree endpoint into the **Formspree Results Dispatch** field, and click **Save Formspree Setting**.
4. Every student quiz submission summary will automatically be dispatched to your Formspree dashboard upon completion.
