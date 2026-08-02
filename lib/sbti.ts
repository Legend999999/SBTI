export const locales = ["en", "ckb", "ar"] as const;
export type Locale = (typeof locales)[number];
export type Direction = "ltr" | "rtl";

export type Dimension =
  | "selfConfidence"
  | "selfClarity"
  | "selfAcceptance"
  | "emotionalIntensity"
  | "emotionalRegulation"
  | "recoverySpeed"
  | "optimism"
  | "flexibility"
  | "riskTolerance"
  | "motivation"
  | "decisionSpeed"
  | "executionConsistency"
  | "socialEnergy"
  | "expressiveness"
  | "boundaries";

export type PersonalityType = {
  id: string;
  code: string;
  safeCode: string;
  slug: string;
  group: "Self" | "Emotional" | "Attitude" | "Action" | "Social";
  titles: Record<Locale, string>;
  hook: Record<Locale, string>;
  short: Record<Locale, string>;
  long?: Record<Locale, string>;
  traits: Record<Locale, string[]>;
  strengths: Record<Locale, string[]>;
  struggles: Record<Locale, string[]>;
  quote: Record<Locale, string>;
  seriousInsight: Record<Locale, string>;
  compatibility: { best: string[]; challenging: string[] };
  dimensionProfile: Record<Dimension, number>;
  characterAsset: CharacterAsset;
  seo: Record<Locale, string>;
  socialCaption: Record<Locale, string>;
  posterCaption: Record<Locale, string>;
};

export type CharacterAsset = {
  expression: string;
  pose: string;
  clothing: string;
  prop: string;
  accent: string;
  backgroundSymbol: string;
  altText: Record<Locale, string>;
  prompt: string;
  negativePrompt: string;
  desktopImage: string;
  mobileImage: string;
  thumbnailImage: string;
  transparentImage: string;
};

export type Question = {
  id: string;
  dimension: Dimension;
  text: Record<Locale, string>;
  reverse?: boolean;
  active: boolean;
};

export type TestResult = {
  type: PersonalityType;
  scores: Record<Dimension, number>;
  distance: number;
  topTraits: Dimension[];
};

export const localeMeta: Record<Locale, { label: string; dir: Direction; numerals: "latn" | "arab" }> = {
  en: { label: "English", dir: "ltr", numerals: "latn" },
  ckb: { label: "کوردی", dir: "rtl", numerals: "arab" },
  ar: { label: "العربية", dir: "rtl", numerals: "arab" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const dimensions: Dimension[] = [
  "selfConfidence",
  "selfClarity",
  "selfAcceptance",
  "emotionalIntensity",
  "emotionalRegulation",
  "recoverySpeed",
  "optimism",
  "flexibility",
  "riskTolerance",
  "motivation",
  "decisionSpeed",
  "executionConsistency",
  "socialEnergy",
  "expressiveness",
  "boundaries",
];

export const dimensionLabels: Record<Dimension, Record<Locale, string>> = {
  selfConfidence: { en: "Self-confidence", ckb: "متمانە بە خۆ", ar: "الثقة بالنفس" },
  selfClarity: { en: "Self-clarity", ckb: "ڕوونیی خۆناسی", ar: "وضوح الذات" },
  selfAcceptance: { en: "Self-acceptance", ckb: "قبوڵکردنی خۆ", ar: "تقبل الذات" },
  emotionalIntensity: { en: "Emotional intensity", ckb: "توندی هەست", ar: "حدة المشاعر" },
  emotionalRegulation: { en: "Emotional regulation", ckb: "ڕێکخستنی هەست", ar: "تنظيم المشاعر" },
  recoverySpeed: { en: "Recovery speed", ckb: "خێرایی گەڕانەوە", ar: "سرعة التعافي" },
  optimism: { en: "Optimism", ckb: "گەشبینی", ar: "التفاؤل" },
  flexibility: { en: "Flexibility", ckb: "نەرمی و گونجان", ar: "المرونة" },
  riskTolerance: { en: "Risk tolerance", ckb: "هەڵگرتنی مەترسی", ar: "تحمل المخاطرة" },
  motivation: { en: "Motivation", ckb: "پاڵنەر", ar: "الدافعية" },
  decisionSpeed: { en: "Decision speed", ckb: "خێرایی بڕیار", ar: "سرعة القرار" },
  executionConsistency: { en: "Execution consistency", ckb: "بەردەوامی لە جێبەجێکردن", ar: "ثبات التنفيذ" },
  socialEnergy: { en: "Social energy", ckb: "وزەی کۆمەڵایەتی", ar: "الطاقة الاجتماعية" },
  expressiveness: { en: "Expressiveness", ckb: "دەربڕین", ar: "التعبير" },
  boundaries: { en: "Boundaries", ckb: "سنوورەکان", ar: "الحدود الشخصية" },
};

const high = 86;
const mid = 55;
const low = 22;

function profile(values: Partial<Record<Dimension, number>>): Record<Dimension, number> {
  return Object.fromEntries(dimensions.map((dimension) => [dimension, values[dimension] ?? mid])) as Record<Dimension, number>;
}

const common = {
  negativePrompt:
    "photorealism, copied franchise character, complex background, tiny unreadable details, harsh insults, sexualized pose, brand logos",
  desktopImage: "/characters/geometric-mascot.webp",
  mobileImage: "/characters/geometric-mascot-mobile.webp",
  thumbnailImage: "/characters/geometric-mascot-thumb.webp",
  transparentImage: "/characters/geometric-mascot-transparent.webp",
};

const typeSeeds = [
  ["IMSB", "IMSB", "imsb", "Self", "The Self-Doubter", "گومانکاری خۆی", "المشكك بنفسه", "Arguing with a mirror", "#9f6bff"],
  ["BOSS", "BOSS", "boss", "Action", "The Leader", "سەرکردە", "القائد", "Holding a tiny crown clipboard", "#1a9f68"],
  ["MUM", "MUM", "mum", "Social", "The Caretaker", "چاودێر", "الراعي", "Carrying snacks and a first-aid pouch", "#f06c7a"],
  ["FAKE", "FAKE", "fake", "Social", "The Shapeshifter", "گۆڕاوگۆڕ", "متبدل الأقنعة", "Switching between soft paper masks", "#8b7cf6"],
  ["Dior-s", "Dior-s", "dior-s", "Attitude", "The Underdog", "کەمبینراوی گەورە", "المستهان به", "Preparing a dramatic comeback cape", "#e0a22b"],
  ["DEAD", "DEAD", "dead", "Emotional", "The Exhausted One", "ماندووی تەواو", "المنهك", "Standing with a one percent battery", "#607d8b"],
  ["ZZZZ", "ZZZZ", "zzzz", "Emotional", "The Sleeper", "خەواڵوو", "النعسان", "Wrapped in a blanket while standing", "#6aa6d8"],
  ["GOGO", "GOGO", "gogo", "Action", "The Doer", "دەستبەکار", "المنجز", "Running with an unfinished coffee", "#f28c38"],
  ["FUCK", "WILD", "wild", "Attitude", "The Wild One", "سەرپێچی دڵخۆش", "المتمرد", "Breaking an unnecessary rule sign", "#ef4444"],
  ["CTRL", "CTRL", "ctrl", "Action", "The Controller", "کۆنتڕۆڵکەر", "المتحكم", "Surrounded by switches and strings", "#14b8a6"],
  ["HHHH", "HHHH", "hhhh", "Social", "The Giggle Machine", "پێکەنینی بەردەوام", "آلة الضحك", "Laughing at their own joke", "#f9c74f"],
  ["SEXY", "CHARM", "charm", "Social", "The Charmer", "جوانقسە", "الجذاب", "Stylish wink with a sparkle cane", "#ec4899"],
  ["OJBK", "OJBK", "ojbk", "Attitude", "The Unbothered One", "بێ خەمی شاز", "غير المكترث", "Shrugging while chaos passes", "#84cc16"],
  ["JOKE-R", "JOKE-R", "joker", "Social", "The Clown", "نوکتەباز", "المهرج", "Holding a comedy mask with honest eyes", "#fb7185"],
  ["POOR", "POOR", "poor", "Action", "The Focused Struggler", "تێکۆشەری سەرسوور", "المكافح المركز", "Working beside an almost-empty pocket", "#d97706"],
  ["OH-NO", "OH-NO", "oh-no", "Emotional", "The Worrier", "نیگەران", "القلق", "Surrounded by warning triangles", "#f97316"],
  ["MONK", "MONK", "monk", "Self", "The Detached One", "ئارامی دەرەوەی شاژە", "المنفصل الهادئ", "Calm while notifications explode", "#22c55e"],
  ["SHIT", "SALTY", "salty", "Attitude", "The Cynic", "گومانکاری تاڵ", "الساخر المتشكك", "Inspecting everything with a tiny lens", "#64748b"],
  ["THAN-K", "THAN-K", "thank", "Self", "The Grateful One", "سوپاسگوزار", "الممتن", "Celebrating a tiny good thing", "#10b981"],
  ["MALO", "MALO", "malo", "Emotional", "The Monkey Mind", "مێشکی بازدە", "العقل القافز", "Jumping between idea cards", "#a855f7"],
  ["ATM-er", "ATM-er", "atm-er", "Social", "The Generous Giver", "بەخشەندەی گیرفان بەتاڵ", "المعطاء", "Giving coins from an empty wallet", "#0ea5e9"],
  ["THIN-K", "THIN-K", "thin-k", "Self", "The Overthinker", "زۆر بیرکەرەوە", "كثير التفكير", "Under tired thought bubbles", "#6366f1"],
  ["SOLO", "SOLO", "solo", "Social", "The Lone Wolf", "تەنهای ئارام", "الذئب المنفرد", "Sitting beneath a small moon", "#334155"],
  ["LOVE-R", "LOVE-R", "lover", "Emotional", "The Hopeless Romantic", "رۆمانسی بێ چارە", "الرومانسي الحالم", "Holding a cracked oversized heart", "#e11d48"],
  ["WOC!", "WOC!", "woc", "Emotional", "The Confused Reactor", "سەرسامی دەستبەجێ", "المتفاعل الحائر", "Shocked inside question marks", "#06b6d4"],
  ["DRUNK", "PARTY", "party", "Social", "The Party Spirit", "ڕۆحی ئاهەنگ", "روح الحفلة", "Dizzy stars without glorifying alcohol", "#f59e0b"],
  ["IMFW", "IMFW", "imfw", "Action", "The Procrastinating Dreamer", "خەونبینی دواخستن", "الحالم المؤجل", "Lying down while plans float above", "#7c3aed"],
] as const;

const profileByCode: Record<string, Partial<Record<Dimension, number>>> = {
  IMSB: { selfConfidence: low, selfClarity: 40, selfAcceptance: low, emotionalIntensity: high, emotionalRegulation: 38 },
  BOSS: { selfConfidence: high, motivation: high, decisionSpeed: high, executionConsistency: 78, boundaries: 74 },
  MUM: { boundaries: low, socialEnergy: 70, expressiveness: 72, selfAcceptance: 72, emotionalRegulation: 68 },
  FAKE: { flexibility: high, selfClarity: low, expressiveness: high, boundaries: 35 },
  "Dior-s": { optimism: 72, motivation: 77, riskTolerance: 68, selfConfidence: 45, executionConsistency: 70 },
  DEAD: { motivation: low, recoverySpeed: low, emotionalIntensity: 67, executionConsistency: low },
  ZZZZ: { motivation: low, decisionSpeed: 30, emotionalRegulation: 70, recoverySpeed: 48 },
  GOGO: { motivation: high, decisionSpeed: high, executionConsistency: high, riskTolerance: 72 },
  FUCK: { riskTolerance: high, flexibility: high, boundaries: high, emotionalRegulation: 32, optimism: 62 },
  CTRL: { boundaries: high, decisionSpeed: 76, flexibility: low, emotionalRegulation: 72, executionConsistency: high },
  HHHH: { expressiveness: high, socialEnergy: high, optimism: high, emotionalRegulation: 42 },
  SEXY: { selfConfidence: high, expressiveness: high, socialEnergy: 80, boundaries: 70 },
  OJBK: { emotionalRegulation: high, recoverySpeed: high, optimism: 70, motivation: 42 },
  "JOKE-R": { expressiveness: high, emotionalIntensity: 70, optimism: 72, selfAcceptance: 48 },
  POOR: { motivation: high, executionConsistency: 76, optimism: 42, recoverySpeed: 55 },
  "OH-NO": { emotionalIntensity: high, emotionalRegulation: low, riskTolerance: low, recoverySpeed: 34 },
  MONK: { emotionalRegulation: high, boundaries: high, socialEnergy: low, expressiveness: low },
  SHIT: { optimism: low, selfClarity: 73, riskTolerance: 40, flexibility: 42 },
  "THAN-K": { optimism: high, selfAcceptance: high, emotionalRegulation: high, expressiveness: 64 },
  MALO: { flexibility: high, emotionalIntensity: high, decisionSpeed: 70, executionConsistency: low },
  "ATM-er": { boundaries: low, expressiveness: 70, socialEnergy: 76, selfAcceptance: 68 },
  "THIN-K": { selfClarity: high, emotionalIntensity: 72, decisionSpeed: low, executionConsistency: 44, boundaries: 62 },
  SOLO: { socialEnergy: low, boundaries: high, selfClarity: 80, expressiveness: low },
  "LOVE-R": { emotionalIntensity: high, optimism: 78, boundaries: low, expressiveness: 76 },
  "WOC!": { emotionalIntensity: high, decisionSpeed: low, selfClarity: low, flexibility: 40 },
  DRUNK: { socialEnergy: high, expressiveness: high, riskTolerance: high, executionConsistency: low },
  IMFW: { motivation: low, decisionSpeed: low, optimism: 75, selfClarity: 58, executionConsistency: low },
};

export const personalityTypes: PersonalityType[] = typeSeeds.map(([code, safeCode, slug, group, en, ckb, ar, prop, accent]) => ({
  id: slug,
  code,
  safeCode,
  slug,
  group,
  titles: { en, ckb, ar },
  hook: {
    en: code === "THIN-K" ? "Your brain opens 47 tabs and then asks why the room is warm." : `A ${en.toLowerCase()} with main-character timing and suspicious accuracy.`,
    ckb: code === "THIN-K" ? "مێشکت ٤٧ تاب دەکاتەوە و پاشان دەپرسێت بۆ ژوورەکە گەرمە." : `${ckb} بە کەسایەتییەکی خۆش و زۆرجار ڕاست.`,
    ar: code === "THIN-K" ? "عقلك يفتح ٤٧ نافذة ثم يسأل لماذا الغرفة حارة." : `${ar} بنكهة مرحة ودقة مريبة.`,
  },
  short: {
    en: code === "THIN-K" ? "You notice patterns before people finish sentences, then spend three hours checking if you overreacted." : `You turn ordinary moments into a recognizable ${en.toLowerCase()} storyline.`,
    ckb: code === "THIN-K" ? "پێش ئەوەی خەڵک قسەیان تەواو بکەن پەیوەندییەکان دەبینیت، پاشان سێ کاتژمێر دڵنیا دەبیتەوە کە زیادت لێ نەکردووە." : `تۆ ساتە ئاساییەکان دەگۆڕیت بۆ چیرۆکی ${ckb}.`,
    ar: code === "THIN-K" ? "تلتقط الأنماط قبل أن ينهي الناس كلامهم، ثم تقضي وقتا طويلا تتأكد أنك لم تبالغ." : `تحول اللحظات العادية إلى قصة واضحة لشخصية ${ar}.`,
  },
  long: code === "THIN-K" ? {
    en: "THIN-K is analytical, observant, and allergic to shallow explanations. You can be brilliant at reading the room, planning three versions of the future, and finding the tiny detail everyone missed. The catch is that your mind sometimes treats every choice like a final exam. Your best growth move is not to think less, but to decide what deserves the full detective board.",
    ckb: "THIN-K وردبینە، شیکاری دەکات و بە ڕووکەشی قسەکان قایل نابێت. دەتوانیت ژوورەکە بخوێنیتەوە، چەند داهاتووی جیاواز دابنێیت و ئەو وردەکارییە ببینیت کە هەموو کەس لێی تێپەڕیوە. بەڵام جارێک مێشکت هەموو بڕیارێک وەک تاقیکردنەوەی کۆتایی مامەڵە پێدەکات. گەشەکردنت ئەوە نییە کەمتر بیر بکەیتەوە، بەڵکو بزانیت چی شایەنی تەختەی پشکنینی تەواوە.",
    ar: "شخصية THIN-K تحليلية وملاحظة ولا ترضى بالإجابات السطحية. تقرأ الجو بسرعة، ترسم أكثر من مستقبل محتمل، وتلتقط التفاصيل التي يفوتها الآخرون. المشكلة أن عقلك أحيانا يعامل كل قرار كأنه امتحان نهائي. التطور الحقيقي ليس أن تفكر أقل، بل أن تعرف ما الذي يستحق كل هذا التحقيق.",
  } : undefined,
  traits: {
    en: code === "THIN-K" ? ["Observant", "Analytical", "Careful"] : ["Distinctive", "Relatable", "Meme-ready"],
    ckb: code === "THIN-K" ? ["وردبین", "شیکاریکار", "ئاگادار"] : ["دیار", "نزیک بە ژیان", "گونجاو بۆ سۆشیال"],
    ar: code === "THIN-K" ? ["ملاحظ", "تحليلي", "حذر"] : ["مميز", "قريب من الواقع", "جاهز للميمز"],
  },
  strengths: {
    en: code === "THIN-K" ? ["Spots hidden patterns", "Prepares well", "Reads subtle signals", "Asks useful questions", "Avoids careless decisions"] : ["Memorable presence", "Fast emotional signal", "Clear social pattern", "Good story energy", "Easy to recognize"],
    ckb: code === "THIN-K" ? ["پەیوەندیی شاراوە دەبینێت", "باش ئامادە دەبێت", "نیشانە وردەکان دەخوێنێتەوە", "پرسیاری بەسوود دەکات", "لە بڕیاری خێرا دوور دەکەوێتەوە"] : ["ئامادەبوونی بیرنەکراو", "نیشانەی هەستی خێرا", "شێوازی کۆمەڵایەتی ڕوون", "وزەی چیرۆک", "ئاسان ناسرێتەوە"],
    ar: code === "THIN-K" ? ["يرى الأنماط الخفية", "يستعد جيدا", "يلتقط الإشارات الدقيقة", "يسأل أسئلة نافعة", "يتجنب القرارات المهملة"] : ["حضور لا ينسى", "إشارة عاطفية سريعة", "نمط اجتماعي واضح", "طاقة قصصية", "سهل التعرف عليه"],
  },
  struggles: {
    en: code === "THIN-K" ? ["Can delay simple choices", "Overreads neutral messages", "Gets tired from mental tabs", "Needs reassurance but hates needing it", "May confuse caution with truth"] : ["Can become a bit too obvious", "May lean into the bit", "Needs balance under stress", "Sometimes misread by others", "Can dodge boring structure"],
    ckb: code === "THIN-K" ? ["بڕیارە ئاسانەکان دوا دەخات", "نامەی ئاسایی زۆر دەخوێنێتەوە", "لە تابەکانی مێشک ماندوو دەبێت", "دڵنیایی دەوێت بەڵام حەزی پێ ناکات", "جارێک ئاگاداری بە ڕاستی تێکەڵ دەکات"] : ["جارێک زۆر ئاشکرا دەبێت", "لە ڕۆڵەکە زیادەڕۆیی دەکات", "لە فشاردا هاوسەنگی دەوێت", "لەوانەیە خەڵک هەڵەی تێبگەن", "لە ڕێکخستنی بێتام ڕادەکات"],
    ar: code === "THIN-K" ? ["يؤجل الخيارات البسيطة", "يفسر الرسائل العادية أكثر من اللازم", "يتعب من النوافذ الذهنية", "يريد الطمأنة ويكره احتياجه لها", "قد يخلط الحذر بالحقيقة"] : ["قد يصبح واضحا أكثر من اللازم", "يمثل الدور زيادة", "يحتاج توازنا تحت الضغط", "قد يسيء الناس فهمه", "يهرب من التنظيم الممل"],
  },
  quote: {
    en: code === "THIN-K" ? "\"I am calm. I just need to inspect every possible timeline first.\"" : "\"This feels personally targeted, but continue.\"",
    ckb: code === "THIN-K" ? "\"ئارامم. تەنها دەبێت هەموو ڕێڕەوی داهاتوو بپشکنم.\"" : "\"هەست دەکەم مەبەست لە منە، بەڵام بەردەوام بە.\"",
    ar: code === "THIN-K" ? "\"أنا هادئ. فقط أحتاج أن أفحص كل الاحتمالات أولا.\"" : "\"أشعر أن هذا الكلام عني، أكمل.\"",
  },
  seriousInsight: {
    en: code === "THIN-K" ? "Your mind is a strength when it serves your values, not every passing fear." : "The funniest version of you still deserves practical care and boundaries.",
    ckb: code === "THIN-K" ? "مێشکت هێزە کاتێک خزمەتی بەهاکانت دەکات، نە هەموو ترسێکی تێپەڕ." : "خۆشترین وەشانی تۆش پێویستی بە چاودێری و سنووری کرداری هەیە.",
    ar: code === "THIN-K" ? "عقلك قوة عندما يخدم قيمك، لا كل خوف عابر." : "حتى نسختك المضحكة تحتاج عناية وحدودا عملية.",
  },
  compatibility: { best: ["MONK", "BOSS", "THAN-K"], challenging: ["GOGO", "DRUNK", "WOC!"] },
  dimensionProfile: profile(profileByCode[code]),
  characterAsset: {
    expression: code === "THIN-K" ? "mentally overloaded but observant" : "expressive, amused, slightly mischievous",
    pose: code === "THIN-K" ? "hand under chin, shoulders slightly raised" : "compact low-poly stance with readable silhouette",
    clothing: "simple cropped jacket, soft sneakers, geometric scarf",
    prop,
    accent,
    backgroundSymbol: prop,
    altText: {
      en: `${en} mascot, ${prop.toLowerCase()}, in a clean geometric style.`,
      ckb: `ماسکۆتی ${ckb} بە شێوازی ئەندازەیی پاک.`,
      ar: `تميمة ${ar} بأسلوب هندسي نظيف.`,
    },
    prompt: `Original clean geometric low-poly mascot for ${code} / ${en}. Expressive face, compact body proportions, ${prop}, warm off-white background, accent ${accent}, transparent export, premium humorous personality test brand.`,
    ...common,
  },
  seo: {
    en: `${en} SBTI personality type profile with strengths, struggles, compatibility and shareable poster.`,
    ckb: `پڕۆفایلی جۆری ${ckb} لە تاقیکردنەوەی SBTI بە خاڵە بەهێزەکان و گونجان.`,
    ar: `ملف نوع ${ar} في اختبار SBTI مع نقاط القوة والتوافق وملصق المشاركة.`,
  },
  socialCaption: {
    en: `I got ${safeCode} on SBTI. Not serious. Suspiciously accurate.`,
    ckb: `لە SBTI بووم بە ${safeCode}. زۆر جدی نییە، بەڵام گومانناک ڕاستە.`,
    ar: `طلع نوعي ${safeCode} في SBTI. ليس جديا، لكنه دقيق بشكل مريب.`,
  },
  posterCaption: {
    en: `My SBTI type is ${safeCode}`,
    ckb: `جۆری SBTI ـم ${safeCode} ـە`,
    ar: `نوعي في SBTI هو ${safeCode}`,
  },
})) as PersonalityType[];

const questionRows: Array<[string, Dimension, string, string, string, boolean?]> = [
  ["q1", "selfConfidence", "I can hype myself up without needing a full committee.", "دەتوانم خۆم هان بدەم بێ ئەوەی تیمێکی تەواوم پێویست بێت.", "أستطيع تشجيع نفسي دون لجنة كاملة."],
  ["q2", "selfClarity", "I usually know what is really bothering me.", "زۆرجار دەزانم بە ڕاستی چی بێزارم دەکات.", "غالبا أعرف ما الذي يزعجني فعلا."],
  ["q3", "selfAcceptance", "I can laugh at myself without turning it into self-destruction.", "دەتوانم بە خۆم پێبکەنم بێ ئەوەی بیکەم بە خۆشکاندن.", "أستطيع الضحك على نفسي دون أن يتحول الأمر لهدم الذات."],
  ["q4", "emotionalIntensity", "Small moments can hit me like a season finale.", "ساتە بچووکەکان جارێک وەک کۆتایی وەرزێک لێم دەدەن.", "اللحظات الصغيرة قد تضربني كأنها نهاية موسم."],
  ["q5", "emotionalRegulation", "Even when I am upset, I can keep my hands on the steering wheel.", "هەرچەندە توڕە بم، دەتوانم دەستم لەسەر فرمان بهێڵمەوە.", "حتى عندما أنزعج أستطيع إبقاء يدي على المقود."],
  ["q6", "recoverySpeed", "After a bad mood, I bounce back faster than people expect.", "دوای مەزاجی خراپ خێراتر لە پێشبینی خەڵک دەگەڕێمەوە.", "بعد المزاج السيئ أعود أسرع مما يتوقع الناس."],
  ["q7", "optimism", "My default setting is that things can still turn out fine.", "ڕێکخستنی بنەڕەتم ئەوەیە کە شت دەکرێت باش دەربچێت.", "إعدادي الافتراضي أن الأمور قد تنتهي بخير."],
  ["q8", "flexibility", "When the plan changes, I can remix instead of panic.", "کاتێک پلان دەگۆڕێت، دەتوانم بیگۆڕم نەک بترسم.", "عندما تتغير الخطة أستطيع التعديل لا الهلع."],
  ["q9", "riskTolerance", "A little chaos can make life more interesting.", "کەمێک ئاڵۆزی ژیان خۆشتر دەکات.", "القليل من الفوضى يجعل الحياة أمتع."],
  ["q10", "motivation", "Once I start, I usually create momentum quickly.", "کاتێک دەست پێدەکەم، زۆرجار خێرا وزە دروست دەکەم.", "عندما أبدأ أصنع الزخم بسرعة غالبا."],
  ["q11", "decisionSpeed", "I would rather choose and adjust than wait forever.", "باشترە بڕیار بدەم و ڕاستی بکەمەوە تا هەتاهەتایە چاوەڕێ بم.", "أفضل أن أختار وأعدل على أن أنتظر للأبد."],
  ["q12", "executionConsistency", "My follow-through is stronger than my excuses.", "بەردەوامیم بەهێزترە لە پاساوەکانم.", "تنفيذي أقوى من أعذاري."],
  ["q13", "socialEnergy", "Being around people usually charges me.", "بوون لەگەڵ خەڵک زۆرجار وزەم پێدەدات.", "الوجود مع الناس يشحنني غالبا."],
  ["q14", "expressiveness", "My face announces news before my mouth does.", "ڕووخسارم پێش دەمم هەواڵەکە ڕادەگەیەنێت.", "وجهي يعلن الخبر قبل فمي."],
  ["q15", "boundaries", "I can say no without writing a legal apology.", "دەتوانم نا بڵێم بێ ئەوەی داوای لێبوردنی یاسایی بنووسم.", "أستطيع قول لا دون كتابة اعتذار قانوني."],
  ["q16", "selfConfidence", "Compliments make me suspicious.", "ستایشکردن گومانی لام دروست دەکات.", "المديح يجعلني أشك.", true],
  ["q17", "selfClarity", "My own feelings sometimes need subtitles.", "هەستەکانی خۆم جارێک ژێرنوس دەوێن.", "مشاعري أحيانا تحتاج ترجمة.", true],
  ["q18", "selfAcceptance", "I replay awkward moments like a director's cut.", "ساتە نەگونجاوەکان وەک وەشانی دەرهێنەر دوبارە دەکەمەوە.", "أعيد المواقف المحرجة كنسخة المخرج.", true],
  ["q19", "emotionalIntensity", "I can turn a tiny signal into a full weather report.", "دەتوانم نیشانەیەکی بچووک بکەم بە ڕاپۆرتی تەواوی کەش.", "أحول الإشارة الصغيرة إلى نشرة طقس كاملة."],
  ["q20", "emotionalRegulation", "I send the message first and process the consequences later.", "یەکەم نامەکە دەنێرم و دواتر ئەنجامەکە شیکاری دەکەم.", "أرسل الرسالة أولا وأحلل العواقب لاحقا.", true],
  ["q21", "recoverySpeed", "One bad comment can rent space in my head for days.", "قسەیەکی خراپ دەتوانێت چەند ڕۆژ لە مێشکم کرێ بنێت.", "تعليق واحد سيئ قد يسكن رأسي لأيام.", true],
  ["q22", "optimism", "I expect the catch before I enjoy the good news.", "پێش ئەوەی هەواڵی باش چێژ بکەم، چاوەڕێی داوەکەم.", "أتوقع الفخ قبل أن أستمتع بالخبر الجيد.", true],
  ["q23", "flexibility", "If someone moves my plan, my soul refreshes with an error.", "ئەگەر کەسێک پلانەکەم بجوڵێنێت، گیانم بە هەڵە تازە دەبێتەوە.", "إذا حرك أحد خطتي ينتعش روحي برسالة خطأ.", true],
  ["q24", "riskTolerance", "Rules feel optional when they make no sense.", "یاساکان وەک هەڵبژاردە دەردەکەون کاتێک مانایان نییە.", "القواعد تبدو اختيارية عندما لا معنى لها."],
  ["q25", "motivation", "My ambition has a dramatic trailer and a sleepy release date.", "ئامانجم تریلەری درامایی هەیە و ڕێکەوتی بڵاوکردنەوەی خەواڵوو.", "طموحي له إعلان درامي وموعد إصدار نعسان.", true],
  ["q26", "decisionSpeed", "Choosing a restaurant can become a philosophical event.", "هەڵبژاردنی خواردنگە دەبێتە ڕووداوی فەلسەفی.", "اختيار مطعم قد يصبح حدثا فلسفيا.", true],
  ["q27", "executionConsistency", "I start strong, then my future self files a complaint.", "بەهێز دەست پێدەکەم، پاشان خۆی داهاتووم سکاڵا تۆمار دەکات.", "أبدأ بقوة ثم تقدم نسختي المستقبلية شكوى.", true],
  ["q28", "socialEnergy", "After social time, I need to disappear into airplane mode.", "دوای کاتی کۆمەڵایەتی، پێویستمە ون ببم وەک دۆخی فڕۆکە.", "بعد الوقت الاجتماعي أحتاج الاختفاء في وضع الطيران.", true],
  ["q29", "expressiveness", "I keep reactions inside unless absolutely necessary.", "کاردانەوەکان لە ناوەوە دەهێڵمەوە مەگەر زۆر پێویست بێت.", "أحتفظ بردودي في الداخل إلا إذا لزم الأمر.", true],
  ["q30", "boundaries", "I help people even when my own battery is blinking red.", "یارمەتی خەڵک دەدەم تەنانەت کاتێک باتریی خۆم سوور دەچنچنێت.", "أساعد الناس حتى عندما بطاريتي تومض بالأحمر.", true],
  ["q31", "selfClarity", "I notice the reason behind my reaction before I explain it.", "پێش ڕوونکردنەوەی کاردانەوەکەم هۆکارەکەی دەبینم.", "ألاحظ سبب ردة فعلي قبل أن أشرحها."],
  ["q32", "executionConsistency", "Deadlines turn me into a strangely focused machine.", "دوا وادەکان دەمکەن بە ئامێرێکی سەیر بەڵام متمرکز.", "المواعيد النهائية تحولني إلى آلة مركزة بشكل غريب."],
];

export const questions: Question[] = questionRows.map(([id, dimension, en, ckb, ar, reverse]) => ({
  id,
  dimension,
  text: { en, ckb, ar },
  reverse: Boolean(reverse),
  active: true,
}));

export const responseOptions = [
  { value: 1, en: "Strongly disagree", ckb: "بە تەواوی ناڕازیم", ar: "لا أوافق أبدا" },
  { value: 2, en: "Disagree", ckb: "ناڕازیم", ar: "لا أوافق" },
  { value: 3, en: "Slightly disagree", ckb: "کەمێک ناڕازیم", ar: "لا أوافق قليلا" },
  { value: 4, en: "Neutral", ckb: "مامناوەند", ar: "محايد" },
  { value: 5, en: "Slightly agree", ckb: "کەمێک ڕازیم", ar: "أوافق قليلا" },
  { value: 6, en: "Agree", ckb: "ڕازیم", ar: "أوافق" },
  { value: 7, en: "Strongly agree", ckb: "بە تەواوی ڕازیم", ar: "أوافق تماما" },
] as const;

export function scoreAnswers(answers: Record<string, number>): TestResult {
  const buckets = Object.fromEntries(dimensions.map((dimension) => [dimension, [] as number[]])) as Record<Dimension, number[]>;
  questions.filter((question) => question.active).forEach((question) => {
    const raw = answers[question.id] ?? 4;
    const adjusted = question.reverse ? 8 - raw : raw;
    buckets[question.dimension].push(((adjusted - 1) / 6) * 100);
  });

  const scores = Object.fromEntries(dimensions.map((dimension) => {
    const values = buckets[dimension];
    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 50;
    return [dimension, Math.round(average)];
  })) as Record<Dimension, number>;

  const ranked = personalityTypes
    .map((type) => ({
      type,
      distance: dimensions.reduce((sum, dimension) => sum + Math.abs(scores[dimension] - type.dimensionProfile[dimension]), 0),
    }))
    .sort((a, b) => a.distance - b.distance || a.type.slug.localeCompare(b.type.slug));

  const topTraits = [...dimensions].sort((a, b) => scores[b] - scores[a]).slice(0, 3);
  return { type: ranked[0].type, scores, distance: ranked[0].distance, topTraits };
}

export function answersForType(type: PersonalityType): Record<string, number> {
  return Object.fromEntries(questions.map((question) => {
    const target = type.dimensionProfile[question.dimension];
    const raw = Math.round((target / 100) * 6 + 1);
    return [question.id, question.reverse ? 8 - raw : raw];
  }));
}

export const siteCopy = {
  en: {
    meta: { title: "MischiefType SBTI Test", description: "A fast, funny, multilingual SBTI personality test with 27 original types and shareable result posters." },
    nav: ["Test", "Types", "Compare", "About"],
    slogan: "Not serious. Suspiciously accurate.",
    heroTitle: "Find the personality type your group chat already knows.",
    heroBody: "MischiefType is a premium entertainment-first SBTI quiz with 27 meme-fluent characters, 15 measured dimensions, and posters built for sharing.",
    start: "Start test",
    explore: "Explore 27 types",
    note: "Free, 4-6 minutes, no signup required.",
    disclaimer: "For entertainment and self-reflection only. It is not a psychological or medical diagnosis.",
    search: "Search types",
    allGroups: "All groups",
    poster: "Download poster",
    share: "Share result",
    retake: "Retake",
    previous: "Previous",
    next: "Next",
    result: "Your result",
    resume: "Resume unfinished test",
  },
  ckb: {
    meta: { title: "تاقیکردنەوەی MischiefType SBTI", description: "تاقیکردنەوەیەکی خێرا و خۆش بۆ SBTI بە ٢٧ جۆر و پۆستەری هاوبەشکردن." },
    nav: ["تاقیکردنەوە", "جۆرەکان", "بەراورد", "دەربارە"],
    slogan: "جدی نییە. بە گومانەوە ڕاستە.",
    heroTitle: "ئەو جۆرە بدۆزەرەوە کە گروپی چاتەکەت پێشتر دەیزانی.",
    heroBody: "MischiefType تاقیکردنەوەیەکی SBTI ـی خۆشە بە ٢٧ کارەکتەری خاوەن میم، ١٥ ڕەهەند و پۆستەری ئامادە بۆ هاوبەشکردن.",
    start: "دەست پێ بکە",
    explore: "٢٧ جۆر ببینە",
    note: "بێبەرامبەر، ٤-٦ خولەک، بێ خۆتۆمارکردن.",
    disclaimer: "تەنها بۆ خۆشی و بیرکردنەوەی خۆیە. دەستنیشانکردنی دەروونی یان پزیشکی نییە.",
    search: "گەڕان بۆ جۆر",
    allGroups: "هەموو گرووپەکان",
    poster: "داگرتنی پۆستەر",
    share: "هاوبەشکردنی ئەنجام",
    retake: "دووبارە",
    previous: "پێشوو",
    next: "دواتر",
    result: "ئەنجامەکەت",
    resume: "بەردەوامبوون لە تاقیکردنەوە",
  },
  ar: {
    meta: { title: "اختبار MischiefType SBTI", description: "اختبار SBTI سريع وممتع متعدد اللغات مع ٢٧ نوعا وملصقات قابلة للمشاركة." },
    nav: ["الاختبار", "الأنواع", "قارن", "حول"],
    slogan: "ليس جديا. دقيق بشكل مريب.",
    heroTitle: "اكتشف النوع الذي يعرفه أصدقاؤك عنك مسبقا.",
    heroBody: "MischiefType اختبار SBTI ترفيهي مصقول مع ٢٧ شخصية، و١٥ بعدا، وملصقات جاهزة للمشاركة.",
    start: "ابدأ الاختبار",
    explore: "استكشف ٢٧ نوعا",
    note: "مجاني، ٤-٦ دقائق، بلا تسجيل.",
    disclaimer: "للترفيه والتأمل الذاتي فقط. ليس تشخيصا نفسيا أو طبيا.",
    search: "ابحث عن نوع",
    allGroups: "كل المجموعات",
    poster: "تنزيل الملصق",
    share: "شارك النتيجة",
    retake: "أعد الاختبار",
    previous: "السابق",
    next: "التالي",
    result: "نتيجتك",
    resume: "تابع الاختبار غير المكتمل",
  },
} as const;
