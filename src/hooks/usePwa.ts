"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isAlarmEnabled, storeAlarmEnabled } from "@/lib/notify";
import { APP_VERSION } from "@/lib/version";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallState = "installed" | "installable" | "ios-guide" | "manual";

export interface PwaApi {
  version: string;
  /** 새 버전 SW가 설치되어 교체 대기 중 */
  updateReady: boolean;
  applyUpdate: () => void;
  installState: InstallState;
  promptInstall: () => Promise<boolean>;
  notifSupported: boolean;
  notifPermission: NotificationPermission;
  alarmEnabled: boolean;
  /** 알림 토글. 켤 때 권한이 없으면 요청까지 수행 */
  toggleAlarm: () => Promise<void>;
}

function detectInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const standalone =
    window.matchMedia?.("(display-mode: standalone)").matches ?? false;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return standalone || iosStandalone;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function usePwa(): PwaApi {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const reloadingRef = useRef(false);

  // 초기 상태 (클라이언트에서만)
  useEffect(() => {
    setInstalled(detectInstalled());
    setAlarmEnabled(isAlarmEnabled());
    if ("Notification" in window) setNotifPermission(Notification.permission);
  }, []);

  // 서비스워커 등록 + 업데이트 감지 (프로덕션 전용 — dev는 HMR과 충돌)
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    navigator.serviceWorker
      .register(`/sw.js?v=${APP_VERSION}`)
      .then((reg) => {
        if (cancelled) return;
        if (reg.waiting && navigator.serviceWorker.controller) {
          setWaiting(reg.waiting);
        }
        reg.addEventListener("updatefound", () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener("statechange", () => {
            if (next.state === "installed" && navigator.serviceWorker.controller) {
              setWaiting(next);
            }
          });
        });
      })
      .catch(() => {});

    const onControllerChange = () => {
      if (reloadingRef.current) window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  // 설치 프롬프트 캡처 + 설치 완료 감지
  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (!waiting) return;
    reloadingRef.current = true;
    waiting.postMessage("SKIP_WAITING");
  }, [waiting]);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return false;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setInstallEvent(null);
      return true;
    }
    return false;
  }, [installEvent]);

  const toggleAlarm = useCallback(async () => {
    if (alarmEnabled) {
      storeAlarmEnabled(false);
      setAlarmEnabled(false);
      return;
    }
    if (!("Notification" in window)) return;
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
    if (permission === "granted") {
      storeAlarmEnabled(true);
      setAlarmEnabled(true);
    }
  }, [alarmEnabled]);

  const installState: InstallState = installed
    ? "installed"
    : installEvent
      ? "installable"
      : isIos()
        ? "ios-guide"
        : "manual";

  return {
    version: APP_VERSION,
    updateReady: waiting !== null,
    applyUpdate,
    installState,
    promptInstall,
    notifSupported: typeof window !== "undefined" && "Notification" in window,
    notifPermission,
    alarmEnabled,
    toggleAlarm,
  };
}
