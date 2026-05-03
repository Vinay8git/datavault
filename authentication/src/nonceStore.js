import crypto from "crypto";

const NONCE_TTL_MS = Number(process.env.NONCE_TTL_MS || 1000 * 60 * 5); // 5 minutes

// address(lowercase) -> { nonce, createdAt }
const nonceMap = new Map();

const normalizeAddress = (address) => String(address || "").toLowerCase().trim();

export function generateNonce(address) {
  const key = normalizeAddress(address);
  const nonce = crypto.randomBytes(16).toString("hex");
  nonceMap.set(key, { nonce, createdAt: Date.now() });
  return nonce;
}

export function getNonce(address) {
  const key = normalizeAddress(address);
  const value = nonceMap.get(key);
  if (!value) return null;

  const expired = Date.now() - value.createdAt > NONCE_TTL_MS;
  if (expired) {
    nonceMap.delete(key);
    return null;
  }

  return value;
}

export function deleteNonce(address) {
  const key = normalizeAddress(address);
  nonceMap.delete(key);
}

export function cleanupExpiredNonces() {
  const now = Date.now();
  for (const [key, value] of nonceMap.entries()) {
    if (now - value.createdAt > NONCE_TTL_MS) {
      nonceMap.delete(key);
    }
  }
}