import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { login } from "~/lib/auth";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "sonner";
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const session = await login(email, password);
    return redirect("/", {
      headers: {
        "Set-Cookie": session,
      },
    });
    // eslint-disable-next-line
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Invalid email or password" },
      { status: 401 }
    );
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <div className="flex flex-col min-h-screen items-center justify-center px-4 ">
        {/* add logo here */}
        <img
          src="https://res.cloudinary.com/dipkbpinx/image/upload/v1742926193/logos/rphbzk7aho7rlc9biwob.png"
          style={{
            maxWidth: "120px",
            height: "auto",
            verticalAlign: "middle",
            fontStyle: "italic",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          className="dark:hidden"
          alt="logo"
          fetchpriority="high"
        />
        {/* add a logo for dark theme */}
        <img
          src="https://res.cloudinary.com/dipkbpinx/image/upload/v1742885355/logos/gvqi8mshjwwqdw1f08aw.png"
          className="hidden dark:block"
          style={{
            maxWidth: "120px",
            height: "auto",
            verticalAlign: "middle",
            fontStyle: "italic",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          alt="logo"
          fetchpriority="high"
        />
        {/* beginning of form */}
        <div className="flex flex-col gap-6 w-full max-w-md shadow">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Login with your Google account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post">
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="w-full dark:bg-gray-200 dark:text-black"
                      type="button"
                      onClick={() => {
                        toast.info("Feature not supported", {
                          position: "top-center",
                        });
                      }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 128"
                        width="1.5em"
                        height="1.5em">
                        <path
                          fill="#fff"
                          d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.3 74.3 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.2 36.2 0 0 1-13.93 5.5a41.3 41.3 0 0 1-15.1 0A37.2 37.2 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.3 38.3 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.3 34.3 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.2 61.2 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38"></path>
                        <path
                          fill="#e33629"
                          d="M44.59 4.21a64 64 0 0 1 42.61.37a61.2 61.2 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.3 34.3 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21"></path>
                        <path
                          fill="#f8bd00"
                          d="M3.26 51.5a63 63 0 0 1 5.5-15.9l20.73 16.09a38.3 38.3 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9"></path>
                        <path
                          fill="#587dbd"
                          d="M65.27 52.15h59.52a74.3 74.3 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68"></path>
                        <path
                          fill="#319f43"
                          d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.2 37.2 0 0 0 14.08 6.08a41.3 41.3 0 0 0 15.1 0a36.2 36.2 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.7 63.7 0 0 1 8.75 92.4"></path>
                      </svg>
                      Google
                    </Button>
                  </div>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        className="[&:not(:placeholder-shown):invalid]:border-destructive dark:bg-gray-300 dark:text-black dark:focus:bg-gray-100"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="/reset-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline">
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        className="[&:not(:placeholder-shown):invalid]:border-destructive dark:bg-gray-300 dark:text-black dark:focus:bg-gray-100"
                        placeholder="********"
                        required
                        minLength={6}
                      />
                      {actionData?.error && (
                        <small className="text-destructive">
                          {actionData.error}
                        </small>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/register"
                      className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
