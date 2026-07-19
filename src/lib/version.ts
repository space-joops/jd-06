/** package.json의 version과 빌드 시점에 동기화됨 (next.config.ts에서 주입) */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
