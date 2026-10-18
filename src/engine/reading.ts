import {
  DIRS8, EAST_GROUP, KE, OPPOSITE, SHENG, TRIGRAM_BY_DIR, findHexagram, youNian,
  type Dir, type Element, type Trigram, type YouNian,
} from "../data/bagua";
import { HEX_EN, TRIGRAM_L, YOUNIAN_L, DIR_L, ELEMENT_L, ELEMENT_COLORS_L, CENTER_AREA, l, type L } from "../data/i18n";
import { ISSUES, STRENGTHS, type Cat } from "../data/issues";
import { PRODUCTS, type Product } from "../data/products";
import { BED_ROOMS, QUESTIONS, ROOM_L, type RoomType } from "../data/questions";
import { annualStars, mingGua, solarYear } from "./compass";

export type Dir8 = Exclude<Dir, "C">;
export type Focus = "wealth" | "career" | "love" | "health" | "family" | "study" | "creativity" | "calm";

export interface Room { id: number; type: RoomType; dir: Dir | ""; photo?: string }
export interface Person { year: number | ""; gender: "male" | "female" | "none" }
export interface Form {
  homeType: "house" | "townhouse" | "condo" | "other" | "";
  facing: Dir8 | "";
  degrees: number | "";
  door: Dir8 | "";
  entrance: "front" | "garage" | "side" | "";
  stairs: "up" | "down" | "no" | "";
  people: Person[];
  focus: Focus[];
  adult: boolean;
  rooms: Room[];
  answers: Record<string, string>;
}

export interface Opportunity {
  key: string; cat: Cat; sev: number; dir?: Dir;
  area: L; title: L; desc: L; basis: L; tip: L; why: L; products: Product[];
}
export interface Strength { key: string; title: L; text: L }
export interface Cell { dir: Dir; trigram?: Trigram; area: L; element: Element; houseStar?: YouNian; personStar?: YouNian; annual: number; rooms: RoomType[]; status: "thriving" | "balanced" | "care" }

export const FOCUS_L: Record<Focus, L> = {
  wealth: l("Wealth", "财运"), career: l("Career", "事业"), love: l("Love", "感情"), health: l("Health & Sleep", "健康安睡"),
  family: l("Family", "家庭和睦"), study: l("Kids & Study", "子女学业"), creativity: l("Creativity", "创意灵感"), calm: l("Calm & Stress Relief", "平静减压"),
};

export const ANNUAL_YEAR = Math.max(solarYear(new Date()), 2027);
const WEIGHTS: Record<Cat, number> = { A: 25, B: 30, C: 15, D: 5, E: 18, F: 7 };
const CAPS: Record<Cat, number> = { A: 6, B: 6, C: 3, D: 2, E: 9, F: 3 };

const dirOfDegrees = (deg: number): { dir: Dir8; edge: boolean } => {
  const d = ((deg % 360) + 360) % 360;
  const i = Math.round(d / 45) % 8;
  const order: Dir8[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const off = Math.abs(d - Math.round(d / 45) * 45);
  return { dir: order[i], edge: off > 22.5 - 7.5 };
};
export { dirOfDegrees };

const drainProducts: Record<Element, string[]> = {
  土: ["wulou", "chime"], 水: ["bamboo", "pagoda"], 火: ["citrine", "mountain"], 金: ["fountain", "bamboo"], 木: ["saltlamp", "amethyst"],
};
const FOCUS_DIR: Record<Focus, Dir> = { wealth: "SE", career: "N", love: "SW", health: "C", family: "E", study: "NE", creativity: "W", calm: "C" };
const FOCUS_STAR: Partial<Record<Focus, YouNian["key"]>> = { wealth: "shengqi", career: "shengqi", health: "tianyi", love: "yannian", family: "yannian", study: "fuwei", calm: "fuwei" };
const FOCUS_PRODUCTS: Record<Focus, string[]> = {
  wealth: ["pixiu", "citrine", "frog"], career: ["fountain", "frog"], love: ["rosepair", "ducks"], health: ["wulou", "amethyst"],
  family: ["bamboo", "fudogs"], study: ["pagoda", "bamboo"], creativity: ["chime", "citrine"], calm: ["amethyst", "saltlamp"],
};

const BLESSING: Record<string, L> = {
  qian: l("Like Qian, heaven, you carry quiet strength. May your home give you a steady foundation, and may helpful people meet you on every road.", "你如乾天，自有一份沉稳的力量。愿你的家给你坚实的根基，出门处处遇贵人。"),
  kun: l("Like Kun, the earth, you nurture those around you. May your home hold you as warmly as you hold others.", "你如坤地，温厚包容、滋养身边的人。愿你的家，也像你待人一样温暖地承载你。"),
  zhen: l("Like Zhen, thunder, you bring new beginnings. May your home be full of fresh energy and joyful starts.", "你如震雷，总能带来新的开始。愿你的家生机盎然，处处有欣喜的起点。"),
  xun: l("Like Xun, the gentle wind, your influence flows quietly and far. May abundance find its way gently into your home.", "你如巽风，柔和而深远。愿丰盛如清风，悄然入你家门。"),
  kan: l("Like Kan, water, you find your way through anything. May your home be a calm harbor and your path flow smoothly.", "你如坎水，总能找到前行的路。愿你的家是平静的港湾，人生之路顺遂流畅。"),
  li: l("Like Li, fire, you bring light and warmth. May your home shine with joy and may your gifts be seen and celebrated.", "你如离火，带来光明与温暖。愿你的家充满喜悦，你的才华被看见、被赞赏。"),
  gen: l("Like Gen, the mountain, you are steady and wise. May your home be a place of rest, growth and quiet achievement.", "你如艮山，沉稳而有智慧。愿你的家是休憩、成长与沉静成就之所。"),
  dui: l("Like Dui, the joyful lake, you bring delight to others. May your home overflow with laughter and warm conversation.", "你如兑泽，给人带来喜悦。愿你的家笑语盈盈、温情满溢。"),
};

const p = (ids: string[]) => ids.map((id) => PRODUCTS[id]).filter(Boolean);
const yn = (base: Trigram) => Object.fromEntries(DIRS8.map((d) => [d, youNian(base, TRIGRAM_BY_DIR[d])])) as Record<Dir8, YouNian>;
const best = (m: Record<Dir8, YouNian>, k: YouNian["key"]) => DIRS8.find((d) => m[d].key === k)!;
const goodList = (m: Record<Dir8, YouNian>) => DIRS8.filter((d) => m[d].good).sort((a, b) => m[a].rank - m[b].rank);
const fmt = (s: L, vars: Record<string, L | string>): L => {
  const rep = (lang: "en" | "zh") => s[lang].replace(/\{(\w+)\}/g, (_, k) => { const v = vars[k]; return typeof v === "string" ? v : v?.[lang] ?? ""; });
  return { en: rep("en"), zh: rep("zh") };
};
const join = (ls: L[], sep: L = l(", ", "、")): L => ({ en: ls.map((x) => x.en).join(sep.en), zh: ls.map((x) => x.zh).join(sep.zh) });

export function buildReading(form: Form) {
  const facing = form.facing as Dir8;
  const sit = OPPOSITE[facing];
  const door = (form.door || facing) as Dir8;
  const houseTri = TRIGRAM_BY_DIR[sit];
  const doorTri = TRIGRAM_BY_DIR[door];
  const houseYN = yn(houseTri);
  const stars = annualStars(ANNUAL_YEAR);

  const people = form.people
    .filter((x) => typeof x.year === "number" && x.year > 1900 && x.year < 2100 && x.gender !== "none")
    .map((x, i) => {
      const m = mingGua(x.year as number, x.gender as "male" | "female");
      const map = yn(m.trigram);
      return { idx: i, year: x.year as number, gender: x.gender, kua: m.number, trigram: m.trigram, east: m.group === "东四命", map, match: (m.group === "东四命") === EAST_GROUP.includes(houseTri.key) };
    });
  const owner = people[0];

  const opps: Opportunity[] = [];
  const strengths: Strength[] = [];
  const addIssue = (id: string, dir?: Dir) => {
    if (opps.some((o) => o.key === id)) return;
    const d = ISSUES[id];
    opps.push({ key: id, cat: d.cat, sev: d.sev, dir, area: d.area, title: d.title, desc: d.desc, basis: d.basis, tip: d.tip, why: d.why, products: p(d.products) });
  };
  const addStrength = (key: string, title: L, text: L) => { if (!strengths.some((s) => s.key === key)) strengths.push({ key, title, text }); };

  // 问卷答案
  const roomTypes = new Set(form.rooms.map((r) => r.type));
  const roomDir = (t: RoomType) => form.rooms.find((r) => r.type === t && r.dir)?.dir as Dir | undefined;
  for (const q of QUESTIONS) {
    const v = form.answers[q.id];
    const opt = q.options.find((o) => o.v === v);
    if (!opt) continue;
    const dirFor = q.group === "living" ? roomDir("living") : q.group === "kitchen" ? roomDir("kitchen") : q.group === "office" ? roomDir("office") : q.group === "bed" ? roomDir("primary") ?? roomDir("bedroom") : q.group === "entry" ? door : undefined;
    if (opt.issue) addIssue(opt.issue, dirFor);
    if (opt.strength) { const s = STRENGTHS[opt.strength]; addStrength(opt.strength, s.title, s.text); }
  }

  if (form.stairs === "down" || form.stairs === "up") {
    opps.push({ key: "stairs", cat: "E", sev: form.stairs === "down" ? 2 : 1, dir: door, area: l("Entry", "玄关"), products: p(["screen", "fudogs"]),
      title: l("A staircase greets the front door", "楼梯正对大门"),
      desc: form.stairs === "down"
        ? l("Stairs running down from the door let energy roll away before it settles.", "大门对着向下的楼梯，入户之气还没停留就顺势流走。")
        : l("Stairs rising right at the door send energy rushing upstairs, skipping the main floor.", "大门正对向上的楼梯，气流直奔楼上，跳过了主要生活层。"),
      basis: l("Chi should enter, slow down and gather — “winding paths hold chi.”", "气宜入而缓、缓而聚——“曲则有情”。"),
      tip: l("Place a round rug and a plant or console between the door and the first step to create a pause.", "在门与第一级台阶之间铺一块圆形地毯，放一盆绿植或玄关桌，让气流有个停顿。"),
      why: l("A landing zone also makes the entry safer for kids and older family members.", "有缓冲区，对孩子和长辈也更安全。") });
  }
  if (form.entrance === "garage" || form.entrance === "side") {
    opps.push({ key: "entrance", cat: "D", sev: 1, area: l("Everyday Entrance", "日常出入口"), products: p(["coins", "saltlamp"]),
      title: l("Your everyday entrance is a second front door", "日常出入口是你的“第二大门”"),
      desc: l("You mostly come home through the garage or a side door, so that path carries most of your daily energy.", "你平时多从车库或侧门进出，这条路线承载了家里大部分的日常气场。"),
      basis: l("The door you use most is where chi truly enters (Yang Zhai San Yao: the door is first of the Three Essentials).", "最常用的门才是真正的纳气口（《阳宅三要》以门为首）。"),
      tip: l("Keep that path clear and well lit, and give it a small welcoming touch — a mat, a plant, a warm light.", "保持这条通道整洁明亮，并加一点迎宾感：一块地垫、一盆绿植、一盏暖灯。"),
      why: l("It's the first thing you see every day — make it feel like coming home.", "这是你每天最先看到的地方，让它有回家的感觉。") });
  }

  // 门（D）
  const doorStar = houseYN[door];
  if (doorStar.good) {
    addStrength("door", l("Your front door welcomes good energy", "大门迎纳吉气"),
      fmt(l("For a {house} home, a {dir} door opens to {star} — {good}.", "{house}宅开{dir}门，为「{star}」方——{good}。"),
        { house: TRIGRAM_L[houseTri.key].name, dir: DIR_L[door], star: YOUNIAN_L[doorStar.key].name, good: YOUNIAN_L[doorStar.key].good }));
  } else {
    opps.push({ key: "door_star", cat: "D", sev: 2, dir: door, area: l("Front Door", "大门"), products: p(["fudogs", "coins"]),
      title: l("Your front door could use a guardian", "大门需要一位守护者"),
      desc: fmt(l("For a {house} home, the {dir} door sits in a Balancing Zone, so it benefits from a little extra care.", "{house}宅的{dir}门落在待调和方位，需要多一点呵护。"),
        { house: TRIGRAM_L[houseTri.key].name, dir: DIR_L[door] }),
      basis: l("The Eight Mansions method reads each door through the changing lines of the house trigram.", "八宅法以宅卦逐爻变化推定各门吉凶。"),
      tip: l("Keep the door area bright, clean and welcoming; a fresh doormat and good lighting go a long way.", "让大门区域明亮、干净、有迎宾感；一块新地垫和好的照明就很有帮助。"),
      why: l("A cared-for entrance changes how every arrival feels.", "用心打理的门口，会改变每一次回家的感受。") });
  }

  // 人宅相配（B）
  for (const per of people) {
    const who = people.length > 1 ? l(`Person ${per.idx + 1}`, `第 ${per.idx + 1} 位家人`) : l("You", "你");
    if (per.match) {
      addStrength(`kua-${per.idx}`, fmt(l("{who} and your home are a natural match", "{who}与这个家天生相合"), { who }),
        fmt(l("Kua {k} ({tri}) belongs to the same group as this {house} home — the home naturally supports {who2}.", "命卦 {k}（{tri}）与{house}宅同属一组，这个家天然地支持{who2}。"),
          { k: String(per.kua), tri: TRIGRAM_L[per.trigram.key].name, house: TRIGRAM_L[houseTri.key].name, who2: per.idx === 0 && people.length === 1 ? l("you", "你") : who }));
    } else if (per.idx === 0) {
      const sq = best(per.map, "shengqi");
      opps.push({ key: `kua-${per.idx}`, cat: "B", sev: 1, area: l("Personal Directions", "个人吉方"), products: p(["mountain", "bamboo"]),
        title: l("Let your personal directions guide the details", "让个人吉方引导细节布置"),
        desc: fmt(l("Kua {k} ({tri}) belongs to a different group than this home — very common, and easily balanced by how you place your bed and desk.", "命卦 {k}（{tri}）与这个家分属不同组别——这很常见，通过床和书桌的朝向就能轻松调和。"),
          { k: String(per.kua), tri: TRIGRAM_L[per.trigram.key].name }),
        basis: l("Eight Mansions: when person and house differ, favor the person's own four good directions.", "八宅法：人宅不同组时，以本人四吉方为用。"),
        tip: fmt(l("Point your headboard and face your desk toward {d1} (Sheng Chi) or {d2} (Tian Yi).", "床头朝向、书桌面向尽量选择{d1}（生气）或{d2}（天医）。"), { d1: DIR_L[sq], d2: DIR_L[best(per.map, "tianyi")] }),
        why: l("These are the spots you spend the most hours in — small changes, big effect.", "这些是你停留最久的位置，小调整就有明显效果。") });
    }
  }

  // 房间方位（A、B、C、F）
  for (const r of form.rooms) {
    if (!r.dir) continue;
    const d = r.dir;
    const rn = ROOM_L[r.type];
    if (d === "C") {
      if (r.type === "bathroom") opps.push({ key: "c-bath", cat: "A", sev: 3, dir: "C", area: rn, products: p(["wulou", "citrine"]),
        title: l("A bathroom at the heart of your home", "卫生间位于房屋中心"),
        desc: l("The center is your home's heart (the Tai Chi point), which loves to be calm, dry and bright.", "中宫是全宅的“太极点”，最喜安静、干爽、明亮。"),
        basis: l("The center belongs to Earth and gathers chi from all eight directions.", "中宫属土，汇聚八方之气。"),
        tip: l("Keep the door closed, run the fan, and keep the space dry and fresh.", "门保持关闭，多开排风，保持干爽清新。"),
        why: l("Interior bathrooms without windows benefit most from good ventilation.", "无窗的中央卫生间最需要良好通风。") });
      else if (r.type === "kitchen") opps.push({ key: "c-kitchen", cat: "A", sev: 2, dir: "C", area: rn, products: p(["citrine", "woodboard"]),
        title: l("The kitchen fire sits at the center", "厨房位于房屋中心"),
        desc: l("Cooking energy at the heart of the home can make the whole house feel busy.", "烹饪之火居于宅心，容易让整个家显得忙碌躁动。"),
        basis: l("Fire feeds Earth; earthy tones help the center settle (fire → earth).", "火生土，以土色调和可让中宫安定。"),
        tip: l("Use earthy tones (sand, terracotta) and keep a strong range hood running.", "多用米色、陶土色，并开足油烟机。"),
        why: l("Better ventilation keeps cooking smells out of the rest of the home.", "排烟好，烹饪气味不会扩散到全屋。") });
      else if (r.type === "living") addStrength("c-living", l("Your living room is the heart of the home", "客厅居中，八方聚气"), l("Chi from all eight directions gathers where your family spends time together.", "八方之气汇聚于全家相聚之处。"));
      continue;
    }
    const tri = TRIGRAM_BY_DIR[d];
    const triL = TRIGRAM_L[tri.key];
    const isBed = BED_ROOMS.includes(r.type);
    const star = isBed && owner ? owner.map[d] : houseYN[d];
    const starFrom = isBed && owner ? l("your personal", "你的个人") : l("this home's", "本宅的");
    const active = ["living", "primary", "bedroom", "kids", "office", "dining"].includes(r.type);

    // A：卦位功能
    if (r.type === "kitchen" && d === "NW") opps.push({ key: "kitchen-nw", cat: "A", sev: 2, dir: d, area: rn, products: p(["citrine", "chime"]),
      title: l("The kitchen sits in Qian, the Heaven palace", "厨房位于西北乾宫"),
      desc: l("The Northwest belongs to Qian ☰ — the father and head of the home. Kitchen fire and Qian's metal pull in different directions.", "西北为乾卦，主家主、男主人。厨房之火与乾金相克。"),
      basis: l("Fire melts metal; Earth bridges them (fire → earth → metal).", "火克金；以土通关（火生土、土生金）。"),
      tip: l("Bring in earthy tones — a ceramic canister set, a stone tray, sand-colored textiles.", "加入土性元素：陶瓷收纳罐、石材托盘、米色布艺。"),
      why: l("Warm neutrals also make a kitchen feel calmer.", "温暖的中性色也让厨房更安静。") });
    if (r.type === "bathroom" && d === "NW") opps.push({ key: "bath-nw", cat: "A", sev: 1, dir: d, area: rn, products: p(["chime"]),
      title: l("A bathroom in the Heaven palace", "卫生间位于西北乾宫"),
      desc: l("Qian ☰ in the Northwest is a place of leadership and support; keep it fresh.", "西北乾位主领导与贵人，宜保持清爽。"),
      basis: l("Qian is metal; white and metallic touches strengthen it.", "乾属金，白色与金属点缀可扶助之。"),
      tip: l("Keep it spotless and dry; add white or metallic accents.", "保持干净干爽，加些白色或金属点缀。"), why: l("A fresh bathroom is simply nicer to use.", "清爽的卫生间用起来更舒服。") });
    if (r.type === "primary" && d === "SW") addStrength("primary-sw", l("Your primary bedroom rests in Kun, the palace of love", "主卧位于西南坤宫"), l("Kun ☷ is the earth and the mother — receptive and nurturing, the classic home of partnership.", "坤为地、为母，温厚承载，正是伴侣关系的传统方位。"));
    if ((r.type === "office" || r.type === "kids") && (d === "NE" || d === "SE")) addStrength(`${r.type}-study`, fmt(l("Your {room} sits in a palace of learning", "{room}位于文昌、学识之位"), { room: rn }), d === "NE" ? l("Gen ☶, the mountain, governs knowledge and steady self-growth.", "艮为山，主学识与沉稳成长。") : l("Xun ☴, the wind, carries the Wenchang energy of study and writing.", "巽为风，主文昌、文思。"));
    if (r.type === "kids" && d === "W") addStrength("kids-w", l("The kids' room is in Dui, the palace of children", "儿童房位于西方兑宫"), l("Dui ☱, the joyful lake, governs children and creativity.", "兑为泽，主子女与创意，喜悦活泼。"));

    // C：壁炉五行
    if (r.type === "living" && form.answers.fireplace === "yes" && (d === "N" || d === "W" || d === "NW")) {
      opps.push({ key: "fireplace", cat: "C", sev: 1, dir: d, area: rn, products: p(d === "N" ? ["bamboo", "woodboard"] : ["citrine", "mountain"]),
        title: fmt(l("Fireplace in the {tri} palace", "壁炉位于{tri}宫"), { tri: triL.name }),
        desc: fmt(l("Your fireplace (fire) sits in {dir}, whose element is {el}.", "壁炉属火，所在的{dir}方属{el}。"), { dir: DIR_L[d], el: ELEMENT_L[tri.element] }),
        basis: d === "N" ? l("Water and fire meet; wood bridges them (water → wood → fire).", "水火相遇，以木通关（水生木、木生火）。") : l("Fire and metal meet; earth bridges them (fire → earth → metal).", "火金相遇，以土通关（火生土、土生金）。"),
        tip: d === "N" ? l("Add wood or green near the mantel — a plant, a wooden bowl.", "在壁炉旁加些木质或绿色元素：一盆绿植、一个木碗。") : l("Add earthy pieces on the mantel — ceramics, stone, sand tones.", "壁炉台上放些土性摆件：陶瓷、石材、米色调。"),
        why: l("Balanced materials also make a mantel look curated.", "材质搭配平衡，壁炉台也更有设计感。") });
    }

    // B：游年吉凶
    if (active) {
      if (star.good) {
        addStrength(`yn-${r.type}`, fmt(l("Your {room} sits in a supportive direction", "{room}落在吉方"), { room: rn }),
          fmt(l("In {dir} ({tri}), it falls in {from} {star} direction — {good}.", "位于{dir}方（{tri}卦），是{from}「{star}」方——{good}。"),
            { dir: DIR_L[d], tri: triL.name, from: starFrom, star: YOUNIAN_L[star.key].name, good: YOUNIAN_L[star.key].good }));
      } else {
        const tipBest = owner ? goodList(owner.map) : goodList(houseYN);
        opps.push({ key: `yn-${r.type}`, cat: "B", sev: star.rank >= 7 ? 2 : 1, dir: d, area: rn, products: p(drainProducts[star.element]),
          title: fmt(l("Your {room} could use a gentle guardian", "{room}需要一位温和的守护者"), { room: rn }),
          desc: fmt(l("In {dir} ({tri}), it sits in {from} Balancing Zone — perfectly livable, and even better with a little support.", "位于{dir}方（{tri}卦），是{from}待调和方位——完全可以安住，加一点调和会更好。"), { dir: DIR_L[d], tri: triL.name, from: starFrom }),
          basis: fmt(l("Eight Mansions: this direction carries {el} energy; we soften it with the element it feeds ({el} → {drain}).", "八宅法：此方之气属{el}，以其所生之五行化泄（{el}生{drain}）。"), { el: ELEMENT_L[star.element], drain: ELEMENT_L[SHENG[star.element]] }),
          tip: isBed || r.type === "office"
            ? fmt(l("Orient your {what} toward {dirs} — your strongest directions.", "把{what}朝向{dirs}——你最有力的方位。"), { what: isBed ? l("headboard", "床头") : l("desk (face this way)", "书桌（面向）"), dirs: join(tipBest.slice(0, 2).map((x) => DIR_L[x]), l(" or ", "或")) })
            : fmt(l("Add touches of {colors} to bring in balancing {drain} energy.", "加入{colors}的点缀，引入调和的{drain}气。"), { colors: ELEMENT_COLORS_L[SHENG[star.element]], drain: ELEMENT_L[SHENG[star.element]] }),
          why: l("Thoughtful orientation is free and easy to try.", "调整朝向不花钱，随时可以试试。") });
      }
    } else if (r.type === "kitchen" || r.type === "bathroom" || r.type === "laundry" || r.type === "garage") {
      if (!houseYN[d].good) addStrength(`anchor-${r.type}`, fmt(l("Your {room} anchors a Balancing Zone", "{room}镇守待调和方位"), { room: rn }),
        l("Tradition places kitchens, bathrooms and storage in exactly these directions, leaving the best directions for living.", "传统上正是把厨房、卫生间、储物放在这些方位，把好方位留给生活起居。"));
      else if (r.type === "bathroom") opps.push({ key: `yn-bath-${d}`, cat: "B", sev: 1, dir: d, area: rn, products: p(["bamboo"]),
        title: l("A bathroom in one of your home's good directions", "卫生间占了本宅吉方"),
        desc: fmt(l("The bathroom sits in {dir}, one of this home's supportive directions.", "卫生间位于{dir}方，是本宅的吉方之一。"), { dir: DIR_L[d] }),
        basis: l("Good directions are best used for living; a closed, fresh bathroom keeps their energy clear.", "吉方宜用于起居；卫生间保持关闭清爽，可护住吉气。"),
        tip: l("Keep the door closed and add a healthy green plant.", "门常关，放一盆健康的绿植。"), why: l("Fresh air, fresh feel.", "空气清新，感觉也清新。") });
    }

    // F：流年
    const s = stars[d].n;
    if ((active || r.type === "entry") && (s === 5 || s === 2)) {
      opps.push({ key: `annual-${r.type}`, cat: "F", sev: s === 5 ? 2 : 1, dir: d, area: rn, products: p(["wulou", "coins"]),
        title: fmt(l("{year} energy: keep your {room} calm", "{year} 年流年：{room}宜静"), { year: String(ANNUAL_YEAR), room: rn }),
        desc: fmt(l("In {year}, the {star} star visits {dir}. It's a year to keep this room peaceful and avoid renovation here.", "{year} 年「{star}」星飞临{dir}方，这一年此房间宜安静，避免装修动土。"),
          { year: String(ANNUAL_YEAR), star: s === 5 ? l("5 Yellow", "五黄") : l("2 Black", "二黑"), dir: DIR_L[d] }),
        basis: l("Flying Stars: earth stars are softened with metal (earth → metal).", "玄空飞星：土星以金化泄（土生金）。"),
        tip: l("Skip red décor here this year; add metallic or white accents.", "今年此处少用红色，多用金属或白色点缀。"),
        why: l("A calm, uncluttered room is restful in any year.", "安静整洁的房间，任何年份都让人放松。") });
    }
  }

  // 补足优势
  if (strengths.length < 2) addStrength("trigram", fmt(l("Your home stands in {tri}, {img}", "你的家坐{tri}（{img}）"), { tri: TRIGRAM_L[houseTri.key].name, img: TRIGRAM_L[houseTri.key].image }), TRIGRAM_L[houseTri.key].quote);
  if (strengths.length < 2) addStrength("care", l("You're giving your home attention", "你正在用心照料这个家"), l("In feng shui, a home that is cared for responds with warmth — taking this reading is already the first step.", "风水认为，被用心照料的家会以温暖回应——做这份解读，已经是第一步。"));

  // 评分
  const loss: Record<Cat, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  for (const o of opps) loss[o.cat] += o.sev;
  const raw = (Object.keys(WEIGHTS) as Cat[]).reduce((s, c) => s + WEIGHTS[c] * (1 - Math.min(1, loss[c] / CAPS[c])), 0);
  const score = Math.round(60 + raw * 0.35);
  const potential = opps.length ? Math.min(96, Math.max(score + 3, score + Math.round((96 - score) * 0.8))) : Math.min(97, score + 1);
  const grade = score >= 88 ? l("Harmonious Home", "和谐之宅") : score >= 78 ? l("Balanced Home · Ready to Bloom", "平稳之宅 · 蓄势待发") : l("A Home Ready to Bloom", "待绽之宅");

  opps.sort((a, b) => b.sev - a.sev);

  // 九宫
  const cells = {} as Record<Dir, Cell>;
  for (const d of [...DIRS8, "C"] as Dir[]) {
    const tri = d === "C" ? undefined : TRIGRAM_BY_DIR[d];
    const care = opps.some((o) => o.dir === d) || stars[d].n === 5;
    const hs = d === "C" ? undefined : houseYN[d as Dir8];
    const ps = d === "C" || !owner ? undefined : owner.map[d as Dir8];
    cells[d] = {
      dir: d, trigram: tri, area: tri ? TRIGRAM_L[tri.key].area : CENTER_AREA, element: tri ? tri.element : "土", houseStar: hs, personStar: ps,
      annual: stars[d].n, rooms: form.rooms.filter((r) => r.dir === d).map((r) => r.type),
      status: care ? "care" : (hs?.good || ps?.good) ? "thriving" : "balanced",
    };
  }

  // 重点领域
  const focusPlans = form.focus.map((f) => {
    const d = FOCUS_DIR[f];
    const key = FOCUS_STAR[f];
    const pd = owner && key ? best(owner.map, key) : undefined;
    const el: Element = d === "C" ? "土" : TRIGRAM_BY_DIR[d].element;
    const lines: L[] = [
      d === "C"
        ? l("Your home's center governs overall wellbeing — keep it open, bright and uncluttered.", "家的中宫主全家身心安和——保持开阔、明亮、无杂物。")
        : fmt(l("{area} lives in the {dir} — the {tri} ({img}) palace. Favor {colors} here.", "{area}对应{dir}方——{tri}（{img}）宫。此处宜用{colors}。"),
          { area: TRIGRAM_L[TRIGRAM_BY_DIR[d].key].area, dir: DIR_L[d], tri: TRIGRAM_L[TRIGRAM_BY_DIR[d].key].name, img: TRIGRAM_L[TRIGRAM_BY_DIR[d].key].image, colors: ELEMENT_COLORS_L[el] }),
    ];
    if (pd && key) lines.push(fmt(l("Your personal {star} direction is {dir} — face it when you work, rest or plan.", "你的个人「{star}」方是{dir}——工作、休息、规划时可面向此方。"), { star: YOUNIAN_L[key].name, dir: DIR_L[pd] }));
    if (stars[d].n === 5 || stars[d].n === 2) lines.push(fmt(l("In {y}, keep this corner calm and choose metal-toned guardians rather than red.", "{y} 年此角宜静，选择金属色调的守护者，少用红色。"), { y: String(ANNUAL_YEAR) }));
    return { focus: f, dir: d, text: join(lines, l(" ", "")), products: p(FOCUS_PRODUCTS[f]) };
  });

  // 年度
  const where = (n: number) => ([...DIRS8, "C"] as Dir[]).find((d) => stars[d].n === n)!;
  const annual = { year: ANNUAL_YEAR, five: where(5), two: where(2), nine: where(9), one: where(1), four: where(4), eight: where(8), products: p(["wulou", "coins", "chime"]) };

  // 守护者套装
  const setIds: string[] = [];
  for (const o of opps) if (o.products[0] && !setIds.includes(o.products[0].id) && setIds.length < 5) setIds.push(o.products[0].id);
  for (const f of focusPlans) if (f.products[0] && !setIds.includes(f.products[0].id) && setIds.length < 7) setIds.push(f.products[0].id);
  const guardianSet = p(setIds);

  // 宅象
  const hex = findHexagram(doorTri.key, houseTri.key);
  const [hexTitle, kwEn, kwZh] = HEX_EN[hex.no - 1];
  const de = doorTri.element, he = houseTri.element;
  const rel: L = de === he ? l("Door and home share the same element — a naturally harmonious pairing.", "门与宅五行相同，天然和谐。")
    : SHENG[de] === he ? fmt(l("The door's {a} nourishes the home's {b} — energy flows in to support you.", "门之{a}生宅之{b}，外气入内、扶助家人。"), { a: ELEMENT_L[de], b: ELEMENT_L[he] })
    : SHENG[he] === de ? fmt(l("The home's {b} feeds the door's {a} — a generous, outgoing home; a few guardians keep its energy close.", "宅之{b}生门之{a}，是慷慨外向之宅；几位守护者便能让气聚于内。"), { a: ELEMENT_L[de], b: ELEMENT_L[he] })
    : KE[de] === he || KE[he] === de ? fmt(l("{a} and {b} create lively, dynamic energy — well-placed guardians bring it into balance.", "{a}与{b}相激，气场活跃而有动力，放对守护者即可调和。"), { a: ELEMENT_L[de], b: ELEMENT_L[he] })
    : l("", "");
  const signature = {
    hexNo: hex.no, hexZh: hex.name, hexTitle, keyword: l(kwEn, kwZh), judgment: hex.judgment, door: doorTri, house: houseTri,
    text: fmt(l("Your home sits in {house} ({himg}) and opens through {door} ({dimg}). Together they form Hexagram {no} — {title}, whose spirit is {kw}. {rel}",
      "你的家坐{house}（{himg}），开门于{door}（{dimg}），上下相合成第 {no} 卦「{zh}」，其精神是「{kw}」。{rel}"),
      { house: TRIGRAM_L[houseTri.key].name, himg: TRIGRAM_L[houseTri.key].image, door: TRIGRAM_L[doorTri.key].name, dimg: TRIGRAM_L[doorTri.key].image,
        no: String(hex.no), title: hexTitle, zh: hex.name, kw: l(kwEn, kwZh), rel }),
  };

  const blessing = BLESSING[(owner?.trigram ?? houseTri).key];
  const edge = typeof form.degrees === "number" ? dirOfDegrees(form.degrees).edge : false;

  return { facing, sit, door, houseTri, houseYN, people, opps, strengths, score, potential, grade, cells, focusPlans, annual, guardianSet, signature, blessing, edge, roomTypes: [...roomTypes] };
}

export type Reading = ReturnType<typeof buildReading>;
