import { useCallback, useEffect, useRef, useState } from "react";
import { GET_LATEST_RELEASE } from "../../api";
import { parseRelease, type Release } from "./release";

export type { Release } from "./release";

export type ReleaseState =
  | { status: "loading" }
  | { status: "ready"; release: Release }
  | { status: "invite" }
  | { status: "error" };

const TIMEOUT_MS = 12000;

const fetchLatestRelease = async (): Promise<Release | null> => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const request = GET_LATEST_RELEASE();
    const response = await fetch(request.url, { ...request.options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Release check returned ${response.status}`);
    }
    return parseRelease(await response.json());
  } finally {
    window.clearTimeout(timer);
  }
};

const stateFor = (release: Release | null): ReleaseState =>
  release ? { status: "ready", release } : { status: "invite" };

export const useLatestRelease = () => {
  const [state, setState] = useState<ReleaseState>({ status: "loading" });
  const pending = useRef<Promise<Release | null> | null>(null);
  const queued = useRef(false);

  const resolve = useCallback(() => {
    pending.current ??= fetchLatestRelease().finally(() => {
      pending.current = null;
    });
    return pending.current;
  }, []);

  useEffect(() => {
    let active = true;
    resolve().then(
      (release) => active && setState(stateFor(release)),
      (error: unknown) => {
        if (!active) return;
        console.error("ButteryAI release check failed:", error);
        setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [resolve]);

  const download = useCallback(async () => {
    if (queued.current) return;
    queued.current = true;
    setState({ status: "loading" });
    try {
      const release = await resolve();
      setState(stateFor(release));
      if (release) window.location.assign(release.url);
    } catch (error) {
      console.error("ButteryAI release check failed:", error);
      setState({ status: "error" });
    } finally {
      queued.current = false;
    }
  }, [resolve]);

  return { state, download };
};
