export type Release = {
  version: string;
  url: string;
  size?: number;
};

export const MIN_VERSION = "1.1.0";

const PLATFORM = "macos-arm64";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const versionParts = (version: string) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  return match ? match.slice(1).map(Number) : null;
};

export const meetsMinimum = (version: string, minimum = MIN_VERSION) => {
  const have = versionParts(version);
  const need = versionParts(minimum);
  if (!have || !need) return false;
  for (let i = 0; i < need.length; i++) {
    if (have[i] !== need[i]) return have[i] > need[i];
  }
  return true;
};

export const isTrustedDownloadURL = (url: URL) =>
  url.protocol === "https:" &&
  !url.username &&
  !url.password &&
  !url.port &&
  ((url.hostname === "server.butteryai.com" && url.pathname.startsWith("/api/releases/download/")) ||
    url.hostname === "storage.googleapis.com");

/** Returns null when the latest release is below MIN_VERSION; throws on a malformed response or an untrusted URL. */
export const parseRelease = (data: unknown): Release | null => {
  if (!isRecord(data) || typeof data.version !== "string" || !data.version) {
    throw new Error("Unexpected release response");
  }
  if (!meetsMinimum(data.version)) return null;
  const asset = isRecord(data.platforms) ? data.platforms[PLATFORM] : undefined;
  if (!isRecord(asset) || typeof asset.url !== "string") {
    throw new Error(`No ${PLATFORM} build in release ${data.version}`);
  }
  // The DMG installer when the release lists one; the zip is what the in-app updater installs.
  const installer = asset.installer;
  const file =
    isRecord(installer) && typeof installer.url === "string"
      ? { url: installer.url, size: installer.size }
      : { url: asset.url, size: asset.size };
  let url: URL;
  try {
    url = new URL(file.url);
  } catch {
    throw new Error("Download URL is invalid");
  }
  if (!isTrustedDownloadURL(url)) {
    throw new Error("Download URL is not on a trusted host");
  }
  return { version: data.version, url: url.href, size: typeof file.size === "number" ? file.size : undefined };
};
