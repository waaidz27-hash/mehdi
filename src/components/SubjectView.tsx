import { useEffect } from 'react';
import type { Subject } from '../types';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  BookOpen,
  Home,
  ChevronLeft,
  Play,
  Layers,
  Award,
  Target,
  Sparkles,
  Brain,
} from 'lucide-react';

interface SubjectViewProps {
  subject: Subject;
  onNavigate: (subjectId: string, lessonId: string) => void;
  onHome: () => void;
  completedLessons: Set<string>;
  toggleComplete: (lessonKey: string) => void;
  userName: string;
  onGenerateCertificate: (subjectId: string) => void;
  onNavigateQuiz: (subjectId: string) => void;
  quizPassed: boolean;
}

export function SubjectView({
  subject,
  onNavigate,
  onHome,
  completedLessons,
  toggleComplete,
  userName,
  onGenerateCertificate,
  onNavigateQuiz,
  quizPassed,
}: SubjectViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [subject.id]);

  const completedCount = subject.lessons.filter((l) =>
    completedLessons.has(`${subject.id}:${l.id}`)
  ).length;
  const progressPercent = Math.round((completedCount / subject.lessons.length) * 100);
  const firstUncompleted = subject.lessons.find(
    (l) => !completedLessons.has(`${subject.id}:${l.id}`)
  );
  const isComplete = completedCount === subject.lessons.length;
  const totalSections = subject.lessons.reduce((acc, l) => acc + l.sections.length, 0);

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-ink-900/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <button
            onClick={onHome}
            className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <BookOpen className="h-4 w-4 text-teal-400" />
            {subject.title}
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <img
          src={subject.heroImage}
          alt={subject.title}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-15`} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/85 to-ink-900/50" />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute top-10 left-10 h-48 w-48 rounded-full bg-gradient-to-br ${subject.gradient} opacity-10 blur-3xl animate-float`} />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className={`mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${subject.gradient} px-4 py-1.5 text-xs font-bold text-white shadow-lg`}>
            <Layers className="h-3.5 w-3.5" />
            {subject.lessons.length} دروس
          </div>

          <h1 className="mb-4 text-4xl font-black text-white sm:text-6xl">{subject.title}</h1>
          <p className="mb-8 max-w-2xl text-base leading-loose text-slate-300 sm:text-lg">{subject.description}</p>

          {/* Stats row */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700/30 bg-slate-800/40 px-4 py-2.5 text-sm">
              <BookOpen className="h-4 w-4 text-teal-400" />
              <span className="font-bold text-white">{subject.lessons.length}</span>
              <span className="text-slate-400">دروس</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700/30 bg-slate-800/40 px-4 py-2.5 text-sm">
              <Layers className="h-4 w-4 text-amber-400" />
              <span className="font-bold text-white">{totalSections}</span>
              <span className="text-slate-400">أقسام</span>
            </div>
            {isComplete && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-emerald-300">مكتملة</span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-400">تقدمك في هذه المادة</span>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`progress-bar-fill h-full rounded-full bg-gradient-to-r ${subject.gradient}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-slate-500">
            {completedCount} من {subject.lessons.length} دروس مكتملة
          </div>

          {/* Certificate section */}
          {isComplete && (
            <div className="mt-6 rounded-3xl border border-teal-500/20 bg-teal-500/5 p-5 text-right">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-500/20">
                  <Award className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{quizPassed ? 'تهانينا!' : 'أكملت الدروس!'}</h3>
                  <p className="text-sm text-slate-300">
                    {quizPassed
                      ? `نجحت في الاختبار ويمكنك تحميل شهادتك. ${userName.trim() ? `الشهادة باسم ${userName.trim()}.` : 'أدخل اسمك في الرئيسية لتضمينه في الشهادة.'}`
                      : 'بقي خطوة واحدة: اجتاز اختبار المادة لفتح الشهادة.'}
                  </p>
                </div>
              </div>
              {quizPassed ? (
                <button
                  onClick={() => onGenerateCertificate(subject.id)}
                  className="shine-effect flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-400 hover:scale-105"
                >
                  <Award className="h-4 w-4" />
                  تحميل شهادة {subject.title}
                </button>
              ) : (
                <button
                  onClick={() => onNavigateQuiz(subject.id)}
                  className="shine-effect flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-400 hover:scale-105"
                >
                  <Brain className="h-4 w-4" />
                  ابدأ اختبار {subject.title}
                </button>
              )}
            </div>
          )}

          {firstUncompleted && (
            <button
              onClick={() => onNavigate(subject.id, firstUncompleted.id)}
              className={`shine-effect mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r ${subject.gradient} px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-105`}
            >
              <Play className="h-4 w-4 fill-white" />
              {completedCount > 0 ? 'أكمل التعلم' : 'ابدأ الدرس الأول'}
            </button>
          )}
        </div>
      </div>

      {/* Lessons list */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 ring-1 ring-teal-500/20">
            <BookOpen className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">جميع الدروس</h2>
            <p className="text-sm text-slate-500">{subject.lessons.length} دروس · {totalSections} أقسام</p>
          </div>
        </div>

        <div className="grid gap-4">
          {subject.lessons.map((lesson, i) => {
            const lessonKey = `${subject.id}:${lesson.id}`;
            const isCompleted = completedLessons.has(lessonKey);
            const isCurrent = firstUncompleted?.id === lesson.id;
            const lessonSections = lesson.sections.length;
            const lessonKeyTerms = lesson.keyTerms?.length || 0;

            return (
              <div
                key={lesson.id}
                onClick={() => onNavigate(subject.id, lesson.id)}
                className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-5 text-right transition-all hover:scale-[1.01] sm:p-6 ${
                  isCurrent
                    ? 'border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/10'
                    : 'border-slate-700/50 bg-ink-800/50 hover:border-slate-600 hover:bg-ink-700/50'
                } cursor-pointer`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Left accent bar */}
                <div className={`absolute right-0 top-0 h-full w-1 bg-gradient-to-b ${subject.gradient} transition-all group-hover:w-1.5 ${isCompleted ? 'opacity-100' : 'opacity-40'}`} />

                {/* Number / completion */}
                <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold transition ${
                  isCompleted
                    ? 'bg-teal-500/20 text-teal-400'
                    : isCurrent
                    ? `bg-gradient-to-br ${subject.gradient} text-white shadow-lg`
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 lesson-num-badge'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className={`mb-1 text-lg font-bold transition ${
                    isCompleted ? 'text-slate-400' : 'text-white group-hover:text-teal-300'
                  }`}>
                    {lesson.title}
                  </h3>
                  <p className="mb-2 line-clamp-1 text-sm text-slate-500">{lesson.subtitle}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {lesson.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {lessonSections} أقسام
                    </span>
                    {lessonKeyTerms > 0 && (
                      <span className="flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" />
                        {lessonKeyTerms} مصطلحات
                      </span>
                    )}
                    {isCompleted && (
                      <span className="flex items-center gap-1 font-semibold text-teal-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        مكتملة
                      </span>
                    )}
                    {isCurrent && !isCompleted && (
                      <span className="flex items-center gap-1 font-semibold text-teal-400">
                        <Play className="h-3 w-3 fill-teal-400" />
                        ابدأ هنا
                      </span>
                    )}
                  </div>
                </div>

                {/* Complete button */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleComplete(lessonKey);
                  }}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition ${
                    isCompleted
                      ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isCompleted ? 'إلغاء' : 'إكمال'}
                </button>

                {/* Arrow */}
                <ChevronLeft className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:text-teal-400 group-hover:-translate-x-1" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {isComplete && (
          <div className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-amber-400" />
            <h3 className="mb-2 text-xl font-bold text-white">{quizPassed ? `أكملت ${subject.title} بنجاح!` : `أكملت دروس ${subject.title}!`}</h3>
            <p className="mb-4 text-sm text-slate-400">
              {quizPassed ? 'لا تنسَ تحميل شهادتك' : 'اجتز الاختبار لفتح الشهادة'}
            </p>
            {quizPassed ? (
              <button
                onClick={() => onGenerateCertificate(subject.id)}
                className="shine-effect flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-amber-400 hover:scale-105"
              >
                <Award className="h-4 w-4" />
                تحميل الشهادة
              </button>
            ) : (
              <button
                onClick={() => onNavigateQuiz(subject.id)}
                className="shine-effect flex items-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-400 hover:scale-105"
              >
                <Brain className="h-4 w-4" />
                ابدأ الاختبار
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
