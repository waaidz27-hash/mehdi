import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Subject, QuizQuestion, QuestionDifficulty } from '../types';
import { getQuizQuestions } from '../data/quizQuestions';
import {
  Home,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  RotateCcw,
  Brain,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface QuizViewProps {
  subject: Subject;
  onHome: () => void;
  onBackToSubject: () => void;
  onPass: () => void;
}

const PASS_THRESHOLD = 0.7;
const QUESTION_COUNT = 10;

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuiz(allQuestions: QuizQuestion[]): QuizQuestion[] {
  const byDifficulty = (d: QuestionDifficulty) => allQuestions.filter((q) => q.difficulty === d);
  const easy = shuffle(byDifficulty('easy'));
  const medium = shuffle(byDifficulty('medium'));
  const hard = shuffle(byDifficulty('hard'));

  const counts = { easy: 4, medium: 4, hard: 2 };
  const selected: QuizQuestion[] = [];
  (['easy', 'medium', 'hard'] as QuestionDifficulty[]).forEach((d) => {
    const pool = d === 'easy' ? easy : d === 'medium' ? medium : hard;
    const take = Math.min(counts[d], pool.length);
    selected.push(...pool.slice(0, take));
  });

  return shuffle(selected).slice(0, QUESTION_COUNT);
}

export function QuizView({ subject, onHome, onBackToSubject, onPass }: QuizViewProps) {
  const allQuestions = useMemo(() => getQuizQuestions(subject.id), [subject.id]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>(() => buildQuiz(allQuestions));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current, finished]);

  const restart = useCallback(() => {
    setQuiz(buildQuiz(allQuestions));
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowFeedback(false);
    setFinished(false);
    setScore(0);
    setPassed(false);
  }, [allQuestions]);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (selected === quiz[current].correctIndex) {
      setScore((s) => s + 1);
    }

    if (current + 1 < quiz.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      const finalScore = newAnswers.reduce(
        (acc, ans, i) => acc + (ans === quiz[i].correctIndex ? 1 : 0),
        0
      );
      const ratio = finalScore / quiz.length;
      setScore(finalScore);
      setPassed(ratio >= PASS_THRESHOLD);
      setFinished(true);
    }
  };

  if (quiz.length === 0) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <p className="text-slate-400">لا توجد أسئلة متاحة لهذه المادة.</p>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / quiz.length) * 100);
    return (
      <div className="min-h-screen bg-ink-900">
        <div className="sticky top-0 z-30 border-b border-slate-800 bg-ink-900/90 backdrop-blur-lg">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <button onClick={onHome} className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">الرئيسية</span>
            </button>
            <span className="text-slate-600">/</span>
            <button onClick={onBackToSubject} className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
              {subject.title}
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-semibold text-white">الاختبار</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className={`rounded-3xl border p-8 text-center ${passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
            <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {passed ? (
                <Award className="h-10 w-10 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-red-400" />
              )}
            </div>

            <h2 className={`mb-3 text-3xl font-black ${passed ? 'text-emerald-300' : 'text-red-300'}`}>
              {passed ? 'مبروك! نجحت في الاختبار' : 'للأسف، لم تنجح هذه المرة'}
            </h2>
            <p className="mb-6 text-slate-400">
              {passed
                ? `أجبت بشكل صحيح على ${score} من ${quiz.length} أسئلة (${percent}%). يمكنك الآن تحميل شهادتك.`
                : `أجبت بشكل صحيح على ${score} من ${quiz.length} أسئلة (${percent}%). تحتاج إلى ${Math.ceil(PASS_THRESHOLD * 100)}% على الأقل للنجاح. يمكنك إعادة المحاولة.`}
            </p>

            <div className="mb-8 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-black text-white">{percent}%</div>
                <div className="text-sm text-slate-500">النتيجة</div>
              </div>
              <div className="h-12 w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-4xl font-black text-white">{score}/{quiz.length}</div>
                <div className="text-sm text-slate-500">إجابات صحيحة</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!passed && (
                <button
                  onClick={restart}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-400 hover:scale-105"
                >
                  <RotateCcw className="h-4 w-4" />
                  إعادة الاختبار
                </button>
              )}
              {passed && (
                <button
                  onClick={onPass}
                  className="shine-effect flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-amber-400 hover:scale-105"
                >
                  <Award className="h-4 w-4" />
                  تحميل الشهادة
                </button>
              )}
              <button
                onClick={onBackToSubject}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-bold text-slate-300 transition hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
                العودة للمادة
              </button>
            </div>
          </div>

          {/* Review */}
          <div className="mt-8 space-y-3">
            <h3 className="mb-4 text-lg font-bold text-white">مراجعة الإجابات</h3>
            {quiz.map((q, i) => {
              const userAns = answers[i];
              const correct = userAns === q.correctIndex;
              return (
                <div key={q.id} className={`rounded-2xl border p-4 ${correct ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                  <div className="mb-2 flex items-start gap-3">
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    )}
                    <div className="flex-1">
                      <p className="mb-2 font-semibold text-white">{q.question}</p>
                      <p className="text-sm text-slate-400">
                        الإجابة الصحيحة: <span className="text-emerald-400">{q.options[q.correctIndex]}</span>
                      </p>
                      {!correct && userAns !== null && (
                        <p className="text-sm text-slate-400">
                          إجابتك: <span className="text-red-400">{q.options[userAns]}</span>
                        </p>
                      )}
                      {userAns === null && (
                        <p className="text-sm text-slate-500">لم تتم الإجابة</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const question = quiz[current];
  const progressPercent = Math.round(((current) / quiz.length) * 100);
  const isCorrect = selected === question.correctIndex;

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-ink-900/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <button onClick={onHome} className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>
          <span className="text-slate-600">/</span>
          <button onClick={onBackToSubject} className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
            {subject.title}
          </button>
          <span className="text-slate-600">/</span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <Brain className="h-4 w-4 text-teal-400" />
            الاختبار
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <img src={subject.heroImage} alt={subject.title} className="absolute inset-0 h-full w-full object-cover opacity-15" loading="lazy" />
        <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-10`} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/85 to-ink-900/50" />

        <div className="relative mx-auto max-w-3xl px-4 py-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-bold text-teal-300 ring-1 ring-teal-500/20">
            <Brain className="h-3.5 w-3.5" />
            اختبار {subject.title}
          </div>
          <h1 className="mb-3 text-3xl font-black text-white sm:text-4xl">اختبر معلوماتك</h1>
          <p className="mb-2 text-slate-400">10 أسئلة بمستويات متدرجة (سهل → متوسط → صعب). تحتاج 70% للنجاح.</p>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-slate-400">السؤال {current + 1} من {quiz.length}</span>
            <span className="flex items-center gap-1.5 font-bold text-white">
              <TrendingUp className="h-4 w-4 text-teal-400" />
              {score} صحيحة
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex items-center gap-2">
          <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
            question.difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-400' :
            question.difficulty === 'medium' ? 'bg-amber-500/15 text-amber-400' :
            'bg-red-500/15 text-red-400'
          }`}>
            {question.difficulty === 'easy' ? 'سهل' : question.difficulty === 'medium' ? 'متوسط' : 'صعب'}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            بدون وقت محدد
          </span>
        </div>

        <div className="rounded-3xl border border-slate-700/50 bg-ink-800/50 p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-bold leading-relaxed text-white sm:text-2xl">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              const isCorrectAnswer = i === question.correctIndex;
              let style = 'border-slate-700 bg-slate-800/50 hover:border-teal-500/40 hover:bg-slate-700/50 text-slate-200';

              if (showFeedback) {
                if (isCorrectAnswer) {
                  style = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300';
                } else if (isSelected && !isCorrectAnswer) {
                  style = 'border-red-500/50 bg-red-500/15 text-red-300';
                } else {
                  style = 'border-slate-700/50 bg-slate-800/30 text-slate-500';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showFeedback}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-right transition-all ${style} ${!showFeedback ? 'cursor-pointer hover:scale-[1.01]' : 'cursor-default'}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    showFeedback && isCorrectAnswer ? 'bg-emerald-500/30 text-emerald-300' :
                    showFeedback && isSelected && !isCorrectAnswer ? 'bg-red-500/30 text-red-300' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {showFeedback && isCorrectAnswer ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : showFeedback && isSelected && !isCorrectAnswer ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      String.fromCharCode(0x0623 + i)
                    )}
                  </div>
                  <span className="flex-1 font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 rounded-2xl border p-4 ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
                <p className={`font-semibold ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                  {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
                </p>
              </div>
              {!isCorrect && (
                <p className="mt-2 text-sm text-slate-400">
                  الإجابة الصحيحة: <span className="text-emerald-400">{question.options[question.correctIndex]}</span>
                </p>
              )}
            </div>
          )}

          {/* Next button */}
          {showFeedback && (
            <button
              onClick={nextQuestion}
              className="shine-effect mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-400 hover:scale-[1.02]"
            >
              {current + 1 < quiz.length ? 'السؤال التالي' : 'إنهاء الاختبار'}
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
