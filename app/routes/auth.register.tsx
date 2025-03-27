import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { register } from "~/lib/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { useState } from "react";
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    await register(email, username, password);
    return redirect("/auth/login");
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
  const [showPassword, setShowPassword] = useState(false);
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
              <CardTitle className="text-xl">Create an Account</CardTitle>
              <CardDescription>
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post">
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        pattern="^[A-Za-z0- 9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
                        className="[&:not(:placeholder-shown):invalid]:border-destructive dark:bg-gray-300 dark:text-black dark:focus:bg-gray-100"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        name="username"
                        onInput={() => {
                          const usernameInput = document.getElementById(
                            "username"
                          ) as HTMLInputElement;
                          const usernameRegex = /^(?!.*@).*$/;
                          if (!usernameRegex.test(usernameInput.value)) {
                            usernameInput.setCustomValidity(
                              "Username cannot be the same as an email or contain '@'"
                            );
                          } else {
                            usernameInput.setCustomValidity("");
                          }
                        }}
                        className="[&:not(:placeholder-shown):invalid]:border-destructive dark:bg-gray-300 dark:text-black dark:focus:bg-gray-100"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <span
                          className="ml-auto"
                          title={
                            showPassword ? "hide password" : "show password"
                          }>
                          {!showPassword ? (
                            <EyeOff
                              className="ml-auto h-4 w-4"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <Eye
                              className="ml-auto h-4 w-4"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </span>
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="false"
                        className="[&:not(:placeholder-shown):invalid]:border-destructive dark:bg-gray-300 dark:text-black dark:focus:bg-gray-100"
                        placeholder="********"
                        required
                        minLength={8}
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
                        "Register"
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a
                      href="/auth/login"
                      className="underline underline-offset-4">
                      Login
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
