import { useEffect, useState } from "react";

const isVisible = () => typeof document === "undefined" || document.visibilityState === "visible";

export const useStageLoop = (steps: readonly number[], hold: number, active: boolean, reduced: boolean) => {
  const [stage, setStage] = useState(reduced ? steps.length : 0);
  const [pageVisible, setPageVisible] = useState(isVisible);

  useEffect(() => {
    const onChange = () => setPageVisible(isVisible());
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => {
    if (reduced || !active || !pageVisible) return;
    const delay = stage < steps.length ? steps[stage] : hold;
    const t = window.setTimeout(() => setStage((s) => (s < steps.length ? s + 1 : 0)), delay);
    return () => window.clearTimeout(t);
  }, [stage, active, pageVisible, reduced, steps, hold]);

  return reduced ? steps.length : stage;
};
