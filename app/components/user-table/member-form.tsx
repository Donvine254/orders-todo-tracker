import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { User } from "~/types";

interface TeamMemberFormProps {
  member?: User;
  onSubmit: (data: { username: string; email: string; role: string }) => void;
  onCancel: () => void;
}

const roles = ["user", "admin"];

const TeamMemberForm = ({
  member,
  onSubmit,
  onCancel,
}: TeamMemberFormProps) => {
  const [memberData, setMemberData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const handleChange = (field: keyof typeof memberData, value: string) => {
    setMemberData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (member) {
      setMemberData({
        username: member.username || "",
        email: member.email || "",
        role: member.role || "",
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      memberData.username.trim() &&
      memberData.email.trim() &&
      memberData.role
    ) {
      onSubmit(memberData);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {member ? "Edit Team Member" : "Add Team Member"}
        </DialogTitle>
        <DialogDescription>
          {member
            ? "Update the team member information below."
            : "Add a new team member to your organization."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Username</Label>
          <Input
            id="username"
            className="[&:not(:placeholder-shown):invalid]:border-destructive dark:bg-gray-300 dark:text-black dark:focus:bg-gray-100"
            minLength={3}
            value={memberData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={memberData.email}
            autoComplete="email"
            pattern="^[A-Za-z0- 9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
            className="[&:not(:placeholder-shown):invalid]:border-destructive dark:bg-gray-300 dark:text-black dark:focus:bg-gray-100"
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={memberData.role || "user"}
            disabled={!member}
            onValueChange={(value) => handleChange("role", value)}
            required>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((roleOption) => (
                <SelectItem key={roleOption} value={roleOption}>
                  {roleOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-todo-primary hover:bg-todo-primary/90">
            {member ? "Update" : "Add"} Member
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default TeamMemberForm;
