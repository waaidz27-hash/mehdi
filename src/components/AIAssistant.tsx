import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, BookOpen, ExternalLink } from 'lucide-react';
import { subjects } from '../data';
import { searchLessons, buildContext, getRelevanceScore, type LessonSnippet } from '../utils/lessonSearch';

interface AIAssistantProps {
  onNavigate: (subjectId: string, lessonId: string) => void;
  onNavigateSubject: (subjectId: string) => void;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  quickLinks?: QuickLink[];
  sourceLinks?: QuickLink[];
}

interface QuickLink {
  type: 'subject' | 'lesson';
  label: string;
  subjectId: string;
  lessonId?: string;
}

interface VideoRecommendation {
  title: string;
  url: string;
  description: string;
}

const suggestions = [
  'ما هو الاتزان الداخلي؟',
  'كيف يعمل القلب؟',
  'مبادئ الإقناع السبعة',
  'ما هو التضخم؟',
  'كيف تبنى العلامة التجارية؟',
  'ما هي الميزة المقارنة؟',
  'أنواع العضلات في الجسم',
  'كيف يعمل الدماغ؟',
];

const subjectKeywords: Record<string, string[]> = {
  anatomy: ['تشريح', 'جسم', 'عضو', 'عظام', 'عضلات', 'دماغ', 'قلب', 'رئة', 'دم', 'أعصاب', 'جهاز', 'وظائف', 'خلايا', 'نسيج', 'أمعاء', 'هضم', 'اتزان داخلي', 'homeostasis'],
  marketing: ['تسويق', 'إقناع', 'علامة تجارية', 'مبيعات', 'مستهلك', 'اعلان', 'دعاية', 'براند', 'قناعة', 'نفوذ', 'خطة تسويقية', 'الإقناع', 'سوق', 'عرض', 'طلب', 'قمع', 'محتوى', 'مؤثر'],
  economics: ['اقتصاد', 'تضخم', 'الناتج المحلي', 'GDP', 'رأس المال', 'سعر الفائدة', 'بطالة', 'سياسة نقدية', 'سياسة مالية', 'عرض وطلب', 'سوق حر', 'أموال', 'مال', 'نمو اقتصادي', 'دين', 'استهلاك', 'استثمار', 'عملة', 'بنك مركزي', 'ركود'],
};

const greetings = ['مرحبا', 'مرحب', 'هلا', 'اهلا', 'أهلا', 'سلام', 'السلام', 'هاي', 'hello', 'hi', 'hey', 'صباح', 'مساء'];
const chitchat = ['كيف حالك', 'كيفك', 'شلونك', 'من انت', 'من أنت', 'ما اسمك', 'what is your name', 'who are you', 'thanks', 'شكرا', 'شكراً', 'مشكور', 'ممتاز', 'جميل', 'رائع', 'احسنت', 'أحسنت', 'ok', 'okay', 'تمام', 'ماذا تفعل', 'ماذا تستطيع', 'ماذا يمكن', 'ساعدني', 'help'];

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[إأآ]/g, 'ا')
    .replace(/[يى]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^a-z0-9\u0600-\u06FF ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isGreeting(query: string) {
  const n = normalizeText(query);
  if (n.split(' ').length > 3) return false;
  return greetings.some((g) => n === normalizeText(g) || n.startsWith(normalizeText(g) + ' '));
}

function isChitchat(query: string) {
  const n = normalizeText(query);
  return chitchat.some((c) => n.includes(normalizeText(c)));
}

function isQuestionOrSubstantive(query: string) {
  const n = normalizeText(query);
  if (n.length < 5) return false;
  const questionWords = ['ما', 'ماذا', 'كيف', 'لماذا', 'متى', 'اين', 'هل', 'اشرح', 'وضح', 'عرف', 'ماهو', 'ما هو', 'اختلاف', 'فرق', 'انواع', 'أمثله', 'مثال', 'تفاصيل', 'what', 'how', 'why', 'explain', 'difference', 'types', 'examples'];
  const hasQuestionWord = questionWords.some((w) => n.includes(normalizeText(w)));
  const tokens = n.split(' ').filter((t) => t.length > 2);
  return hasQuestionWord || tokens.length >= 2;
}

function isRelevant(query: string) {
  const scores = getRelevanceScore(query);
  return scores.length > 0 && scores[0].score >= 1;
}

function sanitizeAssistantContent(text: string) {
  return text
    .replace(/^\s*\.+\s*/gm, '')
    .replace(/^\s*(حسنًا|حسناً|دعني أفكر|دعني أظن|أعتقد|أرى|سأفكر|سأحاول|دعني أجيب|بالتأكيد|بالطبع|بالطبع!)[^\n]*\n?/gim, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderAssistantContent(content: string) {
  const urlSplitRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatchRegex = /^https?:\/\/[^\s]+$/;

  return content.split('\n').map((line, lineIndex) => (
    <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
      {line.split(urlSplitRegex).map((segment, segmentIndex) =>
        urlMatchRegex.test(segment) ? (
          <a key={segmentIndex} href={segment} target="_blank" rel="noreferrer noopener" className="text-teal-300 underline decoration-teal-300 hover:text-teal-100">
            {segment}
          </a>
        ) : (
          <span key={segmentIndex}>{segment}</span>
        ),
      )}
    </p>
  ));
}

function getSubjectIdsFromQuery(query: string) {
  const normalizedQuery = normalizeText(query);
  return subjects
    .map((subject) => ({
      id: subject.id,
      score: (subjectKeywords[subject.id] || []).reduce(
        (sum, keyword) => sum + (normalizedQuery.includes(normalizeText(keyword)) ? 1 : 0),
        0,
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.id);
}

function getLessonLinksForSubject(subjectId: string, query: string): QuickLink[] {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return [];

  const queryTokens = normalizeText(query).split(' ').filter((t) => t.length > 2);
  const scoredLessons = subject.lessons.map((lesson) => {
    const text = normalizeText(`${lesson.title} ${lesson.subtitle}`);
    const score = queryTokens.reduce((sum, token) => (text.includes(token) ? sum + 1 : 0), 0);
    return { lesson, score };
  });

  const matchingLessons = scoredLessons
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => ({ type: 'lesson' as const, subjectId, lessonId: item.lesson.id, label: item.lesson.title }));

  if (matchingLessons.length > 0) return matchingLessons;
  return subject.lessons.slice(0, 2).map((lesson) => ({ type: 'lesson' as const, subjectId, lessonId: lesson.id, label: lesson.title }));
}

function isVideoQuery(query: string) {
  return /(فيديو|يوتيوب|مشاهدة|رابط|YouTube|clip|video|رابط فيديو)/i.test(query);
}

function makeYouTubeSearchLink(query: string): VideoRecommendation {
  const subjectIds = getSubjectIdsFromQuery(query);
  let searchQuery = 'أفضل فيديو تعليمي باللغة العربية لهذا الموضوع';
  if (subjectIds.length > 0) {
    const subject = subjects.find((s) => s.id === subjectIds[0]);
    if (subject) searchQuery = `أفضل فيديو عن ${subject.title} باللغة العربية`;
  }
  return { title: `بحث في يوتيوب: ${searchQuery}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, description: 'بحث محسّن في يوتيوب للحصول على فيديوهات تعليمية مناسبة.' };
}

const videoRecommendationsBySubject: Record<string, VideoRecommendation[]> = {
  anatomy: [
    { title: 'التشريح البشري: الجهاز العضلي والعظمي', url: 'https://www.youtube.com/watch?v=F9UGk-bjPqo', description: 'دليل واضح ومبسط عن الجهاز العضلي والعظمي.' },
    { title: 'شرح تشريح القلب والدورة الدموية', url: 'https://www.youtube.com/watch?v=NLXSj9fiPLw', description: 'مقطع تعليمي موثوق يشرح بنية القلب ووظيفته.' },
  ],
  marketing: [
    { title: 'أساسيات التسويق الرقمي', url: 'https://www.youtube.com/watch?v=R7vA0nO6GHE', description: 'شرح مبسط لأساسيات التسويق الرقمي.' },
    { title: 'كيف تبني علامة تجارية قوية', url: 'https://www.youtube.com/watch?v=7bmsA3i4UQo', description: 'أفضل الممارسات لبناء علامة تجارية مؤثرة.' },
  ],
  economics: [
    { title: 'مقدمة في علم الاقتصاد', url: 'https://www.youtube.com/watch?v=c4E3uigg4U4', description: 'أساسيات العرض والطلب والنمو الاقتصادي.' },
    { title: 'التضخم والسياسة النقدية ببساطة', url: 'https://www.youtube.com/watch?v=gwxD3MVKXbw', description: 'شرح مبسط للتضخم وأدوات البنك المركزي.' },
  ],
};

function getVideoRecommendationsForQuery(query: string): VideoRecommendation[] {
  if (!isVideoQuery(query)) return [];
  const fallback: VideoRecommendation[] = [makeYouTubeSearchLink(query)];
  const subjectIds = getSubjectIdsFromQuery(query);
  if (subjectIds.length === 0) return fallback;
  const curated = subjectIds.flatMap((id) => videoRecommendationsBySubject[id] || []).slice(0, 2);
  return [...curated, makeYouTubeSearchLink(query)];
}

function getQuickLinksForQuery(query: string): QuickLink[] {
  const subjectIds = getSubjectIdsFromQuery(query);
  if (subjectIds.length === 0) return [];
  return subjectIds.slice(0, 2).flatMap((subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return [];
    return [{ type: 'subject' as const, subjectId, label: `عرض ${subject.title}` }, ...getLessonLinksForSubject(subjectId, query)];
  });
}

function getLessonLinksFromSnippets(snippets: LessonSnippet[]): QuickLink[] {
  const seen = new Set<string>();
  const links: QuickLink[] = [];
  for (const s of snippets) {
    const key = `${s.subjectId}:${s.lessonId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({ type: 'lesson', subjectId: s.subjectId, lessonId: s.lessonId, label: s.lessonTitle });
    if (links.length >= 3) break;
  }
  return links;
}

type RouteDecision =
  | { type: 'local'; snippets: LessonSnippet[]; links: QuickLink[] }
  | { type: 'ai'; context: string; links: QuickLink[] }
  | { type: 'irrelevant' };

function routeQuery(query: string): RouteDecision {
  const snippets = searchLessons(query, 5);
  const links = getQuickLinksForQuery(query);

  if (snippets.length >= 2) {
    return { type: 'local', snippets, links: links.length > 0 ? links : getLessonLinksFromSnippets(snippets) };
  }

  if (snippets.length === 1 && isRelevant(query)) {
    return { type: 'local', snippets, links: links.length > 0 ? links : getLessonLinksFromSnippets(snippets) };
  }

  if (isRelevant(query) || isGreeting(query) || isChitchat(query) || isQuestionOrSubstantive(query)) {
    const context = buildContext(snippets);
    return { type: 'ai', context, links };
  }

  return { type: 'irrelevant' };
}

export function AIAssistant({ onNavigate, onNavigateSubject }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<VideoRecommendation[]>([]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'مرحبًا! أنا مساعدك الذكي في أكاديمية المعرفة. أجيب من محتوى الدروس المتاحة (التشريح، التسويق، الاقتصاد) وأستخدم الذكاء الاصطناعي للمسائل التي تحتاج شرحًا إضافيًا. اطرح سؤالك!',
        },
      ]);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const callAI = async (systemPrompt: string, query: string): Promise<string> => {
    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: query },
    ];

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openrouter-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatMessages }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error || `استجابة غير صحيحة (${res.status})`);
    }

    const data = await res.json();
    const fullText = data?.choices?.[0]?.message?.content || '';
    return sanitizeAssistantContent(fullText || 'لم أتمكن من توليد رد. حاول مرة أخرى.');
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setStreamingText('');

    const fallbackVideos = getVideoRecommendationsForQuery(query);
    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setRecommendedVideos(fallbackVideos);

    const route = routeQuery(query);

    try {
      if (route.type === 'local') {
        const localAnswer = route.snippets.slice(0, 3).map((snippet) => `${snippet.heading}: ${snippet.text}`).join('\n\n');
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: localAnswer,
          quickLinks: route.links,
          sourceLinks: getLessonLinksFromSnippets(route.snippets),
        }]);
        setIsSearching(false);
        return;
      }

      if (route.type === 'irrelevant') {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: 'هذا السؤال يبدو خارج موضوعات الأكاديمية. اسألني عن التشريح، التسويق، أو الاقتصاد، وسأساعدك بكل سرور.',
        }]);
        setIsSearching(false);
        return;
      }

      const subjectIds = getSubjectIdsFromQuery(query);
      const subjectContext = subjectIds.length > 0
        ? `الموضوعات المتاحة في الأكاديمية: ${subjects.map((s) => s.title).join('، ')}.`
        : '';

      const systemPrompt = `أنت مساعد دراسي ودود ومتخصص في أكاديمية المعرفة. تحدث دائمًا باللغة العربية فقط. أجب عن سؤال الطالب بوضوح ودقة وإيجاز. استخدم معلومات الدروس أدناه عندما تكون متاحة، ويمكنك استخدام معرفتك العامة إذا كان السؤال مرتبطًا بموضوعات الأكاديمية. لا تخترع معلومات. لا تبدأ بعبارات مثل "حسنًا" أو "دعني أفكر". كن مختصرًا ودقيقًا.\n\n${subjectContext}\n\nمعلومات من الدروس:\n${route.context || 'لا توجد فقرة مطابقة في الدروس، فأجب من معرفتك إذا كان الموضوع ضمن التشريح أو التسويق أو الاقتصاد.'}`;

      const assistantContent = await callAI(systemPrompt, query);

      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: assistantContent,
        quickLinks: route.links,
      }]);
      setStreamingText('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: fallbackVideos.length > 0
          ? 'تعذّر تشغيل المساعد، لذا عرضت لك بحثًا محسّنًا في يوتيوب.'
          : `عذراً، ${message}`,
      }]);
      setRecommendedVideos(fallbackVideos);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSearching) {
      handleSearch(input.trim());
      setInput('');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSearch(suggestion);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 px-5 py-3.5 text-sm font-bold text-white shadow-2xl transition-all hover:scale-105 ${open ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      >
        <Bot className="h-5 w-5" />
        <span className="hidden sm:inline">اسأل المساعد</span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-400" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />

          <div className="relative flex h-[85vh] w-full flex-col overflow-hidden rounded-t-3xl border border-slate-700/50 bg-ink-800 shadow-2xl animate-scale-in sm:h-[700px] sm:max-w-md sm:rounded-3xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700/50 bg-gradient-to-r from-teal-500/10 to-blue-500/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-800 bg-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">مساعد المعرفة</h3>
                  <p className="text-xs text-teal-400">يعمل بالذكاء الاصطناعي</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700/50 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'space-y-3'}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white' : 'bg-slate-800/80 text-slate-300 border border-slate-700/30'}`}>
                      {renderAssistantContent(msg.content)}
                    </div>
                    {msg.quickLinks && msg.quickLinks.length > 0 && (
                      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
                          <BookOpen className="h-3.5 w-3.5 text-teal-400" />
                          دروس ذات صلة
                        </div>
                        <div className="grid gap-1.5">
                          {msg.quickLinks.map((link, linkIdx) => (
                            <button
                              key={linkIdx}
                              onClick={() => {
                                if (link.type === 'lesson' && link.lessonId) onNavigate(link.subjectId, link.lessonId);
                                else onNavigateSubject(link.subjectId);
                                setOpen(false);
                              }}
                              className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/60 px-3 py-2.5 text-right text-sm text-slate-200 transition hover:border-teal-500/40 hover:bg-slate-700/60"
                            >
                              <span className="font-medium text-slate-100">{link.label}</span>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming text */}
              {streamingText && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-slate-800/80 text-slate-300 border border-slate-700/30">
                    {renderAssistantContent(streamingText)}
                    <span className="inline-block w-1.5 h-4 bg-teal-400 animate-pulse mr-0.5 align-middle" />
                  </div>
                </div>
              )}

              {recommendedVideos.length > 0 && (
                <div className="rounded-3xl border border-slate-700/50 bg-slate-900/90 p-4 shadow-lg">
                  <div className="mb-3 text-xs uppercase tracking-wider text-slate-400">فيديوهات موثوقة</div>
                  <div className="grid gap-3">
                    {recommendedVideos.map((video, index) => (
                      <a key={index} href={video.url} target="_blank" rel="noreferrer noopener" className="block rounded-2xl border border-slate-700/60 bg-slate-800/90 px-4 py-3 text-sm text-slate-200 transition hover:border-teal-500/50 hover:bg-slate-700/70">
                        <div className="font-semibold text-slate-100">{video.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{video.description}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {isSearching && !streamingText && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-800/80 border border-slate-700/30 px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" style={{ animationDelay: '0s' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" style={{ animationDelay: '0.15s' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && !isSearching && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    جرّب هذه الأسئلة:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => handleSuggestion(s)} className="rounded-full border border-slate-700/40 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-300 transition hover:border-teal-500/30 hover:bg-slate-700/50 hover:text-teal-300">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-slate-700/50 p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  className="flex-1 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500/40"
                />
                <button type="submit" disabled={!input.trim() || isSearching} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
