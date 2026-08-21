import type { ImageResource, VideoResource } from '../types';

export interface MediaPool {
  images: ImageResource[];
  videos: VideoResource[];
}

export const mediaPools: Record<string, MediaPool> = {
  anatomy: {
    images: [
      { url: 'https://images.pexels.com/photos/3825539/pexels-photo-3825539.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'طالب يدرس الهيكل العظمي', caption: 'علم التشريح يدرس بنية الجسم وأشكال أعضائه' },
      { url: 'https://images.pexels.com/photos/8472000/pexels-photo-8472000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'نموذج هيكل عظمي مع أعضاء', caption: 'الجسم البشري منظّم هرميًا: خلايا ← أنسجة ← أعضاء ← أجهزة' },
      { url: 'https://images.pexels.com/photos/8471784/pexels-photo-8471784.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'نموذج تشريحي مع ملصقات', caption: 'الجهاز العصبي يتحكم في كل وظائف الجسم' },
      { url: 'https://images.pexels.com/photos/7695375/pexels-photo-7695375.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'مخططات تشريحية تعليمية', caption: 'الجسم البالغ يحتوي على 206 عظمة' },
      { url: 'https://images.pexels.com/photos/7269617/pexels-photo-7269617.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'نماذج أعضاء تشريحية', caption: 'أكثر من 640 عضلة هيكلية في جسمك' },
      { url: 'https://images.pexels.com/photos/15410078/pexels-photo-15410078.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'نموذج دماغ بشري', caption: 'الدماغ — 86 مليار خلية عصبية' },
      { url: 'https://images.pexels.com/photos/17483868/pexels-photo-17483868.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'تصوير ثلاثي الأبعاد للدماغ', caption: 'الشبكة العصبية — تريليونات المشابك' },
      { url: 'https://images.pexels.com/photos/8460101/pexels-photo-8460101.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'فحص قلب بالمخطط الكهربائي', caption: 'القلب ينبض 100,000 مرة يوميًا' },
      { url: 'https://images.pexels.com/photos/9408868/pexels-photo-9408868.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'جهاز مراقبة قلب', caption: 'القلب مضختان متجاورتان في عضو واحد' },
      { url: 'https://images.pexels.com/photos/4226259/pexels-photo-4226259.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'صورة أشعة للصدر', caption: 'الرئتان — 300 مليون حويصلة هوائية' },
      { url: 'https://images.pexels.com/photos/8471918/pexels-photo-8471918.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'نموذج تشريحي للمعدة', caption: 'الجهاز الهضمي — قناة 9 أمتار' },
      { url: 'https://images.pexels.com/photos/8932609/pexels-photo-8932609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'خلايا تحت المجهر', caption: 'الخلية — أصغر وحدة حية' },
      { url: 'https://images.pexels.com/photos/8720351/pexels-photo-8720351.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'أنسجة تحت المجهر', caption: 'أربعة أنواع من الأنسجة: طلائي، ضام، عضلي، عصبي' },
      { url: 'https://images.pexels.com/photos/3992930/pexels-photo-3992930.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'خلايا دموية تحت المجهر', caption: 'خلايا الدم — خلايا حمراء وبيضاء وصفائح' },
      { url: 'https://images.pexels.com/photos/5723884/pexels-photo-5723884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'أشعة للعمود الفقري', caption: 'العمود الفقري يحمي النخاع الشوكي' },
    ],
    videos: [
      { id: 'pool-a1', title: 'مقدمة في التشريح ووظائف الأعضاء — Crash Course', youtubeId: 'uBGl2BujkPQ' },
      { id: 'pool-a2', title: 'أنواع العظام في الهيكل العظمي — Kenhub', youtubeId: 'e33A3IWrG3g' },
      { id: 'pool-a3', title: 'العضلات: الخلايا العضلية — Crash Course', youtubeId: 'Ktv-CaOt6UQ' },
      { id: 'pool-a4', title: 'الجهاز التنفسي — Crash Course', youtubeId: 'bHZsvBdUC2I' },
      { id: 'pool-a5', title: 'الدورة القلبية — Dr Matt & Dr Mike', youtubeId: 'PzVKE2AkatM' },
      { id: 'pool-a6', title: 'الجهاز التنفسي — Professor Dave', youtubeId: 'ZB7uA5o0mS4' },
      { id: 'pool-a7', title: 'نظرة عامة على الجهاز التنفسي', youtubeId: '03qvN5pjCTU' },
      { id: 'pool-a8', title: 'أنواع النسيج العضلي', youtubeId: 'jpnNc03cqU0' },
      { id: 'pool-a9', title: 'بنية العضلة الهيكلية — Ninja Nerd', youtubeId: 'UKgbfxPTn_s' },
      { id: 'pool-a10', title: 'القلب والصمامات — Crash Course', youtubeId: 'xamYVlNF5Zo' },
    ],
  },
  marketing: {
    images: [
      { url: 'https://images.pexels.com/photos/6476787/pexels-photo-6476787.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عرض تسويقي على الإنفاق الإعلاني', caption: 'الإقناع فن وعلم تغيير قناعات الآخرين' },
      { url: 'https://images.pexels.com/photos/7710049/pexels-photo-7710049.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'فريق يضع استراتيجية تسويقية', caption: 'استراتيجية التسويق تبدأ بفهم العميل' },
      { url: 'https://images.pexels.com/photos/7688430/pexels-photo-7688430.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'وثائق استراتيجية التسويق', caption: 'العلامة التجارية هي ما يقوله الناس عنك' },
      { url: 'https://images.pexels.com/photos/9034728/pexels-photo-9034728.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عرض ترويجي للنمو', caption: 'التموضع: امتلك كلمة واحدة في ذهن العميل' },
      { url: 'https://images.pexels.com/photos/8353803/pexels-photo-8353803.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عرض بيانات السوق', caption: 'التحليلات تميز التسويق الرقمي' },
      { url: 'https://images.pexels.com/photos/7661590/pexels-photo-7661590.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'هوية العلامة التجارية', caption: 'القيمة الدائمة للعميل — مفتاح الربحية' },
      { url: 'https://images.pexels.com/photos/6956303/pexels-photo-6956303.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'كاميرا وتسويق رقمي', caption: 'كل منصة لها ثقافتها — خصص محتواك' },
      { url: 'https://images.pexels.com/photos/4963359/pexels-photo-4963359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'مصافحة عمل', caption: 'نحن أكثر ميلًا لنقول نعم لمن نحب' },
      { url: 'https://images.pexels.com/photos/7688106/pexels-photo-7688106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'اجتماع تسويقي', caption: 'الكلمات تبيع أكثر من الصور' },
      { url: 'https://images.pexels.com/photos/8124362/pexels-photo-8124362.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عرض تقديمي', caption: 'الإقناع العاطفي يتفوق على المنطقي' },
      { url: 'https://images.pexels.com/photos/15595051/pexels-photo-15595051.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'مكتب تسويق رقمي', caption: 'SEO — الظهور في الصفحة الأولى من جوجل' },
      { url: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'سوشيال ميديا', caption: '4.9 مليار شخص يستخدمون وسائل التواصل يوميًا' },
    ],
    videos: [
      { id: 'pool-m1', title: 'علم الإقناع — روبرت سيالديني', youtubeId: 'cFdCzN7RYbw' },
      { id: 'pool-m2', title: 'مبادئ الإقناع النفسي السبعة', youtubeId: 'P3rbadeF9AI' },
    ],
  },
  economics: {
    images: [
      { url: 'https://images.pexels.com/photos/6801639/pexels-photo-6801639.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'مكتب تحليل الأسهم والرسوم البيانية', caption: 'الاقتصاد دراسة اختيار الموارد النادرة' },
      { url: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'جهاز لوحي يعرض تحليل سوق الأسهم', caption: 'العرض والطلب يحددان كل سعر' },
      { url: 'https://images.pexels.com/photos/9260562/pexels-photo-9260562.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عملة بيتكوين على رسوم بيانية مالية', caption: 'الندرة — جوهر المشكلة الاقتصادية' },
      { url: 'https://images.pexels.com/photos/14751274/pexels-photo-14751274.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'لابتوب يعرض رسوم بيانية مالية', caption: 'GDP يقيس حجم الاقتصاد' },
      { url: 'https://images.pexels.com/photos/10531120/pexels-photo-10531120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عملات ذهبية وفضية', caption: 'البنك المركزي يدير السياسة النقدية' },
      { url: 'https://images.pexels.com/photos/7654624/pexels-photo-7654624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عد النقود', caption: 'البنك المركزي يدير السياسة النقدية' },
      { url: 'https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'سفن شحن', caption: 'التجارة الدولية تزيد الثراء الكلي' },
      { url: 'https://images.pexels.com/photos/11333721/pexels-photo-11333721.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عملات ورسوم بيانية', caption: 'التضخم يذوب القوة الشرائية للنقود' },
      { url: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'شاشة تداول مالي', caption: 'الفائدة المركبة — الوقت يجعل المال ينمو' },
      { url: 'https://images.pexels.com/photos/12198531/pexels-photo-12198531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'آلة حاسبة وقطع نقدية', caption: 'تكلفة الفرصة — قيمة ما تتخلى عنه' },
      { url: 'https://images.pexels.com/photos/7947853/pexels-photo-7947853.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'بيانات تصدير عالمي', caption: 'الميزة المقارنة — كل دولة تتخصص في ما تنتجه بكفاءة' },
      { url: 'https://images.pexels.com/photos/35118208/pexels-photo-35118208.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'رسم بياني هابط', caption: 'الدورات الاقتصادية: صعود وهبوط لا ينتهي' },
      { url: 'https://images.pexels.com/photos/8378726/pexels-photo-8378726.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'رسم طباشيري للتفكير', caption: 'الاقتصاد السلوكي — الناس لا يتصرفون بمنطق' },
      { url: 'https://images.pexels.com/photos/3305/numbers-money-calculating-calculation.jpg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'عملات وآلة حاسبة', caption: 'الاستثمار يجعل المال ينمو exponentially' },
    ],
    videos: [
      { id: 'pool-e1', title: 'كيف تعمل الآلة الاقتصادية — Ray Dalio', youtubeId: 'PHe0bXAIuk0' },
    ],
  },
};

export function getPoolImage(subjectId: string, sectionIndex: number): ImageResource | undefined {
  const pool = mediaPools[subjectId];
  if (!pool || pool.images.length === 0) return undefined;
  return pool.images[sectionIndex % pool.images.length];
}

/**
 * Returns a pool video for a section, skipping any youtubeIds already used.
 * Pass a Set of already-used IDs to avoid duplicates.
 */
export function getPoolVideo(
  subjectId: string,
  sectionIndex: number,
  usedIds?: Set<string>
): VideoResource | undefined {
  const pool = mediaPools[subjectId];
  if (!pool || pool.videos.length === 0) return undefined;

  // Try to find a video not already used
  for (let i = 0; i < pool.videos.length; i++) {
    const idx = (sectionIndex + i) % pool.videos.length;
    const video = pool.videos[idx];
    if (!usedIds || !usedIds.has(video.youtubeId)) {
      return video;
    }
  }
  // All used — return the first as fallback
  return pool.videos[sectionIndex % pool.videos.length];
}
