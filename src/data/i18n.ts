import type { Dir, Element, TrigramKey, YouNianKey } from "./bagua";

export type Lang = "en" | "zh";
export type L = { en: string; zh: string };
export const l = (en: string, zh: string): L => ({ en, zh });

export const DIR_L: Record<Dir, L> = {
  N: l("North", "北"), NE: l("Northeast", "东北"), E: l("East", "东"), SE: l("Southeast", "东南"),
  S: l("South", "南"), SW: l("Southwest", "西南"), W: l("West", "西"), NW: l("Northwest", "西北"), C: l("Center", "中宫"),
};
export const DIR_SHORT: Record<Dir, L> = {
  N: l("N", "北"), NE: l("NE", "东北"), E: l("E", "东"), SE: l("SE", "东南"),
  S: l("S", "南"), SW: l("SW", "西南"), W: l("W", "西"), NW: l("NW", "西北"), C: l("C", "中"),
};

export const ELEMENT_L: Record<Element, L> = {
  金: l("Metal", "金"), 木: l("Wood", "木"), 水: l("Water", "水"), 火: l("Fire", "火"), 土: l("Earth", "土"),
};
export const ELEMENT_COLORS_L: Record<Element, L> = {
  金: l("white, gold, silver", "白、金、银色"), 木: l("green, teal", "绿、青色"), 水: l("navy, black, deep blue", "黑、深蓝"),
  火: l("red, purple, warm orange", "红、紫、暖橙"), 土: l("sand, terracotta, ochre", "米、陶土、赭黄"),
};

export interface TrigramL {
  name: L; image: L; area: L; family: L; quote: L;
}
export const TRIGRAM_L: Record<TrigramKey, TrigramL> = {
  qian: { name: l("Qian", "乾"), image: l("Heaven", "天"), area: l("Helpful People & Travel", "贵人与出行"), family: l("the father", "父亲"),
    quote: l("“Qian is heaven, the father — strong and untiring.” (Shuo Gua)", "《说卦》：“乾为天，为父……健也。”") },
  dui: { name: l("Dui", "兑"), image: l("Lake", "泽"), area: l("Children & Creativity", "子女与创意"), family: l("the youngest daughter", "少女"),
    quote: l("“Dui is the lake — joy and open expression.” (Shuo Gua)", "《说卦》：“兑为泽……说也。”") },
  li: { name: l("Li", "离"), image: l("Fire", "火"), area: l("Fame & Reputation", "名声与声望"), family: l("the middle daughter", "中女"),
    quote: l("“Li is fire, brightness — where all things see one another.” (Shuo Gua)", "《说卦》：“离也者，明也，万物皆相见。”") },
  zhen: { name: l("Zhen", "震"), image: l("Thunder", "雷"), area: l("Family & Health", "家庭与健康"), family: l("the eldest son", "长男"),
    quote: l("“Zhen is thunder — the arousing, where new life begins.” (Shuo Gua)", "《说卦》：“帝出乎震……震，动也。”") },
  xun: { name: l("Xun", "巽"), image: l("Wind", "风"), area: l("Wealth & Abundance", "财富与丰盛"), family: l("the eldest daughter", "长女"),
    quote: l("“Xun is the wind — gentle, penetrating, bringing increase.” (Shuo Gua)", "《说卦》：“巽为风……为近利市三倍。”") },
  kan: { name: l("Kan", "坎"), image: l("Water", "水"), area: l("Career & Life Path", "事业与人生道路"), family: l("the middle son", "中男"),
    quote: l("“Kan is water — flowing on, never losing its course.” (Shuo Gua)", "《说卦》：“坎为水……劳卦也，万物之所归也。”") },
  gen: { name: l("Gen", "艮"), image: l("Mountain", "山"), area: l("Knowledge & Self-Growth", "学识与自我成长"), family: l("the youngest son", "少男"),
    quote: l("“Gen is the mountain — stillness, where things come to completion.” (Shuo Gua)", "《说卦》：“艮为山……成言乎艮。”") },
  kun: { name: l("Kun", "坤"), image: l("Earth", "地"), area: l("Love & Relationships", "感情与婚姻"), family: l("the mother", "母亲"),
    quote: l("“Kun is the earth, the mother — receptive, nurturing all.” (Shuo Gua)", "《说卦》：“坤为地，为母……致役乎坤。”") },
};
export const CENTER_AREA = l("Health & Wellbeing", "健康与身心安和");

export const YOUNIAN_L: Record<YouNianKey, { name: L; good: L }> = {
  shengqi: { name: l("Sheng Chi", "生气"), good: l("Prosperity & Success", "兴旺与成功") },
  tianyi: { name: l("Tian Yi", "天医"), good: l("Health & Healing", "健康与贵人") },
  yannian: { name: l("Yan Nian", "延年"), good: l("Love & Longevity", "和睦与长久") },
  fuwei: { name: l("Fu Wei", "伏位"), good: l("Calm & Personal Growth", "安定与成长") },
  huohai: { name: l("Balancing Zone", "待调和方位"), good: l("Balancing Zone", "待调和方位") },
  liusha: { name: l("Balancing Zone", "待调和方位"), good: l("Balancing Zone", "待调和方位") },
  wugui: { name: l("Balancing Zone", "待调和方位"), good: l("Balancing Zone", "待调和方位") },
  jueming: { name: l("Balancing Zone", "待调和方位"), good: l("Balancing Zone", "待调和方位") },
};

export const STAR_L: Record<number, { name: L; note: L }> = {
  1: { name: l("1 White · Connection", "一白 · 人缘"), note: l("supports connection and new opportunities", "主人缘与新机会") },
  2: { name: l("2 Black · Needs care", "二黑 · 需呵护"), note: l("an area to keep calm and gently balanced this year", "今年宜安静、温和调和") },
  3: { name: l("3 Jade · Lively", "三碧 · 活跃"), note: l("lively energy; soft warm light keeps conversations kind", "气场活跃，暖光可让交流更融洽") },
  4: { name: l("4 Green · Study", "四绿 · 文昌"), note: l("supports study, writing and focus", "主学业、文思与专注") },
  5: { name: l("5 Yellow · Rest", "五黄 · 宜静"), note: l("best kept quiet — avoid renovation here this year", "今年宜静，避免在此装修动土") },
  6: { name: l("6 White · Mentors", "六白 · 贵人"), note: l("supports mentors and steady authority", "主贵人与稳重") },
  7: { name: l("7 Red · Protect", "七赤 · 守护"), note: l("a spot to keep secure and tidy", "宜整洁稳固") },
  8: { name: l("8 White · Wealth", "八白 · 财星"), note: l("supports steady wealth and property", "主正财与置业") },
  9: { name: l("9 Purple · Celebration", "九紫 · 喜庆"), note: l("the strongest star of this era — joy, recognition, celebration", "当运旺星，主喜庆、名声") },
};

/** 六十四卦英文名（卫礼贤译名）与正向关键词，按卦序 */
export const HEX_EN: [string, string, string][] = [
  ["The Creative", "Strength", "刚健"], ["The Receptive", "Nurturing", "厚德"], ["Difficulty at the Beginning", "New Growth", "萌发"],
  ["Youthful Folly", "Learning", "启蒙"], ["Waiting", "Patience", "从容"], ["Conflict", "Clarity", "明辨"], ["The Army", "Order", "有序"],
  ["Holding Together", "Unity", "亲和"], ["Small Taming", "Gathering", "积蓄"], ["Treading", "Grace", "守礼"], ["Peace", "Harmony", "通泰"],
  ["Standstill", "Renewal", "待新"], ["Fellowship", "Togetherness", "同心"], ["Great Possession", "Abundance", "大有"], ["Modesty", "Humility", "谦和"],
  ["Enthusiasm", "Joy", "欢悦"], ["Following", "Flow", "随和"], ["Work on the Decayed", "Restoration", "焕新"], ["Approach", "Arrival", "临福"],
  ["Contemplation", "Insight", "观照"], ["Biting Through", "Breakthrough", "化阻"], ["Grace", "Beauty", "文采"], ["Splitting Apart", "Letting Go", "去旧"],
  ["Return", "Fresh Start", "复始"], ["Innocence", "Sincerity", "真诚"], ["Great Taming", "Reserves", "大畜"], ["Nourishment", "Nourishment", "颐养"],
  ["Great Exceeding", "Courage", "担当"], ["The Abysmal", "Depth", "深稳"], ["The Clinging", "Radiance", "光明"], ["Influence", "Attraction", "感应"],
  ["Duration", "Constancy", "恒久"], ["Retreat", "Rest", "养息"], ["Great Power", "Vitality", "壮盛"], ["Progress", "Rising", "晋升"],
  ["Darkening of the Light", "Inner Light", "内明"], ["The Family", "Family", "家和"], ["Opposition", "Balance", "求同"], ["Obstruction", "Reflection", "反省"],
  ["Deliverance", "Release", "舒解"], ["Decrease", "Simplicity", "简约"], ["Increase", "Increase", "增益"], ["Breakthrough", "Resolve", "决断"],
  ["Coming to Meet", "Encounter", "相遇"], ["Gathering Together", "Gathering", "聚合"], ["Pushing Upward", "Ascent", "上升"], ["Oppression", "Resilience", "坚韧"],
  ["The Well", "Sustenance", "井养"], ["Revolution", "Transformation", "革新"], ["The Cauldron", "Renewal", "鼎新"], ["The Arousing", "Awakening", "振奋"],
  ["Keeping Still", "Stillness", "安止"], ["Development", "Steady Growth", "渐进"], ["The Marrying Maiden", "Devotion", "归宿"], ["Abundance", "Fullness", "丰盛"],
  ["The Wanderer", "Journey", "行旅"], ["The Gentle", "Gentle Flow", "顺入"], ["The Joyous", "Delight", "喜悦"], ["Dispersion", "Openness", "舒展"],
  ["Limitation", "Balance", "有节"], ["Inner Truth", "Trust", "诚信"], ["Small Exceeding", "Care", "细致"], ["After Completion", "Fulfillment", "既成"],
  ["Before Completion", "Possibility", "未竟可期"],
];

export const UI = {
  brandTag: l("Classical Feng Shui for Modern Homes", "传统罗盘风水 · 守护现代家居"),
  concept: l("Every home has its guardians — your lares and penates.", "每个家，都有它的守护者。"),
  heroSub: l(
    "A free, personalized home reading rooted in the I Ching. Answer a few simple questions, add photos if you like, and discover where your home’s guardians belong.",
    "一份源自《易经》的免费个性化家居解读。回答几个简单问题，可附上照片，找到你家的守护者应在何处。"),
  start: l("Find Your Home’s Guardians — Free Reading", "找到你家的守护者 · 免费解读"),
  heroPoints: [
    l("Classical compass feng shui — based on your home’s real directions", "传统罗盘风水 —— 依据你家真实方位"),
    l("Personal Kua number from your birth year", "按出生年份推算个人命卦"),
    l("Gentle, simple adjustments — no renovation needed", "温和简单的摆设调整 —— 无需装修"),
  ],
  demo: l("Demo version · products and prices are placeholders", "演示版 · 商品与价格为示意"),
  steps: [l("Your Home", "房屋"), l("Household", "家人"), l("Rooms & Photos", "房间与照片"), l("Room Check", "房间问答")],
  next: l("Continue", "下一步"), back: l("Back", "上一步"), seeReading: l("See My Reading", "查看我的解读"),
  required: l("Please answer the highlighted questions.", "请完成标出的必答题。"),
  restart: l("Start a new reading", "重新开始"),
  disclaimer: l(
    "Feng shui is a traditional Chinese cultural practice. This reading is offered for cultural and entertainment purposes and is not professional, medical, financial or legal advice. Products are described by their traditional symbolism only.",
    "风水是中国传统文化的一部分。本解读仅供文化参考与娱乐，不构成任何专业、医疗、财务或法律建议。商品仅介绍其传统寓意。"),
};
