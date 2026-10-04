/**
 * QuizNova - Question Data & Answer Key
 * Quiz: Data Science Fundamentals
 * Total Questions: 15
 * 
 * Note: Correct answers are evaluated only upon quiz submission.
 * While answering, participants do not receive immediate correctness feedback.
 */

window.QUIZNOVA_DATA = {
  quizzes: {
    "ds-fundamentals": {
      id: "ds-fundamentals",
      roomCode: "4829",
      title: "Data Science Fundamentals",
      module: "Module 4 Assessment",
      host: "Dr. Aris Vance",
      description: "Test your understanding of data science concepts, data wrangling, model evaluation, and applications.",
      durationMinutes: 8,
      totalQuestions: 15,
      passPercentage: 60,
      categories: [
        { id: "foundations", name: "Data Science Foundations", icon: "school" },
        { id: "cleaning", name: "Data Cleaning & Preprocessing", icon: "cleaning_services" },
        { id: "ml", name: "Machine Learning & Algorithms", icon: "model_training" },
        { id: "evaluation", name: "Model Evaluation & Applied AI", icon: "tune" }
      ],
      questions: [
        {
          id: 1,
          category: "foundations",
          categoryName: "Data Science Foundations",
          subContext: "Core Disciplines • Step 1",
          question: "What is Data Science?",
          options: [
            { key: "A", text: "Only programming" },
            { key: "B", text: "A field combining statistics, computer science, and domain expertise" },
            { key: "C", text: "Only database management" },
            { key: "D", text: "Only mathematics" }
          ],
          correctAnswer: "B",
          explanation: "Data Science is an interdisciplinary field integrating statistics, computer science/programming, and domain knowledge to extract insights from structured and unstructured data."
        },
        {
          id: 2,
          category: "foundations",
          categoryName: "Data Science Foundations",
          subContext: "Pillars of Science • Step 1",
          question: "Which of the following is NOT one of the three pillars of Data Science?",
          options: [
            { key: "A", text: "Mathematics & Statistics" },
            { key: "B", text: "Programming & Engineering" },
            { key: "C", text: "Domain Expertise" },
            { key: "D", text: "Graphic Design" }
          ],
          correctAnswer: "D",
          explanation: "The foundational pillars of Data Science comprise Mathematics/Statistics, Computer Science/Programming, and Domain Expertise. Graphic Design is not one of the primary pillars."
        },
        {
          id: 3,
          category: "foundations",
          categoryName: "Data Science Foundations",
          subContext: "Project Lifecycle • Step 1",
          question: "What is the first step in the Data Science lifecycle?",
          options: [
            { key: "A", text: "Model" },
            { key: "B", text: "Deploy" },
            { key: "C", text: "Define the business question" },
            { key: "D", text: "Explore" }
          ],
          correctAnswer: "C",
          explanation: "Defining the business problem or research question provides the objective and scope that guides data collection, exploration, modeling, and deployment."
        },
        {
          id: 4,
          category: "cleaning",
          categoryName: "Data Cleaning & Preprocessing",
          subContext: "Data Organization • Step 2",
          question: "Which type of data is organized in rows and columns?",
          options: [
            { key: "A", text: "Unstructured" },
            { key: "B", text: "Structured" },
            { key: "C", text: "Semi-structured" },
            { key: "D", text: "Audio data" }
          ],
          correctAnswer: "B",
          explanation: "Structured data follows a rigid tabular schema organized into discrete rows (records) and columns (features/attributes), commonly found in relational databases and spreadsheets."
        },
        {
          id: 5,
          category: "cleaning",
          categoryName: "Data Cleaning & Preprocessing",
          subContext: "Handling Nulls • Step 2",
          question: "Which technique can be used to handle missing data?",
          options: [
            { key: "A", text: "Imputation" },
            { key: "B", text: "Encryption" },
            { key: "C", text: "Compilation" },
            { key: "D", text: "Rendering" }
          ],
          correctAnswer: "A",
          explanation: "Imputation is the statistical practice of replacing missing data with substituted values (such as mean, median, mode, or k-nearest neighbor predictions)."
        },
        {
          id: 6,
          category: "cleaning",
          categoryName: "Data Cleaning & Preprocessing",
          subContext: "Exploratory Visuals • Step 2",
          question: "Which chart is best for showing a trend over time?",
          options: [
            { key: "A", text: "Pie chart" },
            { key: "B", text: "Scatter plot" },
            { key: "C", text: "Line chart" },
            { key: "D", text: "Histogram" }
          ],
          correctAnswer: "C",
          explanation: "Line charts connect continuous data points across time intervals on the horizontal axis, making temporal patterns, seasonality, and long-term trends clear."
        },
        {
          id: 7,
          category: "ml",
          categoryName: "Machine Learning & Algorithms",
          subContext: "Probability Theory • Step 3",
          question: "What does Bayes' theorem help us do?",
          options: [
            { key: "A", text: "Store data" },
            { key: "B", text: "Update probability based on new evidence" },
            { key: "C", text: "Create charts" },
            { key: "D", text: "Clean duplicate records" }
          ],
          correctAnswer: "B",
          explanation: "Bayes' theorem provides a mathematical rule for updating prior beliefs or probabilities in light of new observable evidence."
        },
        {
          id: 8,
          category: "ml",
          categoryName: "Machine Learning & Algorithms",
          subContext: "Learning Paradigms • Step 3",
          question: "Which type of machine learning uses labeled data?",
          options: [
            { key: "A", text: "Unsupervised learning" },
            { key: "B", text: "Reinforcement learning" },
            { key: "C", text: "Supervised learning" },
            { key: "D", text: "Deep learning" }
          ],
          correctAnswer: "C",
          explanation: "In supervised learning, models learn mapping functions from input features to ground-truth labels provided during training."
        },
        {
          id: 9,
          category: "ml",
          categoryName: "Machine Learning & Algorithms",
          subContext: "Supervised Tasks • Step 3",
          question: "Which of the following is an example of classification?",
          options: [
            { key: "A", text: "Predicting house price" },
            { key: "B", text: "Predicting temperature" },
            { key: "C", text: "Spam detection" },
            { key: "D", text: "Forecasting demand" }
          ],
          correctAnswer: "C",
          explanation: "Spam detection classifies messages into discrete categories ('Spam' vs. 'Not Spam'). In contrast, house price, temperature, and demand forecasting are continuous regression problems."
        },
        {
          id: 10,
          category: "ml",
          categoryName: "Machine Learning & Algorithms",
          subContext: "Unsupervised Methods • Step 3",
          question: "Which algorithm is commonly used for clustering?",
          options: [
            { key: "A", text: "K-Means" },
            { key: "B", text: "Linear Regression" },
            { key: "C", text: "Logistic Regression" },
            { key: "D", text: "SVM" }
          ],
          correctAnswer: "A",
          explanation: "K-Means is an unsupervised clustering algorithm that iteratively groups unlabeled data points into k distinct clusters based on geometric feature distance."
        },
        {
          id: 11,
          category: "ml",
          categoryName: "Machine Learning & Algorithms",
          subContext: "Agent Optimization • Step 3",
          question: "In reinforcement learning, an agent learns through:",
          options: [
            { key: "A", text: "Labels only" },
            { key: "B", text: "Trial and error using rewards or penalties" },
            { key: "C", text: "Data cleaning" },
            { key: "D", text: "Manual programming of every rule" }
          ],
          correctAnswer: "B",
          explanation: "Reinforcement learning agents navigate an environment taking actions to maximize cumulative rewards and minimize penalties through trial and feedback."
        },
        {
          id: 12,
          category: "evaluation",
          categoryName: "Model Evaluation & Applied AI",
          subContext: "Generalization • Step 4",
          question: "What is overfitting?",
          options: [
            { key: "A", text: "Model is too simple" },
            { key: "B", text: "Model memorizes training noise and performs poorly on new data" },
            { key: "C", text: "Model has no training data" },
            { key: "D", text: "Model only uses categorical data" }
          ],
          correctAnswer: "B",
          explanation: "Overfitting happens when a model fits the training set too closely, capturing stochastic noise rather than the underlying pattern, which degrades out-of-sample generalization."
        },
        {
          id: 13,
          category: "evaluation",
          categoryName: "Model Evaluation & Applied AI",
          subContext: "Validation Metrics • Step 4",
          question: "Which metric is especially useful for measuring the percentage of actual positives correctly identified?",
          options: [
            { key: "A", text: "Accuracy" },
            { key: "B", text: "Recall" },
            { key: "C", text: "MAE" },
            { key: "D", text: "R²" }
          ],
          correctAnswer: "B",
          explanation: "Recall (Sensitivity / True Positive Rate) measures True Positives / (True Positives + False Negatives), highlighting how effectively all true cases were caught."
        },
        {
          id: 14,
          category: "evaluation",
          categoryName: "Model Evaluation & Applied AI",
          subContext: "AI Disciplines • Step 4",
          question: "What does NLP stand for?",
          options: [
            { key: "A", text: "Neural Learning Process" },
            { key: "B", text: "Natural Language Processing" },
            { key: "C", text: "Network Learning Program" },
            { key: "D", text: "Numerical Language Prediction" }
          ],
          correctAnswer: "B",
          explanation: "Natural Language Processing (NLP) is the branch of AI concerned with enabling software to understand, interpret, and generate human language."
        },
        {
          id: 15,
          category: "foundations",
          categoryName: "Data Science Foundations",
          subContext: "Scale & Dimensions • Step 1",
          question: "Which of the following is one of the 5 V's of Big Data?",
          options: [
            { key: "A", text: "Volume" },
            { key: "B", text: "Vision" },
            { key: "C", text: "Verification" },
            { key: "D", text: "Virtualization" }
          ],
          correctAnswer: "A",
          explanation: "The 5 V's of Big Data are Volume, Velocity, Variety, Veracity, and Value."
        }
      ]
    }
  },

  // Helper method to get quiz
  getQuiz: function(quizId) {
    return this.quizzes[quizId] || this.quizzes["ds-fundamentals"];
  }
};
