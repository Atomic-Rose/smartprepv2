// Original, simple tile illustrations (inline SVG, 320×180).
// Ink and cobalt on a pale tile; no green, which is reserved for correct answers.

const INK = '#0f1216';
const COBALT = '#2346d1';
const PAPER = '#ffffff';

const wrap = body =>
  `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${body}</svg>`;

// Chapter 1 — a processor with a rising cost-curve behind it (Moore's Law, digital change).
function chip() {
  const pins = [];
  for (let i = 0; i < 4; i++) {
    const p = 133 + i * 18;   // pins along each side of the 80×80 chip at (120, 50)
    const q = 63 + i * 18;
    pins.push(`<path d="M${p} 36v14M${p} 130v14M106 ${q}h14M200 ${q}h14"/>`);
  }
  return wrap(`
    <path d="M28 150 C 120 148, 210 112, 292 30" fill="none" stroke="${COBALT}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
    <circle cx="292" cy="30" r="6" fill="${COBALT}"/>
    <g stroke="${INK}" stroke-width="3" stroke-linecap="round">${pins.join('')}</g>
    <rect x="120" y="50" width="80" height="80" rx="12" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
    <rect x="140" y="70" width="40" height="40" rx="7" fill="${COBALT}"/>
    <path d="M152 92l6 6 11-14" fill="none" stroke="${PAPER}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`);
}

// Chapter 2 — five forces: a central rivalry node pressed on by four outer forces.
function forces() {
  const outer = [[84, 44], [236, 44], [84, 136], [236, 136]];
  const lines = outer.map(([x, y]) => `<path d="M${x} ${y}L160 90"/>`).join('');
  const nodes = outer.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>`).join('');
  return wrap(`
    <g stroke="${INK}" stroke-width="3" stroke-dasharray="1 7" stroke-linecap="round">${lines}</g>
    ${nodes}
    <circle cx="160" cy="90" r="30" fill="${COBALT}"/>
    <circle cx="160" cy="90" r="12" fill="none" stroke="${PAPER}" stroke-width="3"/>`);
}

// Chapter 3 — a bar chart under a magnifying glass (finding patterns in data).
function chart() {
  const bars = [[86, 46], [122, 74], [158, 58], [194, 102]];
  const rects = bars.map(([x, h], i) => i === 3
    ? `<rect x="${x}" y="${150 - h}" width="24" height="${h}" rx="4" fill="${COBALT}"/>`
    : `<rect x="${x}" y="${150 - h}" width="24" height="${h}" rx="4" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>`).join('');
  return wrap(`
    <path d="M66 150h190" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    ${rects}
    <circle cx="236" cy="66" r="30" fill="${PAPER}" fill-opacity=".6" stroke="${INK}" stroke-width="4"/>
    <path d="M257 87l22 22" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`);
}

export const ART = { chip, forces, chart };
