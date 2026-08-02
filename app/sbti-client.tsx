"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { characterRegistryByCode, type CharacterRecord } from "../lib/characters";
import {
  answersForType,
  dimensionLabels,
  dimensions,
  localeMeta,
  locales,
  personalityTypes,
  questions,
  responseOptions,
  scoreAnswers,
  siteCopy,
  type Locale,
  type PersonalityType,
  type TestResult,
} from "../lib/sbti";

type View = "home" | "test" | "result";
type PosterLayout = "story" | "portrait" | "square";

const groupColors = {
  Self: "#6366f1",
  Emotional: "#e11d48",
  Attitude: "#f59e0b",
  Action: "#159a62",
  Social: "#0ea5e9",
};

export default function SBTIApp({ initialLocale }: { initialLocale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [view, setView] = useState<View>("home");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [safeMode, setSafeMode] = useState(true);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [posterLayout, setPosterLayout] = useState<PosterLayout>("story");
  const [posterStyle, setPosterStyle] = useState("sunrise");
  const [username, setUsername] = useState("");
  const [toast, setToast] = useState("");
  const posterCanvas = useRef<HTMLCanvasElement>(null);
  const copy = siteCopy[locale];
  const dir = localeMeta[locale].dir;
  const result = useMemo(() => scoreAnswers(answers), [answers]);
  const complete = questions.every((question) => answers[question.id]);

  useEffect(() => {
    const stored = localStorage.getItem("sbti-session");
    if (stored) {
      try {
        const session = JSON.parse(stored) as { answers: Record<string, number>; index: number };
        setAnswers(session.answers ?? {});
        setIndex(session.index ?? 0);
      } catch {
        localStorage.removeItem("sbti-session");
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem("sbti-locale", locale);
    window.history.replaceState(null, "", `/${locale}`);
  }, [dir, locale]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("sbti-session", JSON.stringify({ answers, index }));
  }, [answers, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (view !== "test") return;
      const numeric = Number(event.key);
      if (numeric >= 1 && numeric <= 7) answerCurrent(numeric);
      if (event.key === "ArrowRight") dir === "rtl" ? previousQuestion() : nextQuestion();
      if (event.key === "ArrowLeft") dir === "rtl" ? nextQuestion() : previousQuestion();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const filteredTypes = personalityTypes.filter((type) => {
    const text = `${type.code} ${type.safeCode} ${type.titles[locale]}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (group === "All" || type.group === group);
  });

  function displayCode(type: PersonalityType) {
    return safeMode ? type.safeCode : type.code;
  }

  function startTest(resume = false) {
    if (!resume) {
      setAnswers({});
      setIndex(0);
    }
    setView("test");
  }

  function answerCurrent(value: number) {
    setAnswers((current) => ({ ...current, [questions[index].id]: value }));
  }

  function nextQuestion() {
    if (index < questions.length - 1) setIndex((value) => value + 1);
    else setView("result");
  }

  function previousQuestion() {
    setIndex((value) => Math.max(0, value - 1));
  }

  function jumpToResult(type: PersonalityType) {
    setAnswers(answersForType(type));
    setView("result");
    setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 40);
  }

  async function shareResult() {
    const caption = result.type.socialCaption[locale];
    if (navigator.share) await navigator.share({ title: copy.result, text: caption, url: window.location.href });
    else {
      await navigator.clipboard.writeText(caption);
      flash("Caption copied");
    }
  }

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function downloadPoster() {
    const canvas = posterCanvas.current;
    if (!canvas) return;
    await renderPoster(canvas, result, locale, displayCode(result.type), posterLayout, posterStyle, username);
    const link = document.createElement("a");
    link.download = `sbti-${displayCode(result.type).toLowerCase()}-${posterLayout}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    flash("Poster downloaded");
  }

  return (
    <main className="app-shell" dir={dir}>
      <header className="nav">
        <a className="brand" href="#top" aria-label="MischiefType home">
          <span className="logo-mark" aria-hidden="true">M</span>
          <span>MischiefType</span>
        </a>
        <nav aria-label="Primary navigation">
          {copy.nav.map((item, itemIndex) => (
            <a key={item} href={["#test", "#types", "#compare", "#about"][itemIndex]}>{item}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <select aria-label="Language" value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
            {locales.map((item) => <option key={item} value={item}>{localeMeta[item].label}</option>)}
          </select>
          <button className="icon-button" aria-label="Toggle theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "☾" : "☼"}</button>
          <button className="primary small" onClick={() => startTest()}>{copy.start}</button>
        </div>
      </header>

      {view === "home" && (
        <>
          <section className="hero" id="top">
            <div className="hero-copy">
              <p className="eyebrow">{copy.slogan}</p>
              <h1>{copy.heroTitle}</h1>
              <p>{copy.heroBody}</p>
              <div className="hero-actions">
                <button className="primary" onClick={() => startTest()}>{copy.start}</button>
                <a className="secondary" href="#types">{copy.explore}</a>
              </div>
              <span className="note">{copy.note}</span>
            </div>
            <div className="character-cloud" aria-label="Original personality character preview">
              {personalityTypes.slice(0, 9).map((type, cloudIndex) => (
                <Mascot key={type.code} type={type} code={displayCode(type)} locale={locale} cloudIndex={cloudIndex} />
              ))}
            </div>
          </section>

          <section className="proof" aria-label="Product facts">
            {["27 types", "15 dimensions", "30+ questions", "One brutally honest result"].map((fact) => <strong key={fact}>{fact}</strong>)}
          </section>

          <section className="section" id="types">
            <div className="section-heading">
              <p className="eyebrow">Personality gallery</p>
              <h2>All 27 original SBTI characters</h2>
              <label className="switch"><input type="checkbox" checked={safeMode} onChange={(event) => setSafeMode(event.target.checked)} /> Safe wording</label>
            </div>
            <div className="filters">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} />
              <select value={group} onChange={(event) => setGroup(event.target.value)} aria-label="Group filter">
                <option value="All">{copy.allGroups}</option>
                {Object.keys(groupColors).map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="type-grid">
              {filteredTypes.map((type) => (
                <button className="type-card" key={type.code} onClick={() => jumpToResult(type)} style={{ "--accent": groupColors[type.group] } as React.CSSProperties}>
                  <Mascot type={type} code={displayCode(type)} locale={locale} />
                  <span className="type-code" dir="ltr">{displayCode(type)}</span>
                  <strong>{type.titles[locale]}</strong>
                  <small>{type.short[locale]}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="section split" id="test">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Answer, discover, share.</h2>
              <div className="steps">
                {["Answer one clean question per screen.", "Discover a 15-dimension result.", "Download a poster built for stories."].map((step, stepIndex) => <p key={step}><b>{stepIndex + 1}</b>{step}</p>)}
              </div>
            </div>
            <PosterPreview result={result} locale={locale} code={displayCode(result.type)} layout={posterLayout} styleName={posterStyle} />
          </section>

          <section className="section feature-grid" id="compare">
            {["Three languages", "Instant result", "Detailed dimensions", "Shareable poster", "Friend comparison", "Private by default"].map((feature) => <article key={feature}><h3>{feature}</h3><p>{copy.disclaimer}</p></article>)}
          </section>

          <section className="section" id="about">
            <h2>FAQ</h2>
            <details open><summary>Is this scientific?</summary><p>{copy.disclaimer}</p></details>
            <details><summary>Can I use Kurdish or Arabic?</summary><p>Yes. Layout, navigation flow, progress direction, punctuation, and result posters respond to RTL languages.</p></details>
            <details><summary>Where is my data stored?</summary><p>The prototype stores progress locally on your device. Anonymous aggregate analytics are documented for the production version.</p></details>
          </section>
        </>
      )}

      {view === "test" && (
        <section className="test-shell" aria-labelledby="question-title">
          <div className="test-top">
            <button className="secondary" onClick={() => setView("home")}>×</button>
            <div className="progress"><span style={{ inlineSize: `${((index + 1) / questions.length) * 100}%` }} /></div>
            <span>{index + 1}/{questions.length}</span>
          </div>
          <article className="question-card">
            <p className="eyebrow">{dimensionLabels[questions[index].dimension][locale]}</p>
            <h1 id="question-title">{questions[index].text[locale]}</h1>
            <div className="scale" role="radiogroup" aria-label="Response scale">
              {responseOptions.map((option) => (
                <button
                  key={option.value}
                  className={answers[questions[index].id] === option.value ? "selected" : ""}
                  role="radio"
                  aria-checked={answers[questions[index].id] === option.value}
                  onClick={() => answerCurrent(option.value)}
                >
                  <b>{option.value}</b>
                  <span>{option[locale]}</span>
                </button>
              ))}
            </div>
            <div className="test-controls">
              <button className="secondary" disabled={index === 0} onClick={previousQuestion}>{copy.previous}</button>
              <button className="primary" disabled={!answers[questions[index].id]} onClick={nextQuestion}>{index === questions.length - 1 ? copy.result : copy.next}</button>
            </div>
          </article>
        </section>
      )}

      {view === "result" && (
        <ResultView
          result={result}
          locale={locale}
          code={displayCode(result.type)}
          copy={copy}
          onRetake={() => startTest(false)}
          onShare={shareResult}
          onDownload={downloadPoster}
          posterLayout={posterLayout}
          setPosterLayout={setPosterLayout}
          posterStyle={posterStyle}
          setPosterStyle={setPosterStyle}
          username={username}
          setUsername={setUsername}
        />
      )}

      {Object.keys(answers).length > 0 && !complete && view === "home" && <button className="resume" onClick={() => startTest(true)}>{copy.resume}</button>}
      <canvas ref={posterCanvas} className="hidden-canvas" width={1080} height={1920} aria-hidden="true" />
      {toast && <div className="toast" role="status">{toast}</div>}
      <footer>
        <b>MischiefType</b>
        <span>{copy.disclaimer}</span>
        <a>Privacy</a><a>Terms</a><a>Contact</a>
      </footer>
    </main>
  );
}

function Mascot({ type, code, locale, cloudIndex = 0 }: { type: PersonalityType; code: string; locale: Locale; cloudIndex?: number }) {
  const character = characterRegistryByCode[type.code];
  return (
    <span
      className="mascot"
      aria-label={character.alt[locale]}
      style={{ "--accent": type.characterAsset.accent, "--delay": `${cloudIndex * 80}ms`, "--character-bg": character.backgroundColor } as React.CSSProperties}
    >
      <img
        className="mascot-img"
        src={character.imageCard}
        alt={character.alt[locale]}
        width={character.width}
        height={character.height}
        loading={cloudIndex > 2 ? "lazy" : "eager"}
      />
      <b dir="ltr">{code}</b>
    </span>
  );
}

function PosterPreview({ result, locale, code, layout, styleName }: { result: TestResult; locale: Locale; code: string; layout: PosterLayout; styleName: string }) {
  return (
    <div className={`poster-preview ${layout} ${styleName}`}>
      <span className="poster-brand">MischiefType</span>
      <p>My SBTI type is</p>
      <img
        className="poster-character"
        src={characterRegistryByCode[result.type.code].imagePoster}
        alt={characterRegistryByCode[result.type.code].alt[locale]}
        width={characterRegistryByCode[result.type.code].width}
        height={characterRegistryByCode[result.type.code].height}
      />
      <h3 dir="ltr">{code}</h3>
      <strong>{result.type.titles[locale]}</strong>
      <small>{result.type.quote[locale]}</small>
    </div>
  );
}

function ResultView(props: {
  result: TestResult;
  locale: Locale;
  code: string;
  copy: typeof siteCopy[Locale];
  onRetake: () => void;
  onShare: () => void;
  onDownload: () => void;
  posterLayout: PosterLayout;
  setPosterLayout: (layout: PosterLayout) => void;
  posterStyle: string;
  setPosterStyle: (style: string) => void;
  username: string;
  setUsername: (name: string) => void;
}) {
  const { result, locale, code, copy } = props;
  const type = result.type;
  return (
    <section className="result-shell" id="result">
      <div className="result-hero">
        <Mascot type={type} code={code} locale={locale} />
        <div>
          <p className="eyebrow">{copy.result}</p>
          <h1><bdi>{code}</bdi> {type.titles[locale]}</h1>
          <h2>{type.hook[locale]}</h2>
          <p>{type.long?.[locale] ?? type.short[locale]}</p>
          <div className="hero-actions">
            <button className="primary" onClick={props.onShare}>{copy.share}</button>
            <button className="secondary" onClick={props.onDownload}>{copy.poster}</button>
            <button className="secondary" onClick={props.onRetake}>{copy.retake}</button>
          </div>
        </div>
      </div>

      <div className="result-grid">
        <section>
          <h2>This is you when...</h2>
          <p>{type.short[locale]}</p>
          <h3>Strengths</h3>
          <ChipList items={type.strengths[locale]} />
          <h3>Blind spots</h3>
          <ChipList items={type.struggles[locale]} />
          <h3>Advice that is actually useful</h3>
          <p>{type.seriousInsight[locale]}</p>
          <h3>Funny roast</h3>
          <p>{type.quote[locale]}</p>
        </section>
        <section>
          <h2>15-dimension chart</h2>
          <div className="chart">
            {dimensions.map((dimension) => (
              <p key={dimension}>
                <span>{dimensionLabels[dimension][locale]}</span>
                <i><b style={{ inlineSize: `${result.scores[dimension]}%` }} /></i>
                <em>{result.scores[dimension]}</em>
              </p>
            ))}
          </div>
          <h3>Best matches</h3>
          <p>{type.compatibility.best.join(" · ")}</p>
          <h3>Most challenging</h3>
          <p>{type.compatibility.challenging.join(" · ")}</p>
          <small>Related MBTI comparisons are entertainment shorthand, not scientific equivalence.</small>
        </section>
        <section className="poster-lab">
          <h2>Poster generator</h2>
          <PosterPreview result={result} locale={locale} code={code} layout={props.posterLayout} styleName={props.posterStyle} />
          <div className="poster-controls">
            <select value={props.posterLayout} onChange={(event) => props.setPosterLayout(event.target.value as PosterLayout)} aria-label="Poster layout">
              <option value="story">1080x1920 Story</option>
              <option value="portrait">1080x1350 Portrait</option>
              <option value="square">1080x1080 Square</option>
            </select>
            <select value={props.posterStyle} onChange={(event) => props.setPosterStyle(event.target.value)} aria-label="Poster background">
              <option value="sunrise">Warm glow</option>
              <option value="mint">Mint signal</option>
              <option value="ink">Dark mode</option>
            </select>
            <input value={props.username} onChange={(event) => props.setUsername(event.target.value)} placeholder="@username optional" />
          </div>
        </section>
      </div>
    </section>
  );
}

function ChipList({ items }: { items: string[] }) {
  return <div className="chips">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

async function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function renderPoster(canvas: HTMLCanvasElement, result: TestResult, locale: Locale, code: string, layout: PosterLayout, styleName: string, username: string) {
  const sizes = { story: [1080, 1920], portrait: [1080, 1350], square: [1080, 1080] } as const;
  const [width, height] = sizes[layout];
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rtl = localeMeta[locale].dir === "rtl";
  ctx.fillStyle = styleName === "ink" ? "#111716" : styleName === "mint" ? "#dff5e9" : "#fff7ed";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = result.type.characterAsset.accent;
  ctx.beginPath();
  ctx.arc(width * 0.72, height * 0.23, width * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = styleName === "ink" ? "#f9faf7" : "#17211d";
  ctx.textAlign = rtl ? "right" : "left";
  ctx.direction = rtl ? "rtl" : "ltr";
  const x = rtl ? width - 96 : 96;
  ctx.font = "700 46px Arial";
  ctx.fillText("MischiefType", x, 110);
  ctx.font = "500 58px Arial";
  ctx.fillText(result.type.posterCaption[locale], x, height * 0.2);
  ctx.font = "900 160px Arial";
  ctx.direction = "ltr";
  ctx.textAlign = "center";
  ctx.fillText(code, width / 2, height * 0.42);
  const character = characterRegistryByCode[result.type.code] as CharacterRecord;
  try {
    const image = await loadCanvasImage(character.imagePoster);
    const imageSize = Math.min(width * 0.58, height * 0.28);
    ctx.drawImage(image, (width - imageSize) / 2, height * 0.43, imageSize, imageSize);
  } catch {
    ctx.fillStyle = character.backgroundColor;
    ctx.fillRect(width * 0.24, height * 0.45, width * 0.52, height * 0.16);
  }
  ctx.fillStyle = result.type.characterAsset.accent;
  ctx.fillRect(width * 0.22, height * 0.62, width * 0.56, height * 0.026);
  ctx.fillStyle = styleName === "ink" ? "#f9faf7" : "#17211d";
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.font = "700 64px Arial";
  ctx.fillText(result.type.titles[locale], width / 2, height * 0.69);
  ctx.font = "32px Arial";
  result.topTraits.forEach((trait, index) => ctx.fillText(dimensionLabels[trait][locale], width / 2, height * (0.76 + index * 0.045)));
  ctx.font = "28px Arial";
  if (username) ctx.fillText(username, width / 2, height - 145);
  ctx.fillText(siteCopy[locale].disclaimer, width / 2, height - 78, width - 120);
}
