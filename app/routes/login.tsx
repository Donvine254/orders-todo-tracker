import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { login } from "~/lib/auth.server";
import { Loader2 } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950">
      <div className="flex min-h-screen items-center justify-center px-4 ">
        <div className="w-full max-w-md space-y-6 bg-todo-primary dark:bg-gray-500/50 p-6 rounded-lg shadow ">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Orders Tracker</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your credentials to sign in
            </p>
          </div>
          <div className="space-y-4 ">
            {actionData?.error && (
              <Alert variant="destructive">
                <AlertDescription>{actionData.error}</AlertDescription>
              </Alert>
            )}

            <Form method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="dark:bg-gray-200 dark:text-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="dark:bg-gray-200 dark:text-black"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
