import { SignJWT, jwtVerify } from "jose";
import { createCookie } from "@remix-run/node";

const SECRET_KEY = new TextEncoder().encode("your-very-secure-secret-key");
const TOKEN_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

const sessionCookie = createCookie("session", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: TOKEN_EXPIRY,
});

export async function login(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(SECRET_KEY);

  return await sessionCookie.serialize(token);
}

export async function isAuth(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await sessionCookie.parse(cookieHeader)) as string | null;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
