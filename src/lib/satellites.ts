// 함께 수거하기(우주유영) 게임에 등장하는 유명 위성 10종.
// 이미지 에셋 없이 캔버스로 그린다. forward(진행 방향) = +x 로컬 좌표계.

export type SatKind =
  | "station" // ISS · 톈궁 (긴 트러스 + 다중 태양전지판)
  | "hubble" // 허블 (은색 원통 망원경)
  | "jwst" // 제임스웹 (금색 육각 거울 + 선실드)
  | "starlink" // 스타링크 (평판 버스 + 단일 패널 + SpaceX 로고)
  | "sputnik" // 스푸트니크 (금속 구 + 4 안테나)
  | "dish" // 보이저 (대형 접시 안테나 + 붐)
  | "boxsat"; // GPS · GOES · 랜드샛 (박스 버스 + 2 패널)

export interface SatelliteDef {
  id: string;
  name: string;
  kind: SatKind;
  body: string;
  panel: string;
  accent?: string;
  /** 대략적인 히트박스/라벨 기준 반경(px, scale 1) */
  r: number;
}

export const SAT_DEFS: SatelliteDef[] = [
  { id: "iss", name: "ISS", kind: "station", body: "#dbe1ea", panel: "#25407a", accent: "#ffd27a", r: 34 },
  { id: "tiangong", name: "톈궁", kind: "station", body: "#ece6d6", panel: "#2f6b4f", accent: "#e05b5b", r: 32 },
  { id: "hubble", name: "허블", kind: "hubble", body: "#c9ccd3", panel: "#2a4a8c", accent: "#ffd27a", r: 24 },
  { id: "jwst", name: "제임스웹", kind: "jwst", body: "#ffd45e", panel: "#8b6cff", accent: "#b98cff", r: 26 },
  { id: "starlink", name: "스타링크", kind: "starlink", body: "#eef2f7", panel: "#16263f", accent: "#ffffff", r: 22 },
  { id: "sputnik", name: "스푸트니크", kind: "sputnik", body: "#cfd4dc", panel: "#8a939f", accent: "#eef2f7", r: 18 },
  { id: "voyager", name: "보이저", kind: "dish", body: "#c6cad2", panel: "#5b6270", accent: "#ffd27a", r: 24 },
  { id: "gps", name: "GPS", kind: "boxsat", body: "#d5dae2", panel: "#274d99", accent: "#9fd0ff", r: 22 },
  { id: "goes", name: "GOES", kind: "boxsat", body: "#e3e7ee", panel: "#2b6b8c", accent: "#9fe0ff", r: 22 },
  { id: "landsat", name: "랜드샛", kind: "boxsat", body: "#dbe0e8", panel: "#356b3f", accent: "#a7e6b0", r: 22 },
];

export const STARLINK_DEF = SAT_DEFS.find((s) => s.id === "starlink")!;

type Ctx = CanvasRenderingContext2D;

/** 태양전지판 한 장 (그리드 셀) */
function panel(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 0.6;
  const cols = Math.max(1, Math.round(w / 5));
  const rows = Math.max(1, Math.round(h / 5));
  for (let i = 1; i < cols; i++) {
    ctx.beginPath();
    ctx.moveTo(x + (w / cols) * i, y);
    ctx.lineTo(x + (w / cols) * i, y + h);
    ctx.stroke();
  }
  for (let j = 1; j < rows; j++) {
    ctx.beginPath();
    ctx.moveTo(x, y + (h / rows) * j);
    ctx.lineTo(x + w, y + (h / rows) * j);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * 위성을 로컬 원점(0,0) 기준으로 그린다. 진행 방향 = +x.
 * 호출측이 translate/rotate/scale/globalAlpha 를 이미 적용한 상태여야 한다.
 */
export function drawSatellite(ctx: Ctx, def: SatelliteDef) {
  ctx.lineJoin = "round";
  switch (def.kind) {
    case "station": {
      // 중앙 트러스 (진행축)
      ctx.fillStyle = "#9aa3b2";
      ctx.fillRect(-30, -2.5, 60, 5);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 0.6;
      for (let i = -28; i <= 28; i += 7) {
        ctx.beginPath();
        ctx.moveTo(i, -2.5);
        ctx.lineTo(i + 4, 2.5);
        ctx.stroke();
      }
      // 태양전지판 3쌍
      for (const cx of [-22, 0, 22]) {
        panel(ctx, cx - 8, -26, 16, 20, def.panel);
        panel(ctx, cx - 8, 6, 16, 20, def.panel);
      }
      // 중앙 모듈
      ctx.fillStyle = def.body;
      roundRect(ctx, -12, -6, 24, 12, 5);
      ctx.fill();
      if (def.accent) {
        ctx.fillStyle = def.accent;
        roundRect(ctx, 12, -3.5, 8, 7, 3);
        ctx.fill();
      }
      break;
    }
    case "hubble": {
      // 은색 원통
      const g = ctx.createLinearGradient(0, -9, 0, 9);
      g.addColorStop(0, "#eef1f6");
      g.addColorStop(0.5, def.body);
      g.addColorStop(1, "#8f96a2");
      ctx.fillStyle = g;
      roundRect(ctx, -18, -9, 36, 18, 7);
      ctx.fill();
      // 조리개(앞쪽)
      ctx.fillStyle = "#1a1f2b";
      ctx.beginPath();
      ctx.ellipse(17, 0, 3.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // 소형 패널
      panel(ctx, -6, -20, 12, 11, def.panel);
      panel(ctx, -6, 9, 12, 11, def.panel);
      // 안테나
      ctx.strokeStyle = "#c9ccd3";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(-24, 0);
      ctx.stroke();
      break;
    }
    case "jwst": {
      // 선실드 (다이아 5겹)
      ctx.save();
      ctx.rotate(0.0);
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 ? "#b98cff" : "#8b6cff";
        ctx.globalAlpha = 0.9 - i * 0.06;
        ctx.beginPath();
        ctx.moveTo(0, -22 + i * 1.6);
        ctx.lineTo(26 - i, 0 + i * 1.6);
        ctx.lineTo(0, 22 + i * 1.6);
        ctx.lineTo(-26 + i, 0 + i * 1.6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      // 금색 육각 거울 (중앙 + 6)
      ctx.fillStyle = def.body;
      const hex = (cx: number, cy: number, s: number) => {
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI / 3) * k + Math.PI / 6;
          const px = cx + Math.cos(a) * s;
          const py = cy + Math.sin(a) * s;
          if (k) ctx.lineTo(px, py);
          else ctx.moveTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(120,80,0,0.4)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      };
      const s = 4.6;
      hex(-4, -2, s);
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k;
        hex(-4 + Math.cos(a) * s * 1.75, -2 + Math.sin(a) * s * 1.75, s);
      }
      break;
    }
    case "starlink": {
      // 단일 태양전지판 (길게 한쪽)
      panel(ctx, 4, -8, 34, 16, def.panel);
      // 평판 버스
      const g = ctx.createLinearGradient(0, -7, 0, 7);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "#c3ccd8");
      ctx.fillStyle = g;
      roundRect(ctx, -22, -7, 22, 14, 3);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
      // SpaceX 로고 텍스트
      ctx.fillStyle = "#11151d";
      ctx.font = "700 6px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SpaceX", -11, 0);
      break;
    }
    case "sputnik": {
      // 금속 구
      const g = ctx.createRadialGradient(-4, -4, 2, 0, 0, 14);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.5, def.body);
      g.addColorStop(1, "#7a828e");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      // 4 안테나 (뒤로 스윕)
      ctx.strokeStyle = def.accent ?? "#e5e9ef";
      ctx.lineWidth = 1.3;
      for (const dy of [-7, -3, 3, 7]) {
        ctx.beginPath();
        ctx.moveTo(-6, dy * 0.4);
        ctx.lineTo(-30, dy);
        ctx.stroke();
      }
      break;
    }
    case "dish": {
      // 대형 접시 안테나 (앞쪽)
      ctx.save();
      const g = ctx.createLinearGradient(-16, 0, 16, 0);
      g.addColorStop(0, "#eef1f6");
      g.addColorStop(1, "#aeb4c0");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(6, 0, 12, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      // 급전부
      ctx.strokeStyle = "#c6cad2";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(20, 0);
      ctx.stroke();
      ctx.fillStyle = def.accent ?? "#ffd27a";
      ctx.beginPath();
      ctx.arc(20, 0, 2.4, 0, Math.PI * 2);
      ctx.fill();
      // 본체 + 붐
      ctx.fillStyle = def.body;
      roundRect(ctx, -18, -6, 14, 12, 3);
      ctx.fill();
      ctx.strokeStyle = "#5b6270";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-34, -8);
      ctx.stroke();
      break;
    }
    case "boxsat":
    default: {
      // 태양전지판 2장
      panel(ctx, -30, -9, 18, 18, def.panel);
      panel(ctx, 12, -9, 18, 18, def.panel);
      // 박스 버스
      const g = ctx.createLinearGradient(0, -10, 0, 10);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, def.body);
      ctx.fillStyle = g;
      roundRect(ctx, -11, -10, 22, 20, 4);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.22)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
      // 접시 안테나 (앞)
      ctx.fillStyle = def.accent ?? "#9fd0ff";
      ctx.beginPath();
      ctx.ellipse(11, 3, 4.5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // 안테나 붐
      ctx.strokeStyle = "#aab0bc";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, -18);
      ctx.stroke();
      break;
    }
  }
}
