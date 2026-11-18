import { useCallback, useEffect, useRef, useState } from "react";
import { GET_LATEST_RELEASE } from "../../api";

export type Release = {
  version: string;
  url: string;
  size?: number;
};

export type ReleaseState = { status: "loading" } | { status: "ready"; release: Release } | { status: "error" };

const PLATFORM = "macos-arm64";
const TIMEOUT_MS = 12000;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const parseRelease = (data: unknown): Release => {
  if (!isRecord(data) || typeof data.version !== "string" || !data.version || !isRecord(data.platforms)) {
    throw new Error("Unexpected release response");
  }
  const asset = data.platforms[PLATFORM];
  if (!isRecord(asset) || typeof asset.url !== "string") {
    throw new Error(`No ${PLATFORM} build in release ${data.version}`);
  }
  const url = new URL(asset.url);
  if (url.protocol !== "https:") {
    throw new Error("Download URL is not https");
  }
  return { version: data.version, url: url.href, size: typeof asset.size === "number" ? asset.size : undefined };
};

const fetchLatestRelease = async (): Promise<Release> => {
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

export const useLatestRelease = () => {
  const [state, setState] = useState<ReleaseState>({ status: "loading" });
  const pending = useRef<Promise<Release> | null>(null);
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
      (release) => active && setState({ status: "ready", release }),
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
      setState({ status: "ready", release });
      window.location.assign(release.url);
    } catch (error) {
      console.error("ButteryAI release check failed:", error);
      setState({ status: "error" });
    } finally {
      queued.current = false;
    }
  }, [resolve]);

  return { state, download };
};
