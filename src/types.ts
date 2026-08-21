export interface VideoResource {
  id: string;
  title: string;
  youtubeId: string;
}

export interface ImageResource {
  url: string;
  alt: string;
  caption?: string;
}

export interface LessonSection {
  heading: string;
  body: string[];
  image?: ImageResource;
  videos?: VideoResource[];
  callout?: {
    type: 'info' | 'warning' | 'tip';
    title: string;
    content: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  sections: LessonSection[];
  keyTerms?: { term: string; definition: string }[];
  summary: string[];
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  heroImage: string;
  lessons: Lesson[];
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: QuestionDifficulty;
}
