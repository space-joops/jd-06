import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

const { version } = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8")
) as { version: string };

const nextConfig: NextConfig = {
  env: {
    // 앱 전역에서 package.json 버전과 동기화된 버전 문자열 사용
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

export default nextConfig;
