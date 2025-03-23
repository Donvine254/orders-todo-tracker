import { SignJWT, jwtVerify } from "jose";
import { createCookie } from "@remix-run/node";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);
const TOKEN_EXPIRY = 24 * 60 * 60;

const user = {
  email: process.env.USER_EMAIL!,
  password_digest: process.env.USER_SECRET!,
};

const sessionCookie = createCookie("session", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: TOKEN_EXPIRY,
});

export async function login(email: string, password: string) {
  const isValid = email === user.email;
  if (!isValid) {
    throw new Error("user not found");
  }
  const isPasswdValid = await bcrypt.compare(password, user.password_digest);
  if (!isPasswdValid) {
    throw new Error("Invalid password");
  }

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
