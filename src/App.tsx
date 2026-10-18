import { useEffect, useState } from "react";
import { LangCtx, Logo } from "./ui";
import { UI, type Lang } from "./data/i18n";
import Wizard, { QuickStart, emptyForm } from "./components/Wizard";
import Report from "./components/Report";
import { buildReading, type Form } from "./engine/reading";

const FORM_KEY = "lares-form";
const LANG_KEY = "lares-lang";

function initialLang(): Lang {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "zh" || q === "en") return q;
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "zh" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}
function initialForm(): Form {
  try {
    const f = JSON.parse(localStorage.getItem(FORM_KEY) || "null");
    if (f) return { ...emptyForm(), ...f, rooms: (f.rooms ?? []).map((r: Form["rooms"][number]) => ({ ...r, photo: undefined })) };
  } catch { /* ignore */ }
  return emptyForm();
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [stage, setStage] = useState<"landing" | "quick" | "quickReport" | "deep" | "report">("landing");
  const [form, setForm] = useState<Form>(initialForm);
  const t = (x: { en: string; zh: string }) => x[lang];

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? "风水先生 LARES · 免费家居风水解读" : "LARES — Classical Feng Shui for Modern Homes";
  }, [lang]);
  useEffect(() => {
    localStorage.setItem(FORM_KEY, JSON.stringify({ ...form, rooms: form.rooms.map((r) => ({ ...r, photo: undefined })) }));
  }, [form]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [stage]);

  return (
    <LangCtx.Provider value={lang}>
      <div className={`app lang-${lang}`}>
        <header className="top">
          <button className="brand" onClick={() => setStage("landing")} aria-label="LARES home">
            <Logo />
            <span className="brand-text">
              <b>LARES</b>
              <small>{lang === "zh" ? "风水先生 · 传统罗盘风水" : "Classical Feng Shui for Modern Homes"}</small>
            </span>
          </button>
          <div className="lang-switch" role="group" aria-label="Language">
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")}>中</button>
          </div>
        </header>
        <div className="demo-bar">{t(UI.demo)}</div>

        <main>
          {stage === "landing" && (
            <section className="hero">
              <p className="eyebrow">{lang === "zh" ? "免费 · 个性化 · 源自《易经》" : "Free · Personalized · Rooted in the I Ching"}</p>
              <h1>{t(UI.concept)}</h1>
              <p className="hero-sub">{t(UI.heroSub)}</p>
              <button className="btn primary big" onClick={() => setStage("quick")}>{t(UI.start)}</button>
              <ul className="hero-points">{UI.heroPoints.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>
              <div className="story">
                <h2>{lang === "zh" ? "每个家，都有它的守护者" : "Every home has its guardians"}</h2>
                {lang === "zh" ? (
                  <>
                    <p>在古罗马，家家户户都会在灶火旁设一座小小的神龛，供奉 <i>Lares</i>——守护家宅的神灵。在世界的另一端，中国的先贤用源自《易经》的风水，思考人如何与庇护自己的空间和谐相处。</p>
                    <p>两种古老的文化，一个共同的信念：<b>家不只是四面墙，它需要被用心照料，也会用安稳与温暖回馈你。</b></p>
                  </>
                ) : (
                  <>
                    <p>In ancient Rome, every household kept a small shrine near the hearth for the <i>Lares</i> — the guardian spirits of the home. Half a world away, Chinese sages turned to the I Ching and the art of feng shui to ask how we might live in harmony with the spaces that shelter us.</p>
                    <p>Two ancient cultures, one shared belief: <b>a home is more than walls. It is something to be cared for — and something that cares for you in return.</b></p>
                  </>
                )}
              </div>
            </section>
          )}
          {stage === "quick" && <QuickStart form={form} setForm={setForm} onDone={() => setStage("quickReport")} />}
          {stage === "deep" && <Wizard form={form} setForm={setForm} onDone={() => setStage("report")} onExit={() => setStage("quickReport")} />}
          {(stage === "quickReport" || stage === "report") && (
            <Report reading={buildReading(form)} form={form} quick={stage === "quickReport"}
              onRestart={() => { setForm(emptyForm()); setStage("quick"); }}
              onEdit={() => setStage(stage === "quickReport" ? "quick" : "deep")}
              onDeepen={() => setStage("deep")} />
          )}
        </main>

        <footer>
          <p>{t(UI.disclaimer)}</p>
          <p className="muted">© LARES · {lang === "zh" ? "风水先生" : "Every home has its guardians."}</p>
        </footer>
      </div>
    </LangCtx.Provider>
  );
}
