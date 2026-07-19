/* 아스트로펫 서비스워커
 * 등록 URL의 ?v= 쿼리(앱 버전)로 캐시를 버전링한다.
 * 버전이 바뀌면 새 SW가 설치·대기하고, 앱이 SKIP_WAITING 메시지로 교체를 지시한다. */
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE = `astropet-${VERSION}`;
const APP_SHELL = "/";
const PRECACHE = [APP_SHELL, "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("astropet-") && key !== CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 페이지 이동: 네트워크 우선, 오프라인이면 캐시된 앱 셸
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches
            .open(CACHE)
            .then((cache) => cache.put(APP_SHELL, copy))
            .catch(() => {});
          return response;
        })
        .catch(() => caches.match(APP_SHELL))
    );
    return;
  }

  // 정적 자산: 캐시 우선 (Next 정적 파일은 내용 해시가 있어 안전)
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches
                .open(CACHE)
                .then((cache) => cache.put(request, copy))
                .catch(() => {});
            }
            return response;
          })
      )
    );
  }
});

// 알림 클릭 → 열린 창 포커스, 없으면 새로 연다
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if ("focus" in client) return client.focus();
        }
        return self.clients.openWindow("/");
      })
  );
});
