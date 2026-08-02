const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "public", "characters");

const specs = [
  ["CTRL", "#f1c8a4", "#2f3436", "#d8b085", "#111", "ctrl"],
  ["ATM-er", "#f1c8a4", "#2f3436", "#76b85a", "#111", "money"],
  ["Dior-s", "#f1c8a4", "#2f3436", "#f3cfb5", "#111", "recline"],
  ["BOSS", "#f1c8a4", "#2f3436", "#f7c948", "#111", "crown"],
  ["THAN-K", "#f1c8a4", "#2f3436", "#76b85a", "#111", "prayer"],
  ["OH-NO", "#f1c8a4", "#2f3436", "#f7c8a7", "#111", "worry"],
  ["GOGO", "#efc0a0", "#e7b08f", "#efc0a0", "#111", "run"],
  ["SEXY", "#f1c8a4", "#2f3436", "#f4c43f", "#111", "pose"],
  ["LOVE-R", "#f1c8a4", "#2f3436", "#d92345", "#111", "heart"],
  ["MUM", "#f1c8a4", "#2f3436", "#4a9b55", "#111", "mum"],
  ["FAKE", "#c8e5bc", "#2f3436", "#4f9b49", "#111", "longface"],
  ["OJBK", "#f0c2a2", "#d7ad8e", "#f0c2a2", "#111", "shrug"],
  ["MALO", "#d18845", "#7d4a22", "#f4c43f", "#111", "monkey"],
  ["JOKE-R", "#f3e6d8", "#2f3436", "#e04343", "#111", "clown"],
  ["WOC!", "#f1c8a4", "#2f3436", "#77bfe8", "#111", "shock"],
  ["THIN-K", "#f1c8a4", "#2f3436", "#d8b085", "#111", "think"],
  ["SHIT", "#f1c8a4", "#2f3436", "#2f3436", "#111", "formal"],
  ["ZZZZ", "#f1c8a4", "#2f3436", "#9bc878", "#111", "sleep"],
  ["POOR", "#f1c8a4", "#7a6a52", "#3f7f48", "#111", "work"],
  ["MONK", "#f1c8a4", "#7a6a52", "#d88422", "#111", "monk"],
  ["IMSB", "#f1c8a4", "#a78b5e", "#f4dec2", "#111", "doubt"],
  ["SOLO", "#f1c8a4", "#2f3436", "#111111", "#111", "solo"],
  ["FUCK", "#d5bb91", "#2f3436", "#78aa44", "#111", "grass"],
  ["DEAD", "#e5c3a7", "#2f3436", "#0e1113", "#111", "coffin"],
  ["IMFW", "#f1c8a4", "#2f3436", "#4f9b49", "#111", "fragile"],
  ["HHHH", "#f1c8a4", "#2f3436", "#efb48f", "#111", "laugh"],
  ["DRUNK", "#f1c8a4", "#2f3436", "#e8d1b6", "#111", "bottle"],
];

function poly(points, fill, extra = "") {
  return `<polygon points="${points}" fill="${fill}" ${extra}/>`;
}

function face(x = 420, y = 255, scale = 1, skin = "#f1c8a4", hair = "#2f3436", mood = "neutral") {
  const w = 185 * scale;
  const h = 175 * scale;
  const eyeY = y + h * 0.48;
  const mouth = mood === "laugh"
    ? `<path d="M${x + w * .32} ${y + h * .67} Q${x + w * .5} ${y + h * .88} ${x + w * .72} ${y + h * .67}" fill="none" stroke="#8d2f2f" stroke-width="${12 * scale}" stroke-linecap="round"/>`
    : mood === "shock"
      ? `<ellipse cx="${x + w * .55}" cy="${y + h * .7}" rx="${18 * scale}" ry="${34 * scale}" fill="#8d2f2f"/>`
      : mood === "sad"
        ? `<path d="M${x + w * .34} ${y + h * .72} Q${x + w * .52} ${y + h * .61} ${x + w * .72} ${y + h * .73}" fill="none" stroke="#8d2f2f" stroke-width="${8 * scale}" stroke-linecap="round"/>`
        : `<path d="M${x + w * .37} ${y + h * .70} Q${x + w * .52} ${y + h * .77} ${x + w * .68} ${y + h * .70}" fill="none" stroke="#8d2f2f" stroke-width="${7 * scale}" stroke-linecap="round"/>`;
  return `
    ${poly(`${x + 25 * scale},${y + 15 * scale} ${x + w * .55},${y} ${x + w},${y + 50 * scale} ${x + w * .9},${y + h} ${x + 35 * scale},${y + h * .95} ${x},${y + 70 * scale}`, skin)}
    ${poly(`${x},${y + 55 * scale} ${x + 45 * scale},${y} ${x + w * .55},${y} ${x + w},${y + 52 * scale} ${x + w * .77},${y + 78 * scale} ${x + w * .58},${y + 48 * scale} ${x + 30 * scale},${y + 86 * scale}`, hair, `opacity=".96"`)}
    <circle cx="${x + w * .34}" cy="${eyeY}" r="${7 * scale}" fill="#1b1f1d"/>
    <circle cx="${x + w * .68}" cy="${eyeY + 4 * scale}" r="${7 * scale}" fill="#1b1f1d"/>
    <path d="M${x + w * .51} ${eyeY + 8 * scale} L${x + w * .46} ${eyeY + 40 * scale} L${x + w * .57} ${eyeY + 39 * scale}" fill="none" stroke="#8b654b" stroke-width="${5 * scale}" stroke-linejoin="round"/>
    ${mouth}`;
}

function body(x = 400, y = 430, fill = "#76b85a") {
  return `${poly(`${x + 45},${y} ${x + 168},${y + 8} ${x + 215},${y + 210} ${x + 3},${y + 220}`, fill)}
    <path d="M${x + 78} ${y + 220} L${x + 58} ${y + 360}" stroke="#5e4334" stroke-width="28" stroke-linecap="round"/>
    <path d="M${x + 145} ${y + 218} L${x + 170} ${y + 360}" stroke="#5e4334" stroke-width="28" stroke-linecap="round"/>`;
}

function drawing([code, skin, hair, outfit, ink, kind]) {
  const darkPanel = kind === "recline" || kind === "coffin";
  let bg = darkPanel ? `<rect x="90" y="165" width="780" height="560" rx="28" fill="#111"/>` : "";
  let mood = ["worry", "shock"].includes(kind) ? (kind === "shock" ? "shock" : "sad") : kind === "laugh" ? "laugh" : "neutral";
  let art = "";
  if (kind === "coffin") {
    art = `<rect x="175" y="300" width="610" height="330" rx="24" fill="#0c1012"/><rect x="215" y="345" width="530" height="210" rx="28" fill="#20272b"/>${face(430, 360, .75, skin, hair, "sad")}<path d="M335 505 L655 430" stroke="#64717a" stroke-width="46" stroke-linecap="round"/>`;
  } else if (kind === "sleep") {
    art = `<rect x="170" y="350" width="535" height="255" rx="46" fill="${outfit}"/><path d="M235 455 C330 390 470 390 595 475" fill="${outfit}"/>${face(445, 405, .68, skin, hair, "neutral")}<text x="650" y="320" font-size="82" font-family="Arial" font-weight="900" fill="#77a855">Z</text>`;
  } else if (kind === "recline") {
    art = `<g transform="translate(80 40) rotate(-8 480 480)">${face(455, 305, .82, skin, hair, "sad")}<path d="M330 520 C470 460 585 505 720 575" stroke="${skin}" stroke-width="58" stroke-linecap="round"/><path d="M295 555 L565 635" stroke="${outfit}" stroke-width="72" stroke-linecap="round"/><path d="M265 512 L345 447" stroke="${skin}" stroke-width="38" stroke-linecap="round"/></g>`;
  } else {
    art = `${face(kind === "think" ? 390 : 400, kind === "grass" ? 300 : 230, kind === "think" ? 1.22 : kind === "longface" ? 1.12 : 1, skin, hair, mood)}${kind === "grass" ? `<g>${Array.from({length:18},(_,i)=>`<path d="M${330+i*18} 300 L${315+i*19} ${170+(i%4)*18}" stroke="#5c8f37" stroke-width="10" stroke-linecap="round"/>`).join("")}</g>` : ""}${body(395, 410, outfit)}`;
  }
  const extras = {
    crown: `<path d="M380 218 L425 150 L470 220 L520 150 L565 218 Z" fill="#f4c430" stroke="#b98d17" stroke-width="8"/>`,
    money: `<g transform="rotate(-18 300 470)"><rect x="205" y="410" width="190" height="92" rx="10" fill="#65b96b"/><rect x="235" y="435" width="130" height="42" rx="21" fill="#bde7a9"/></g><path d="M390 490 L250 455" stroke="${skin}" stroke-width="36" stroke-linecap="round"/>`,
    prayer: `<path d="M405 475 L485 555" stroke="${skin}" stroke-width="32" stroke-linecap="round"/><path d="M535 475 L485 555" stroke="${skin}" stroke-width="32" stroke-linecap="round"/>`,
    worry: `<text x="660" y="285" font-size="110" font-family="Arial" font-weight="900" fill="#ef7d31">!</text><path d="M355 465 L280 555" stroke="${skin}" stroke-width="34" stroke-linecap="round"/>`,
    run: `<g><path d="M430 640 L325 750" stroke="${skin}" stroke-width="38" stroke-linecap="round"/><path d="M510 635 L650 725" stroke="${skin}" stroke-width="38" stroke-linecap="round"/><path d="M345 498 L250 450" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><path d="M555 485 L685 450" stroke="${skin}" stroke-width="34" stroke-linecap="round"/></g>`,
    pose: `<path d="M360 470 L275 390" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><path d="M575 470 L655 385" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><path d="M450 640 L390 760" stroke="#c59a6e" stroke-width="30" stroke-linecap="round"/><path d="M515 640 L585 760" stroke="#c59a6e" stroke-width="30" stroke-linecap="round"/>`,
    heart: `<path d="M665 345 C665 290 735 285 745 345 C765 290 835 305 825 365 C812 445 745 480 745 480 C745 480 675 435 665 345Z" fill="#d92345"/>`,
    mum: `<path d="M350 505 L265 595" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><path d="M565 505 L650 590" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><circle cx="655" cy="582" r="38" fill="#f1c8a4"/><rect x="615" y="555" width="90" height="60" rx="20" fill="#7ccf86"/>`,
    longface: `<rect x="345" y="350" width="260" height="360" rx="20" fill="${outfit}" opacity=".9"/><path d="M350 510 L250 590" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><path d="M600 510 L700 590" stroke="${skin}" stroke-width="34" stroke-linecap="round"/>`,
    shrug: `<path d="M350 500 L265 445" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><path d="M585 500 L690 445" stroke="${skin}" stroke-width="34" stroke-linecap="round"/>`,
    monkey: `<circle cx="350" cy="305" r="72" fill="#d18845"/><circle cx="610" cy="305" r="72" fill="#d18845"/><path d="M665 650 C790 620 795 760 700 755" fill="none" stroke="#7d4a22" stroke-width="28" stroke-linecap="round"/>`,
    clown: `<circle cx="493" cy="352" r="18" fill="#e04343"/><path d="M360 250 L315 200 M615 250 L660 200" stroke="#e04343" stroke-width="24" stroke-linecap="round"/>`,
    shock: `<text x="665" y="360" font-size="95" font-family="Arial" font-weight="900" fill="#35a7d6">?</text>`,
    think: `<path d="M610 525 L530 468" stroke="${skin}" stroke-width="36" stroke-linecap="round"/><circle cx="675" cy="230" r="28" fill="#c8c6ff"/><circle cx="730" cy="175" r="40" fill="#c8c6ff"/>`,
    formal: `<path d="M440 430 L492 610 L545 430" fill="#f7f7f7"/><path d="M492 505 L455 610 L530 610 Z" fill="#111"/>`,
    work: `<path d="M615 640 L745 720" stroke="#7a6a52" stroke-width="30" stroke-linecap="round"/><rect x="630" y="690" width="155" height="60" rx="10" fill="#202720"/>`,
    monk: `<circle cx="490" cy="645" r="105" fill="${outfit}"/><path d="M350 610 C425 725 555 725 630 610" fill="none" stroke="#a45f1c" stroke-width="30"/>`,
    doubt: `<path d="M385 355 L300 300" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><path d="M585 360 L690 300" stroke="${skin}" stroke-width="34" stroke-linecap="round"/>`,
    solo: `<path d="M390 410 L585 420 L610 655 L365 655Z" fill="#111"/><circle cx="725" cy="255" r="55" fill="#d8dee5"/>`,
    fragile: `<path d="M350 505 L275 605" stroke="${skin}" stroke-width="28" stroke-linecap="round"/><path d="M580 505 L660 615" stroke="${skin}" stroke-width="28" stroke-linecap="round"/><path d="M405 710 L375 805" stroke="#5e4334" stroke-width="22" stroke-linecap="round"/>`,
    laugh: `<rect x="365" y="225" width="250" height="205" rx="12" fill="${skin}" opacity=".95"/><path d="M390 340 L600 340" stroke="#e04343" stroke-width="16" stroke-linecap="round"/>`,
    bottle: `<path d="M610 455 L730 650" stroke="#2b5945" stroke-width="38" stroke-linecap="round"/><rect x="700" y="620" width="58" height="150" rx="18" transform="rotate(-28 700 620)" fill="#405f45"/>`,
    ctrl: `<path d="M345 500 L265 420" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><path d="M585 500 L700 420" stroke="${skin}" stroke-width="34" stroke-linecap="round"/><circle cx="260" cy="415" r="25" fill="${skin}"/><circle cx="700" cy="420" r="25" fill="${skin}"/>`,
  }[kind] || "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="960" viewBox="0 0 960 960">
    <rect width="960" height="960" fill="none"/>
    ${bg}
    <ellipse cx="480" cy="805" rx="210" ry="42" fill="#17211d" opacity=".10"/>
    ${art}
    ${extras}
    <text x="480" y="895" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="58" fill="${darkPanel ? "#f7f7f7" : "#4f8f45"}">${code}</text>
  </svg>`;
}

async function writeVariant(code, name, svg, size, quality) {
  const dir = path.join(outRoot, code);
  await fs.mkdir(dir, { recursive: true });
  await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality })
    .toFile(path.join(dir, `${name}.webp`));
}

(async () => {
  await fs.rm(outRoot, { recursive: true, force: true });
  for (const spec of specs) {
    const svg = drawing(spec);
    await writeVariant(spec[0], "full", svg, 960, 92);
    await writeVariant(spec[0], "poster", svg, 1080, 92);
    await writeVariant(spec[0], "card", svg, 640, 90);
    await writeVariant(spec[0], "thumbnail", svg, 256, 88);
  }
})();
