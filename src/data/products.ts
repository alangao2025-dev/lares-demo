import type { Element } from "./bagua";
import { l, type L } from "./i18n";

export interface Product {
  id: string;
  line: "lares" | "penates";
  name: L;
  icon: string;
  element: Element;
  price: number;
  guards: L;
  symbolism: L;
  /** Shopify variant id，演示版为占位 */
  variant: string;
}

const P = (p: Product) => p;

export const PRODUCTS: Record<string, Product> = Object.fromEntries([
  P({ id: "fudogs", line: "lares", name: l("Brass Fu Dog Pair", "黄铜守门狮（一对）"), icon: "🦁", element: "金", price: 89, variant: "1001",
    guards: l("Entry & threshold", "入户与门户"), symbolism: l("Traditionally placed at the entrance as a guardian pair, symbolizing protection and steadiness.", "传统上成对置于门口，寓意守护与安稳。") }),
  P({ id: "wulou", line: "lares", name: l("Brass Wu Lou Gourd", "黄铜葫芦"), icon: "🏺", element: "金", price: 39, variant: "1002",
    guards: l("Wellbeing & rest", "安康与休养"), symbolism: l("A classic symbol of wellbeing; its metal element is traditionally used to soften heavy earth energy.", "传统安康象征；其金性传统上用于化泄过重的土气。") }),
  P({ id: "amethyst", line: "lares", name: l("Amethyst Cluster", "紫水晶簇"), icon: "💜", element: "火", price: 45, variant: "1003",
    guards: l("Calm & restful sleep", "宁静与安睡"), symbolism: l("Associated with calm and restful energy in feng shui and crystal traditions.", "在风水与水晶传统中寓意宁静、安睡。") }),
  P({ id: "rosepair", line: "lares", name: l("Rose Quartz Hearts (Pair)", "粉晶心（一对）"), icon: "💗", element: "土", price: 36, variant: "1004",
    guards: l("Love & partnership", "感情与伴侣"), symbolism: l("Pairs symbolize partnership; rose quartz is associated with love and tenderness.", "成对寓意相伴；粉晶象征爱与温柔。") }),
  P({ id: "ducks", line: "lares", name: l("Mandarin Duck Pair", "鸳鸯摆件（一对）"), icon: "🦆", element: "土", price: 49, variant: "1005",
    guards: l("Love & devotion", "姻缘与恩爱"), symbolism: l("Mandarin ducks mate for life and have long symbolized devoted love.", "鸳鸯成双，自古象征恩爱相守。") }),
  P({ id: "screen", line: "lares", name: l("Lattice Folding Screen", "花格屏风"), icon: "🪟", element: "木", price: 159, variant: "1006",
    guards: l("Flow of chi at the entry", "入户气流"), symbolism: l("Gently slows and guides incoming energy so it can circulate — “winding paths hold chi.”", "让入户之气回旋缓行——“曲则有情”。") }),
  P({ id: "mountain", line: "lares", name: l("Mountain Landscape Print", "山水画"), icon: "⛰️", element: "土", price: 79, variant: "1007",
    guards: l("Support behind you", "背后靠山"), symbolism: l("Gen ☶, the mountain, stands for stillness and support — a “mountain at your back.”", "艮为山，主安止与依靠——“背后有靠山”。") }),
  P({ id: "saltlamp", line: "lares", name: l("Himalayan Salt Lamp", "喜马拉雅盐灯"), icon: "🕯️", element: "火", price: 42, variant: "1008",
    guards: l("Warmth & light", "温暖与光明"), symbolism: l("Brings the warm glow of Li ☲, fire and brightness, to darker corners.", "为暗角带来离卦之明、火之温暖。") }),
  P({ id: "chime", line: "lares", name: l("6-Rod Brass Wind Chime", "六管黄铜风铃"), icon: "🎐", element: "金", price: 55, variant: "1009",
    guards: l("Helpful people & balance", "贵人与调和"), symbolism: l("Six rods echo Qian ☰ (six is its number); metal tones traditionally balance earth energy.", "六管应乾卦之数；金音传统上用于调和土气。") }),
  P({ id: "baguamirror", line: "lares", name: l("Bagua Mirror (Outdoor)", "八卦镜（户外用）"), icon: "☯️", element: "金", price: 29, variant: "1010",
    guards: l("Facing the street", "面向街道"), symbolism: l("Hung outside, facing outward only — a traditional emblem of deflecting harsh outside energy.", "仅挂于户外、朝外——传统上用以化解外部冲射。") }),
  P({ id: "pixiu", line: "penates", name: l("Pixiu Pair", "貔貅（一对）"), icon: "🐉", element: "土", price: 69, variant: "2001",
    guards: l("Wealth & abundance", "财富与丰盛"), symbolism: l("A mythical guardian of treasure, traditionally associated with gathering and keeping wealth.", "传说中守护财宝的神兽，寓意聚财守财。") }),
  P({ id: "frog", line: "penates", name: l("Money Frog", "招财金蟾"), icon: "🐸", element: "金", price: 45, variant: "2002",
    guards: l("Prosperity", "招财进宝"), symbolism: l("The three-legged frog with a coin traditionally symbolizes prosperity arriving.", "口衔铜钱的三足金蟾，传统寓意财源滚滚。") }),
  P({ id: "citrine", line: "penates", name: l("Citrine Geode", "黄水晶洞"), icon: "💛", element: "土", price: 59, variant: "2003",
    guards: l("Abundance", "丰盛"), symbolism: l("Known in crystal lore as the “merchant’s stone,” associated with abundance.", "水晶传统中被称为“商人之石”，寓意丰盛。") }),
  P({ id: "bamboo", line: "penates", name: l("Lucky Bamboo in Ceramic", "陶瓷盆富贵竹"), icon: "🎋", element: "木", price: 35, variant: "2004",
    guards: l("Growth & study", "成长与学业"), symbolism: l("Living wood of Xun ☴ and Zhen ☳ — steady growth and fresh energy.", "巽震之木，寓意节节高升、生机勃勃。") }),
  P({ id: "fountain", line: "penates", name: l("Tabletop Water Fountain", "桌面流水摆件"), icon: "⛲", element: "水", price: 89, variant: "2005",
    guards: l("Career & flow", "事业与流动"), symbolism: l("Kan ☵, water, is the trigram of the life path; gently moving water symbolizes flow.", "坎为水，主事业与人生道路；流水寓意顺畅。") }),
  P({ id: "pagoda", line: "penates", name: l("Wenchang Pagoda", "文昌塔"), icon: "🗼", element: "木", price: 39, variant: "2006",
    guards: l("Study & focus", "学业与专注"), symbolism: l("The classic emblem of scholarship and exam success in Chinese tradition.", "中国传统中学业与功名的象征。") }),
  P({ id: "coins", line: "penates", name: l("Six Emperor Coins", "六帝钱"), icon: "🪙", element: "金", price: 19, variant: "2007",
    guards: l("Doorway & annual balance", "门槛与年度调和"), symbolism: l("Coins from six prosperous reigns, traditionally used to bring steady fortune and balance earth energy.", "取六位盛世帝王年号铜钱，寓意福运绵长，传统上用于化泄土气。") }),
  P({ id: "woodboard", line: "penates", name: l("Bamboo Divider Board", "竹木隔板"), icon: "🪵", element: "木", price: 25, variant: "2008",
    guards: l("Kitchen harmony", "厨房和谐"), symbolism: l("Wood bridges water and fire in the Five Elements cycle (water feeds wood, wood feeds fire).", "五行中木可通关水火（水生木、木生火）。") }),
  P({ id: "fiveset", line: "penates", name: l("Five Elements Harmony Kit", "五行和合套装"), icon: "🧭", element: "土", price: 129, variant: "2009",
    guards: l("Whole-home balance", "全屋平衡"), symbolism: l("One piece for each element — metal, wood, water, fire, earth — for a balanced home.", "金木水火土各一件，寓意全宅五行调和。") }),
].map((p) => [p.id, p]));

export const SHIPPING = {
  eta: l("Ships from our workshop · approx. 10–18 business days", "工坊直发 · 约 10–18 个工作日送达"),
  cny: l("Order by Jan 15, 2027 to receive before Lunar New Year (Feb 6)", "1 月 15 日前下单，农历新年（2 月 6 日）前送达"),
};
