import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookie = "courses_admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 8;

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookie)?.value;

  return verifyAdminSessionToken(token);
}

export function createAdminSessionToken() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("Admin credentials are not configured.");
  }

  const expiresAt = Date.now() + sessionDurationMs;
  const signature = signAdminSession(String(expiresAt), username, password);

  return `${expiresAt}.${signature}`;
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) return false;

  return safeCompare(username, expectedUsername) && safeCompare(password, expectedPassword);
}

export function getAdminSessionMaxAge() {
  return Math.floor(sessionDurationMs / 1000);
}

function verifyAdminSessionToken(token?: string) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || !token) return false;

  const [rawExpiresAt, signature] = token.split(".");
  const expiresAt = Number(rawExpiresAt);

  if (!rawExpiresAt || !signature || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  return safeCompare(signature, signAdminSession(rawExpiresAt, username, password));
}

function signAdminSession(value: string, username: string, password: string) {
  return createHmac("sha256", password).update(`${username}:${value}`).digest("hex");
}

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}
