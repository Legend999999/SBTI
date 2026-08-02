export type CharacterRecord = {
  code: string;
  slug: string;
  imageFull: string;
  imageCard: string;
  imagePoster: string;
  imageThumbnail: string;
  width: number;
  height: number;
  focalPoint: { x: number; y: number };
  backgroundColor: string;
  alt: {
    en: string;
    ckb: string;
    ar: string;
  };
};

const size = { width: 960, height: 960 };

const characterSeed = [
  ["CTRL", "ctrl", "#eef7ef", "The CTRL controller character holding both hands up in a controlling pose.", "کارەکتەری CTRL بە پۆزی کۆنتڕۆڵکردن.", "شخصية CTRL بوضعية التحكم باليدين."],
  ["ATM-er", "atm-er", "#effaf1", "The ATM-er character holding out green money.", "کارەکتەری ATM-er پارە دەدات.", "شخصية ATM-er تقدم المال الأخضر."],
  ["Dior-s", "dior-s", "#111111", "The Dior-s reclining cynical character on a dark panel.", "کارەکتەری Dior-s پاڵکەوتوو لەسەر پاشبنەمای تاریک.", "شخصية Dior-s مستلقية على خلفية داكنة."],
  ["BOSS", "boss", "#fff7d8", "The BOSS leader character wearing a yellow crown.", "کارەکتەری BOSS بە تاجی زەرد.", "شخصية BOSS ترتدي تاجا أصفر."],
  ["THAN-K", "than-k", "#f2faf2", "The THAN-K grateful character with hands together.", "کارەکتەری THAN-K دەستەکانی پێکەوە.", "شخصية THAN-K تضع يديها معا بامتنان."],
  ["OH-NO", "oh-no", "#fff0e8", "The OH-NO worried character with a distressed expression.", "کارەکتەری OH-NO بە دەم و چاوی نیگەرانی.", "شخصية OH-NO بتعبير قلق ومتوتر."],
  ["GOGO", "gogo", "#fff4e9", "The GOGO nude-colored running character.", "کارەکتەری GOGO بە ڕاکردن.", "شخصية GOGO تركض بلون جسد فاتح."],
  ["SEXY", "sexy", "#fff6dc", "The SEXY slim confident posing character.", "کارەکتەری SEXY باریک و باوەڕبەخۆ.", "شخصية SEXY نحيفة وواثقة."],
  ["LOVE-R", "love-r", "#fff0f3", "The LOVE-R red romantic character with heart symbolism.", "کارەکتەری LOVE-R سوور بە هێمای دڵ.", "شخصية LOVE-R حمراء مع رموز الحب."],
  ["MUM", "mum", "#eefaf0", "The MUM nurturing character dressed in green.", "کارەکتەری MUM بە جل و بەرگی سەوز.", "شخصية MUM الحنونة بملابس خضراء."],
  ["FAKE", "fake", "#eff9ed", "The FAKE green shapeshifter with a long artificial-looking face.", "کارەکتەری FAKE سەوز بە ڕووخساری درێژ.", "شخصية FAKE الخضراء بوجه طويل مصطنع."],
  ["OJBK", "ojbk", "#fff3eb", "The OJBK pale character shrugging carelessly.", "کارەکتەری OJBK کاڵ کە بە بێخەمی شان دەجوڵێنێت.", "شخصية OJBK الشاحبة تهز كتفيها بلا مبالاة."],
  ["MALO", "malo", "#fff5df", "The MALO monkey character jumping with restless energy.", "کارەکتەری MALO مەیموونە و وزەی بازدانی هەیە.", "شخصية MALO القرد بطاقة قلقة."],
  ["JOKE-R", "joke-r", "#fff5f5", "The JOKE-R clown character with a red nose and exaggerated expression.", "کارەکتەری JOKE-R شەڕەبەز بە لووتی سوور.", "شخصية JOKE-R المهرج بأنف أحمر وتعبير مبالغ."],
  ["WOC!", "woc", "#eefaff", "The WOC! shocked character with a wide open mouth.", "کارەکتەری WOC! بە دەمێکی کراوەی سەرسامی.", "شخصية WOC! مصدومة بفم مفتوح جدا."],
  ["THIN-K", "thin-k", "#f3f2ff", "The THIN-K large-headed thinking character with a hand near the face.", "کارەکتەری THIN-K سەرگەورە و دەست نزیک ڕووخسار.", "شخصية THIN-K كبيرة الرأس ويدها قرب الوجه."],
  ["SHIT", "shit", "#f1f4f1", "The SHIT cynical character in formal clothing.", "کارەکتەری SHIT گومانکار بە جل و بەرگی فەرمی.", "شخصية SHIT ساخرة بملابس رسمية."],
  ["ZZZZ", "zzzz", "#edf8e9", "The ZZZZ sleeping character partly inside a green rectangular form.", "کارەکتەری ZZZZ خەواڵوو لە ناو چوارگۆشەی سەوز.", "شخصية ZZZZ نائمة جزئيا داخل شكل أخضر."],
  ["POOR", "poor", "#f2faf0", "The POOR exhausted working character in green.", "کارەکتەری POOR ماندوو و سەرقاڵ بە کار.", "شخصية POOR منهكة وتعمل."],
  ["MONK", "monk", "#fff4dc", "The MONK seated character in orange clothing.", "کارەکتەری MONK دانیشتوو بە جل و بەرگی پرتەقاڵی.", "شخصية MONK جالسة بملابس برتقالية."],
  ["IMSB", "imsb", "#f7f2e9", "The IMSB self-doubting character with hands near the head.", "کارەکتەری IMSB دەستەکانی نزیک سەر.", "شخصية IMSB تشك بنفسها ويداها قرب الرأس."],
  ["SOLO", "solo", "#f0f2f4", "The SOLO isolated character dressed in black.", "کارەکتەری SOLO تەنها بە جل و بەرگی ڕەش.", "شخصية SOLO منفردة بملابس سوداء."],
  ["FUCK", "fuck", "#eff6e7", "The FUCK angry geometric head with grass growing from the top.", "کارەکتەری FUCK تووڕە بە گیا لە سەری.", "شخصية FUCK رأس هندسي غاضب ينبت منه العشب."],
  ["DEAD", "dead", "#e9edf0", "The DEAD character lying inside a black coffin.", "کارەکتەری DEAD پاڵکەوتوو لە تابووتی ڕەش.", "شخصية DEAD مستلقية داخل تابوت أسود."],
  ["IMFW", "imfw", "#eef9ed", "The IMFW weak fragile character in green clothing.", "کارەکتەری IMFW لاواز بە جل و بەرگی سەوز.", "شخصية IMFW ضعيفة بملابس خضراء."],
  ["HHHH", "hhhh", "#fff2e9", "The HHHH square-headed character laughing loudly.", "کارەکتەری HHHH سەرچوارگۆشە و پێکەنینی بەرز.", "شخصية HHHH مربعة الرأس تضحك بصوت عال."],
  ["DRUNK", "drunk", "#fff5e8", "The DRUNK stumbling character carrying a bottle.", "کارەکتەری DRUNK لە لەرزاندن و بوتڵ بەدەست.", "شخصية DRUNK تتعثر وتحمل زجاجة."],
] as const;

export const characterRegistry: CharacterRecord[] = characterSeed.map(([code, slug, backgroundColor, en, ckb, ar]) => ({
  code,
  slug,
  imageFull: `/characters/${code}/full.webp`,
  imageCard: `/characters/${code}/card.webp`,
  imagePoster: `/characters/${code}/poster.webp`,
  imageThumbnail: `/characters/${code}/thumbnail.webp`,
  width: size.width,
  height: size.height,
  focalPoint: { x: 0.5, y: 0.48 },
  backgroundColor,
  alt: { en, ckb, ar },
}));

export const characterRegistryByCode = Object.fromEntries(
  characterRegistry.map((character) => [character.code, character]),
) as Record<string, CharacterRecord>;
