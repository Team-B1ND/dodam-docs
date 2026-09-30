"use client";

import { useEffect } from "react";
import { ToastProvider, useToast } from "@b1nd/dodam-design-system/components";

const GLOBAL_ERROR_EVENT = "dodam:global-error";
const GLOBAL_ERROR_MESSAGE = "예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
const reportedErrors = new WeakSet<object>();

const isObjectLike = (value: unknown): value is object =>
  (typeof value === "object" && value !== null) || typeof value === "function";

export function reportGlobalError(error: unknown) {
  if (typeof window === "undefined") return;

  if (isObjectLike(error)) {
    if (reportedErrors.has(error)) return;
    reportedErrors.add(error);
  }

  window.setTimeout(() => {
    window.dispatchEvent(new Event(GLOBAL_ERROR_EVENT));
  }, 0);
}

export function GlobalErrorToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event instanceof ErrorEvent) reportGlobalError(event.error);
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportGlobalError(event.reason);
    };
    const showErrorToast = () => toast.error(GLOBAL_ERROR_MESSAGE);

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener(GLOBAL_ERROR_EVENT, showErrorToast);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener(GLOBAL_ERROR_EVENT, showErrorToast);
    };
  }, [toast]);

  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}
