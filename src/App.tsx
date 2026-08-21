import { useState, useEffect, useCallback, useMemo } from 'react';
import { HomePage } from './components/HomePage';
import { SubjectView } from './components/SubjectView';
import { LessonView } from './components/LessonView';
import { QuizView } from './components/QuizView';
import { AIAssistant } from './components/AIAssistant';
import { subjects, getSubject, getLesson } from './data';
import { downloadCertificate } from './utils/certificate';

type View =
  | { type: 'home' }
  | { type: 'subject'; subjectId: string }
  | { type: 'lesson'; subjectId: string; lessonId: string }
  | { type: 'quiz'; subjectId: string };

const STORAGE_KEY = 'akademia_completed_lessons';
const NAME_STORAGE_KEY = 'akademia_user_name';
const QUIZ_PASSED_KEY = 'akademia_quiz_passed';

export function App() {
  const [view, setView] = useState<View>({ type: 'home' });
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState('');
  const [quizPassed, setQuizPassed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletedLessons(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const storedName = localStorage.getItem(NAME_STORAGE_KEY);
      if (storedName) {
        setUserName(storedName);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const storedQuiz = localStorage.getItem(QUIZ_PASSED_KEY);
      if (storedQuiz) {
        setQuizPassed(new Set(JSON.parse(storedQuiz)));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleUserNameChange = useCallback((name: string) => {
    setUserName(name);
    try {
      localStorage.setItem(NAME_STORAGE_KEY, name);
    } catch {
      // ignore
    }
  }, []);

  const completedSubjectIds = useMemo(
    () => subjects
      .filter((subject) =>
        subject.lessons.every((lesson) => completedLessons.has(`${subject.id}:${lesson.id}`))
      )
      .map((subject) => subject.id),
    [completedLessons]
  );

  const generateCertificate = useCallback(
    (subjectId: string) => {
      const subject = getSubject(subjectId);
      const normalizedName = userName.trim();
      if (!subject || !normalizedName) {
        if (!normalizedName) {
          window.alert('من فضلك أدخل اسمك أولاً لتحميل الشهادة.');
        }
        return;
      }
      downloadCertificate(subject.title, normalizedName, subject.id);
    },
    [userName]
  );

  const generateAllCertificates = useCallback(() => {
    const normalizedName = userName.trim();
    if (!normalizedName) {
      window.alert('من فضلك أدخل اسمك أولاً لتحميل الشهادات.');
      return;
    }

    subjects
      .filter((subject) =>
        subject.lessons.every((lesson) => completedLessons.has(`${subject.id}:${lesson.id}`))
      )
      .forEach((subject) => {
        downloadCertificate(subject.title, normalizedName, subject.id);
      });
  }, [userName, completedLessons]);

  const toggleComplete = useCallback((lessonKey: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonKey)) {
        next.delete(lessonKey);
      } else {
        next.add(lessonKey);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const navigateToLesson = useCallback((subjectId: string, lessonId: string) => {
    setView({ type: 'lesson', subjectId, lessonId });
  }, []);

  const navigateToSubject = useCallback((subjectId: string) => {
    setView({ type: 'subject', subjectId });
  }, []);

  const navigateToQuiz = useCallback((subjectId: string) => {
    setView({ type: 'quiz', subjectId });
  }, []);

  const handleQuizPass = useCallback((subjectId: string) => {
    setQuizPassed((prev) => {
      const next = new Set(prev);
      next.add(subjectId);
      try {
        localStorage.setItem(QUIZ_PASSED_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const goHome = useCallback(() => {
    setView({ type: 'home' });
  }, []);

  let content: React.ReactNode = null;

  if (view.type === 'home') {
    content = (
      <HomePage
        subjects={subjects}
        onNavigate={navigateToLesson}
        onSubjectSelect={navigateToSubject}
        completedLessons={completedLessons}
        userName={userName}
        onUserNameChange={handleUserNameChange}
        onGenerateCertificate={generateCertificate}
        onGenerateAllCertificates={generateAllCertificates}
        completedSubjectIds={completedSubjectIds}
      />
    );
  } else if (view.type === 'subject') {
    const subject = getSubject(view.subjectId);
    if (!subject) {
      content = null;
      goHome();
    } else {
      content = (
        <SubjectView
          subject={subject}
          onNavigate={navigateToLesson}
          onHome={goHome}
          completedLessons={completedLessons}
          toggleComplete={toggleComplete}
          userName={userName}
          onGenerateCertificate={generateCertificate}
          onNavigateQuiz={navigateToQuiz}
          quizPassed={quizPassed.has(subject.id)}
        />
      );
    }
  } else if (view.type === 'lesson') {
    const subject = getSubject(view.subjectId);
    const lesson = getLesson(view.subjectId, view.lessonId);
    if (!subject || !lesson) {
      content = null;
      goHome();
    } else {
      content = (
        <LessonView
          lesson={lesson}
          subject={subject}
          onNavigate={navigateToLesson}
          onHome={goHome}
          onBackToSubject={() => navigateToSubject(view.subjectId)}
          completedLessons={completedLessons}
          toggleComplete={toggleComplete}
        />
      );
    }
  } else if (view.type === 'quiz') {
    const subject = getSubject(view.subjectId);
    if (!subject) {
      content = null;
      goHome();
    } else {
      content = (
        <QuizView
          subject={subject}
          onHome={goHome}
          onBackToSubject={() => navigateToSubject(view.subjectId)}
          onPass={() => {
            handleQuizPass(subject.id);
            generateCertificate(subject.id);
          }}
        />
      );
    }
  }

  return (
    <>
      {content}
      <AIAssistant onNavigate={navigateToLesson} onNavigateSubject={navigateToSubject} />
    </>
  );
}

export default App;
