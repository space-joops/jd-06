import type { DebrisId } from "./types";

// 우주쓰레기 7종의 사실적 SVG 아트. 게임 캔버스(스프라이트)와 도감(이미지) 공용 소스.
// viewBox 0 0 64 64. 이모지 대신 이 벡터 아트를 쓴다.

export const DEBRIS_SVG: Record<DebrisId, string> = {
  // 페인트/열제어 코팅 조각 — 우주선 표면에서 떨어져 나와 살짝 말린 박편
  paint: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#fefdf8"/><stop offset=".55" stop-color="#e9e4d6"/><stop offset="1" stop-color="#c4bea9"/></linearGradient></defs>
<path d="M15 41 41 51 49 37 23 27Z" fill="#8f8a7b"/>
<path d="M12 23c7-8 27-11 40-3-6 10-2 21-13 27-12 3-24-5-28-12-1-4 0-9 1-12z" fill="url(#a)" stroke="#b4ae9c" stroke-width=".8"/>
<path d="M13 24c8-6 22-8 37-3" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>
<ellipse cx="35" cy="33" rx="9" ry="5" fill="#b3a488" opacity=".28"/>
<ellipse cx="24" cy="28" rx="3" ry="1.8" fill="#fff" opacity=".6"/></svg>`,

  // 나사와 볼트 — 육각 머리 + 나사산 스테인리스 파스너
  bolt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#eef2f6"/><stop offset=".5" stop-color="#a9b2be"/><stop offset="1" stop-color="#727c89"/></linearGradient></defs>
<rect x="26" y="30" width="12" height="26" rx="2" fill="url(#b)"/>
<g stroke="#5b6470" stroke-width="1" opacity=".8" fill="none">
<path d="M26 34l12 2M26 39l12 2M26 44l12 2M26 49l12 2M26 54l12 1"/></g>
<polygon points="32,8 47,16.5 47,33.5 32,42 17,33.5 17,16.5" fill="url(#b)" stroke="#5b6470" stroke-width="1"/>
<polygon points="32,13 42,19 42,31 32,37 22,31 22,19" fill="none" stroke="#fff" stroke-width="1" opacity=".45"/>
<circle cx="32" cy="25" r="4.6" fill="#8c96a2" stroke="#616b77" stroke-width=".8"/></svg>`,

  // 단열재 파편 — 위성용 MLI(다층 단열재) 금빛 포일, 구겨진 면 + 은박 속층
  insulation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#ffe89a"/><stop offset=".5" stop-color="#e8b64e"/><stop offset="1" stop-color="#a9781f"/></linearGradient></defs>
<path d="M10 22 50 10 57 40 19 54Z" fill="url(#c)"/>
<g opacity=".5">
<polygon points="10,22 30,17 24,40 15,42" fill="#fff2b0"/>
<polygon points="30,17 50,10 47,30 26,35" fill="#d59e34"/>
<polygon points="19,54 26,35 47,30 41,49" fill="#c88f2b"/></g>
<g stroke="#fff6cf" stroke-width="1" opacity=".7" fill="none"><path d="M14 30l12-4M28 44l14-6M34 20l10-3"/></g>
<path d="M10 22 19 54 16 52 8 24Z" fill="#dfe3e8" opacity=".85"/></svg>`,

  // 로켓 페어링 — 곡면 복합재 덮개 조각. 아래 모서리에 허니콤 코어 힌트 + 도색 스트라이프
  fairing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d3d9e0"/></linearGradient></defs>
<path d="M15 15c14-7 29-4 36 5l-4 30c-9 6-25 4-33-2-3-9-2-24 1-33z" fill="url(#d)" stroke="#b3bcc6" stroke-width="1"/>
<path d="M15 15c14-7 29-4 36 5" fill="none" stroke="#fff" stroke-width="1.5" opacity=".8"/>
<rect x="19" y="23" width="27" height="3.4" rx="1.7" fill="#d64545" opacity=".85"/>
<g fill="none" stroke="#b79a63" stroke-width=".8" opacity=".8">
<path d="M17 44l4-2 4 2 4-2 4 2 4-2 4 2"/><path d="M17 48l4-2 4 2 4-2 4 2 4-2 4 2"/></g></svg>`,

  // 태양전지판 조각 — 파란 셀 그리드 + 은빛 버스바 + 반사 글린트
  solar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="e" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#2b4fb0"/><stop offset=".5" stop-color="#16306e"/><stop offset="1" stop-color="#0d1c44"/></linearGradient></defs>
<path d="M12 15 52 11 54 51 14 53Z" fill="#31384a"/>
<path d="M14 17 50 13.5 52 49 16 51Z" fill="url(#e)"/>
<g stroke="#aeb9d6" stroke-width=".8" opacity=".85" fill="none">
<path d="M26 15 27 52M39 14 40 51M13 28 53 25M14 41 54 38"/></g>
<g stroke="#dfe6f5" stroke-width=".5" opacity=".5" fill="none"><path d="M20 16 21 52M33 15 34 51M46 14 47 50"/></g>
<polygon points="14,17 30,16 20,51 15,51" fill="#a9c8ff" opacity=".16"/></svg>`,

  // 폐위성 — 소형 죽은 위성. 접시 + 태양전지판(한쪽 손상) + 금박 버스
  satellite: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs>
<linearGradient id="f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6eaf0"/><stop offset="1" stop-color="#9aa3b0"/></linearGradient>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b4fb0"/><stop offset="1" stop-color="#122a63"/></linearGradient></defs>
<g transform="rotate(-7 15 33)"><rect x="3" y="26" width="17" height="14" fill="url(#g)" stroke="#0e1f4a" stroke-width=".8"/>
<path d="M11 26v14M3 33h17" stroke="#7f8cc0" stroke-width=".6"/></g>
<g transform="rotate(15 49 34)"><rect x="44" y="26" width="17" height="14" fill="url(#g)" stroke="#0e1f4a" stroke-width=".8"/>
<path d="M52 26v14M44 33h17" stroke="#7f8cc0" stroke-width=".6"/></g>
<rect x="24" y="24" width="16" height="19" rx="2" fill="url(#f)" stroke="#6b7480" stroke-width=".8"/>
<rect x="27" y="28" width="10" height="5" fill="#e2b64f"/>
<ellipse cx="32" cy="17" rx="7" ry="3.6" fill="#dfe4ea" stroke="#9aa3b0" stroke-width=".8"/>
<path d="M32 17v6" stroke="#9aa3b0" stroke-width="1"/>
<path d="M38 43l6 8" stroke="#8a93a0" stroke-width="1.6"/></svg>`,

  // 우주인의 공구가방 — EVA용 흰 베타천 가방 + 스트랩 + 테더 후크, 삐져나온 공구
  toolbag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d7dde3"/></linearGradient></defs>
<path d="M31 9c0-4 6-4 6 0v4" fill="none" stroke="#c2c8cf" stroke-width="2.2"/>
<rect x="16" y="17" width="32" height="34" rx="6" fill="url(#h)" stroke="#b4bcc4" stroke-width="1"/>
<path d="M16 25v-2a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v2z" fill="#eef1f4" stroke="#b4bcc4" stroke-width=".8"/>
<rect x="22" y="17" width="4" height="34" fill="#cfd5db" opacity=".85"/>
<rect x="38" y="17" width="4" height="34" fill="#cfd5db" opacity=".85"/>
<rect x="27" y="31" width="10" height="5" rx="1" fill="#98a1ad" stroke="#77808c" stroke-width=".6"/>
<g transform="rotate(20 44 14)"><rect x="42" y="7" width="3" height="13" rx="1.4" fill="#8a93a0"/>
<circle cx="43.5" cy="8" r="3.2" fill="none" stroke="#8a93a0" stroke-width="2"/></g>
<rect x="16" y="41" width="32" height="10" rx="6" fill="#000" opacity=".05"/></svg>`,
};

const enc = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ""))}`;

export const DEBRIS_DATAURL = Object.fromEntries(
  (Object.keys(DEBRIS_SVG) as DebrisId[]).map((k) => [k, enc(DEBRIS_SVG[k])])
) as Record<DebrisId, string>;
