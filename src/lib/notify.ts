export const ALARM_KEY = "astropet-alarm-v1";

export function isAlarmEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ALARM_KEY) === "1";
  } catch {
    return false;
  }
}

export function storeAlarmEnabled(on: boolean): void {
  try {
    window.localStorage.setItem(ALARM_KEY, on ? "1" : "0");
  } catch {
    // ignore
  }
}

/**
 * 재회 윈도우가 열릴 때 로컬 알림을 띄운다.
 * 탭이 열려 있는 동안만 동작 — 앱을 완전히 닫았을 때의 푸시는 서버 도입 이후 지원.
 */
export async function notifyApproach(petName: string): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!isAlarmEnabled()) return;
  if (document.visibilityState === "visible") return; // 보고 있는 중엔 알림 불필요

  const title = `💫 ${petName}가 상공을 지나가요!`;
  const options: NotificationOptions = {
    body: "지금부터 3분 동안 만날 수 있어요. 쓰다듬고 함께 수거해요!",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "astropet-window",
  };

  try {
    const reg =
      "serviceWorker" in navigator
        ? await navigator.serviceWorker.getRegistration()
        : undefined;
    if (reg) {
      await reg.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch {
    // 알림 실패는 조용히 무시
  }
}
