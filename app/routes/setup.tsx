import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChevronLeft,
  Users,
  Settings,
  Database,
  Clock,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { motion } from "framer-motion";
import { redirect, useLoaderData } from "@remix-run/react";
import { isAuth } from "~/lib/auth";
import { MetaFunction } from "@remix-run/node";
import { UserTable } from "~/db/schema";
import { db } from "~/db";
import { desc } from "drizzle-orm";
import TeamMemberTable from "~/components/user-table/table";

export const meta: MetaFunction = () => {
  return [
    { title: "Setup | Order Status Tracker" },
    {
      name: "description",
      content: "A simple website to track order progress!",
    },
  ];
};
export const loader = async ({ request }: { request: Request }) => {
  const isAuthenticated = await isAuth(request);
  if (!isAuthenticated) {
    return redirect("/auth/login");
  }
  const data = await db
    .select({
      id: UserTable.id,
      email: UserTable.email,
      username: UserTable.username,
      createdAt: UserTable.createdAt,
      role: UserTable.role,
    })
    .from(UserTable)
    .orderBy(desc(UserTable.createdAt));

  return Response.json(data);
};

const SetupPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("team");
  const [isMounted, setIsMounted] = useState(false);
  const loaderData = useLoaderData<typeof loader>();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 flex justify-center items-center">
        <Loader2 size={64} className="animate-spin" />
      </div>
    );
  }
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            className="text-todo-primary"
            onClick={() => navigate("/")}>
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </Button>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}>
          <Card className="shadow-md border py-4">
            <CardHeader>
              <CardTitle className="text-2xl font-medium text-todo-primary ">
                System Setup
              </CardTitle>
              <CardDescription>
                Configure your order tracking system settings
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs
                defaultValue="team"
                value={activeTab}
                onValueChange={handleTabChange}>
                <div className="min-w-full px-1 py-1 overflow-x-auto">
                  <TabsList className="inline-flex md:justify-between w-full min-w-max overflow-x-auto">
                    <TabsTrigger
                      value="team"
                      className="data-[state=active]:bg-todo-primary data-[state=active]:text-white">
                      <Users className="h-4 w-4 mr-2" />
                      Team Members
                    </TabsTrigger>
                    <TabsTrigger
                      value="system"
                      className="data-[state=active]:bg-todo-primary data-[state=active]:text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </TabsTrigger>
                    <TabsTrigger
                      value="data"
                      className="data-[state=active]:bg-todo-primary data-[state=active]:text-white">
                      <Database className="h-4 w-4 mr-2" />
                      Data Management
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="team" className="mt-0">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      This section allows you to manage team members who can be
                      assigned to orders.
                    </p>
                    <TeamMemberTable members={loaderData} />
                  </div>
                </TabsContent>

                <TabsContent value="system" className="mt-0">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Configure system settings, notifications, and appearance
                      preferences.
                    </p>

                    <div className="p-6 border rounded-md bg-gray-50 text-center">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-todo-primary opacity-50" />
                      <p className="text-lg font-medium mb-2">Coming Soon</p>
                      <p className="text-muted-foreground">
                        System settings configuration will be available in the
                        next update.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data" className="mt-0">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Import, export, or reset your order data.
                    </p>

                    <div className="p-6 border rounded-md bg-gray-50 text-center">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-todo-primary opacity-50" />
                      <p className="text-lg font-medium mb-2">Coming Soon</p>
                      <p className="text-muted-foreground">
                        Data management features will be available in the next
                        update.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button
                className="bg-todo-primary hover:bg-todo-primary/90"
                onClick={() => navigate("/")}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SetupPage;
