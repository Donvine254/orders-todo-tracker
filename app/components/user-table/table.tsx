import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Dialog } from "~/components/ui/dialog";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { User } from "~/types";
import TeamMemberForm from "./member-form";

interface TeamMemberTableProps {
  members: User[];
}

const TeamMemberTable = ({ members }: TeamMemberTableProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "user":
        return "default";
      default:
        return "outline";
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Team Members ({members.length})</h3>
        <Button
          className="bg-todo-primary hover:bg-todo-primary/90"
          onClick={() => {
            setEditingMember(null);
            setIsFormOpen(true);
          }}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No team members found. Add your first team member to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium text-nowrap text-ellipsis">
                  {member.username}
                </TableCell>
                <TableCell className="text-ellipsis">{member.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(member.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMember(member);
                        setIsFormOpen(true);
                      }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <TeamMemberForm
          member={editingMember || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMember(null);
          }}
        />
      </Dialog>

      {/* <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      /> */}
    </div>
  );
};

export default TeamMemberTable;
