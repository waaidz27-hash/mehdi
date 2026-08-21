import { subjects } from '../data';

export interface LessonSnippet {
  subjectId: string;
  subjectTitle: string;
  lessonId: string;
  lessonTitle: string;
  heading: string;
  text: string;
  score: number;
}

const allSnippets: LessonSnippet[] = subjects.flatMap((subject) =>
  subject.lessons.flatMap((lesson) =>
    lesson.sections.flatMap((section) =>
      section.body.map((paragraph) => ({
        subjectId: subject.id,
        subjectTitle: subject.title,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        heading: section.heading,
        text: paragraph,
        score: 0,
      })),
    ),
  ),
);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[إأآ]/g, 'ا')
    .replace(/[يى]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^a-z0-9\u0600-\u06FF ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const normalizedSnippets = allSnippets.map((s) => ({
  ...s,
  normalized: normalize(`${s.heading} ${s.text}`),
}));

const STOP_WORDS = new Set([
  'ما', 'ماذا', 'كيف', 'لماذا', 'متى', 'اين', 'أين', 'هل', 'في', 'من', 'الى',
  'على', 'عن', 'مع', 'هو', 'هي', 'هذا', 'هذه', 'ذلك', 'التي', 'الذي', 'و',
  'او', 'أو', 'ثم', 'بل', 'لكن', 'ان', 'أن', 'انه', 'أنه', 'كان', 'كانت',
  'قد', 'كل', 'بعض', 'غير', 'بين', 'عند', 'عندما', 'لكن', 'حتى', 'الا',
  'إلا', 'بدون', 'نحو', 'خلال', 'بعد', 'قبل', 'مثل', 'حيث', 'كما', 'اي',
  'أي', 'also', 'the', 'is', 'are', 'what', 'how', 'why', 'when', 'where',
]);

function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export function searchLessons(query: string, maxResults = 5): LessonSnippet[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scored = normalizedSnippets.map((snippet) => {
    let score = 0;
    for (const token of queryTokens) {
      if (snippet.normalized.includes(token)) score += 1;
    }
    return { snippet, score };
  });

  const maxPossibleScore = queryTokens.length;
  const matchThreshold = Math.max(2, Math.ceil(maxPossibleScore * 0.5));

  return scored
    .filter((item) => item.score >= matchThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => ({ ...item.snippet, score: item.score }));
}

export function buildContext(snippets: LessonSnippet[]): string {
  if (snippets.length === 0) return '';
  const parts = snippets.map((s, i) =>
    `[${i + 1}] الموضوع: ${s.subjectTitle} | الدرس: ${s.lessonTitle} | ${s.heading}\n${s.text}`,
  );
  return parts.join('\n\n');
}

const subjectKeywordMap: Record<string, string[]> = {
  anatomy: ['تشريح', 'جسم', 'عضو', 'عظام', 'عضلات', 'دماغ', 'قلب', 'رئه', 'رئة', 'دم', 'اعصاب', 'أعصاب', 'جهاز', 'وظائف', 'خلايا', 'نسيج', 'امعاء', 'أمعاء', 'هضم', 'اتزان داخلي', 'homeostasis', 'هضمي', 'عصبي', 'تنفسي', 'دوره دمويه', 'دورة دموية', 'كبد', 'كلي', 'كلى', 'معدة', 'بنكرياس', 'غدد', 'جلد', 'حوت', 'حواس'],
  marketing: ['تسويق', 'اقناع', 'إقناع', 'علامه تجاريه', 'علامة تجارية', 'مبيعات', 'مستهلك', 'اعلان', 'إعلان', 'دعايه', 'دعاية', 'براند', 'قناعه', 'قناعة', 'نفوذ', 'خطه تسويقيه', 'خطة تسويقية', 'الاقناع', 'الإقناع', 'سوق', 'عرض', 'طلب', 'قمع', 'محتوى', 'مؤثر', 'مؤثرين', 'سوشيال', 'تواصل', 'رقمي', 'علامه', 'علامة'],
  economics: ['اقتصاد', 'تضخم', 'الناتج المحلي', 'GDP', 'راس المال', 'رأس المال', 'سعر الفائده', 'سعر الفائدة', 'بطاله', 'بطالة', 'سياسه نقديه', 'سياسة نقدية', 'سياسه ماليه', 'سياسة مالية', 'عرض و طلب', 'سوق حر', 'اموال', 'أموال', 'مال', 'نمو اقتصادي', 'دين', 'ناتج', 'استهلاك', 'ادخار', 'ادخر', 'استثمار', 'تجاره', 'تجارة', 'عمله', 'عملة', 'بنك', 'مركزي', 'ركود', 'ازمه', 'أزمة', 'العرض', 'الطلب'],
};

export function getRelevanceScore(query: string): { subjectId: string; score: number }[] {
  const normalizedQuery = normalize(query);
  return subjects
    .map((subject) => ({
      id: subject.id,
      score: (subjectKeywordMap[subject.id] || []).reduce(
        (sum, keyword) => sum + (normalizedQuery.includes(normalizeText(keyword)) ? 1 : 0),
        0,
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => ({ subjectId: item.id, score: item.score }));
}

function normalizeText(text: string) {
  return normalize(text);
}
