import { useState, useEffect, useRef } from 'react';
import type { Subject } from '../types';
import type { LucideIcon } from 'lucide-react';
import {
  HeartPulse,
  Megaphone,
  TrendingUp,
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Library,
  Award,
  Play,
  Zap,
  Target,
  Layers,
  Flame,
  User,
  Download,
  Brain,
  TrendingUp as TrendIcon,
  Trophy,
} from 'lucide-react';

interface HomePageProps {
  subjects: Subject[];
  onNavigate: (subjectId: string, lessonId: string) => void;
  onSubjectSelect: (subjectId: string) => void;
  completedLessons: Set<string>;
  userName: string;
  onUserNameChange: (name: string) => void;
  onGenerateCertificate: (subjectId: string) => void;
  onGenerateAllCertificates: () => void;
  completedSubjectIds: string[];
}

const iconMap: Record<string, LucideIcon> = {
  Body: HeartPulse,
  Megaphone: Megaphone,
  TrendingUp: TrendingUp,
};

const defaultIcon: LucideIcon = BookOpen;

export function HomePage({
  subjects,
  onNavigate,
  onSubjectSelect,
  completedLessons,
  userName,
  onUserNameChange,
  onGenerateCertificate,
  onGenerateAllCertificates,
  completedSubjectIds,
}: HomePageProps) {
  const totalLessons = subjects.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalCompleted = completedLessons.size;
  const overallProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const completedSubjectsCount = completedSubjectIds.length;
  const canDownloadAllCertificates = completedSubjectsCount > 0;
  const readyMessage = completedSubjectsCount > 0
    ? `لديك ${completedSubjectsCount} مادة مكتملة جاهزة للشهادة.`
    : 'أكمل مادة واحدة على الأقل لتحصل على شهادة إلكترونية.';

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Hero */}
      <div ref={heroRef} className="hero-gradient relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl animate-float" />
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-20 right-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:pt-28">
          {/* Badge */}
          <div className="mb-6 flex justify-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/40 px-5 py-2 text-sm text-slate-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-teal-400" />
              منصة تعليمية شاملة باللغة العربية
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-center text-4xl font-black leading-tight text-white sm:text-7xl animate-fade-in-up">
            أكاديمية <span className="animated-gradient-text">المعرفة</span>
          </h1>
          <p className="mx-auto mb-3 max-w-2xl text-center text-xl font-semibold text-slate-200 sm:text-3xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            من الصفر إلى الاحتراف
          </p>
          <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-loose text-slate-400 sm:text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            تعلّم التشريح وعلم الإقناع والتسويق والاقتصاد بدروس مكثفة وعميقة، مدعّمة بالصور والفيديوهات.
            محتوى غني يكفيك لأسابيع من التعلم المستمر.
          </p>

          {/* Stats with enhanced design */}
          <div className="mx-auto mb-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass rounded-2xl p-6 text-center transition hover:scale-105">
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <Library className="h-6 w-6 text-teal-400 drop-glow" />
                <span className="text-4xl font-black text-teal-400">{subjects.length}</span>
              </div>
              <div className="text-sm font-medium text-slate-400">مواد دراسية</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center transition hover:scale-105">
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <BookOpen className="h-6 w-6 text-amber-400 drop-glow" />
                <span className="text-4xl font-black text-amber-400">{totalLessons}</span>
              </div>
              <div className="text-sm font-medium text-slate-400">درس مكثف</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center transition hover:scale-105">
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <Trophy className="h-6 w-6 text-emerald-400 drop-glow" />
                <span className="text-4xl font-black text-emerald-400">{completedSubjectsCount}</span>
              </div>
              <div className="text-sm font-medium text-slate-400">شهادة جاهزة</div>
            </div>
          </div>

          {/* Overall progress bar */}
          {totalCompleted > 0 && (
            <div className="mx-auto mb-8 max-w-md animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <TrendIcon className="h-3.5 w-3.5 text-teal-400" />
                  تقدمك العام
                </span>
                <span className="font-bold text-white">{overallProgress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="progress-bar-fill h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a
              href="#subjects"
              className="shine-effect flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-4 text-base font-bold text-white shadow-2xl transition hover:scale-105 hover:shadow-teal-500/20"
            >
              <Flame className="h-5 w-5" />
              ابدأ رحلتك التعليمية
            </a>
            <a
              href="#certificates"
              className="flex items-center gap-2 rounded-2xl border border-slate-700/50 bg-slate-800/50 px-8 py-4 text-base font-bold text-slate-300 backdrop-blur-sm transition hover:border-slate-600 hover:bg-slate-700/50 hover:text-white"
            >
              <Award className="h-5 w-5 text-amber-400" />
              الشهادات
            </a>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink-900 to-transparent" />
      </div>

      {/* Certificate input */}
      <div id="certificates" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-12">
        <div className="gradient-border rounded-3xl bg-ink-800/70 p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 ring-1 ring-amber-500/20">
              <Award className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">شهادات الإنجاز</h2>
              <p className="mt-1 text-sm text-slate-400">
                أدخل اسمك لتحصل على شهادة عند إكمال مادة كاملة.
              </p>
            </div>
          </div>

          {/* Name input card */}
          <div className={`rounded-2xl border bg-slate-950/60 p-5 transition-all duration-300 ${
            isNameFocused
              ? 'border-amber-500/50 ring-2 ring-amber-500/20'
              : 'border-slate-700/50'
          }`}>
            <label htmlFor="cert-name" className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <User className="h-4 w-4 text-amber-400" />
              الاسم على الشهادة
              <span className="text-xs font-normal text-slate-500">({userName.length}/25)</span>
            </label>
            <div className="relative">
              <input
                id="cert-name"
                value={userName}
                onChange={(event) => onUserNameChange(event.target.value.slice(0, 25))}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                placeholder="أدخل اسمك هنا"
                maxLength={25}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-900/80 px-4 py-3.5 pr-12 text-base font-semibold text-white placeholder:text-slate-600 placeholder:font-normal outline-none transition focus:border-amber-500/60"
              />
              <User className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-400/60" />
            {readyMessage}
          </p>

          {/* Download all */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onGenerateAllCertificates}
              disabled={!canDownloadAllCertificates}
              className={`shine-effect flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition ${
                canDownloadAllCertificates
                  ? 'bg-teal-500 hover:bg-teal-400 hover:scale-105 shadow-lg'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              {canDownloadAllCertificates ? `تحميل ${completedSubjectsCount} شهادة` : 'لا توجد شهادات بعد'}
            </button>
          </div>

          {/* Per-subject buttons */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {subjects.map((subject) => {
              const isComplete = subject.lessons.every((lesson) =>
                completedLessons.has(`${subject.id}:${lesson.id}`)
              );
              return (
                <button
                  key={subject.id}
                  type="button"
                  disabled={!isComplete}
                  onClick={() => onGenerateCertificate(subject.id)}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                    isComplete
                      ? 'bg-blue-500 text-white hover:bg-blue-400 hover:scale-[1.02] shadow-lg'
                      : 'cursor-not-allowed bg-slate-700 text-slate-500'
                  }`}
                >
                  {isComplete ? `تحميل شهادة ${subject.title}` : `أكمل ${subject.title}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div id="subjects" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-16">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="section-divider w-32" />
          </div>
          <h2 className="mb-3 flex items-center justify-center gap-2 text-3xl font-bold text-white sm:text-4xl">
            <Library className="h-8 w-8 text-teal-400 drop-glow" />
            اختر مادتك
          </h2>
          <p className="text-slate-400 sm:text-lg">ثلاث مواد شاملة، كل واحدة رحلة تعليمية كاملة من الأساسيات إلى الإتقان</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {subjects.map((subject, idx) => {
            const Icon = iconMap[subject.icon] || BookOpen;
            const completedCount = subject.lessons.filter((l) =>
              completedLessons.has(`${subject.id}:${l.id}`)
            ).length;
            const progressPercent = subject.lessons.length > 0 ? Math.round((completedCount / subject.lessons.length) * 100) : 0;
            const firstUncompleted = subject.lessons.find(
              (l) => !completedLessons.has(`${subject.id}:${l.id}`)
            );
            const isComplete = completedCount === subject.lessons.length;
            const totalSections = subject.lessons.reduce((acc, l) => acc + l.sections.length, 0);

            return (
              <div
                key={subject.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-700/50 bg-ink-800/50 transition-all hover:border-slate-600 card-glow animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                {/* Hero image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={subject.heroImage}
                    alt={subject.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/50 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-25`} />
                  {/* Icon badge */}
                  <div className={`absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${subject.gradient} shadow-xl transition group-hover:scale-110`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  {/* Completion badge */}
                  {isComplete && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      مكتملة
                    </div>
                  )}
                  {/* Progress badge */}
                  {!isComplete && progressPercent > 0 && (
                    <div className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                      {progressPercent}%
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">{subject.title}</h3>
                  <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-400">{subject.description}</p>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{completedCount} / {subject.lessons.length} دروس</span>
                      <span className="font-semibold text-slate-300">{progressPercent}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`progress-bar-fill h-full rounded-full bg-gradient-to-r ${subject.gradient}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mb-5 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {subject.lessons.length} دروس
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      {totalSections} أقسام
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => firstUncompleted ? onNavigate(subject.id, firstUncompleted.id) : onSubjectSelect(subject.id)}
                    className={`shine-effect flex w-full items-center justify-center gap-2 rounded-xl ${
                      isComplete ? 'bg-emerald-500 hover:bg-emerald-400' : `bg-gradient-to-r ${subject.gradient}`
                    } py-4 text-sm font-bold text-white transition hover:scale-[1.02] hover:shadow-lg`}
                  >
                    {progressPercent > 0 ? (
                      <>
                        <Play className="h-4 w-4 fill-white" />
                        أكمل التعلم
                      </>
                    ) : (
                      <>
                        ابدأ التعلم
                        <ArrowLeft className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-slate-800 bg-ink-800/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">لماذا أكاديمية المعرفة؟</h2>
            <p className="text-slate-400">تجربة تعلم مصممة بعناية لتأخذك من المبتدئ إلى المحترف</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, title: 'محتوى مكثف', desc: 'دروس عميقة لا تجد مثيلاً لها — كل درس صفحات من المعرفة المركزة', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
              { icon: Library, title: 'صور وفيديوهات', desc: 'كل درس مدعّم بصور توضيحية وفيديوهات يوتيوب لتسهيل الفهم', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              { icon: GraduationCap, title: 'من الصفر للاحتراف', desc: 'لا تحتاج معرفة مسبقة — نبدأ من الأساسيات ونبني حتى الإتقان', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { icon: Brain, title: 'مساعد ذكي', desc: 'اسأل المساعد الذكي أي سؤال و احصل على إجابة فورية من محتوى الدروس', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`group rounded-2xl border ${feature.border} ${feature.bg} p-6 text-center transition hover:scale-105 animate-fade-in-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} transition group-hover:scale-110`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">أكاديمية المعرفة</span>
          </div>
          <p className="text-sm text-slate-500">
            منصة تعليمية عربية شاملة
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {totalLessons} درسًا في {subjects.length} مواد — محتوى غني من الصفر إلى الاحتراف
          </p>
        </div>
      </footer>
    </div>
  );
}
