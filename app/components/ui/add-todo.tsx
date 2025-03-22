import { useState } from "react";
import { Button } from "./button";
import { Plus } from "lucide-react";
import EditTodoDialog from "./edit-dialog";
import { motion } from "framer-motion";

const AddTodoButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-todo-primary hover:bg-todo-primary/90 text-white flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add New Order</span>
        </Button>
      </motion.div>

      <EditTodoDialog
        todo={null}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default AddTodoButton;
