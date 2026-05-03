import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import { SiweMessage } from "siwe";
import { generateNonce, getNonce, deleteNonce, cleanupExpiredNonces } from "./nonceStore.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";
const SESSION_MAX_AGE_MS = Number(process.env.SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 8); // 8h

if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error("SESSION_SECRET must be set and at least 32 characters.");
}

app.set("trust proxy", 1);
app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(
  cookieSession({
    name: "dv_session",
    keys: [SESSION_SECRET],
    httpOnly: true,
    secure: IS_PROD, // true in prod (HTTPS)
    sameSite: IS_PROD ? "none" : "lax",
    maxAge: SESSION_MAX_AGE_MS,
  })
);

app.get("/", (_req, res) => {
  res.send("Auth Service Running..");
});

// Health-check for auth subsystem
app.get("/auth/health", (_req, res) => {
  return res.json({
    ok: true,
    service: "auth",
    env: NODE_ENV,
  });
});

// Nonce Route
app.get("/auth/nonce", (req, res) => {
  cleanupExpiredNonces();

  const address = String(req.query.address || "").trim();

  if (!address) {
    return res.status(400).json({
      success: false,
      code: "MISSING_ADDRESS",
      message: "Address is required",
    });
  }

  const nonce = generateNonce(address);

  return res.json({
    success: true,
    nonce,
  });
});

// Verify Route
app.post("/auth/verify", async (req, res) => {
  try {
    cleanupExpiredNonces();

    const { message, signature } = req.body || {};

    if (!message || !signature) {
      return res.status(400).json({
        success: false,
        code: "MISSING_PAYLOAD",
        message: "Missing message or signature",
      });
    }

    const siweMessage = new SiweMessage(message);
    const { address, nonce, domain, uri } = siweMessage;

    if (!address || !nonce || !domain || !uri) {
      return res.status(400).json({
        success: false,
        code: "INVALID_SIWE_MESSAGE",
        message: "SIWE message missing required fields",
      });
    }

    // Domain binding check
    const expectedHost = new URL(FRONTEND_ORIGIN).host;
    if (domain !== expectedHost) {
      return res.status(401).json({
        success: false,
        code: "DOMAIN_MISMATCH",
        message: "SIWE domain mismatch",
      });
    }

    // URI binding check
    const expectedOrigin = new URL(FRONTEND_ORIGIN).origin;
    if (uri !== expectedOrigin) {
      return res.status(401).json({
        success: false,
        code: "URI_MISMATCH",
        message: "SIWE URI mismatch",
      });
    }

    const stored = getNonce(address);

    if (!stored) {
      return res.status(400).json({
        success: false,
        code: "NONCE_NOT_FOUND",
        message: "Nonce not found or expired",
      });
    }

    if (stored.nonce !== nonce) {
      return res.status(400).json({
        success: false,
        code: "NONCE_INVALID",
        message: "Invalid nonce",
      });
    }

    const result = await siweMessage.verify({ signature });

    if (!result.success) {
      return res.status(401).json({
        success: false,
        code: "INVALID_SIGNATURE",
        message: "Invalid signature",
      });
    }

    // one-time nonce
    deleteNonce(address);

    req.session.user = {
      address,
      authenticatedAt: Date.now(),
    };

    return res.json({
      success: true,
      user: req.session.user,
    });
  } catch (err) {
    console.error("SIWE verify error:", err);
    return res.status(500).json({
      success: false,
      code: "VERIFY_FAILED",
      message: "Verification failed",
    });
  }
});

app.get("/auth/me", (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      code: "UNAUTHENTICATED",
    });
  }

  return res.json({
    success: true,
    authenticated: true,
    user: req.session.user,
  });
});

app.post("/auth/logout", (req, res) => {
  req.session = null;

  return res.json({
    success: true,
    message: "Logged out",
  });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT} (${NODE_ENV})`);
});