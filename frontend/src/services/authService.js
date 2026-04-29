import { SiweMessage } from "siwe";
import { ethers } from "ethers";

const BACKEND_URL = "http://localhost:4000";

export async function loginWithMetaMask() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  // 1. Get wallet
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  
const rawAddress = accounts[0];
const address = ethers.getAddress(rawAddress);

  // 2. Get nonce
  const nonceRes = await fetch(
    `${BACKEND_URL}/auth/nonce?address=${address}`,
    { credentials: "include" }
  );

  const { nonce } = await nonceRes.json();

  // 3. Create SIWE message
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: "Sign in to DataVault",
    uri: window.location.origin,
    version: "1",
    chainId: 1,
    nonce,
  });

  const messageToSign = message.prepareMessage();

  // 4. Sign
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [messageToSign, address],
  });

  // 5. Verify
  const res = await fetch(`${BACKEND_URL}/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      message: messageToSign,
      signature,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error("Login failed");
  }

  return data;
}