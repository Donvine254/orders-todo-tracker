import { useState } from "react";
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
import { ChevronLeft, Users, Settings, Database, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { motion } from "framer-motion";

const SetupPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("team");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-todo-light to-white p-4 md:p-6">
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
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-medium text-todo-primary">
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
                <TabsList className="grid grid-cols-3 mb-6">
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

                <TabsContent value="team" className="mt-0">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      This section allows you to manage team members who can be
                      assigned to orders.
                    </p>

                    <div className="p-6 border rounded-md bg-gray-50 text-center">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-todo-primary opacity-50" />
                      <p className="text-lg font-medium mb-2">Coming Soon</p>
                      <p className="text-muted-foreground">
                        Team management functionality will be available in the
                        next update.
                      </p>
                    </div>
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
