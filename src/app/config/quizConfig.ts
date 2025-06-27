// config/quizConfig.ts

export const QUIZ_CONFIG = {
  // Time settings (in seconds)
  timeLimit: 3600, // 1 hour
  warningTime: 300, // Show warning when 5 minutes left

  // Question selection
  questionSelection: {
    mode: "all", // 'all' | 'random' | 'byLevel' | 'byRole'
    randomCount: 20,
    levelDistribution: {
      easy: 8,
      medium: 8,
      advanced: 4,
    },
  },

  // Scoring
  scoring: {
    passPercentage: 70,
    showCorrectAnswers: false, // Show correct answers after submission
    pointsPerLevel: {
      easy: 1,
      medium: 2,
      advanced: 3,
    },
  },

  // UI Settings
  ui: {
    showDifficultyIndicator: true,
    showQuestionCategory: true,
    showProgressPercentage: true,
    allowSkipQuestions: false,
    allowReviewBeforeSubmit: true,
  },

  // Instructions
  instructions: {
    title: "Software Engineering Assessment",
    description:
      "This assessment will test your knowledge in various areas of software engineering.",
    rules: [
      "You have 60 minutes to complete the assessment",
      "Each question is multiple choice with only one correct answer",
      "Questions vary in difficulty: Easy, Medium, and Advanced",
      "You cannot go back to previous questions once answered",
      "Your score will be calculated based on correct answers",
    ],
  },
};

// Function to get quiz settings based on user role or preferences
export function getQuizSettings(userRole?: string) {
  // You can customize settings based on user role or preferences
  const settings = { ...QUIZ_CONFIG };

  if (userRole === "beginner") {
    settings.questionSelection.levelDistribution = {
      easy: 15,
      medium: 5,
      advanced: 0,
    };
  } else if (userRole === "expert") {
    settings.questionSelection.levelDistribution = {
      easy: 0,
      medium: 10,
      advanced: 10,
    };
  }

  return settings;
}
