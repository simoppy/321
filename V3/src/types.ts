export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
  distractorLogic?: string[]; // Массив объяснений для каждого варианта ответа
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  grade: string;
  date: string;
}

export type Theme = 'light' | 'dark';
