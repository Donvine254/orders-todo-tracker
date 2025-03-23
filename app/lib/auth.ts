import { SignJWT, jwtVerify } from "jose";
import { createCookie } from "@remix-run/node";
import { db } from "~/db";
import { UserTable } from "~/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
const SECRET_KEY = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET!);

const TOKEN_EXPIRY = 24 * 60 * 60;

const sessionCookie = createCookie("session", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: TOKEN_EXPIRY,
});

export async function login(email: string, password: string) {
  const user = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email.toLowerCase()))
    .limit(1)
    .then((rows) => rows[0]);

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswdValid = await bcrypt.compare(password, user.passwordDigest);
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
