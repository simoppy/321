/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, ChevronRight, ChevronLeft, RotateCcw, User, Zap, Shield, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUESTIONS } from './constants';
import { QuizResult, Theme } from './types';

export default function App() {
  const [view, setView] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [theme, setTheme] = useState<Theme>('dark');
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
    
    const savedResult = localStorage.getItem('lastResult');
    if (savedResult) setLastResult(JSON.parse(savedResult));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const startQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setView('quiz');
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    let score = 0;
    QUESTIONS.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / QUESTIONS.length) * 100;
    let grade = '';
    if (percentage >= 90) grade = '5';
    else if (percentage >= 75) grade = '4';
    else if (percentage >= 60) grade = '3';
    else grade = '2';

    const result: QuizResult = {
      score,
      total: QUESTIONS.length,
      percentage,
      grade,
      date: new Date().toLocaleString(),
    };

    setLastResult(result);
    localStorage.setItem('lastResult', JSON.stringify(result));
    setView('result');

    if (grade === '5') {
      const confettiColors = theme === 'dark' ? ['#FFDE00', '#000000', '#ffffff'] : ['#059669', '#ffffff', '#064E3B'];
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center mb-16 animate-fade-up">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[var(--text-on-accent)] font-bold text-2xl shadow-lg" style={{ backgroundColor: 'var(--accent)' }}>
            <Terminal size={28} />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight leading-none uppercase">ИНФОРМАТИКА</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold mt-1">Макеев Семён, ИСиП-1-25</p>
          </div>
        </div>

        <button
          onClick={handleToggleTheme}
          className="p-4 rounded-2xl bento-card hover:opacity-80 transition-all"
        >
          {theme === 'light' ? <Sun size={22} className="text-[var(--accent)]" /> : <Moon size={22} className="text-[var(--accent)]" />}
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <AnimatePresence mode="wait">
          {view === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full"
            >
              <div className="md:col-span-4 bento-card flex flex-col justify-center py-20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 group-hover:opacity-20 transition-all duration-700" style={{ backgroundColor: 'var(--accent)' }}></div>
                <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight leading-[1.1]">
                  Интеллектуальная <br /> <span style={{ color: 'var(--accent)' }}>система</span> тестирования
                </h2>
                <p className="text-xl opacity-60 mb-10 max-w-xl leading-relaxed">
                  Профессиональная среда для проверки знаний. Bento Grid интерфейс, мгновенная аналитика и безупречная эстетика.
                </p>
                <button
                  onClick={startQuiz}
                  className="btn-primary w-fit flex items-center gap-3"
                >
                  НАЧАТЬ ТЕСТ <ChevronRight size={24} />
                </button>
              </div>

              <div className="md:col-span-2 flex flex-col gap-6">
                <div className="bento-card flex-grow flex flex-col justify-center animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  <div className="p-4 rounded-2xl w-fit mb-4" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}>
                    <Zap size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Performance</h3>
                  <p className="text-sm opacity-50">Высокая скорость работы и мгновенный отклик интерфейса.</p>
                </div>
                <div className="bento-card flex-grow flex flex-col justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  <div className="p-4 rounded-2xl w-fit mb-4" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}>
                    <Shield size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Security</h3>
                  <p className="text-sm opacity-50">Локальное хранение данных и полная конфиденциальность.</p>
                </div>
              </div>

              <div className="md:col-span-3 bento-card flex items-center gap-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}>
                  <User size={32} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-40 font-bold mb-1">Автор проекта</p>
                  <p className="font-bold text-2xl">Макеев Семён</p>
                  <p className="text-sm opacity-50">Группа ИСиП-1-25</p>
                </div>
              </div>

              <div className="md:col-span-3 bento-card flex items-center justify-between animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-40 font-bold mb-1">Последний результат</p>
                  <p className="font-bold text-2xl">
                    {lastResult ? `${lastResult.percentage}%` : '---'}
                  </p>
                </div>
                {lastResult && (
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest opacity-40 font-bold mb-1">Оценка</p>
                    <p className="text-4xl font-display font-bold" style={{ color: 'var(--accent)' }}>{lastResult.grade}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-4xl flex flex-col gap-8"
            >
              {/* Progress Bar */}
              <div className="w-full h-1 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}>
                  {QUESTIONS[currentQuestionIndex].category}
                </span>
                <p className="text-sm font-mono opacity-40">Вопрос {currentQuestionIndex + 1} / {QUESTIONS.length}</p>
              </div>

              <div className="bento-card min-h-[200px] flex items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: 'var(--accent)' }}></div>
                <p className="text-3xl md:text-4xl font-display font-bold leading-tight">
                  {QUESTIONS[currentQuestionIndex].text}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`answer-btn p-8 ${answers[currentQuestionIndex] === idx ? 'selected' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                      answers[currentQuestionIndex] === idx ? 'text-[var(--text-on-accent)]' : 'bg-black/5 dark:bg-white/5 opacity-40'
                    }`} style={answers[currentQuestionIndex] === idx ? { backgroundColor: 'var(--accent)' } : {}}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-xl font-medium">{option}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-10">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl bento-card transition-all ${
                    currentQuestionIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-80'
                  }`}
                >
                  <ChevronLeft size={22} /> Назад
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={answers[currentQuestionIndex] === undefined}
                  className={`flex items-center gap-2 px-10 py-4 btn-primary ${
                    answers[currentQuestionIndex] === undefined ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  {currentQuestionIndex === QUESTIONS.length - 1 ? 'ЗАВЕРШИТЬ' : 'ДАЛЕЕ'} <ChevronRight size={22} />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'result' && lastResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-5xl"
            >
              <div className="md:col-span-7 bento-card flex flex-col items-center justify-center py-16 text-center">
                <h2 className="text-4xl font-display font-bold mb-12">Результаты теста</h2>
                
                <div className="relative w-64 h-64 mb-12">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="transparent"
                      className="opacity-5"
                    />
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="var(--accent)"
                      strokeWidth="16"
                      fill="transparent"
                      strokeDasharray={691.15}
                      initial={{ strokeDashoffset: 691.15 }}
                      animate={{ strokeDashoffset: 691.15 - (691.15 * lastResult.percentage) / 100 }}
                      transition={{ duration: 2, ease: "circOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-display font-bold">{lastResult.percentage}%</span>
                    <span className="text-xs uppercase tracking-widest opacity-40 font-bold">Accuracy</span>
                  </div>
                </div>

                <div className="flex gap-12">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{lastResult.score}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Правильно</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{lastResult.total - lastResult.score}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Ошибки</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col gap-6">
                <div className="bento-card flex-grow flex flex-col items-center justify-center text-center py-12">
                  <p className="text-xs uppercase tracking-widest opacity-40 font-bold mb-4">Итоговая оценка</p>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                    className="text-9xl font-display font-bold mb-4"
                    style={{ color: 'var(--accent)' }}
                  >
                    {lastResult.grade}
                  </motion.div>
                  <p className="text-xl font-medium opacity-60">
                    {lastResult.grade === '5' ? 'Превосходно!' : 
                     lastResult.grade === '4' ? 'Хороший результат' : 
                     lastResult.grade === '3' ? 'Удовлетворительно' : 'Нужно повторить'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={startQuiz}
                    className="flex-grow btn-primary flex items-center justify-center gap-3"
                  >
                    <RotateCcw size={24} /> ПРОЙТИ ЗАНОВО
                  </button>
                  <button
                    onClick={() => setView('start')}
                    className="p-6 rounded-3xl bento-card font-bold text-xl flex items-center justify-center hover:opacity-80"
                  >
                    ВЫХОД
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-16 flex justify-between items-center opacity-30 text-[10px] uppercase tracking-[0.3em] font-bold">
        <p>© 2026 МПТ | ИНФОРМАТИКА</p>
        <p>МАКЕЕВ СЕМЁН АНДРЕЕВИЧ</p>
      </footer>
    </div>
  );
}
