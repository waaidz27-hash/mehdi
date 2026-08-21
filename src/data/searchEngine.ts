import type { Subject, Lesson, LessonSection } from '../types';
import { subjects } from './index';

export interface SearchResult {
  subjectId: string;
  subjectTitle: string;
  lessonId: string;
  lessonTitle: string;
  sectionIndex: number;
  sectionHeading: string;
  matchedParagraph: string;
  score: number;
}

interface SearchIndexEntry {
  subjectId: string;
  subjectTitle: string;
  lessonId: string;
  lessonTitle: string;
  sectionIndex: number;
  sectionHeading: string;
  paragraph: string;
  keywords: string[];
}

// Normalize Arabic text: remove diacritics, normalize alef/ya/ta marbuta
function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove diacritics
    .replace(/[\u0622\u0623\u0625]/g, '\u0627') // normalize alef variants
    .replace(/\u0649/g, '\u064A') // ya → alef maqsura
    .replace(/\u0629/g, '\u0647') // ta marbuta → ha
    .replace(/[ًٌٍَُِّْ]/g, '')
    .toLowerCase()
    .trim();
}

function extractKeywords(text: string): string[] {
  const normalized = normalizeArabic(text);
  // Split on non-Arabic-letter and non-number characters
  const words = normalized.split(/[\s\u060C\u061B\u061F.,;:!?()«»""''\-\[\]{}]+/);
  // Filter out very short words and common stopwords
  const stopwords = new Set([
    'في', 'من', 'الى', 'عن', 'على', 'مع', 'هذا', 'هذه', 'ذلك', 'التي', 'الذي',
    'ما', 'لا', 'كم', 'كيف', 'هو', 'هي', 'ان', 'او', 'و', 'ف', 'ثم', 'قد',
    'كل', 'بعض', 'غير', 'بين', 'حين', 'عند', 'لكن', 'بل', 'كان', 'يكون',
    'هناك', 'هنا', 'اذا', 'اذا', 'لك', 'له', 'لها', 'بها', 'به', 'فيه', 'فيها',
    'ال', 'هؤلاء', 'ذ', 'تي', 'وما', 'فما', 'بما', 'كما', 'حيث', 'اي', 'اية',
    'قبل', 'بعد', 'خلال', 'رد', 'ص', 'م', 'ن', 'ت', 'ل', 'ب', 'ف', 'و',
    'ه', 'ي', 'ا', 'د', 'ر', 'س', 'ع', 'ك',
  ]);
  return words.filter((w) => w.length > 2 && !stopwords.has(w));
}

function buildIndex(): SearchIndexEntry[] {
  const index: SearchIndexEntry[] = [];
  for (const subject of subjects) {
    for (const lesson of subject.lessons) {
      for (let i = 0; i < lesson.sections.length; i++) {
        const section = lesson.sections[i];
        for (const paragraph of section.body) {
          index.push({
            subjectId: subject.id,
            subjectTitle: subject.title,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            sectionIndex: i,
            sectionHeading: section.heading,
            paragraph,
            keywords: extractKeywords(paragraph + ' ' + section.heading + ' ' + lesson.title),
          });
        }
      }
    }
  }
  return index;
}

let cachedIndex: SearchIndexEntry[] | null = null;

function getIndex(): SearchIndexEntry[] {
  if (!cachedIndex) {
    cachedIndex = buildIndex();
  }
  return cachedIndex;
}

export function searchContent(query: string, maxResults: number = 5): SearchResult[] {
  if (!query.trim()) return [];
  const index = getIndex();
  const queryKeywords = extractKeywords(query);
  if (queryKeywords.length === 0) return [];

  const results: SearchResult[] = [];

  for (const entry of index) {
    let score = 0;
    const paragraphNormalized = normalizeArabic(entry.paragraph + ' ' + entry.sectionHeading + ' ' + entry.lessonTitle);

    for (const qkw of queryKeywords) {
      // Exact keyword match in keywords list
      if (entry.keywords.includes(qkw)) {
        score += 3;
      }
      // Partial keyword match (keyword contains query or vice versa)
      for (const ekw of entry.keywords) {
        if (ekw.includes(qkw) || qkw.includes(ekw)) {
          score += 1;
          break;
        }
      }
      // Direct substring match in paragraph
      if (paragraphNormalized.includes(qkw)) {
        score += 2;
      }
    }

    // Bonus: heading match
    const headingNormalized = normalizeArabic(entry.sectionHeading);
    for (const qkw of queryKeywords) {
      if (headingNormalized.includes(qkw)) {
        score += 2;
      }
    }

    // Bonus: lesson title match
    const titleNormalized = normalizeArabic(entry.lessonTitle);
    for (const qkw of queryKeywords) {
      if (titleNormalized.includes(qkw)) {
        score += 1;
      }
    }

    if (score > 0) {
      results.push({
        subjectId: entry.subjectId,
        subjectTitle: entry.subjectTitle,
        lessonId: entry.lessonId,
        lessonTitle: entry.lessonTitle,
        sectionIndex: entry.sectionIndex,
        sectionHeading: entry.sectionHeading,
        matchedParagraph: entry.paragraph,
        score,
      });
    }
  }

  // Sort by score descending, take top results
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

// Get a short snippet around the matched keywords
export function getSnippet(paragraph: string, query: string, maxLen: number = 200): string {
  const normalized = normalizeArabic(paragraph);
  const queryKeywords = extractKeywords(query);
  if (queryKeywords.length === 0 || paragraph.length <= maxLen) return paragraph;

  // Find the earliest position of any query keyword
  let earliestPos = -1;
  for (const qkw of queryKeywords) {
    const pos = normalized.indexOf(qkw);
    if (pos !== -1 && (earliestPos === -1 || pos < earliestPos)) {
      earliestPos = pos;
    }
  }

  if (earliestPos === -1) {
    return paragraph.substring(0, maxLen) + '...';
  }

  // Map normalized position back to original (approximate)
  const start = Math.max(0, earliestPos - Math.floor(maxLen / 3));
  const end = Math.min(paragraph.length, start + maxLen);
  let snippet = paragraph.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < paragraph.length) snippet = snippet + '...';
  return snippet;
}
