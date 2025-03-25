import React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { TodoOrder } from "~/types";

interface TablePaginationProps {
  table: Table<TodoOrder>;
}

const TablePagination: React.FC<TablePaginationProps> = ({ table }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Showing {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()} page(s)
      </div>
    </div>
  );
};

export default TablePagination;
