import type { QuizQuestion } from '../types';

export const quizQuestions: Record<string, QuizQuestion[]> = {
  anatomy: [
    // Easy
    { id: 'an-e1', question: 'كم عدد العظام في جسم الإنسان البالغ؟', options: ['206', '201', '212', '198'], correctIndex: 0, difficulty: 'easy' },
    { id: 'an-e2', question: 'ما هو أكبر عضو في جسم الإنسان؟', options: ['الكبد', 'القلب', 'الدماغ', 'الرئة'], correctIndex: 0, difficulty: 'easy' },
    { id: 'an-e3', question: 'كم عدد غرف القلب؟', options: ['أربع', 'ثلاث', 'خمس', 'اثنتان'], correctIndex: 0, difficulty: 'easy' },
    { id: 'an-e4', question: 'ما العضو المسؤول عن ضخ الدم؟', options: ['القلب', 'الرئة', 'الكبد', 'الكلية'], correctIndex: 0, difficulty: 'easy' },
    { id: 'an-e5', question: 'ما هي أصغر وحدة حية في الجسم؟', options: ['الخلية', 'النسيج', 'العضو', 'الجزيء'], correctIndex: 0, difficulty: 'easy' },
    { id: 'an-e6', question: 'كم عدد أجهزة الجسم الرئيسية؟', options: ['11', '8', '14', '6'], correctIndex: 0, difficulty: 'easy' },
    { id: 'an-e7', question: 'أين يقع النخاع الشوكي؟', options: ['العمود الفقري', 'الجمجمة', 'الصدر', 'الحوض'], correctIndex: 0, difficulty: 'easy' },
    { id: 'an-e8', question: 'ما العضو المسؤول عن التنفس؟', options: ['الرئتان', 'القلب', 'الكلية', 'المعدة'], correctIndex: 0, difficulty: 'easy' },

    // Medium
    { id: 'an-m1', question: 'ما هو عدد الخلايا العصبية في الدماغ تقريبًا؟', options: ['86 مليار', '10 مليار', '500 مليون', 'تريليون'], correctIndex: 0, difficulty: 'medium' },
    { id: 'an-m2', question: 'أي نوع من الأنسجة يربط العضلات بالعظام؟', options: ['الأوتار', 'الغضاريف', 'الرباطات', 'اللفافة'], correctIndex: 0, difficulty: 'medium' },
    { id: 'an-m3', question: 'ما هو الجهاز المسؤول عن الاستتباب (الاتزان الداخلي)؟', options: ['الجهاز العصبي والغدد الصماء', 'الجهاز الهضمي فقط', 'الجهاز التنفسي فقط', 'الجهاز العضلي'], correctIndex: 0, difficulty: 'medium' },
    { id: 'an-m4', question: 'كم عدد الفقرات في العمود الفقري البشري؟', options: ['33', '24', '28', '36'], correctIndex: 0, difficulty: 'medium' },
    { id: 'an-m5', question: 'ما هو اسم العظم الأطول في جسم الإنسان؟', options: ['عظم الفخذ (Femur)', 'عظم الظنبوب', 'عظم العضد', 'عظم الزند'], correctIndex: 0, difficulty: 'medium' },
    { id: 'an-m6', question: 'أي خلايا مسؤولة عن نقل الأكسجين في الدم؟', options: ['كريات الدم الحمراء', 'كريات الدم البيضاء', 'الصفائح الدموية', 'البلازما'], correctIndex: 0, difficulty: 'medium' },
    { id: 'an-m7', question: 'ما هو العضو الذي يفلتر الدم وينتج البول؟', options: ['الكليتان', 'الكبد', 'الطحال', 'البنكرياس'], correctIndex: 0, difficulty: 'medium' },
    { id: 'an-m8', question: 'ما هي الأنسجة الأربعة الأساسية في الجسم؟', options: ['طلائية، ضامة، عضلية، عصبية', 'عظمية، غضروفية، دموية، دهنية', 'بشرة، عضلات، أعصاب، أوعية', 'ظرفية، عميقة، سمحاقية، مصلية'], correctIndex: 0, difficulty: 'medium' },

    // Hard
    { id: 'an-h1', question: 'ما هو الناقل العصبي الرئيسي في المشابك العصبية العضلية؟', options: ['الأسيتيل كولين', 'الدوبامين', 'السيروتونين', 'الغلوتامات'], correctIndex: 0, difficulty: 'hard' },
    { id: 'an-h2', question: 'أي هرمون تفرزه الغدة الكظرية استجابة للضغط النفسي؟', options: ['الكورتيزول', 'الأنسولين', 'الثيروكسين', 'البرولاكتين'], correctIndex: 0, difficulty: 'hard' },
    { id: 'an-h3', question: 'ما هو اسم الصمام بين الأذين الأيسر والبطين الأيسر؟', options: ['صمام التاجية (Mitral)', 'صمام ثلاثي الشرفات', 'صمام الأورطي', 'صمام الرئوي'], correctIndex: 0, difficulty: 'hard' },
    { id: 'an-h4', question: 'ما هي البنية المسؤولة عن توازن السوائل داخل الخلية وخارجها؟', options: ['مضخة الصوديوم-البوتاسيوم', 'الغشاء الدهني فقط', 'الريبوسومات', 'الميتوكوندريا'], correctIndex: 0, difficulty: 'hard' },
    { id: 'an-h5', question: 'أي فص من الدماغ مسؤول عن اللغة المنطوقة (منطقة بروكا)؟', options: ['الفص الجبهي', 'الفص الصدغي', 'الفص الجداري', 'الفص القفوي'], correctIndex: 0, difficulty: 'hard' },
    { id: 'an-h6', question: 'ما هو البروتين الرئيسي في الألياف العضلية المسؤول عن الانقباض؟', options: ['الأكتين والميوسين', 'الكولاجين', 'الإيلاستين', 'الكيراتين'], correctIndex: 0, difficulty: 'hard' },
  ],

  marketing: [
    // Easy
    { id: 'mk-e1', question: 'ما هو المفهوم الأساسي للتسويق؟', options: ['إيصال قيمة للعميل', 'بيع المنتج فقط', 'الإعلان فقط', 'تصميم المنتج'], correctIndex: 0, difficulty: 'easy' },
    { id: 'mk-e2', question: 'ما هي المكونات الأربعة لمزيج التسويق (4Ps)؟', options: ['المنتج، السعر، المكان، الترويج', 'المنتج، الربح، الناس، الإعلان', 'السعر، الجودة، التوزيع، الإعلان', 'المنتج، التعبئة، السعر، البيع'], correctIndex: 0, difficulty: 'easy' },
    { id: 'mk-e3', question: 'ما معنى العلامة التجارية (Brand)؟', options: ['ما يقوله الناس عنك عندما لا تكون موجودًا', 'شعار الشركة فقط', 'اسم المنتج', 'لون التغليف'], correctIndex: 0, difficulty: 'easy' },
    { id: 'mk-e4', question: 'ما هو الهدف من SEO؟', options: ['الظهور في الصفحة الأولى من جوجل', 'زيادة عدد الموظفين', 'تصميم موقع جميل', 'طباعة الكتيبات'], correctIndex: 0, difficulty: 'easy' },
    { id: 'mk-e5', question: 'أي منصة تعتبر الأكبر للتواصل الاجتماعي عالميًا؟', options: ['فيسبوك', 'تويتر', 'لينكدإن', 'سناب شات'], correctIndex: 0, difficulty: 'easy' },
    { id: 'mk-e6', question: 'ما هو "التموضع" (Positioning)؟', options: ['امتلاك كلمة في ذهن العميل', 'وضع المنتج على الرف', 'توزيع المنتج', 'تسعير المنتج'], correctIndex: 0, difficulty: 'easy' },
    { id: 'mk-e7', question: 'ما هو الفرق بين التسويق والمبيعات؟', options: ['التسويق يجذب والمبيعات تغلق', 'لا فرق بينهما', 'المبيعات أوسع من التسويق', 'التسويق جزء من المبيعات'], correctIndex: 0, difficulty: 'easy' },
    { id: 'mk-e8', question: 'ما معنى "القيمة الدائمة للعميل" (CLV)؟', options: ['إجمالي ما ينفقه العميل خلال علاقته بالعلامة', 'قيمة أول عملية شراء', 'تكلفة جذب العميل', 'ربح المنتج الواحد'], correctIndex: 0, difficulty: 'easy' },

    // Medium
    { id: 'mk-m1', question: 'كم عدد مبادئ الإقناع التي حددها روبرت سيالديني؟', options: ['ستة', 'أربعة', 'ثمانية', 'عشرة'], correctIndex: 0, difficulty: 'medium' },
    { id: 'mk-m2', question: 'ما هو "التسويق بالمحتوى" (Content Marketing)؟', options: ['تقديم محتوى قيم لجذب الجمهور وبناء الثقة', 'شراء مساحات إعلانية', 'إرسال رسائل بريد عشوائية', 'تصميم لافتات الطرق'], correctIndex: 0, difficulty: 'medium' },
    { id: 'mk-m3', question: 'ما هو "مسار التحويل" (Conversion Funnel)؟', options: ['رحلة العميل من الوعي إلى الشراء', 'مسار شحن المنتج', 'خطة التسعير', 'قناة التوزيع'], correctIndex: 0, difficulty: 'medium' },
    { id: 'mk-m4', question: 'ما معنى "A/B Testing"؟', options: ['مقارنة نسختين لتحديد الأفضل أداءً', 'اختبار جودة المنتج', 'فحص سرعة الموقع', 'تقييم الموظفين'], correctIndex: 0, difficulty: 'medium' },
    { id: 'mk-m5', question: 'ما هو "معدل التحويل" (Conversion Rate)؟', options: ['نسبة الزوار الذين يقومون بالإجراء المطلوب', 'نسبة الزوار الذين يغادرون', 'سرعة تحميل الصفحة', 'تكلفة الإعلان'], correctIndex: 0, difficulty: 'medium' },
    { id: 'mk-m6', question: 'أي مبدأ من سيالديني يعتمد على "الدليل الاجتماعي"؟', options: ['أنظر إلى ما يفعله الآخرون', 'الالتزام والاتساق', 'السلطة', 'الندرة'], correctIndex: 0, difficulty: 'medium' },
    { id: 'mk-m7', question: 'ما هو الفرق بين B2B و B2C؟', options: ['B2B بين الشركات وB2C للمستهلك النهائي', 'لا فرق', 'B2C أغلى من B2B', 'B2B للمستهلك النهائي'], correctIndex: 0, difficulty: 'medium' },
    { id: 'mk-m8', question: 'ما هي "شخصية العميل" (Buyer Persona)؟', options: ['نموذج يمثل العميل المثالي بتفاصيل ديموغرافية وسلوكية', 'ممثل خدمة العملاء', 'صاحب المتجر', 'المنافس الرئيسي'], correctIndex: 0, difficulty: 'medium' },

    // Hard
    { id: 'mk-h1', question: 'ما هو "الندرة" كأحد مبادئ سيالديني؟', options: ['الأشياء النادرة تبدو أكثر قيمة', 'قليل الإنتاج يرفع التكلفة', 'المنتجات الرخيصة لا تبيع', 'الوفرة تنقص الجودة'], correctIndex: 0, difficulty: 'hard' },
    { id: 'mk-h2', question: 'ما هو "معدل التخلص" (Churn Rate)؟', options: ['نسبة العملاء الذين يتوقفون عن التعامل معك', 'نسبة الأرباح', 'معدل نمو المبيعات', 'تكلفة الإعلان لكل عميل'], correctIndex: 0, difficulty: 'hard' },
    { id: 'mk-h3', question: 'ما هو "CAC"؟', options: ['تكلفة اكتساب العميل', 'إجمالي إيرادات العميل', 'معدل النقر', 'معدل التحويل'], correctIndex: 0, difficulty: 'hard' },
    { id: 'mk-h4', question: 'ما هو "التموضع النفسي" (Psychological Positioning)؟', options: ['امتلاك فئة في ذهن العميل قبل المنافسين', 'وضع المنتج في المتجر', 'تسعير نفسي', 'توزيع جغرافي'], correctIndex: 0, difficulty: 'hard' },
    { id: 'mk-h5', question: 'ما هو "التسويق الأخلاقي" (Ethical Marketing)؟', options: ['التسويق بشفافية دون تلاعب أو إكراه', 'التسويق مجانًا', 'التسويق للمنظمات الخيرية فقط', 'التسويق بدون إعلانات'], correctIndex: 0, difficulty: 'hard' },
    { id: 'mk-h6', question: 'ما هو "التأثير الشبكي" (Network Effect) في التسويق الرقمي؟', options: ['قيمة المنتج تزداد بزيادة عدد المستخدمين', 'الشبكة تزيد التكلفة', 'الإنترنت يقلل الجودة', 'المنافسة تقلل المستخدمين'], correctIndex: 0, difficulty: 'hard' },
  ],

  economics: [
    // Easy
    { id: 'ec-e1', question: 'ما هو التعريف الأساسي للاقتصاد؟', options: ['دراسة كيفية اختيار الموارد النادرة', 'دراسة الأموال فقط', 'علم المحاسبة', 'دراسة التجارة فقط'], correctIndex: 0, difficulty: 'easy' },
    { id: 'ec-e2', question: 'ما الذي يحدد سعر السوق في اقتصاد حر؟', options: ['العرض والطلب', 'الحكومة فقط', 'البنك المركزي', 'الشركات الكبرى'], correctIndex: 0, difficulty: 'easy' },
    { id: 'ec-e3', question: 'ما هو التضخم؟', options: ['ارتفاع مستوى الأسعار وانخفاض القوة الشرائية', 'زيادة الإنتاج', 'انخفاض الأسعار', 'زيادة الصادرات'], correctIndex: 0, difficulty: 'easy' },
    { id: 'ec-e4', question: 'ما هو GDP؟', options: ['إجمالي الناتج المحلي', 'إجمالي الدخل القومي', 'مؤشر الأسعار', 'ميزان المدفوعات'], correctIndex: 0, difficulty: 'easy' },
    { id: 'ec-e5', question: 'ما هي "تكلفة الفرصة"؟', options: ['قيمة أفضل بديل تتخلى عنه', 'تكلفة المنتج', 'سعر السوق', 'تكلفة الإنتاج'], correctIndex: 0, difficulty: 'easy' },
    { id: 'ec-e6', question: 'ماذا يحدث عندما يزيد الطلب ويثبت العرض؟', options: ['يرتفع السعر', 'ينخفض السعر', 'لا يتغير', 'يتوقف الإنتاج'], correctIndex: 0, difficulty: 'easy' },
    { id: 'ec-e7', question: 'ما هو "السوق الحرة"؟', options: ['سوق بحد أدنى من تدخل الحكومة', 'سوق تديره الحكومة', 'سوق مغلق', 'سوق محلي فقط'], correctIndex: 0, difficulty: 'easy' },
    { id: 'ec-e8', question: 'ما هي "الندرة" في الاقتصاد؟', options: ['الموارد محدودة والرغبات لا نهائية', 'قلية السلع', 'ارتفاع الأسعار', 'نقص العمالة'], correctIndex: 0, difficulty: 'easy' },

    // Medium
    { id: 'ec-m1', question: 'ما هو "الناتج المحلي الإجمالي الحقيقي" مقارنة بالاسمي؟', options: ['معدّل للتضخم', 'أعلى دائمًا', 'لا يشمل الاستهلاك', 'يقيس الصادرات فقط'], correctIndex: 0, difficulty: 'medium' },
    { id: 'ec-m2', question: 'ماذا يفعل البنك المركزي لمكافحة التضخم؟', options: ['يرفع أسعار الفائدة', 'يطبع المزيد من النقود', 'يخفض الضرائب', 'يزيد الإنفاق الحكومي'], correctIndex: 0, difficulty: 'medium' },
    { id: 'ec-m3', question: 'ما هي "الميزة المقارنة"؟', options: ['تخصص كل دولة في ما تنتجه بكفاءة نسبية أعلى', 'إنتاج كل شيء محليًا', 'استيراد كل السلع', 'تصدير المواد الخام فقط'], correctIndex: 0, difficulty: 'medium' },
    { id: 'ec-m4', question: 'ما هو "العرض المرن"؟', options: ['الكمية المضافة تتغير بنسبة أكبر من السعر', 'السعر لا يؤثر على الكمية', 'العرض ثابت', 'الطلب يتحدد بالعرض'], correctIndex: 0, difficulty: 'medium' },
    { id: 'ec-m5', question: 'ما هو "الكساد" (Recession)؟', options: ['انكماش الاقتصاد لربعين متتاليين', 'انخفاض الأسعار', 'زيادة الصادرات', 'ارتفاع الأجور'], correctIndex: 0, difficulty: 'medium' },
    { id: 'ec-m6', question: 'ما هي "الفائدة المركبة"؟', options: ['فائدة على الأصل والفائدة المتراكمة', 'فائدة ثابتة', 'فائدة بسيطة', 'خصم من البنك'], correctIndex: 0, difficulty: 'medium' },
    { id: 'ec-m7', question: 'ما هو "الاحتكار"؟', options: ['شركة واحدة تسيطر على السوق', 'شركتان متنافستان', 'عديد البائعين', 'سوق حر بالكامل'], correctIndex: 0, difficulty: 'medium' },
    { id: 'ec-m8', question: 'ماذا يعني "العجز في الميزانية" للحكومة؟', options: ['الإنفاق يفوق الإيرادات', 'الإيرادات تفوق الإنفاق', 'توازن كامل', 'زيادة الصادرات'], correctIndex: 0, difficulty: 'medium' },

    // Hard
    { id: 'ec-h1', question: 'ما هو "المنحنى الفيليبس"؟', options: ['علاقة عكسية بين التضخم والبطالة قصيرة المدى', 'علاقة بين الفائدة والنمو', 'منحنى العرض الكلي', 'منحنى الطلب الكلي'], correctIndex: 0, difficulty: 'hard' },
    { id: 'ec-h2', question: 'ما هو "الناتج المحتمل" في الاقتصاد الكلي؟', options: ['أقصى إنتاج مستدام دون تسريع التضخم', 'الإنتاج في أوقات الذروة', 'إنتاج وقت الركود', 'الإنتاج الاسمي'], correctIndex: 0, difficulty: 'hard' },
    { id: 'ec-h3', question: 'ما هو "مضاعف الإنفاق" (Spending Multiplier)؟', options: ['زيادة الدخل بمقدار أكبر من الزيادة في الإنفاق', 'تضاعف الأسعار', 'تضاعف الإنتاج', 'تضاعف الضرائب'], correctIndex: 0, difficulty: 'hard' },
    { id: 'ec-h4', question: 'ما هي "مرونة الطلب السعرية"؟', options: ['مدى استجابة الكمية المطلوبة لتغير السعر', 'مدى استجابة الدخل للسعر', 'تغير العرض', 'تغير التكلفة'], correctIndex: 0, difficulty: 'hard' },
    { id: 'ec-h5', question: 'ما هو "الاقتصاد السلوكي"؟', options: ['دراسة تأثير العوامل النفسية على القرارات الاقتصادية', 'دراسة السلوك الحيواني', 'تحليل البيانات المالية', 'دراسة الإنتاج'], correctIndex: 0, difficulty: 'hard' },
    { id: 'ec-h6', question: 'ما هو "التراكم الرأسمالي"؟', options: ['إعادة استثمار الفائض لتوسيع الإنتاج', 'تخزين الأموال', 'صرف الأرباح', 'بيع الأصول'], correctIndex: 0, difficulty: 'hard' },
  ],
};

export function getQuizQuestions(subjectId: string): QuizQuestion[] {
  return quizQuestions[subjectId] ?? [];
}
