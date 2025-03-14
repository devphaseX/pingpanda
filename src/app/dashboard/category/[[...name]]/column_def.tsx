"use client";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { DeliverStatus } from "@/server/__internals/constants/enums";
import { Event } from "@/server/__internals/db/schemas";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type EventWithCategory = Event & { category: string };

export function getColumnDefs(event?: EventWithCategory) {
  const columnDefs: ColumnDef<EventWithCategory>[] = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span>{row.getValue("category") ?? "Uncategorized"} </span>
      ),
    },

    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <span>{date.toLocaleString()}</span>;
      },
    },
    ...(event
      ? Object.entries((event.fields as object) ?? {}).map(
          ([field, value]) => ({
            accessorFn: (row: EventWithCategory) =>
              (row.fields as Record<string, any>)[field],
            header: field,
            cell: (context: CellContext<EventWithCategory, unknown>) =>
              context.getValue() ?? "-",
          }),
        )
      : []),

    {
      accessorKey: "deliver_status",
      header: "Delivery Status",
      cell: ({ row }) => {
        const status = row.getValue<DeliverStatus>("deliver_status");
        return (
          <span
            className={cn("px-2 py-1 rounded-full text-xs font-semibold", {
              "bg-green-100 text-green-800": status === DeliverStatus.DELIVERED,
              "bg-yellow-100 text-yellow-800": status === DeliverStatus.PENDING,
              "bg-red-100 text-red-800": status === DeliverStatus.FAILED,
            })}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return columnDefs;
}
