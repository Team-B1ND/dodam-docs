"use client";

import { useEffect } from "react";
import { FilledButton } from "@b1nd/dodam-design-system/components";
import { reportGlobalError } from "@/shared/ui/GlobalErrorToastProvider";

export default function Error({
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
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl font-bold text-text-primary">문제가 발생했습니다</h1>
      <p role="alert" className="text-text-secondary">
        예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <FilledButton size="medium" onClick={reset}>
        다시 시도
      </FilledButton>
    </main>
  );
}
