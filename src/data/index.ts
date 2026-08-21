import type { Subject } from '../types';
import { anatomy } from '../data/anatomy';
import { marketing } from '../data/marketing';
import { economics } from '../data/economics';

export const subjects: Subject[] = [anatomy, marketing, economics];

export function getSubject(subjectId: string): Subject | undefined {
  return subjects.find((s) => s.id === subjectId);
}

export function getLesson(subjectId: string, lessonId: string) {
  const subject = getSubject(subjectId);
  return subject?.lessons.find((l) => l.id === lessonId);
}

export function getTotalLessons(): number {
  return subjects.reduce((acc, s) => acc + s.lessons.length, 0);
}
