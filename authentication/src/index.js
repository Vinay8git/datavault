import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import { SiweMessage } from "siwe";
import { generateNonce, getNonce, deleteNonce } from "./nonceStore.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session setup
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "supersecretkey"],
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
  })
);

app.get("/", (req, res) => {
  res.send("Auth Service Running..");
});

//Nonce Route
app.get("/auth/nonce", (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  const nonce = generateNonce(address);

  res.json({ nonce });
});

// Verify Route
app.post("/auth/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;

    if (!message || !signature) {
      return res.status(400).json({ error: "Missing message or signature" });
    }

    // Parse SIWE message
    const siweMessage = new SiweMessage(message);

    const { address, nonce } = siweMessage;

    // Get stored nonce
    const stored = getNonce(address);

    if (!stored) {
      return res.status(400).json({ error: "Nonce not found" });
    }

    // Check nonce match
    if (stored.nonce !== nonce) {
      return res.status(400).json({ error: "Invalid nonce" });
    }

    // Verify signature
    const result = await siweMessage.verify({ signature });

    if (!result.success) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Delete nonce: one-time use
    deleteNonce(address);

    // Create session
    req.session.user = {
      address,
    };

    return res.json({ success: true, address });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Verification failed" });
  }
});

app.get("/auth/me", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: req.session.user,
  });
});



const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});