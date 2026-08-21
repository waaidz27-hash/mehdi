import { useEffect, useMemo, useState } from 'react';
import type { Lesson, Subject } from '../types';
import { LessonSectionView, type ResolvedMedia } from './LessonSectionView';
import { getPoolImage, getPoolVideo } from '../data/mediaPool';
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  ListChecks,
  BookOpen,
  Home,
  Sparkles,
  Target,
  Zap,
  Play,
} from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  subject: Subject;
  onNavigate: (subjectId: string, lessonId: string) => void;
  onHome: () => void;
  onBackToSubject: () => void;
  completedLessons: Set<string>;
  toggleComplete: (lessonKey: string) => void;
}

type LessonPage =
  | { type: 'section'; label: string; sectionIndex: number }
  | { type: 'keyTerms'; label: string }
  | { type: 'summary'; label: string };

export function LessonView({
  lesson,
  subject,
  onNavigate,
  onHome,
  onBackToSubject,
  completedLessons,
  toggleComplete,
}: LessonViewProps) {
  const lessonKey = `${subject.id}:${lesson.id}`;
  const isCompleted = completedLessons.has(lessonKey);
  const [activePage, setActivePage] = useState(0);

  const pages = useMemo<LessonPage[]>(() => {
    const contentPages: LessonPage[] = lesson.sections.map((_, index) => ({
      type: 'section',
      label: `القسم ${index + 1}`,
      sectionIndex: index,
    }));

    if (lesson.keyTerms && lesson.keyTerms.length > 0) {
      contentPages.push({ type: 'keyTerms', label: 'المصطلحات' });
    }

    if (lesson.summary && lesson.summary.length > 0) {
      contentPages.push({ type: 'summary', label: 'الخلاصة' });
    }

    return contentPages;
  }, [lesson]);

  const currentIndex = subject.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? subject.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < subject.lessons.length - 1 ? subject.lessons[currentIndex + 1] : null;

  const totalPages = pages.length;
  const currentPage = pages[activePage];
  const isFirstPage = activePage === 0;
  const isLastPage = activePage === totalPages - 1;
  const pageProgress = Math.round(((activePage + 1) / totalPages) * 100);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePage(0);
  }, [lesson.id]);

  const resolvedMedia: ResolvedMedia[] = useMemo(() => {
    const usedVideoIds = new Set<string>();
    return lesson.sections.map((section, index) => {
      const image = section.image || getPoolImage(subject.id, index);
      let videos = section.videos;
      if (!videos || videos.length === 0) {
        const poolVideo = getPoolVideo(subject.id, index, usedVideoIds);
        if (poolVideo) videos = [poolVideo];
      }
      if (videos) {
        videos.forEach((video) => usedVideoIds.add(video.youtubeId));
      }
      return { image, videos };
    });
  }, [lesson, subject.id]);

  const renderPageContent = () => {
    if (currentPage.type === 'section') {
      return (
        <LessonSectionView
          section={lesson.sections[currentPage.sectionIndex]}
          resolvedMedia={resolvedMedia[currentPage.sectionIndex]}
          sectionIndex={currentPage.sectionIndex}
          isActive
        />
      );
    }

    if (currentPage.type === 'keyTerms' && lesson.keyTerms) {
      return (
        <div className="animate-fade-in">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
              <ListChecks className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="flex-1 text-xl font-bold leading-tight text-white sm:text-2xl">
              المصطلحات الأساسية
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {lesson.keyTerms.map((term, index) => (
              <div key={index} className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4 transition hover:border-slate-600 hover:bg-slate-800/50">
                <dt className="mb-1.5 font-bold text-teal-300">{term.term}</dt>
                <dd className="text-sm leading-relaxed text-slate-400">{term.definition}</dd>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentPage.type === 'summary' && lesson.summary) {
      return (
        <div className="animate-fade-in">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/20">
              <Zap className="h-5 w-5 text-teal-400" />
            </div>
            <h3 className="flex-1 text-xl font-bold leading-tight text-white sm:text-2xl">
              خلاصة الدرس
            </h3>
          </div>
          <div className="overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-500/5 p-6 sm:p-8">
            <ul className="space-y-4">
              {lesson.summary.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300 leading-loose">
                  <div className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20">
                    <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  const goNext = () => {
    if (activePage < totalPages - 1) {
      setActivePage((page) => page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (activePage > 0) {
      setActivePage((page) => page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="fixed top-0 right-0 left-0 z-50 h-1 bg-slate-800/50">
        <div className="reading-progress h-full bg-teal-400" style={{ width: `${pageProgress}%` }} />
      </div>

      <div className="sticky top-0 z-30 border-b border-slate-800 bg-ink-900/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onHome} className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">الرئيسية</span>
            </button>
            <span className="text-slate-600">/</span>
            <button onClick={onBackToSubject} className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{subject.title}</span>
            </button>
          </div>
          <button
            onClick={() => toggleComplete(lessonKey)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isCompleted
                ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {isCompleted ? 'درس مكتمل' : 'إكمال الدرس'}
          </button>
        </div>
      </div>

      <div className="sticky top-[57px] z-20 border-b border-slate-800 bg-ink-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-2.5">
          <h2 className="mb-2 text-lg font-bold leading-tight text-white sm:text-xl">{lesson.title}</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {pages.map((pageItem, pageIndex) => {
              const isActive = pageIndex === activePage;
              return (
                <button
                  key={`${pageItem.type}-${pageIndex}`}
                  onClick={() => setActivePage(pageIndex)}
                  className={`flex min-w-[96px] items-center justify-center rounded-2xl border px-4 py-2 text-xs font-bold transition ${
                    isActive
                      ? `bg-gradient-to-br ${subject.gradient} text-white shadow-lg`
                      : 'border-slate-700/50 bg-slate-800/70 text-slate-400 hover:border-slate-600 hover:bg-slate-900'
                  }`}
                >
                  {pageItem.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <header className="mb-8 animate-fade-in-up">
          <div className={`mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${subject.gradient} px-4 py-2 text-xs font-bold text-white shadow-lg`}>
            <Target className="h-4 w-4" />
            {subject.title}
          </div>
          <p className="text-lg text-slate-400">{lesson.subtitle}</p>
        </header>

        <div className="rounded-3xl border border-slate-700/50 bg-ink-800/60 p-6 shadow-xl">
          {renderPageContent()}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">
            {lesson.sections.length} أقسام
            {lesson.keyTerms && lesson.keyTerms.length > 0 ? ` · ${lesson.keyTerms.length} مصطلحات` : ''}
            {lesson.summary && lesson.summary.length > 0 ? ` · ${lesson.summary.length} خلاصة` : ''}
          </div>
          {isLastPage && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {!isCompleted ? (
                <button
                  onClick={() => toggleComplete(lessonKey)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  أكمل هذا الدرس
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-teal-500/20 bg-teal-500/10 px-6 py-3 text-sm font-semibold text-teal-200">
                  <CheckCircle2 className="h-4 w-4" />
                  هذا الدرس مكتمل
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3 border-t border-slate-800 pt-6">
          <button
            onClick={goPrev}
            disabled={isFirstPage}
            className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
              isFirstPage
                ? 'cursor-not-allowed border-slate-800 text-slate-700'
                : 'border-slate-700/50 bg-ink-800/50 text-slate-300 hover:border-teal-500/30 hover:bg-ink-700/50 hover:text-teal-300'
            }`}
          >
            <ArrowRight className="h-4 w-4" />
            السابق
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-bold text-slate-300">{activePage + 1}</span>
            <span>/</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={isLastPage ? () => nextLesson && onNavigate(subject.id, nextLesson.id) : goNext}
            disabled={isLastPage && !nextLesson}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
              isLastPage
                ? nextLesson
                  ? `bg-gradient-to-r ${subject.gradient} text-white shadow-lg hover:scale-105`
                  : 'cursor-not-allowed bg-slate-800 text-slate-700'
                : `bg-gradient-to-r ${subject.gradient} text-white shadow-lg hover:scale-105`
            }`}
          >
            {isLastPage ? 'الدرس التالي' : 'التالي'}
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-slate-700/30 bg-ink-800/20 p-4">
          {prevLesson ? (
            <button
              onClick={() => onNavigate(subject.id, prevLesson.id)}
              className="group flex flex-1 items-center gap-3 text-right transition"
            >
              <ArrowRight className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:text-teal-400" />
              <div className="text-sm font-semibold text-slate-300 group-hover:text-teal-300">الدرس السابق</div>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {nextLesson ? (
            <button
              onClick={() => onNavigate(subject.id, nextLesson.id)}
              className="group flex flex-1 items-center justify-end gap-3 text-left transition"
            >
              <div className="text-sm font-semibold text-slate-300 group-hover:text-teal-300">الدرس التالي</div>
              <ArrowLeft className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:text-teal-400" />
            </button>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>
    </div>
  );
}
