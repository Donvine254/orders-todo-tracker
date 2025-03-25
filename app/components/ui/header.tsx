import { useState, useEffect } from "react";
import { LogOutIcon, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { formatDate } from "~/lib/utils";
import { toast } from "sonner";

export default function Header() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        console.error("Logout failed");
        toast.error("Failed to process logout request");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glassmorphism  rounded-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow mb-6 border">
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
      <div className="flex flex-col md:flex-row items-center gap-4">
        <p className="text-lg font-medium">{formatDate(currentDate)}</p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className=" ">
            <a href="/setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup
            </a>
          </Button>
          <Button
            variant="outline"
            className="hover:bg-destructive hover:text-white "
            onClick={() => handleLogout()}>
            <LogOutIcon className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
