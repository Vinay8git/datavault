import { SiweMessage } from "siwe";
import { ethers } from "ethers";

const BACKEND_URL = "http://localhost:4000";

export async function loginWithMetaMask(setUser) {
  try {
    if (!window.ethereum) {
      return { success: false, message: "MetaMask not installed" };
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const rawAddress = accounts[0];
    const address = ethers.getAddress(rawAddress);

    const nonceRes = await fetch(`${BACKEND_URL}/auth/nonce?address=${address}`, {
      credentials: "include",
    });

    const nonceData = await nonceRes.json();
    if (!nonceRes.ok || !nonceData?.success || !nonceData?.nonce) {
      return {
        success: false,
        message: nonceData?.message || "Failed to fetch nonce",
      };
    }

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in to DataVaultX",
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce: nonceData.nonce,
    });

    const messageToSign = message.prepareMessage();

    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [messageToSign, address],
    });

    const verifyRes = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        message: messageToSign,
        signature,
      }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData?.success) {
      return {
        success: false,
        message: verifyData?.message || "Login failed",
      };
    }

    const user = verifyData.user || { address };
    setUser(user);

    return { success: true, user };
  } catch (err) {
    console.error("loginWithMetaMask error:", err);
    return {
      success: false,
      message: err?.message || "Authentication failed",
    };
  }
}