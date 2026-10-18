import { useMemo, useRef, useState } from "react";
import { marked } from "marked";
import { HexLines, useT } from "../ui";
import { DIR_L, DIR_SHORT, ELEMENT_COLORS_L, ELEMENT_L, STAR_L, TRIGRAM_L, UI, YOUNIAN_L, l } from "../data/i18n";
import { ROOM_L } from "../data/questions";
import { PRODUCTS, SHIPPING, type Product } from "../data/products";
import { FOCUS_L, type Form, type Opportunity, type Reading } from "../engine/reading";
import type { Dir } from "../data/bagua";

marked.use({ renderer: { html: () => "" } });
const GRID: Dir[] = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"];
const money = (n: number) => `$${n.toFixed(0)}`;

function ProductCard({ p, inCart, toggle }: { p: Product; inCart: boolean; toggle: () => void }) {
  const { t, lang } = useT();
  return (
    <div className={`product ${p.line}`}>
      <div className="p-img" aria-hidden="true">{p.icon}</div>
      <div className="p-body">
        <div className="p-line">{p.line === "lares" ? (lang === "zh" ? "Lares · 守护安宁" : "Lares · Peace & Protection") : (lang === "zh" ? "Penates · 守护丰足" : "Penates · Abundance")}</div>
        <b>{t(p.name)}</b>
        <div className="p-guards">{lang === "zh" ? "守护：" : "Guards: "}{t(p.guards)}</div>
        <p className="p-sym">{t(p.symbolism)}</p>
        <div className="p-foot">
          <span className="price">{money(p.price)}</span>
          <button className={`btn small ${inCart ? "added" : "primary"}`} onClick={toggle}>{inCart ? (lang === "zh" ? "已加入 ✓" : "Added ✓") : (lang === "zh" ? "加入购物车" : "Add to cart")}</button>
        </div>
      </div>
    </div>
  );
}

function OppCard({ o, n, cart, toggle }: { o: Opportunity; n: number; cart: Set<string>; toggle: (id: string) => void }) {
  const { t, lang } = useT();
  return (
    <article className="opp" id={`opp-${o.key}`}>
      <div className="opp-head">
        <span className="opp-n">{n}</span>
        <div>
          <div className="opp-area">{t(o.area)}{o.dir ? ` · ${t(DIR_L[o.dir])}` : ""}</div>
          <h3>{t(o.title)}</h3>
        </div>
      </div>
      <p>{t(o.desc)}</p>
      <p className="basis"><span>☯</span>{t(o.basis)}</p>
      <div className="tip"><b>{lang === "zh" ? "免费小调整" : "A free shift"}</b>{t(o.tip)}<span className="why">{t(o.why)}</span></div>
      {o.products.length > 0 && (
        <div className="guardians">
          <div className="g-label">{lang === "zh" ? "为这里请一位守护者" : "Invite a guardian here"}</div>
          <div className="products">{o.products.map((p) => <ProductCard key={p.id} p={p} inCart={cart.has(p.id)} toggle={() => toggle(p.id)} />)}</div>
        </div>
      )}
      <p className="goodnews">{lang === "zh" ? "好消息是：只需简单的摆设调整，这里就能重新回到平衡。" : "The good news: a simple shift can bring this area back into balance."}</p>
    </article>
  );
}

export default function Report({ reading: r, form, quick, onRestart, onEdit, onDeepen }: { reading: Reading; form: Form; quick?: boolean; onRestart: () => void; onEdit: () => void; onDeepen: () => void }) {
  const { t, lang } = useT();
  const zh = lang === "zh";
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState("");
  const toggle = (id: string) => setCart((c) => { const n = new Set(c); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const cartTotal = [...cart].reduce((s, id) => s + PRODUCTS[id].price, 0);
  const setTotal = r.guardianSet.reduce((s, p) => s + p.price, 0);
  const shown = quick ? r.opps.slice(0, 3) : showAll ? r.opps : r.opps.slice(0, 5);
  const hexLines = [...r.signature.house.lines, ...r.signature.door.lines];
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 4500); };

  const deepen = (
    <div className="card deepen">
      <div>
        <div className="sig-label">{zh ? "深度解读 · 约 2 分钟" : "Deep reading · about 2 minutes"}</div>
        <h3>{zh ? "想知道每个房间的守护者吗？" : "Want to know the guardian for every room?"}</h3>
        <ul>
          <li>{zh ? "解锁你家的宅气指数与提升空间" : "Unlock your Harmony Score — and how high it can go"}</li>
          <li>{zh ? "九宫守护图：每个方位的状态一目了然" : "Your Nine Palaces map, direction by direction"}</li>
          <li>{zh ? "逐个房间的精准分析，可上传照片获得 AI 解读" : "Room-by-room insights, plus AI photo insights"}</li>
        </ul>
      </div>
      <button className="btn primary big" onClick={onDeepen}>{zh ? "继续深度解读 →" : "Deepen My Reading →"}</button>
    </div>
  );

  const checkout = (ids: string[]) => {
    const path = `/cart/${ids.map((id) => `${PRODUCTS[id].variant}:1`).join(",")}`;
    flash(zh ? `演示版：正式上线后将跳转到 Shopify 购物车 ${path}（${ids.length} 件）` : `Demo: in production this opens your Shopify cart at ${path} (${ids.length} items)`);
  };

  return (
    <section className="report">
      <div className="r-hero">
        <p className="eyebrow">{quick ? (zh ? "你的快速解读" : "Your Quick Reading") : (zh ? "你的风水先生家居解读" : "Your LARES Home Reading")}</p>
        <h1>{t(UI.concept)}</h1>
        <div className="r-actions"><button className="link" onClick={onEdit}>{zh ? "修改答案" : "Edit answers"}</button><button className="link" onClick={onRestart}>{t(UI.restart)}</button></div>
      </div>

      <div className="card signature">
        <div className="sig-hex"><HexLines lines={hexLines} /></div>
        <div className="sig-body">
          <div className="sig-label">{zh ? "你家的易经卦象" : "Your Home’s I Ching Signature"}</div>
          <h2>{zh ? `第 ${r.signature.hexNo} 卦 · ${r.signature.hexZh}` : `Hexagram ${r.signature.hexNo} · ${r.signature.hexTitle}`} <span className="kw">{t(r.signature.keyword)}</span></h2>
          <p>{t(r.signature.text)}</p>
          {zh && <p className="judg">卦辞：「{r.signature.judgment}」</p>}
        </div>
      </div>

      {quick ? (
        <div className="card score locked">
          <div className="ring" style={{ ["--p" as string]: "60" }}><div><b>?</b><small>{zh ? "宅气指数" : "Harmony Score"}</small></div></div>
          <div className="score-text">
            <h2>{zh ? "你的宅气指数待解锁" : "Your Harmony Score is ready to unlock"}</h2>
            <p className="hint">{zh ? "宅气指数需要了解你家各个房间的位置与布置。再回答几个简单问题（约 2 分钟）即可查看。" : "Your score depends on where each room sits and how it’s arranged. Answer a few more simple questions (about 2 minutes) to see it."}</p>
            <button className="btn ghost" onClick={onDeepen}>{zh ? "解锁宅气指数" : "Unlock my score"}</button>
          </div>
        </div>
      ) : (
        <div className="card score">
        <div className="ring" style={{ ["--p" as string]: `${r.score}` }}>
          <div><b>{r.score}</b><small>{zh ? "宅气指数" : "Harmony Score"}</small></div>
        </div>
        <div className="score-text">
          <h2>{t(r.grade)}</h2>
          <p className="potential">{zh ? <>完成 <b>{r.opps.length}</b> 项简单调整后，可提升至 <b>{r.potential}</b></> : <>Your potential: <b>{r.potential}</b> after <b>{r.opps.length}</b> simple adjustments</>}</p>
          <div className="bar"><span style={{ width: `${((r.score - 60) / 36) * 100}%` }} /><span className="pot" style={{ left: `${((r.potential - 60) / 36) * 100}%` }} /></div>
          <p className="hint">{zh ? `坐${t(TRIGRAM_L[r.houseTri.key].name)}向${t(DIR_L[r.facing])} · ${t(TRIGRAM_L[r.houseTri.key].name)}宅 · 评分以易经八卦体系为主（75%），结合形峦与流年。` : `${t(TRIGRAM_L[r.houseTri.key].name)} home, facing ${t(DIR_L[r.facing])}. Scored mainly by the I Ching trigram system (75%), plus form and annual energy.`}</p>
        </div>
      </div>

      )}

      {r.edge && <p className="hint warn center">{zh ? "提示：你的朝向读数接近两个方位交界，建议复测，结果可能因此不同。" : "Note: your compass reading sits near a direction boundary — re-measuring may refine your reading."}</p>}

      <h2 className="sec">{zh ? "你家已经做得很好的地方" : "What’s Already Working"}</h2>
      <div className="strengths">
        {(quick ? r.strengths.slice(0, 3) : r.strengths).map((s) => <div key={s.key} className="strength"><span>✦</span><div><b>{t(s.title)}</b><p>{t(s.text)}</p></div></div>)}
      </div>

      <h2 className="sec">{quick ? (zh ? "你家的第一批守护者" : "Your First Guardians") : (zh ? "你家的守护者" : "Your Home’s Guardians")}</h2>
      <p className="sec-sub">{zh ? "每个家都有需要被守护的地方。以下是我们为你找到的位置，以及适合请来的守护者。" : "Every home has places that would love a little care. Here’s where your guardians belong — and who to invite."}</p>
      {r.opps.length === 0 && <p className="hint">{zh ? "你的家已经非常和谐，可以从下方的“重点领域”和年度更新中锦上添花。" : "Your home is already beautifully balanced — see your focus areas and annual update below to add a finishing touch."}</p>}
      {shown.map((o, i) => <OppCard key={o.key} o={o} n={i + 1} cart={cart} toggle={toggle} />)}
      {quick && deepen}
      {!quick && r.opps.length > 5 && <button className="btn ghost center-block" onClick={() => setShowAll(!showAll)}>{showAll ? (zh ? "收起" : "Show less") : (zh ? `查看其余 ${r.opps.length - 5} 项温和调整` : `See ${r.opps.length - 5} more gentle adjustments`)}</button>}

      {!quick && <>
      <h2 className="sec">{zh ? "九宫守护图" : "Your Nine Palaces"}</h2>
      <p className="sec-sub">{zh ? "上北下南。每一宫对应一个生活领域与一位守护者。" : "North at the top. Each palace governs an area of life — and each has its guardian."}</p>
      <div className="palace-sum">
        {zh
          ? <>你家有 <b className="g">{r.palaceCount.thriving}</b> 个当旺位、<b>{r.palaceCount.balanced}</b> 个安和位{r.palaceCount.care > 0 && <>、<b className="c">{r.palaceCount.care}</b> 个守护位。请来 {r.palaceCount.care} 位守护者，九宫即可圆满。</>}{r.palaceCount.care === 0 && "，九宫已然圆满。"}</>
          : <>Your home has <b className="g">{r.palaceCount.thriving}</b> thriving palaces, <b>{r.palaceCount.balanced}</b> steady{r.palaceCount.care > 0 ? <> and <b className="c">{r.palaceCount.care}</b> guardian spot{r.palaceCount.care > 1 ? "s" : ""}. Invite {r.palaceCount.care} guardian{r.palaceCount.care > 1 ? "s" : ""} and all nine palaces are complete.</> : <> — all nine palaces are in harmony.</>}</>}
      </div>
      <div className="palaces">
        {GRID.map((d) => {
          const c = r.cells[d];
          const st = c.status === "thriving" ? l("Thriving", "当旺 · 宜多用") : c.status === "care" ? l("Guardian Spot", "守护位") : l("Steady", "安和");
          const go = () => {
            if (!c.target) return;
            if (c.target.startsWith("opp-")) setShowAll(true);
            setTimeout(() => document.getElementById(c.target!)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
          };
          const Tag = c.status === "care" ? "button" : "div";
          return (
            <Tag key={d} className={`palace ${c.status}`} onClick={c.status === "care" ? go : undefined}>
              <div className="pl-top"><b>{t(DIR_SHORT[d])}</b><span>{c.trigram ? `${c.trigram.symbol} ${t(TRIGRAM_L[c.trigram.key].name)}` : "☯"}</span><em>{t(st)}</em></div>
              <div className="pl-area">{t(c.area)}</div>
              <div className="pl-el">{t(ELEMENT_L[c.element])} · {t(ELEMENT_COLORS_L[c.element])}</div>
              {c.houseLine && <div className={`pl-star ${c.houseLine.ok ? "g" : ""}`}>{t(c.houseLine.text)}</div>}
              {c.personLine && <div className="pl-star g">{t(c.personLine)}</div>}
              {c.status !== "care" && <div className="pl-annual">{r.annual.year} · {t(STAR_L[c.annual].name)}</div>}
              {c.rooms.length > 0 && <div className="pl-rooms">{c.rooms.map((x) => t(ROOM_L[x])).join(" · ")}</div>}
              {c.status === "care" && (
                <div className="pl-guard">
                  <p>{t(c.reason)}</p>
                  {c.guardian && <div className="pl-gp"><span>{c.guardian.icon}</span>{zh ? "此宫守护者：" : "Guardian: "}<b>{t(c.guardian.name)}</b></div>}
                  <span className="pl-more">{zh ? "查看建议 →" : "See how →"}</span>
                </div>
              )}
            </Tag>
          );
        })}
      </div>
      </>}

      {r.focusPlans.length > 0 && <>
        <h2 className="sec">{zh ? "你最关心的方面" : "Your Focus"}</h2>
        {r.focusPlans.map((f) => (
          <div key={f.focus} className="card focus">
            <h3>{t(FOCUS_L[f.focus])} <span className="dirtag">{t(DIR_L[f.dir])}</span></h3>
            <p>{t(f.text)}</p>
            <div className="products">{f.products.slice(0, 2).map((p) => <ProductCard key={p.id} p={p} inCart={cart.has(p.id)} toggle={() => toggle(p.id)} />)}</div>
          </div>
        ))}
      </>}

      <h2 className="sec">{zh ? `${r.annual.year} 年度能量更新` : `${r.annual.year} Annual Energy Update`}</h2>
      <div className="card annual" id="annual">
        <p className="hint">{zh ? `自 ${r.annual.year} 年 2 月 4 日立春起生效 · 丁未火羊年（农历新年 2 月 6 日）` : `Takes effect at Li Chun, Feb 4, ${r.annual.year} · Year of the Fire Goat (Lunar New Year: Feb 6)`}</p>
        <ul>
          <li><b>{t(DIR_L[r.annual.five])} · {t(STAR_L[5].name)}</b> — {t(STAR_L[5].note)}. {zh ? "可放置铜葫芦或六帝钱，避免红色。" : "Place a brass gourd or six emperor coins; skip red décor."}</li>
          <li><b>{t(DIR_L[r.annual.two])} · {t(STAR_L[2].name)}</b> — {t(STAR_L[2].note)}. {zh ? "金属风铃或铜器可温和调和。" : "A metal wind chime or brass piece offers gentle balance."}</li>
          <li><b>{t(DIR_L[r.annual.nine])} · {t(STAR_L[9].name)}</b> — {t(STAR_L[9].note)}.</li>
          <li><b>{t(DIR_L[r.annual.eight])} · {t(STAR_L[8].name)}</b> — {t(STAR_L[8].note)}.</li>
          <li><b>{t(DIR_L[r.annual.four])} · {t(STAR_L[4].name)}</b> — {t(STAR_L[4].note)}.</li>
          <li><b>{t(DIR_L[r.annual.one])} · {t(STAR_L[1].name)}</b> — {t(STAR_L[1].note)}.</li>
        </ul>
        <div className="set-mini">
          <b>{r.annual.year} Guardian Set</b>
          <span>{r.annual.products.map((p) => t(p.name)).join(" + ")}</span>
          <span className="price">{money(r.annual.products.reduce((s, p) => s + p.price, 0))}</span>
          <button className="btn small primary" onClick={() => { setCart((c) => new Set([...c, ...r.annual.products.map((p) => p.id)])); }}>{zh ? "加入购物车" : "Add set"}</button>
        </div>
      </div>

      <h2 className="sec">{zh ? "你的守护者套装" : "Your Guardian Set"}</h2>
      <div className="card gset">
        <p className="sec-sub">{zh ? "根据你家的解读，为最需要守护的位置挑选的一套摆件。" : "A curated set for the places in your home that would love a guardian most."}</p>
        <ul className="gset-list">
          {r.guardianSet.map((p) => <li key={p.id}><span className="p-ic">{p.icon}</span><span>{t(p.name)}<small>{t(p.guards)}</small></span><span className="price">{money(p.price)}</span></li>)}
        </ul>
        <div className="gset-foot">
          <div><b>{money(setTotal)}</b><small>{t(SHIPPING.eta)}</small><small className="cny">🧧 {t(SHIPPING.cny)}</small></div>
          <button className="btn primary big" onClick={() => checkout(r.guardianSet.map((p) => p.id))}>{zh ? "一键配齐守护者" : "Bring Your Guardians Home"}</button>
        </div>
      </div>

      {r.people.length > 0 && <>
        <h2 className="sec">{zh ? "家人的个人吉方" : "Personal Directions"}</h2>
        <div className="card kua">
          <table>
            <thead><tr><th>{zh ? "家人" : "Person"}</th><th>Kua</th><th>{t(YOUNIAN_L.shengqi.good)}</th><th>{t(YOUNIAN_L.tianyi.good)}</th><th>{t(YOUNIAN_L.yannian.good)}</th><th>{t(YOUNIAN_L.fuwei.good)}</th></tr></thead>
            <tbody>
              {r.people.map((pp) => {
                const f = (k: "shengqi" | "tianyi" | "yannian" | "fuwei") => t(DIR_L[(Object.keys(pp.map) as (keyof typeof pp.map)[]).find((d) => pp.map[d].key === k)!]);
                return <tr key={pp.idx}><td>{pp.idx + 1} · {pp.year}</td><td>{pp.kua} {pp.trigram.symbol} {t(TRIGRAM_L[pp.trigram.key].name)}</td><td>{f("shengqi")}</td><td>{f("tianyi")}</td><td>{f("yannian")}</td><td>{f("fuwei")}</td></tr>;
              })}
            </tbody>
          </table>
          <p className="hint">{zh ? "床头、书桌、沙发的朝向尽量选择这些方位。" : "Point headboards and face desks and sofas toward these directions when you can."}</p>
        </div>
      </>}

      {quick ? deepen : <PhotoInsights reading={r} form={form} />}

      <div className="card blessing">
        <div className="sig-label">{zh ? "给你的祝福" : "A Blessing for You"}</div>
        <p>{t(r.blessing)}</p>
        <p className="sign">— {zh ? "风水先生" : "LARES"}</p>
      </div>

      <EmailCapture />
      <Feedback />

      {cart.size > 0 && (
        <div className="cartbar">
          <span>🛒 {cart.size} · {money(cartTotal)}</span>
          <button className="btn small primary" onClick={() => checkout([...cart])}>{zh ? "去结算" : "Checkout"}</button>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </section>
  );
}

function PhotoInsights({ reading: r, form }: { reading: Reading; form: Form }) {
  const { lang } = useT();
  const zh = lang === "zh";
  const photos = form.rooms.filter((x) => x.photo);
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const abort = useRef<AbortController | null>(null);
  const html = useMemo(() => marked.parse(text, { async: false }) as string, [text]);

  const run = async () => {
    abort.current?.abort();
    const ctl = new AbortController(); abort.current = ctl;
    setText(""); setErr(""); setState("loading");
    const ctx = [
      `Home: ${form.homeType}, facing ${r.facing}, sitting ${r.sit} (${TRIGRAM_L[r.houseTri.key].name.en} home), front door ${r.door}.`,
      `Rooms: ${form.rooms.map((x) => `${ROOM_L[x.type].en} (${x.dir || "?"})`).join("; ")}.`,
      `Photos (in order): ${photos.map((x, i) => `#${i + 1} ${ROOM_L[x.type].en} in ${x.dir}`).join("; ") || "none"}.`,
      `Questionnaire answers: ${Object.entries(form.answers).map(([k, v]) => `${k}=${v}`).join(", ")}.`,
      `Strengths already found: ${r.strengths.map((s) => s.title.en).join("; ")}.`,
      `Adjustments already suggested: ${r.opps.map((o) => o.title.en).join("; ")}.`,
      `Focus: ${form.focus.join(", ")}.`,
    ].join("\n");
    try {
      const res = await fetch("/api/insights", {
        method: "POST", headers: { "content-type": "application/json" }, signal: ctl.signal,
        body: JSON.stringify({ lang, code, context: ctx, images: photos.map((x) => x.photo!.split(",")[1]) }),
      });
      if (!res.ok || !res.body) { let m = `HTTP ${res.status}`; try { m = (await res.json()).error ?? m; } catch { /* */ } throw new Error(m); }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += value;
        const lines = buf.split("\n"); buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          try {
            const j = JSON.parse(line.slice(5));
            if (j.type === "content_block_delta" && j.delta?.type === "text_delta") setText((s) => s + j.delta.text);
            else if (j.choices?.[0]?.delta?.content) setText((s) => s + j.choices[0].delta.content);
          } catch { /* partial */ }
        }
      }
      setState("done");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setErr((e as Error).message); setState("error");
    }
  };

  return (
    <div className="card ai">
      <div className="sig-label">{zh ? "AI 照片解读" : "AI Photo Insights"}</div>
      <p className="hint">{photos.length
        ? (zh ? `我们将结合你上传的 ${photos.length} 张照片，补充问卷之外的观察。演示版需要输入访问码。` : `We’ll look at your ${photos.length} photo(s) for details the questions may have missed. The demo requires an access code.`)
        : (zh ? "你没有上传照片——AI 将根据你的回答写一段个性化解读。演示版需要输入访问码。" : "No photos uploaded — the AI will write a personalized note from your answers. The demo requires an access code.")}</p>
      {state !== "loading" && (
        <div className="row">
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder={zh ? "访问码" : "Access code"} aria-label="access code" />
          <button className="btn primary" onClick={run} disabled={!code}>{zh ? "生成 AI 解读" : "Get AI insights"}</button>
        </div>
      )}
      {state === "loading" && !text && <p className="hint"><span className="spinner" /> {zh ? "正在观察你的家……约 20–40 秒" : "Looking at your home… about 20–40 seconds"}</p>}
      {text && <div className="md" dangerouslySetInnerHTML={{ __html: html }} />}
      {state === "error" && <p className="hint warn">{err}</p>}
      {text && <p className="hint">{zh ? "由 AI 辅助生成的个性化内容。" : "Personalized with AI assistance."}</p>}
    </div>
  );
}

function EmailCapture() {
  const { lang } = useT();
  const zh = lang === "zh";
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [consent, setConsent] = useState(false);
  return (
    <div className="card email">
      <h3>{zh ? "把完整报告发到你的邮箱" : "Get your full reading by email"}</h3>
      <p className="hint">{zh ? "包含可打印的 PDF 报告，以及首单 10% 优惠码。" : "Includes a printable PDF of your reading and 10% off your first order."}</p>
      {ok ? <p className="okmsg">{zh ? "谢谢！（演示版不会真正发送邮件。）" : "Thank you! (Demo — no email is actually sent.)"}</p> : (
        <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@") && consent) setOk(true); }}>
          <div className="row"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="email" /><button className="btn primary" disabled={!consent}>{zh ? "发送" : "Send it"}</button></div>
          <label className="check small"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />{zh ? "我同意接收风水先生（LARES）的邮件，可随时退订。" : "Yes, email me my reading and occasional feng shui tips from LARES. Unsubscribe anytime."}</label>
        </form>
      )}
    </div>
  );
}

function Feedback() {
  const { lang } = useT();
  const zh = lang === "zh";
  const [v, setV] = useState<"" | "up" | "down">("");
  return (
    <div className="feedback">
      {v ? <span>{zh ? "感谢你的反馈！" : "Thanks for your feedback!"}</span> : <>
        <span>{zh ? "这份解读对你有帮助吗？" : "Was this reading helpful?"}</span>
        <button className="icon" aria-label="yes" onClick={() => setV("up")}>👍</button>
        <button className="icon" aria-label="no" onClick={() => setV("down")}>👎</button>
      </>}
    </div>
  );
}
