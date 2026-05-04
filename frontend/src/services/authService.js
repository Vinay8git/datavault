import { SiweMessage } from "siwe";
import { ethers } from "ethers";
import { apiRequest } from "./apiClient";

/**
 * Wallet login with structured return object:
 * { success: boolean, user?: object, message?: string, code?: string }
 */
export async function loginWithMetaMask(setUser) {
  try {
    if (!window.ethereum) {
      return { success: false, code: "NO_METAMASK", message: "MetaMask not installed" };
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const rawAddress = accounts?.[0];

    if (!rawAddress) {
      return { success: false, code: "NO_ACCOUNT", message: "No wallet account selected" };
    }

    const address = ethers.getAddress(rawAddress);

    const nonceData = await apiRequest({
      base: "auth",
      path: `/auth/nonce?address=${address}`,
      method: "GET",
    });

    if (!nonceData?.success || !nonceData?.nonce) {
      return { success: false, code: "NONCE_FAILED", message: "Failed to fetch nonce" };
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

    const verifyData = await apiRequest({
      base: "auth",
      path: "/auth/verify",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageToSign, signature }),
    });

    if (!verifyData?.success) {
      return { success: false, code: "VERIFY_FAILED", message: "Login failed" };
    }

    const user = verifyData.user || { address };
    setUser(user);

    return { success: true, user };
  } catch (err) {
    console.error("loginWithMetaMask error:", err);
    return {
      success: false,
      code: err?.code || "AUTH_ERROR",
      message: err?.message || "Authentication failed",
    };
  }
}

export async function logout(setUser) {
  try {
    await apiRequest({
      base: "auth",
      path: "/auth/logout",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // even if logout request fails, force local logout state
    console.warn("logout error:", err);
  } finally {
    setUser(null);
  }
}