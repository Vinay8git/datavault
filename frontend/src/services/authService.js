import { SiweMessage } from "siwe";
import { ethers } from "ethers";
import { apiRequest } from "./apiClient";

export async function loginWithMetaMask(setUser, options = {}) {
  const onStageChange = options.onStageChange || (() => {});

  try {
    if (!window.ethereum) {
      return { success: false, code: "NO_METAMASK", message: "MetaMask not installed" };
    }

    onStageChange("connecting");
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

    onStageChange("signing");
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [messageToSign, address],
    });

    onStageChange("verifying");
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
  } catch (_err) {
    // no-op
  } finally {
    setUser(null);
  }
}