import { SignJWT, jwtVerify } from "jose";
import { createCookie } from "@remix-run/node";
import bcrypt from "bcryptjs";
const SECRET_KEY = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET!);

const TOKEN_EXPIRY = 24 * 60 * 60;

// async function hashPassword() {
//   const password = "YourPasswordHere";
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(password, saltRounds);

//   console.log("Hashed Password:", hashedPassword);
// }

// hashPassword();

const user = {
  email: import.meta.env.VITE_USER_EMAIL!,
  password_digest: import.meta.env.VITE_USER_SECRET!,
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
