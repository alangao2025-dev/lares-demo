export type Dir = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" | "C";
export type Element = "金" | "木" | "水" | "火" | "土";
export type TrigramKey = "qian" | "dui" | "li" | "zhen" | "xun" | "kan" | "gen" | "kun";

export const DIRS8: Exclude<Dir, "C">[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const DIR_NAME: Record<Dir, string> = {
  N: "北", NE: "东北", E: "东", SE: "东南", S: "南", SW: "西南", W: "西", NW: "西北", C: "中宫",
};
export const OPPOSITE: Record<Exclude<Dir, "C">, Exclude<Dir, "C">> = {
  N: "S", S: "N", E: "W", W: "E", NE: "SW", SW: "NE", SE: "NW", NW: "SE",
};

export interface Trigram {
  key: TrigramKey;
  name: string;
  symbol: string;
  /** 自下而上，1 为阳爻 */
  lines: [number, number, number];
  dir: Exclude<Dir, "C">;
  luoshu: number;
  xiantian: number;
  element: Element;
  nature: string;
  family: string;
  body: string;
  virtue: string;
  home: string;
}

export const TRIGRAMS: Record<TrigramKey, Trigram> = {
  qian: { key: "qian", name: "乾", symbol: "☰", lines: [1, 1, 1], dir: "NW", luoshu: 6, xiantian: 1, element: "金", nature: "天", family: "父（男主人）", body: "首", virtue: "健",
    home: "西北乾位为“天门”，主家主、男主人、事业与贵人。宜整洁稳重、可置金属器物；忌厨房（火烧天门，火克金）与卫生间，忌长期杂乱。" },
  dui: { key: "dui", name: "兑", symbol: "☱", lines: [1, 1, 0], dir: "W", luoshu: 7, xiantian: 2, element: "金", nature: "泽", family: "少女", body: "口", virtue: "说（悦）",
    home: "西方兑位主少女、子女、口才与喜悦社交。宜白、金、银色与圆形器物，可作儿童房或休闲区；忌大红大火（火克金）。" },
  li: { key: "li", name: "离", symbol: "☲", lines: [1, 0, 1], dir: "S", luoshu: 9, xiantian: 3, element: "火", nature: "火", family: "中女", body: "目（心）", virtue: "丽（附丽、光明）",
    home: "南方离位主名声、文明、眼睛与心血管。宜明亮通透、灯光充足，可用红紫暖色与木质（木生火）；忌鱼缸等大水（水火相冲）。" },
  zhen: { key: "zhen", name: "震", symbol: "☳", lines: [1, 0, 0], dir: "E", luoshu: 3, xiantian: 4, element: "木", nature: "雷", family: "长男", body: "足（肝）", virtue: "动",
    home: "东方震位主长子、健康活力与新的开始。宜绿植、木器，可配少量蓝黑与水（水生木）；忌大面积金属（金克木）。" },
  xun: { key: "xun", name: "巽", symbol: "☴", lines: [0, 1, 1], dir: "SE", luoshu: 4, xiantian: 5, element: "木", nature: "风", family: "长女", body: "股（胆）", virtue: "入",
    home: "东南巽位主长女、文昌与财气流通（巽为风、为入、为近利市三倍）。宜书桌、绿植、水养植物；忌杂物堆积与尖锐金属。" },
  kan: { key: "kan", name: "坎", symbol: "☵", lines: [0, 1, 0], dir: "N", luoshu: 1, xiantian: 6, element: "水", nature: "水", family: "中男", body: "耳（肾）", virtue: "陷（险）",
    home: "北方坎位主中男、事业、智慧与肾。宜蓝黑色、金属（金生水），可设水景；忌大量土黄色（土克水）。" },
  gen: { key: "gen", name: "艮", symbol: "☶", lines: [0, 0, 1], dir: "NE", luoshu: 8, xiantian: 7, element: "土", nature: "山", family: "少男", body: "手（脾胃）", virtue: "止",
    home: "东北艮位主少男、学业积累与储蓄（艮为止，主收藏）。宜黄、棕、米色与陶瓷、石材，可作储藏或学习区；忌大面积绿植（木克土）。" },
  kun: { key: "kun", name: "坤", symbol: "☷", lines: [0, 0, 0], dir: "SW", luoshu: 2, xiantian: 8, element: "土", nature: "地", family: "母（女主人）", body: "腹", virtue: "顺",
    home: "西南坤位主女主人、婚姻与家庭和睦。宜厚实、温暖的土色与暖光（火生土），可放成对摆件；忌杂乱和大型尖锐物。" },
};

export const TRIGRAM_LIST = Object.values(TRIGRAMS);
export const TRIGRAM_BY_DIR = Object.fromEntries(TRIGRAM_LIST.map((t) => [t.dir, t])) as Record<Exclude<Dir, "C">, Trigram>;
export const TRIGRAM_BY_LUOSHU = Object.fromEntries(TRIGRAM_LIST.map((t) => [t.luoshu, t])) as Record<number, Trigram>;
export const TRIGRAM_BY_XIANTIAN = Object.fromEntries(TRIGRAM_LIST.map((t) => [t.xiantian, t])) as Record<number, Trigram>;

export function trigramFromLines(l: number[]): Trigram {
  return TRIGRAM_LIST.find((t) => t.lines[0] === l[0] && t.lines[1] === l[1] && t.lines[2] === l[2])!;
}

export const EAST_GROUP: TrigramKey[] = ["kan", "li", "zhen", "xun"];

/* ---------------- 五行 ---------------- */

export const ELEMENT_INFO: Record<Element, { color: string; colors: string; material: string; shape: string; css: string }> = {
  金: { color: "白", colors: "白、金、银、香槟色", material: "金属、铜器、白色陶瓷", shape: "圆形、拱形", css: "#c9b37e" },
  木: { color: "绿", colors: "绿、青、翠色", material: "木材、绿植、竹、藤", shape: "长条形、竖直线条", css: "#5b8c5a" },
  水: { color: "黑", colors: "黑、深蓝、灰蓝", material: "玻璃、镜面、水景", shape: "波浪形、不规则曲线", css: "#3c5a78" },
  火: { color: "红", colors: "红、紫、橙、粉", material: "灯光、蜡烛、皮革", shape: "三角形、尖形", css: "#b8473a" },
  土: { color: "黄", colors: "黄、棕、米、咖啡色", material: "陶瓷、石材、砖、水晶", shape: "方形、扁平", css: "#a88449" },
};
export const SHENG: Record<Element, Element> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
export const KE: Record<Element, Element> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };
export const shengWo = (e: Element) => (Object.keys(SHENG) as Element[]).find((k) => SHENG[k] === e)!;
export const keWo = (e: Element) => (Object.keys(KE) as Element[]).find((k) => KE[k] === e)!;

/** 体用生克（梅花易数） */
export function tiYong(ti: Element, yong: Element): { label: string; luck: "吉" | "小吉" | "平" | "小凶" | "凶"; text: string } {
  if (ti === yong) return { label: "体用比和", luck: "吉", text: "体用同气，事情顺遂，内外协调。" };
  if (SHENG[yong] === ti) return { label: "用生体", luck: "吉", text: "外力生扶自身，有进益、得助之象。" };
  if (KE[ti] === yong) return { label: "体克用", luck: "小吉", text: "自身能掌控局面，需主动出力，终可成事。" };
  if (SHENG[ti] === yong) return { label: "体生用", luck: "小凶", text: "自身向外泄耗，有破费、劳累之象，宜节制。" };
  return { label: "用克体", luck: "凶", text: "外部压力克制自身，宜守不宜进，谨慎行事。" };
}

/* ---------------- 八宅大游年 ---------------- */

export type YouNianKey = "shengqi" | "tianyi" | "yannian" | "fuwei" | "huohai" | "liusha" | "wugui" | "jueming";

export interface YouNian {
  key: YouNianKey;
  name: string;
  star: string;
  element: Element;
  luck: "大吉" | "次吉" | "中吉" | "小吉" | "小凶" | "次凶" | "大凶";
  good: boolean;
  rank: number;
  meaning: string;
  suit: string;
}

/** 两卦爻位异或掩码（下=1、中=2、上=4）→ 游年星。依“大游年歌”变爻次序推得。 */
export const YOUNIAN_BY_MASK: Record<number, YouNianKey> = {
  0: "fuwei", 4: "shengqi", 6: "wugui", 7: "yannian", 5: "liusha", 1: "huohai", 3: "tianyi", 2: "jueming",
};

export const YOUNIAN: Record<YouNianKey, YouNian> = {
  shengqi: { key: "shengqi", name: "生气", star: "贪狼", element: "木", luck: "大吉", good: true, rank: 1,
    meaning: "生机勃发，主事业进取、财运、人丁兴旺。", suit: "大门、主卧、客厅、办公位" },
  tianyi: { key: "tianyi", name: "天医", star: "巨门", element: "土", luck: "次吉", good: true, rank: 2,
    meaning: "主健康、贵人扶持、疾病康复。", suit: "卧室（尤宜体弱者、老人）、餐厅、灶口朝向" },
  yannian: { key: "yannian", name: "延年", star: "武曲", element: "金", luck: "中吉", good: true, rank: 3,
    meaning: "主婚姻和合、人际和睦、长寿。", suit: "夫妻主卧、客厅、会客区" },
  fuwei: { key: "fuwei", name: "伏位", star: "辅弼", element: "木", luck: "小吉", good: true, rank: 4,
    meaning: "主平稳安定、静心守成。", suit: "书房、卧室、静修处" },
  huohai: { key: "huohai", name: "祸害", star: "禄存", element: "土", luck: "小凶", good: false, rank: 5,
    meaning: "主口舌是非、小病小灾。", suit: "卫生间、储物间、厨房（压凶）" },
  liusha: { key: "liusha", name: "六煞", star: "文曲", element: "水", luck: "次凶", good: false, rank: 6,
    meaning: "主烂桃花、是非、破财。", suit: "卫生间、厨房、储藏室" },
  wugui: { key: "wugui", name: "五鬼", star: "廉贞", element: "火", luck: "大凶", good: false, rank: 7,
    meaning: "主火灾、盗贼、意外、小人。", suit: "卫生间、储物间、厨房（以凶制凶）" },
  jueming: { key: "jueming", name: "绝命", star: "破军", element: "金", luck: "大凶", good: false, rank: 8,
    meaning: "主重病、破财、诸事不顺。", suit: "卫生间、储藏室、厨房（灶压绝命）" },
};

export function youNian(a: Trigram, b: Trigram): YouNian {
  const mask = (a.lines[0] ^ b.lines[0]) * 1 + (a.lines[1] ^ b.lines[1]) * 2 + (a.lines[2] ^ b.lines[2]) * 4;
  return YOUNIAN[YOUNIAN_BY_MASK[mask]];
}

/* ---------------- 玄空九星 ---------------- */

export interface FlyStar {
  n: number;
  name: string;
  element: Element;
  luck: "大吉" | "吉" | "平" | "凶" | "大凶";
  meaning: string;
  remedy: string;
}

/** 以下九运（2024–2043）旺衰为准 */
export const FLY_STARS: Record<number, FlyStar> = {
  1: { n: 1, name: "一白贪狼", element: "水", luck: "吉", meaning: "九运生气星，主人缘、桃花、事业升迁。", remedy: "可放水养绿植或金属摆件（金生水）催旺。" },
  2: { n: 2, name: "二黑巨门", element: "土", luck: "凶", meaning: "病符星，主疾病、身体不适。", remedy: "放铜葫芦、铜钱、金属摆件泄土；忌红色与火（火生土），不宜体弱者长居。" },
  3: { n: 3, name: "三碧禄存", element: "木", luck: "凶", meaning: "是非星，主口舌争执、官非。", remedy: "用红色/暖光（木生火以泄木），保持安静，少放绿植。" },
  4: { n: 4, name: "四绿文曲", element: "木", luck: "吉", meaning: "文昌星，主学业、考试、文思。", remedy: "宜设书桌，放四支富贵竹或水养绿植催旺。" },
  5: { n: 5, name: "五黄廉贞", element: "土", luck: "大凶", meaning: "五黄煞，主灾病、意外、损耗，最忌动土。", remedy: "当年此方忌装修动土、忌红色与火；可放铜铃/六帝钱/金属摆件泄土，保持安静。" },
  6: { n: 6, name: "六白武曲", element: "金", luck: "平", meaning: "主权贵、偏财、贵人（九运退气，吉力减弱）。", remedy: "可放土色摆件（土生金）以扶。" },
  7: { n: 7, name: "七赤破军", element: "金", luck: "凶", meaning: "主破财、盗贼、口舌、刀伤。", remedy: "用蓝黑色或水养植物（金生水以泄金），门窗加固。" },
  8: { n: 8, name: "八白左辅", element: "土", luck: "吉", meaning: "主正财、置业（九运退气，仍属次吉）。", remedy: "可放暖光、红色（火生土）扶旺。" },
  9: { n: 9, name: "九紫右弼", element: "火", luck: "大吉", meaning: "九运当令旺星，主喜庆、名声、姻缘、兴旺。", remedy: "宜明亮、红紫色、灯光常开，可作客厅或主要活动区。" },
};

/** 洛书顺飞路径 */
export const FLY_PATH: Dir[] = ["C", "NW", "W", "NE", "S", "N", "SW", "E", "SE"];

/* ---------------- 六十四卦 ---------------- */

export interface Hexagram {
  no: number;
  name: string;
  upper: TrigramKey;
  lower: TrigramKey;
  judgment: string;
  home: string;
}

const H = (no: number, name: string, upper: TrigramKey, lower: TrigramKey, judgment: string, home: string): Hexagram =>
  ({ no, name, upper, lower, judgment, home });

export const HEXAGRAMS: Hexagram[] = [
  H(1, "乾为天", "qian", "qian", "元亨利贞。", "刚健向上，家运兴旺；宜主动作为，家主当以身作则，忌刚愎过亢。"),
  H(2, "坤为地", "kun", "kun", "元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。", "厚德载物，宜守成持家、以柔顺包容；重视西南坤位与女主人的作用。"),
  H(3, "水雷屯", "kan", "zhen", "元亨利贞。勿用有攸往，利建侯。", "初创艰难，新居或新装修宜循序渐进，先打好基础，不宜冒进。"),
  H(4, "山水蒙", "gen", "kan", "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。", "启蒙之象，利子女教育；宜整理学习空间，向明白人请教后再行动。"),
  H(5, "水天需", "kan", "qian", "有孚，光亨，贞吉。利涉大川。", "等待时机之象，搬迁装修宜耐心择时，饮食起居规律则吉。"),
  H(6, "天水讼", "qian", "kan", "有孚，窒惕，中吉，终凶。利见大人，不利涉大川。", "易生争执，家中宜减少尖角对冲、门对门等格局，和为贵。"),
  H(7, "地水师", "kun", "kan", "贞，丈人吉，无咎。", "需有主心骨统筹，家务分工明确；宜整顿秩序，收纳归位。"),
  H(8, "水地比", "kan", "kun", "吉。原筮，元永贞，无咎。不宁方来，后夫凶。", "亲比和睦，邻里家人相助；客厅宜开阔利于团聚。"),
  H(9, "风天小畜", "xun", "qian", "亨。密云不雨，自我西郊。", "小有积蓄而未大成，宜积累、勿急躁，可加强东南巽位的整洁。"),
  H(10, "天泽履", "qian", "dui", "履虎尾，不咥人，亨。", "如履虎尾，谨慎则安；注意家中安全隐患与长幼礼序。"),
  H(11, "地天泰", "kun", "qian", "小往大来，吉亨。", "天地交泰，上下通达，家运亨通；宜保持空气流通、动线顺畅。"),
  H(12, "天地否", "qian", "kun", "否之匪人，不利君子贞，大往小来。", "闭塞不通，宜打通阻塞的动线、清理杂物，增加沟通与通风。"),
  H(13, "天火同人", "qian", "li", "同人于野，亨。利涉大川，利君子贞。", "和同于人，利家庭聚会与合作；客厅宜明亮开放。"),
  H(14, "火天大有", "li", "qian", "元亨。", "大有收获，家业丰盛；宜保持南方明亮，富而不骄。"),
  H(15, "地山谦", "kun", "gen", "亨，君子有终。", "谦逊有终，宜低调务实，家居以简朴整洁为上。"),
  H(16, "雷地豫", "zhen", "kun", "利建侯行师。", "愉悦安乐，利乔迁宴客；但需防安逸懈怠。"),
  H(17, "泽雷随", "dui", "zhen", "元亨利贞，无咎。", "随时而动，宜顺应变化调整布局，作息随时令。"),
  H(18, "山风蛊", "gen", "xun", "元亨，利涉大川。先甲三日，后甲三日。", "积弊需整治，旧宅宜大扫除、修缮破损、处理霉湿与积尘。"),
  H(19, "地泽临", "kun", "dui", "元亨利贞。至于八月有凶。", "好运来临，宜把握时机；盛时亦应未雨绸缪。"),
  H(20, "风地观", "xun", "kun", "盥而不荐，有孚颙若。", "宜观察审视，先看清房屋格局与周边环境再做决定。"),
  H(21, "火雷噬嗑", "li", "zhen", "亨。利用狱。", "有梗阻需咬合清除，家中障碍物、卡门、漏水等应及时处理。"),
  H(22, "山火贲", "gen", "li", "亨。小利有攸往。", "文饰之象，适合软装美化；但重实质，勿过度装饰。"),
  H(23, "山地剥", "gen", "kun", "不利有攸往。", "剥落衰退，注意房屋结构、墙体脱落与家人健康，宜守不宜大动。"),
  H(24, "地雷复", "kun", "zhen", "亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。", "一阳来复，运势回升；宜重新整理居所，迎接新开始。"),
  H(25, "天雷无妄", "qian", "zhen", "元亨利贞。其匪正有眚，不利有攸往。", "顺其自然、不妄为；勿迷信乱放法器，按常理布置即吉。"),
  H(26, "山天大畜", "gen", "qian", "利贞，不家食吉，利涉大川。", "大有积蓄，利储蓄置业；宜设充足收纳，东北艮位整洁。"),
  H(27, "山雷颐", "gen", "zhen", "贞吉。观颐，自求口实。", "颐养之象，重饮食健康；厨房、餐厅宜洁净有序。"),
  H(28, "泽风大过", "dui", "xun", "栋桡，利有攸往，亨。", "栋梁弯曲，负担过重；注意横梁压顶与承重，减轻压力。"),
  H(29, "坎为水", "kan", "kan", "习坎，有孚，维心亨，行有尚。", "重重险阻，注意防水防潮、漏水与湿气；守信持心可渡难关。"),
  H(30, "离为火", "li", "li", "利贞，亨。畜牝牛，吉。", "光明附丽，宜采光充足；同时注意用电用火安全。"),
  H(31, "泽山咸", "dui", "gen", "亨，利贞，取女吉。", "感应相交，利婚恋与夫妻感情；主卧宜温馨、成对布置。"),
  H(32, "雷风恒", "zhen", "xun", "亨，无咎，利贞，利有攸往。", "恒久之道，家居格局宜稳定，不宜频繁大改。"),
  H(33, "天山遁", "qian", "gen", "亨，小利贞。", "退避之象，宜暂缓大事，可整理静修空间以养精蓄锐。"),
  H(34, "雷天大壮", "zhen", "qian", "利贞。", "声势壮大，宜正道而行，防冲动；可动但须守规矩。"),
  H(35, "火地晋", "li", "kun", "康侯用锡马蕃庶，昼日三接。", "晋升向上，利事业；南方与客厅宜明亮，利贵人往来。"),
  H(36, "地火明夷", "kun", "li", "利艰贞。", "光明受伤，宜韬光养晦；家中昏暗处应增加照明。"),
  H(37, "风火家人", "xun", "li", "利女贞。", "家道正则天下定；重家庭伦常与女主人持家，厨房（火）宜整洁。"),
  H(38, "火泽睽", "li", "dui", "小事吉。", "意见相左，家人易有分歧；避免门对门、镜对镜等对冲格局。"),
  H(39, "水山蹇", "kan", "gen", "利西南，不利东北；利见大人，贞吉。", "行路艰难，宜反求诸己；动线受阻处应疏通，可加强西南坤位。"),
  H(40, "雷水解", "zhen", "kan", "利西南，无所往，其来复吉。有攸往，夙吉。", "困难化解，宜尽早处理积压问题，清理杂物迎新气。"),
  H(41, "山泽损", "gen", "dui", "有孚，元吉，无咎，可贞，利有攸往。曷之用？二簋可用享。", "减损得益，断舍离、精简物品反而吉利。"),
  H(42, "风雷益", "xun", "zhen", "利有攸往，利涉大川。", "增益之象，利添置、改善居住条件，东方东南宜生机盎然。"),
  H(43, "泽天夬", "dui", "qian", "扬于王庭，孚号，有厉。告自邑，不利即戎，利有攸往。", "决断之时，该拆该改宜果断，但方式要平和。"),
  H(44, "天风姤", "qian", "xun", "女壮，勿用取女。", "不期而遇，注意外来因素与人际界限；门户宜稳固。"),
  H(45, "泽地萃", "dui", "kun", "亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。", "聚集之象，利家人团聚、祭祀礼仪；客厅宜宽敞。"),
  H(46, "地风升", "kun", "xun", "元亨，用见大人，勿恤，南征吉。", "步步高升，利乔迁、升学；南方宜明亮通畅。"),
  H(47, "泽水困", "dui", "kan", "亨，贞，大人吉，无咎，有言不信。", "困顿缺乏，注意漏水、财气外泄；少说多做，守正待时。"),
  H(48, "水风井", "kan", "xun", "改邑不改井，无丧无得，往来井井。汔至，亦未繘井，羸其瓶，凶。", "井养不穷，重视水路、厨卫维护，基础设施要常修常新。"),
  H(49, "泽火革", "dui", "li", "己日乃孚，元亨利贞，悔亡。", "变革之象，适合装修改造、调整格局，时机成熟则顺。"),
  H(50, "火风鼎", "li", "xun", "元吉，亨。", "鼎新立业，利厨房改造、新居安灶；灶位宜稳、坐凶向吉。"),
  H(51, "震为雷", "zhen", "zhen", "亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。", "震动惊扰，注意噪音与突发事件；临危不乱则无咎。"),
  H(52, "艮为山", "gen", "gen", "艮其背，不获其身；行其庭，不见其人，无咎。", "止而安，宜静不宜动；座位、床位宜有靠山。"),
  H(53, "风山渐", "xun", "gen", "女归吉，利贞。", "循序渐进，装修搬迁宜按部就班，利婚嫁。"),
  H(54, "雷泽归妹", "zhen", "dui", "征凶，无攸利。", "名分不正则凶，家中长幼次序、主次空间宜分明。"),
  H(55, "雷火丰", "zhen", "li", "亨，王假之，勿忧，宜日中。", "丰盛鼎盛，宜保持明亮，盛极防衰、勿铺张。"),
  H(56, "火山旅", "li", "gen", "小亨，旅贞吉。", "羁旅在外，租住或临时居所宜简洁安稳，注意门户安全。"),
  H(57, "巽为风", "xun", "xun", "小亨，利有攸往，利见大人。", "风行而入，重通风换气；顺势而为，利东南巽位。"),
  H(58, "兑为泽", "dui", "dui", "亨，利贞。", "喜悦和乐，利交流聚会；西方兑位宜明快，防口舌。"),
  H(59, "风水涣", "xun", "kan", "亨。王假有庙，利涉大川，利贞。", "涣散之象，宜凝聚人心；客厅设聚气区，避免穿堂。"),
  H(60, "水泽节", "kan", "dui", "亨。苦节，不可贞。", "节制有度，控制开支与物品数量，但勿过苛。"),
  H(61, "风泽中孚", "xun", "dui", "豚鱼吉，利涉大川，利贞。", "诚信于中，家人互信则吉；家居重实用真诚。"),
  H(62, "雷山小过", "zhen", "gen", "亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。", "宜小调整，不宜大改动；局部微调胜于整体翻新。"),
  H(63, "水火既济", "kan", "li", "亨小，利贞。初吉终乱。", "水火既济，诸事已成；厨房水火宜调和，成功后防松懈。"),
  H(64, "火水未济", "li", "kan", "亨。小狐汔济，濡其尾，无攸利。", "事未完成，宜谨慎收尾；装修未完勿急于入住。"),
];

export function findHexagram(upper: TrigramKey, lower: TrigramKey): Hexagram {
  return HEXAGRAMS.find((h) => h.upper === upper && h.lower === lower)!;
}
