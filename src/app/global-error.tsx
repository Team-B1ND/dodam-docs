"use client";

import "./globals.css";
import { useEffect } from "react";
import { FilledButton } from "@b1nd/dodam-design-system/components";
import { DdsRegistry } from "@b1nd/dodam-design-system/next";
import { GlobalErrorToastProvider, reportGlobalError } from "@/shared/ui/GlobalErrorToastProvider";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportGlobalError(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="antialiased bg-background-default text-text-primary">
        <DdsRegistry>
          <GlobalErrorToastProvider>
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
              <h1 className="text-xl font-bold">문제가 발생했습니다</h1>
              <p role="alert" className="text-text-secondary">
                예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
              </p>
              <FilledButton size="medium" onClick={reset}>
                다시 시도
              </FilledButton>
            </main>
          </GlobalErrorToastProvider>
        </DdsRegistry>
      </body>
    </html>
  );
}
