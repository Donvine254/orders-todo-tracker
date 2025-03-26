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
          fetchPriority="high"
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
          fetchPriority="high"
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
                      variant="secondary"
                      className="w-full"
                      type="button"
                      onClick={() => {
                        toast.info("Feature not supported", {
                          position: "top-center",
                        });
                      }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Login with Google
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
