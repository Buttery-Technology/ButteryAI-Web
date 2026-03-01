// SRP-2048 client implementation using BigInt + Web Crypto API
// Matches ButteryAI-Server's SRPAuthRouteCoordinator.swift proof calculations:
//   M  = H(pad(A) + pad(B) + K)  where K = pad(H(unpad(S)))
//   M2 = H(pad(A) + pad(M) + K)

// RFC 5054 SRP-2048 parameters
const N_HEX =
  "AC6BDB41324A9A9BF166DE5E1389582FAF72B6651987EE07FC3192943DB56050" +
  "A37329CBB4A099ED8193E0757767A13DD52312AB4B03310DCD7F48A9DA04FD50" +
  "E8083969EDB767B0CF6095179A163AB3661A05FBD5FAAAE82918A9962F0B93B8" +
  "55F97993EC975EEAA80D740ADBF4FF747359D041D5C33EA71D281E446B14773B" +
  "CA97B43A23FB801676BD207A436C6481F1D2B9078717461A5B9D32E688F87748" +
  "544523B524B0D57D5EA77A2775D2ECFA032CFBDBF52FB3786160279004E57AE6" +
  "AF874E7303CE53299CCC041C7BC308D82A5698F3A8D0C38271AE35F8E9DBFBB6" +
  "94B5C803D89F7AE435DE236D525F54759B65E372FCD68EF20FA7111F9E4AFF73";

const N = BigInt("0x" + N_HEX);
const g = 2n;
const HASH_LENGTH = 32; // SHA-256 = 32 bytes
const N_BYTES = 256; // 2048 bits = 256 bytes

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function bigIntToBytes(n: bigint): Uint8Array {
  let hex = n.toString(16);
  if (hex.length % 2 !== 0) hex = "0" + hex;
  return hexToBytes(hex);
}

function bytesToBigInt(bytes: Uint8Array): bigint {
  return BigInt("0x" + bytesToHex(bytes));
}

// Pad to N_BYTES (256 bytes for SRP-2048)
function pad(bytes: Uint8Array): Uint8Array {
  if (bytes.length >= N_BYTES) return bytes;
  const padded = new Uint8Array(N_BYTES);
  padded.set(bytes, N_BYTES - bytes.length);
  return padded;
}

// Remove leading zero bytes
function unpad(bytes: Uint8Array): Uint8Array {
  let start = 0;
  while (start < bytes.length - 1 && bytes[start] === 0) start++;
  return bytes.slice(start);
}

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hash = await crypto.subtle.digest("SHA-256", data as unknown as BufferSource);
  return new Uint8Array(hash);
}

async function hashConcat(...buffers: Uint8Array[]): Promise<Uint8Array> {
  let totalLen = 0;
  for (const b of buffers) totalLen += b.length;
  const combined = new Uint8Array(totalLen);
  let offset = 0;
  for (const b of buffers) {
    combined.set(b, offset);
    offset += b.length;
  }
  return sha256(combined);
}

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base = ((base % mod) + mod) % mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

async function computeX(salt: Uint8Array, email: string, password: string): Promise<bigint> {
  const identity = new TextEncoder().encode(`${email}:${password}`);
  const identityHash = await sha256(identity);
  const xHash = await hashConcat(salt, identityHash);
  return bytesToBigInt(xHash);
}

async function computeU(A: Uint8Array, B: Uint8Array): Promise<bigint> {
  const hash = await hashConcat(pad(A), pad(B));
  return bytesToBigInt(hash);
}

async function computeK_multiplier(): Promise<bigint> {
  const hash = await hashConcat(pad(bigIntToBytes(N)), pad(bigIntToBytes(g)));
  return bytesToBigInt(hash);
}

// Generate random private key
function generatePrivateKey(): bigint {
  const bytes = new Uint8Array(HASH_LENGTH);
  crypto.getRandomValues(bytes);
  return bytesToBigInt(bytes);
}

export async function generateRegistrationCredentials(
  email: string,
  password: string,
): Promise<{ salt: string; verifier: string }> {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const salt = bytesToHex(saltBytes);

  const x = await computeX(saltBytes, email, password);
  const v = modPow(g, x, N);
  const verifier = bytesToHex(bigIntToBytes(v));

  return { salt, verifier };
}

export function generateClientKeys(): { publicKey: string; privateKey: string } {
  const a = generatePrivateKey();
  const A = modPow(g, a, N);
  return {
    publicKey: bytesToHex(bigIntToBytes(A)),
    privateKey: bytesToHex(bigIntToBytes(a)),
  };
}

export async function computeClientProof(
  privateKeyHex: string,
  publicKeyAHex: string,
  serverPublicKeyBHex: string,
  saltHex: string,
  email: string,
  password: string,
): Promise<{ proof: string; sharedSecret: Uint8Array }> {
  const a = BigInt("0x" + privateKeyHex);
  const A = BigInt("0x" + publicKeyAHex);
  const B = BigInt("0x" + serverPublicKeyBHex);
  const saltBytes = hexToBytes(saltHex);

  const u = await computeU(bigIntToBytes(A), bigIntToBytes(B));
  if (u === 0n) throw new Error("Invalid SRP parameters: u is zero");

  const k = await computeK_multiplier();
  const x = await computeX(saltBytes, email, password);

  // S = (B - k * g^x) ^ (a + u * x) mod N
  const gx = modPow(g, x, N);
  const kgx = (k * gx) % N;
  const base = ((B - kgx) % N + N) % N;
  const exp = (a + u * x) % (N - 1n);
  const S = modPow(base, exp, N);

  // K = pad(H(unpad(S))) — server's custom key derivation
  const S_bytes = bigIntToBytes(S);
  const K = pad(await sha256(unpad(S_bytes)));

  // M = H(pad(A) + pad(B) + K) — server's custom proof
  const A_bytes = bigIntToBytes(A);
  const B_bytes = bigIntToBytes(B);
  const M = await hashConcat(pad(A_bytes), pad(B_bytes), K);

  return { proof: bytesToHex(M), sharedSecret: K };
}

export async function verifyServerProof(
  publicKeyAHex: string,
  clientProofHex: string,
  sharedSecret: Uint8Array,
  serverProofHex: string,
): Promise<boolean> {
  const A_bytes = hexToBytes(publicKeyAHex);
  const M_bytes = hexToBytes(clientProofHex);

  // M2 = H(pad(A) + pad(M) + K)
  const expected = await hashConcat(pad(A_bytes), pad(M_bytes), sharedSecret);
  return bytesToHex(expected) === serverProofHex.toLowerCase();
}
