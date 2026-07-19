// PWA 아이콘 생성기 — 외부 의존성 없이 픽셀을 직접 그려 PNG로 인코딩한다.
// 사용법: node scripts/generate-icons.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ── 미니 PNG 인코더 ──────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** rgba: Uint8Array(size*size*4) */
function encodePng(size, rgba) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // 필터 없음
    rgba.subarray(y * size * 4, (y + 1) * size * 4).forEach((v, i) => {
      raw[y * (size * 4 + 1) + 1 + i] = v;
    });
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── 그리기 도우미 (0~1 상대좌표) ─────────────────────────────────
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => c1.map((v, i) => lerp(v, c2[i], t));
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

const BG_TOP = hex("#0b1026");
const BG_BOT = hex("#241a4d");
const MINT = hex("#7de8c3");
const MINT_LIGHT = hex("#b5f4de");
const MINT_DARK = hex("#3ec99a");
const STEM = hex("#4db996");
const INK = hex("#2b2350");
const STAR_Y = hex("#ffe9a8");
const BLUSH = hex("#ff9eb5");
const WHITE = [255, 255, 255];

const STARS = [
  [0.18, 0.14, 0.011, WHITE, 0.95],
  [0.84, 0.11, 0.008, WHITE, 0.9],
  [0.9, 0.34, 0.006, hex("#f9a8d4"), 0.9],
  [0.1, 0.4, 0.006, WHITE, 0.8],
  [0.8, 0.82, 0.007, hex("#7de8c3"), 0.85],
  [0.14, 0.82, 0.008, WHITE, 0.9],
  [0.5, 0.05, 0.006, WHITE, 0.8],
  [0.68, 0.2, 0.005, WHITE, 0.7],
];

/** (x, y) 픽셀의 최종 색을 계산 — 소프트엣지 원/타원의 painter's algorithm */
function shade(x, y, scale, px) {
  const aa = 1.5 / px; // 소프트 엣지 폭
  let col = mix(BG_TOP, BG_BOT, y);

  const put = (c, a) => {
    if (a > 0) col = mix(col, c, clamp01(a));
  };
  const circle = (cx, cy, r, c, a = 1) => {
    const d = Math.hypot(x - cx, y - cy);
    put(c, a * smooth(r + aa, r - aa, d));
  };

  for (const [sx, sy, sr, sc, sa] of STARS) circle(sx, sy, sr, sc, sa);

  const s = scale;
  const cx = 0.5;
  const cy = 0.6;
  const rx = 0.3 * s;
  const ry = 0.27 * s;

  // 안테나
  const stemW = 0.014 * s;
  const stemTop = cy - ry - 0.1 * s;
  if (y > stemTop && y < cy - ry + 0.03 * s) {
    put(STEM, smooth(stemW + aa, stemW - aa, Math.abs(x - cx)));
  }
  const bobY = stemTop - 0.015 * s;
  {
    // 보블 글로우
    const d = Math.hypot(x - cx, y - bobY);
    put(STAR_Y, 0.35 * smooth(0.075 * s, 0.03 * s, d));
  }
  circle(cx, bobY, 0.038 * s, STAR_Y);

  // 몸통 (셰이딩 포함)
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  const e = dx * dx + dy * dy;
  const bodyA = smooth(1 + aa * 4, 1 - aa * 4, e);
  if (bodyA > 0) {
    const lightT = clamp01((dx + 1) * 0.28 + (dy + 1) * 0.38);
    let body = mix(MINT_LIGHT, MINT, lightT);
    body = mix(body, MINT_DARK, smooth(0.45, 1.05, e));
    put(body, bodyA);
    // 하이라이트
    const hd = Math.hypot((x - (cx - 0.13 * s)) / (0.09 * s), (y - (cy - 0.14 * s)) / (0.05 * s));
    put(WHITE, 0.4 * bodyA * smooth(1, 0.5, hd));
  }

  // 눈
  for (const sideDir of [-1, 1]) {
    const ex = cx + sideDir * 0.115 * s;
    const ey = cy - 0.05 * s;
    circle(ex, ey, 0.048 * s, INK);
    circle(ex + 0.017 * s, ey - 0.018 * s, 0.017 * s, WHITE);
  }

  // 볼터치
  circle(cx - 0.19 * s, cy + 0.04 * s, 0.038 * s, BLUSH, 0.55);
  circle(cx + 0.19 * s, cy + 0.04 * s, 0.038 * s, BLUSH, 0.55);

  // 입 (아래쪽 호)
  {
    const mx = x - cx;
    const my = y - (cy + 0.015 * s);
    const d = Math.hypot(mx, my);
    const r = 0.055 * s;
    const th = 0.013 * s;
    if (my > r * 0.25) {
      put(INK, smooth(th + aa, th - aa, Math.abs(d - r)));
    }
  }

  return col;
}

function render(size, scale) {
  const ss = size >= 512 ? 2 : 3; // 슈퍼샘플링 배율
  const big = size * ss;
  const rgba = new Uint8Array(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let pxi = 0; pxi < size; pxi++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const c = shade((pxi * ss + sx + 0.5) / big, (py * ss + sy + 0.5) / big, scale, big);
          r += c[0];
          g += c[1];
          b += c[2];
        }
      }
      const n = ss * ss;
      const o = (py * size + pxi) * 4;
      rgba[o] = r / n;
      rgba[o + 1] = g / n;
      rgba[o + 2] = b / n;
      rgba[o + 3] = 255;
    }
  }
  return encodePng(size, rgba);
}

const root = join(import.meta.dirname, "..");
mkdirSync(join(root, "public", "icons"), { recursive: true });

const targets = [
  ["public/icons/icon-192.png", 192, 1.0],
  ["public/icons/icon-512.png", 512, 1.0],
  ["public/icons/icon-maskable-512.png", 512, 0.72],
  ["public/apple-touch-icon.png", 180, 1.0],
];

for (const [file, size, scale] of targets) {
  writeFileSync(join(root, file), render(size, scale));
  console.log(`✓ ${file} (${size}x${size})`);
}
