import { l, type L } from "./i18n";

export type RoomType = "entry" | "living" | "dining" | "kitchen" | "primary" | "bedroom" | "kids" | "office" | "bathroom" | "garage" | "laundry";

export const ROOM_L: Record<RoomType, L> = {
  entry: l("Entryway / Foyer", "入户玄关"), living: l("Living / Family Room", "客厅 / 家庭室"), dining: l("Dining", "餐厅"),
  kitchen: l("Kitchen", "厨房"), primary: l("Primary Bedroom", "主卧"), bedroom: l("Bedroom", "次卧"), kids: l("Kids' Room", "儿童房"),
  office: l("Home Office", "书房 / 家庭办公室"), bathroom: l("Bathroom", "卫生间"), garage: l("Garage", "车库"), laundry: l("Laundry / Mudroom", "洗衣房 / 杂物间"),
};
export const ROOM_ORDER: RoomType[] = ["entry", "living", "dining", "kitchen", "primary", "bedroom", "kids", "office", "bathroom", "garage", "laundry"];
export const BED_ROOMS: RoomType[] = ["primary", "bedroom", "kids"];

export interface Option { v: string; label: L; issue?: string; strength?: string }
export interface Question { id: string; group: "entry" | "living" | "bed" | "kitchen" | "office" | "bathroom" | "outside"; text: L; hint?: L; options: Option[] }

const o = (v: string, en: string, zh: string, extra: Partial<Option> = {}): Option => ({ v, label: l(en, zh), ...extra });

export const GROUP_L: Record<Question["group"], L> = {
  entry: l("Front Door & Entry", "大门与玄关"), living: l("Living Room", "客厅"), bed: l("Bedroom(s)", "卧室"),
  kitchen: l("Kitchen", "厨房"), office: l("Home Office", "书房"), bathroom: l("Bathroom(s)", "卫生间"), outside: l("Outside & Overall", "窗外与整体"),
};
export const GROUP_ROOMS: Record<Question["group"], RoomType[] | "always"> = {
  entry: "always", outside: "always", living: ["living"], bed: BED_ROOMS, kitchen: ["kitchen"], office: ["office"], bathroom: ["bathroom"],
};

export const QUESTIONS: Question[] = [
  { id: "entry_view", group: "entry", text: l("When you open the front door, what do you see first?", "打开大门，第一眼看到什么？"), options: [
    o("wall", "A wall, console or entry furniture", "墙面、玄关柜或玄关家具", { strength: "entry_wall" }),
    o("living", "The living room", "客厅"),
    o("window", "A window, patio door or back door straight ahead", "正前方是窗户、落地门或后门", { issue: "rushing" }),
    o("kitchen", "The kitchen / stove", "厨房或灶台", { issue: "door_kitchen" }),
    o("bathroom", "A bathroom door", "卫生间门", { issue: "door_bath" }),
    o("mirror", "A mirror facing the door", "正对大门的镜子", { issue: "door_mirror" }),
  ] },
  { id: "entry_light", group: "entry", text: l("How does your entry feel?", "玄关给人的感觉？"), options: [
    o("bright", "Bright and tidy", "明亮整洁", { strength: "entry_bright" }),
    o("dark", "A bit dark", "有点暗", { issue: "entry_dark" }),
    o("clutter", "Shoes, bags and clutter pile up", "鞋子、包和杂物较多", { issue: "entry_clutter" }),
  ] },
  { id: "sofa_back", group: "living", text: l("What's behind your main sofa?", "主沙发背后是什么？"), options: [
    o("wall", "A solid wall", "实墙", { strength: "sofa_backed" }),
    o("window", "A window", "窗户", { issue: "sofa_open" }),
    o("walkway", "A walkway or open space", "过道或空旷处", { issue: "sofa_open" }),
  ] },
  { id: "sofa_beam", group: "living", text: l("Is there an exposed beam or soffit right above the sofa?", "沙发正上方有外露横梁或吊顶凸梁吗？"), options: [
    o("yes", "Yes", "有", { issue: "beam_sofa" }), o("no", "No", "没有"), o("unsure", "Not sure", "不确定"),
  ] },
  { id: "living_light", group: "living", text: l("How much natural light does the living room get?", "客厅自然采光如何？"), options: [
    o("bright", "Bright", "明亮", { strength: "living_bright" }), o("ok", "Average", "一般"), o("dark", "Rather dark", "偏暗", { issue: "dark_living" }),
  ] },
  { id: "living_water", group: "living", text: l("Do you have a fish tank or water fountain in the living room?", "客厅里有鱼缸或流水摆件吗？"), options: [
    o("none", "No", "没有"),
    o("front", "Yes, in front of / facing the sofa", "有，在沙发前方", { strength: "water_front" }),
    o("behind", "Yes, behind the sofa", "有，在沙发背后", { issue: "water_behind" }),
  ] },
  { id: "fireplace", group: "living", text: l("Is there a fireplace in the living room?", "客厅有壁炉吗？"), options: [
    o("no", "No", "没有"), o("yes", "Yes", "有"),
  ] },
  { id: "headboard", group: "bed", text: l("What's behind your headboard?", "床头背后是什么？"), options: [
    o("wall", "A solid wall", "实墙", { strength: "bed_backed" }),
    o("window", "A window", "窗户", { issue: "bed_window" }),
    o("bathwall", "A wall shared with a bathroom", "与卫生间共用的墙", { issue: "bed_bathwall" }),
    o("floating", "Nothing — the bed floats in the room", "不靠墙，床在房间中间", { issue: "bed_window" }),
  ] },
  { id: "bed_mirror", group: "bed", text: l("Lying in bed, can you see yourself in a mirror?", "躺在床上，能在镜子里看到自己吗？"), options: [
    o("yes", "Yes", "能", { issue: "mirror_bed" }), o("no", "No", "不能"),
  ] },
  { id: "bed_door", group: "bed", text: l("How does the bedroom door relate to the bed?", "卧室门和床的位置关系？"), options: [
    o("direct", "The door opens directly in line with the bed", "门与床正对成一直线", { issue: "door_bed" }),
    o("diagonal", "The bed is diagonal from the door (can see the door from bed)", "床在门的斜对角（躺着能看到门）", { strength: "bed_command" }),
    o("hidden", "You can't see the door from the bed", "躺在床上看不到门"),
  ] },
  { id: "bed_above", group: "bed", text: l("What's above the bed?", "床的正上方有什么？"), options: [
    o("clear", "A clear, flat ceiling", "平整的天花板"),
    o("beam", "A beam", "横梁", { issue: "beam_bed" }),
    o("fan", "A ceiling fan directly overhead", "正上方有吊扇", { issue: "fan_bed" }),
    o("heavy", "Heavy shelves or large art", "重的搁架或大幅挂画", { issue: "heavy_bed" }),
  ] },
  { id: "ensuite", group: "bed", text: l("Does an en-suite bathroom door face the bed?", "主卧自带卫生间的门正对床吗？"), options: [
    o("yes", "Yes", "是", { issue: "ensuite_bed" }), o("no", "No", "不是"), o("none", "No en-suite", "没有自带卫生间"),
  ] },
  { id: "stove_sink", group: "kitchen", text: l("Where is the stove relative to the sink and fridge?", "灶台与水槽、冰箱的位置关系？"), options: [
    o("apart", "Well separated", "相隔较远", { strength: "kitchen_apart" }),
    o("beside", "Right next to each other", "紧挨着", { issue: "water_fire" }),
    o("facing", "Facing each other (e.g. island sink facing the stove)", "面对面（如岛台水槽正对灶台）", { issue: "water_fire" }),
  ] },
  { id: "stove_back", group: "kitchen", text: l("What's behind the stove?", "灶台背后是什么？"), options: [
    o("wall", "A solid wall", "实墙", { strength: "stove_backed" }),
    o("window", "A window", "窗户", { issue: "stove_open" }),
    o("island", "Open space (stove on an island)", "空旷处（灶在岛台上）", { issue: "stove_open" }),
  ] },
  { id: "desk_back", group: "office", text: l("When seated at your desk, what's behind you?", "坐在书桌前，背后是什么？"), options: [
    o("wall", "A wall or bookshelf", "墙或书柜", { strength: "desk_backed" }),
    o("door", "The door", "门", { issue: "desk_open" }),
    o("window", "A window", "窗户", { issue: "desk_open" }),
    o("walkway", "A walkway", "过道", { issue: "desk_open" }),
  ] },
  { id: "desk_face", group: "office", text: l("What do you face when seated?", "坐着时面前是什么？"), options: [
    o("room", "The open room / the door (not directly in line)", "开阔的房间或门（不正对）", { strength: "desk_command" }),
    o("wall", "A wall, close up", "近距离的墙面", { issue: "desk_wall" }),
    o("window", "A window", "窗户"),
  ] },
  { id: "bath_air", group: "bathroom", text: l("How is the bathroom ventilation?", "卫生间通风如何？"), options: [
    o("window", "Window, stays dry", "有窗，干爽"),
    o("fan", "No window, exhaust fan works well", "无窗，有排风扇且效果好"),
    o("damp", "Often damp or musty", "常潮湿或有异味", { issue: "bath_damp" }),
  ] },
  { id: "bath_door", group: "bathroom", text: l("What does a bathroom door face?", "卫生间门正对着什么？"), options: [
    o("none", "Nothing in particular", "没有特别正对什么"),
    o("kitchen", "The kitchen", "厨房", { issue: "bath_kitchen" }),
    o("dining", "The dining table", "餐桌", { issue: "bath_dining" }),
  ] },
  { id: "outside", group: "outside", text: l("What do you see from your main windows or front door?", "从主窗或大门往外看，能看到什么？"), options: [
    o("open", "An open view, trees or a quiet street", "开阔景观、树木或安静的街道", { strength: "open_view" }),
    o("tjunction", "A road heading straight at the house (T-junction)", "一条路直冲房子（T 字路口）", { issue: "road_rush" }),
    o("corner", "A sharp corner of another building", "其他建筑的尖角", { issue: "sharp_out" }),
    o("power", "Power lines or a utility tower", "电线或电塔", { issue: "power_out" }),
    o("wall", "A neighbor's wall, close by", "很近的邻居墙面"),
  ] },
  { id: "clutter", group: "outside", text: l("Overall, how is storage and clutter at home?", "整体来看，家里的收纳情况？"), options: [
    o("tidy", "Mostly tidy", "基本整洁", { strength: "tidy" }),
    o("some", "A few cluttered spots", "有几处杂乱", { issue: "clutter_some" }),
    o("lots", "Quite a lot of clutter", "杂物比较多", { issue: "clutter_lots" }),
  ] },
];
