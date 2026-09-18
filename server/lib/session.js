const crypto = require("crypto");

const COOKIE_NAME = "sfk_session";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

function getSecret() {
  return process.env.SESSION_SECRET || "";
}

function encode(payload) {
  const secret = getSecret();
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const mac = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function decode(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const secret = getSecret();
  if (!secret) return null;
  const [body, mac] = token.split(".");
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload || !payload.userId || !payload.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: process.env.BASE_PATH || "/",
    maxAge: MAX_AGE_MS
  };
}

function clearCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: process.env.BASE_PATH || "/"
  };
}

function createToken(userId) {
  return encode({
    userId,
    exp: Date.now() + MAX_AGE_MS
  });
}

module.exports = {
  COOKIE_NAME,
  MAX_AGE_MS,
  encode,
  decode,
  cookieOptions,
  clearCookieOptions,
  createToken
};
