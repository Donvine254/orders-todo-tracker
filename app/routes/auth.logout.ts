import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie":
        "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
    },
  });
}
export async function action() {
  try {
    return new Response(null, {
      headers: {
        "Set-Cookie":
          "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
      },
    });
  } catch (error) {
    return new Response("Logout failed", { status: 500 });
  }
}
