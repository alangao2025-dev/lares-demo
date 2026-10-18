import { useEffect, useRef, useState } from "react";
import { useT } from "../ui";
import { DIR_L, DIR_SHORT, UI, l, type L } from "../data/i18n";
import { GROUP_L, GROUP_ROOMS, QUESTIONS, ROOM_L, ROOM_ORDER, type RoomType } from "../data/questions";
import { dirOfDegrees, FOCUS_L, type Dir8, type Focus, type Form } from "../engine/reading";
import type { Dir } from "../data/bagua";

export function emptyForm(): Form {
  return {
    homeType: "", facing: "", degrees: "", door: "", entrance: "", stairs: "",
    people: [{ year: "", gender: "female" }], focus: [], adult: false,
    rooms: [
      { id: 1, type: "living", dir: "" }, { id: 2, type: "kitchen", dir: "" },
      { id: 3, type: "primary", dir: "" }, { id: 4, type: "bathroom", dir: "" },
    ],
    answers: {},
  };
}

const ROSE: { d: Dir8; x: number; y: number }[] = [
  { d: "N", x: 50, y: 8 }, { d: "NE", x: 80, y: 20 }, { d: "E", x: 92, y: 50 }, { d: "SE", x: 80, y: 80 },
  { d: "S", x: 50, y: 92 }, { d: "SW", x: 20, y: 80 }, { d: "W", x: 8, y: 50 }, { d: "NW", x: 20, y: 20 },
];
const GRID: Dir[] = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"];

async function compressImage(file: File, max = 1024): Promise<string> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.8);
}

function Choice<T extends string>({ value, options, onChange, cols }: { value: T | ""; options: { v: T; label: L; sub?: L }[]; onChange: (v: T) => void; cols?: number }) {
  const { t } = useT();
  return (
    <div className="choices" style={cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined} role="radiogroup">
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className={`choice ${value === o.v ? "on" : ""}`} onClick={() => onChange(o.v)}>
          <span>{t(o.label)}</span>{o.sub && <small>{t(o.sub)}</small>}
        </button>
      ))}
    </div>
  );
}

function Field({ label, hint, missing, children }: { label: string; hint?: string; missing?: boolean; children: React.ReactNode }) {
  return (
    <div className={`field ${missing ? "missing" : ""}`}>
      <div className="field-label">{label}</div>
      {hint && <p className="hint">{hint}</p>}
      {children}
    </div>
  );
}

function CompassButton({ onReading }: { onReading: (deg: number) => void }) {
  const { lang } = useT();
  const [live, setLive] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const cleanup = useRef<() => void>(() => {});
  useEffect(() => () => cleanup.current(), []);
  const start = async () => {
    setErr("");
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
    try { if (DOE?.requestPermission && (await DOE.requestPermission()) !== "granted") throw new Error("denied"); }
    catch { setErr(lang === "zh" ? "未获得指南针权限，请手动选择方向。" : "Compass permission was not granted — please choose the direction manually."); return; }
    const handler = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      const h = typeof e.webkitCompassHeading === "number" ? e.webkitCompassHeading : e.absolute && e.alpha != null ? 360 - e.alpha : null;
      if (h != null) setLive(Math.round(h) % 360);
    };
    const ev = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(ev, handler as EventListener);
    cleanup.current = () => window.removeEventListener(ev, handler as EventListener);
    setTimeout(() => setLive((v) => { if (v == null) setErr(lang === "zh" ? "此设备没有可用的指南针，请手动选择。" : "No compass detected on this device — please choose manually."); return v; }), 2500);
  };
  return (
    <div className="compass-btn">
      {live == null
        ? <button type="button" className="btn ghost" onClick={start}>🧭 {lang === "zh" ? "用手机指南针测量" : "Use my phone’s compass"}</button>
        : <div className="row"><span className="live">{live}°</span><button type="button" className="btn ghost" onClick={() => { onReading(live); cleanup.current(); setLive(null); }}>{lang === "zh" ? "使用此读数" : "Use this reading"}</button></div>}
      {err && <p className="hint warn">{err}</p>}
    </div>
  );
}


const FACING_HINT: Record<string, L> = {
  condo: l("Stand at your main window or balcony (the side with the most light) and look out. That direction is your home’s facing.", "站在主窗或阳台前（采光最多的一侧）向外看，这个方向就是房屋朝向。"),
  house: l("Stand at your front door, facing the street. The direction you are looking is your home’s facing.", "站在正门口，面朝街道。你所看的方向就是房屋朝向。"),
  any: l("House: stand at your front door facing the street. Condo: stand at your main window looking out. The direction you face is your home’s facing.", "独栋或联排：站在正门口面朝街道；公寓：站在主窗前向外看。你面对的方向就是房屋朝向。"),
};

export function FacingDoor({ form, up, miss }: { form: Form; up: (p: Partial<Form>) => void; miss: (k: string) => boolean }) {
  const { t, lang } = useT();
  const zh = lang === "zh";
  const facingHint = FACING_HINT[form.homeType === "condo" ? "condo" : form.homeType ? "house" : "any"];
  const deg = typeof form.degrees === "number" ? dirOfDegrees(form.degrees) : null;
  const setDegrees = (v: number | "") => { if (v === "") up({ degrees: "" }); else up({ degrees: v, facing: dirOfDegrees(v).dir }); };
  return (
    <>
          <Field label={zh ? "你家朝向哪个方向？" : "Which direction does your home face?"} hint={t(facingHint)} missing={miss("facing")}>
            <div className="facing">
              <div className="rose" role="radiogroup" aria-label="facing">
                <div className="rose-center">{form.facing ? <><b>{t(DIR_L[form.facing])}</b><small>{zh ? "朝向" : "facing"}</small></> : <small>{zh ? "点选方向" : "Tap a direction"}</small>}</div>
                {ROSE.map((r) => (
                  <button key={r.d} type="button" role="radio" aria-checked={form.facing === r.d} className={`rose-dir ${form.facing === r.d ? "on" : ""}`} style={{ left: `${r.x}%`, top: `${r.y}%` }}
                    onClick={() => up({ facing: r.d, degrees: "" })}>{t(DIR_SHORT[r.d])}</button>
                ))}
              </div>
              <div className="facing-side">
                <CompassButton onReading={(d) => setDegrees(d)} />
                <label className="deg">{zh ? "或输入指南针读数（度）" : "Or enter a compass reading (°)"}
                  <input type="number" min={0} max={359} inputMode="numeric" value={form.degrees} onChange={(e) => setDegrees(e.target.value === "" ? "" : Math.max(0, Math.min(359, Number(e.target.value))))} placeholder="e.g. 165" />
                </label>
                <p className="hint">{zh ? "请使用“磁北”读数（大多数手机指南针的默认设置）。" : "Use magnetic north (the default on most phone compasses)."}</p>
                {deg?.edge && <p className="hint warn">{zh ? `${form.degrees}° 接近两个方位的交界，建议在不同位置再测一次。` : `${form.degrees}° is close to the border between two directions — we recommend measuring again from another spot.`}</p>}
              </div>
            </div>
          </Field>
          <Field label={zh ? "正门在房子的哪个方位？" : "Where is your front door located?"} hint={zh ? "以房屋中心为原点。" : "Measured from the center of your home."} missing={miss("door")}>
            <div className="grid9 small">
              {GRID.map((d) => d === "C"
                ? <div key={d} className="g9 center">{zh ? "房屋中心" : "Center"}</div>
                : <button key={d} type="button" className={`g9 ${form.door === d ? "on" : ""}`} onClick={() => up({ door: d as Dir8 })}>{t(DIR_L[d])}</button>)}
            </div>
          </Field>
    </>
  );
}

export function FocusField({ form, up, miss }: { form: Form; up: (p: Partial<Form>) => void; miss: (k: string) => boolean }) {
  const { t, lang } = useT();
  return (
    <Field label={lang === "zh" ? "你现在最关心哪些方面？（可多选）" : "What matters most to you right now? (choose any)"} missing={miss("focus")}>
      <div className="chips">
        {(Object.keys(FOCUS_L) as Focus[]).map((f) => (
          <button key={f} type="button" aria-pressed={form.focus.includes(f)} className={`chip ${form.focus.includes(f) ? "on" : ""}`}
            onClick={() => up({ focus: form.focus.includes(f) ? form.focus.filter((x) => x !== f) : [...form.focus, f] })}>{t(FOCUS_L[f])}</button>
        ))}
      </div>
    </Field>
  );
}

export function QuickStart({ form, setForm, onDone }: { form: Form; setForm: (f: Form) => void; onDone: () => void }) {
  const { lang } = useT();
  const zh = lang === "zh";
  const [show, setShow] = useState(false);
  const up = (patch: Partial<Form>) => setForm({ ...form, ...patch });
  const missing = (["facing", "door"] as const).filter((k) => !form[k]) as string[];
  if (!form.focus.length) missing.push("focus");
  const miss = (k: string) => show && missing.includes(k);
  const p0 = form.people[0] ?? { year: "", gender: "female" };
  const setP0 = (patch: Partial<typeof p0>) => up({ people: [{ ...p0, ...patch }, ...form.people.slice(1)] });
  return (
    <section className="wizard">
      <div className="quick-head">
        <p className="eyebrow">{zh ? "快速解读 · 约 1 分钟" : "Quick reading · about 1 minute"}</p>
        <h2>{zh ? "三个问题，遇见你家的守护者" : "Three questions to meet your home’s guardians"}</h2>
      </div>
      <div className="card">
        <FacingDoor form={form} up={up} miss={miss} />
        <FocusField form={form} up={up} miss={miss} />
        <Field label={zh ? "你的出生年份（选填）" : "Your birth year (optional)"} hint={zh ? "填写后可推算个人命卦（Kua），解读更个性化。" : "Adds your personal Kua number for a more personal reading."}>
          <div className="row person">
            <input type="number" inputMode="numeric" placeholder={zh ? "如 1988" : "e.g. 1988"} value={p0.year} onChange={(e) => setP0({ year: e.target.value ? Number(e.target.value) : "" })} style={{ maxWidth: 180 }} />
            <select value={p0.gender} onChange={(e) => setP0({ gender: e.target.value as "male" | "female" | "none" })} style={{ width: "auto" }}>
              <option value="female">{zh ? "女" : "Female"}</option>
              <option value="male">{zh ? "男" : "Male"}</option>
              <option value="none">{zh ? "不愿透露" : "Prefer not to say"}</option>
            </select>
          </div>
        </Field>
      </div>
      {show && missing.length > 0 && <p className="hint warn center">{zh ? "请完成标出的问题。" : "Please answer the highlighted questions."}</p>}
      <div className="nav center-nav">
        <button className="btn primary big" onClick={() => { if (missing.length) { setShow(true); return; } up({ adult: true }); onDone(); }}>{zh ? "查看我的守护者" : "Meet My Guardians"}</button>
      </div>
      <p className="hint center small-note">{zh ? "继续即表示你已年满 16 岁。不需要注册，也不会保存照片。" : "By continuing you confirm you are 16 or older. No sign-up needed."}</p>
    </section>
  );
}

export default function Wizard({ form, setForm, onDone, onExit }: { form: Form; setForm: (f: Form) => void; onDone: () => void; onExit: () => void }) {
  const { t, lang } = useT();
  const [step, setStep] = useState(0);
  const [showMissing, setShowMissing] = useState(false);
  const [editDir, setEditDir] = useState(false);
  const up = (patch: Partial<Form>) => setForm({ ...form, ...patch });
  const zh = lang === "zh";

  const roomTypes = new Set(form.rooms.map((r) => r.type));
  const groups = (Object.keys(GROUP_L) as (keyof typeof GROUP_L)[]).filter((g) => {
    const rt = GROUP_ROOMS[g];
    return rt === "always" || rt.some((x) => roomTypes.has(x));
  });
  const visibleQs = QUESTIONS.filter((q) => groups.includes(q.group));

  const missing: string[] = [];
  if (step === 0) (["homeType", "facing", "door", "entrance", "stairs"] as const).forEach((k) => { if (!form[k]) missing.push(k); });
  if (step === 1 && !form.focus.length) missing.push("focus");
  if (step === 2) { if (!form.rooms.length) missing.push("rooms"); form.rooms.forEach((r) => { if (!r.dir) missing.push(`room-${r.id}`); }); }
  if (step === 3) visibleQs.forEach((q) => { if (!form.answers[q.id]) missing.push(q.id); });
  const miss = (k: string) => showMissing && missing.includes(k);

  const next = () => {
    if (missing.length) { setShowMissing(true); return; }
    setShowMissing(false);
    if (step < 3) { setStep(step + 1); window.scrollTo({ top: 0, behavior: "smooth" }); } else onDone();
  };

  const onPhoto = async (id: number, file?: File) => {
    if (!file) return;
    const photo = await compressImage(file);
    setForm({ ...form, rooms: form.rooms.map((r) => (r.id === id ? { ...r, photo } : r)) });
  };

  return (
    <section className="wizard">
      <ol className="stepper">
        {UI.steps.map((s, i) => <li key={i} className={i === step ? "on" : i < step ? "done" : ""}><span>{i + 1}</span>{t(s)}</li>)}
      </ol>

      {step === 0 && (
        <div className="card">
          <h2>{zh ? "关于你的家" : "About Your Home"}</h2>
          <p className="hint">{zh ? "再花 2 分钟，解锁宅气指数、九宫守护图与逐个房间的精准分析。" : "Two more minutes unlock your Harmony Score, Nine Palaces map and a room-by-room reading."}</p>
          <Field label={zh ? "你住的是哪种房子？" : "What type of home do you live in?"} missing={miss("homeType")}>
            <Choice value={form.homeType} onChange={(v) => up({ homeType: v })} cols={4} options={[
              { v: "house", label: l("Single-family house", "独栋住宅") }, { v: "townhouse", label: l("Townhouse", "联排别墅") },
              { v: "condo", label: l("Condo / Apartment", "公寓") }, { v: "other", label: l("Other", "其他") },
            ]} />
          </Field>
          <div className="field">
            <div className="field-label">{zh ? "朝向与正门" : "Facing & front door"}</div>
            <p className="hint">{zh ? `朝向：${t(DIR_L[form.facing as Dir8])} · 正门：${t(DIR_L[form.door as Dir8])}` : `Facing ${t(DIR_L[form.facing as Dir8])} · Front door ${t(DIR_L[form.door as Dir8])}`} <button type="button" className="link" onClick={() => setEditDir(!editDir)}>{editDir ? (zh ? "收起" : "Done") : (zh ? "修改" : "Change")}</button></p>
            {editDir && <FacingDoor form={form} up={up} miss={miss} />}
          </div>
          <Field label={zh ? "你平时最常从哪道门进出？" : "Which door do you use most often?"} missing={miss("entrance")}>
            <Choice value={form.entrance} onChange={(v) => up({ entrance: v })} cols={3} options={[
              { v: "front", label: l("Front door", "正门") }, { v: "garage", label: l("Garage door", "车库门") }, { v: "side", label: l("Side / back door", "侧门或后门") },
            ]} />
          </Field>
          <Field label={zh ? "正门对面有楼梯吗？" : "Is there a staircase facing the front door?"} missing={miss("stairs")}>
            <Choice value={form.stairs} onChange={(v) => up({ stairs: v })} cols={3} options={[
              { v: "up", label: l("Yes, going up", "有，向上") }, { v: "down", label: l("Yes, going down", "有，向下") }, { v: "no", label: l("No", "没有") },
            ]} />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="card">
          <h2>{zh ? "你的家人" : "Your Household"}</h2>
          <Field label={zh ? "家人出生年份（选填，用于推算个人命卦 Kua）" : "Birth year of household members (optional — for your personal Kua number)"}
            hint={zh ? "第一位视为宅主。1 月至 2 月初出生的人，命卦按上一年计算（以立春为界）。命卦传统公式只区分男女。" : "The first person is treated as the head of household. Born in January or early February? Your Kua follows the previous year (the solar year begins around Feb 4). The traditional Kua formula uses male / female calculations."}>
            {form.people.map((pp, i) => (
              <div className="row person" key={i}>
                <span className="pnum">{i + 1}</span>
                <input type="number" inputMode="numeric" placeholder={zh ? "出生年份，如 1988" : "Birth year, e.g. 1988"} value={pp.year}
                  onChange={(e) => up({ people: form.people.map((x, j) => (j === i ? { ...x, year: e.target.value ? Number(e.target.value) : "" } : x)) })} />
                <select value={pp.gender} onChange={(e) => up({ people: form.people.map((x, j) => (j === i ? { ...x, gender: e.target.value as "male" | "female" | "none" } : x)) })}>
                  <option value="female">{zh ? "女" : "Female"}</option>
                  <option value="male">{zh ? "男" : "Male"}</option>
                  <option value="none">{zh ? "不愿透露" : "Prefer not to say"}</option>
                </select>
                {form.people.length > 1 && <button type="button" className="icon" aria-label="remove" onClick={() => up({ people: form.people.filter((_, j) => j !== i) })}>×</button>}
              </div>
            ))}
            {form.people.length < 4 && <button type="button" className="link" onClick={() => up({ people: [...form.people, { year: "", gender: "male" }] })}>+ {zh ? "添加家人" : "Add a person"}</button>}
          </Field>
          <FocusField form={form} up={up} miss={miss} />
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2>{zh ? "房间与照片" : "Rooms & Photos"}</h2>
          <p className="hint">{zh ? "列出主要房间，并选择它们位于房屋中心的哪个方位。照片为选填，上传后可获得 AI 照片解读。照片只在生成报告时使用，不会被保存。" : "List your main rooms and where each sits relative to the center of your home. Photos are optional — add them for AI photo insights. Photos are used only to create your reading and are never stored."}</p>
          <div className="mini-guide">
            <div className="grid9 tiny">{GRID.map((d) => <div key={d} className={`g9 ${d === "C" ? "center" : ""}`}>{t(DIR_SHORT[d])}</div>)}</div>
            <p>{zh ? "想象把户型图分成九宫格，中间一格是房屋中心，上方为北。" : "Imagine your floor plan divided into a 3×3 grid with north at the top. The middle square is the center."}</p>
          </div>
          {miss("rooms") && <p className="hint warn">{zh ? "请至少添加一个房间。" : "Please add at least one room."}</p>}
          <div className="rooms">
            {form.rooms.map((r) => (
              <div className={`room ${miss(`room-${r.id}`) ? "missing" : ""}`} key={r.id}>
                <label className="photo">
                  {r.photo ? <img src={r.photo} alt={t(ROOM_L[r.type])} /> : <span>📷<br />{zh ? "添加照片" : "Add photo"}</span>}
                  <input type="file" accept="image/*" hidden onChange={(e) => { onPhoto(r.id, e.target.files?.[0]); e.target.value = ""; }} />
                </label>
                <div className="room-fields">
                  <select value={r.type} aria-label="room type" onChange={(e) => up({ rooms: form.rooms.map((x) => (x.id === r.id ? { ...x, type: e.target.value as RoomType } : x)) })}>
                    {ROOM_ORDER.map((rt) => <option key={rt} value={rt}>{t(ROOM_L[rt])}</option>)}
                  </select>
                  <select value={r.dir} aria-label="direction" onChange={(e) => up({ rooms: form.rooms.map((x) => (x.id === r.id ? { ...x, dir: e.target.value as Dir } : x)) })}>
                    <option value="">{zh ? "位于哪个方位？" : "Which part of the home?"}</option>
                    {GRID.map((d) => <option key={d} value={d}>{t(DIR_L[d])}</option>)}
                  </select>
                </div>
                <div className="room-actions">
                  {r.photo && <button type="button" className="link" onClick={() => up({ rooms: form.rooms.map((x) => (x.id === r.id ? { ...x, photo: undefined } : x)) })}>{zh ? "移除照片" : "Remove photo"}</button>}
                  <button type="button" className="icon" aria-label="remove room" onClick={() => up({ rooms: form.rooms.filter((x) => x.id !== r.id) })}>×</button>
                </div>
              </div>
            ))}
          </div>
          <div className="row wrap">
            {ROOM_ORDER.filter((rt) => !roomTypes.has(rt) || rt === "bedroom" || rt === "bathroom").slice(0, 8).map((rt) => (
              <button key={rt} type="button" className="chip add" onClick={() => up({ rooms: [...form.rooms, { id: Date.now(), type: rt, dir: "" }] })}>+ {t(ROOM_L[rt])}</button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h2>{zh ? "房间问答" : "Room Check"}</h2>
          <p className="hint">{zh ? `根据你的房间，共 ${visibleQs.length} 个问题，点选即可。` : `${visibleQs.length} quick questions based on your rooms — just tap an answer.`}</p>
          {groups.map((g) => (
            <div key={g} className="qgroup">
              <h3>{t(GROUP_L[g])}</h3>
              {QUESTIONS.filter((q) => q.group === g).map((q) => (
                <Field key={q.id} label={t(q.text)} missing={miss(q.id)}>
                  <Choice value={form.answers[q.id] ?? ""} onChange={(v) => up({ answers: { ...form.answers, [q.id]: v } })} options={q.options.map((o) => ({ v: o.v, label: o.label }))} />
                </Field>
              ))}
            </div>
          ))}
        </div>
      )}

      {showMissing && missing.length > 0 && <p className="hint warn center">{t(UI.required)}</p>}
      <div className="nav">
        <button className="btn ghost" onClick={() => { if (step === 0) onExit(); else { setStep(step - 1); setShowMissing(false); } }}>← {t(UI.back)}</button>
        <button className="btn primary" onClick={next}>{step < 3 ? `${t(UI.next)} →` : t(UI.seeReading)}</button>
      </div>
    </section>
  );
}
