import {
  DIRS8, EAST_GROUP, FLY_PATH, FLY_STARS, OPPOSITE, TRIGRAM_BY_DIR, TRIGRAM_BY_LUOSHU, youNian,
  type Dir, type FlyStar, type Trigram, type YouNian,
} from "../data/bagua";

/** 以立春（约 2 月 4 日）为年界 */
export function solarYear(d: Date): number {
  const y = d.getFullYear();
  const beforeLichun = d.getMonth() === 0 || (d.getMonth() === 1 && d.getDate() < 4);
  return beforeLichun ? y - 1 : y;
}

/** 当年入中宫之星（亦即男命卦数） */
export function annualCenterStar(year: number): number {
  const n = (11 - (year % 9)) % 9;
  return n === 0 ? 9 : n;
}

export interface MingGua {
  number: number;
  trigram: Trigram;
  group: "东四命" | "西四命";
}

export function mingGua(birthYear: number, gender: "male" | "female"): MingGua {
  const male = annualCenterStar(birthYear);
  let n = male;
  if (gender === "female") {
    n = (((6 - male) % 9) + 9) % 9;
    if (n === 0) n = 9;
  }
  if (n === 5) n = gender === "male" ? 2 : 8;
  const trigram = TRIGRAM_BY_LUOSHU[n];
  return { number: n, trigram, group: EAST_GROUP.includes(trigram.key) ? "东四命" : "西四命" };
}

export interface HouseGua {
  sit: Exclude<Dir, "C">;
  face: Exclude<Dir, "C">;
  trigram: Trigram;
  group: "东四宅" | "西四宅";
}

export function houseGua(sit: Exclude<Dir, "C">): HouseGua {
  const trigram = TRIGRAM_BY_DIR[sit];
  return { sit, face: OPPOSITE[sit], trigram, group: EAST_GROUP.includes(trigram.key) ? "东四宅" : "西四宅" };
}

export function annualStars(year: number): Record<Dir, FlyStar> {
  const center = annualCenterStar(year);
  const out = {} as Record<Dir, FlyStar>;
  FLY_PATH.forEach((d, i) => {
    out[d] = FLY_STARS[((center - 1 + i) % 9) + 1];
  });
  return out;
}

export function youNianMap(base: Trigram): Record<Exclude<Dir, "C">, YouNian> {
  return Object.fromEntries(DIRS8.map((d) => [d, youNian(base, TRIGRAM_BY_DIR[d])])) as Record<Exclude<Dir, "C">, YouNian>;
}

/** 三元九运 */
export function period(year: number): { n: number; range: string } {
  const start = 1864;
  const idx = Math.floor((year - start) / 20);
  const n = (((idx % 9) + 9) % 9) + 1;
  const s = start + idx * 20;
  return { n, range: `${s}–${s + 19}` };
}
