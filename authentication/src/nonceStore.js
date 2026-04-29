// In-memory store: for now
const nonceStore = new Map();

export function generateNonce(address) {
  const nonce = Math.random().toString(36).substring(2, 10);

  nonceStore.set(address, {
    nonce,
    createdAt: Date.now(),
  });

  return nonce;
}

export function getNonce(address) {
  return nonceStore.get(address);
}

export function deleteNonce(address) {
  nonceStore.delete(address);
}