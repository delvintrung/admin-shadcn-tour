"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tour } from "@/types";
import { ItineraryManagerDialog } from "./ItineraryManagerDialog";

export const itineraryTourColumns: ColumnDef<Tour>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên Tour
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium max-w-[300px] truncate" title={row.original.title}>{row.original.title}</div>
    },
    {
        accessorKey: "duration",
        header: "Thời lượng",
    },
    {
        accessorKey: "location",
        header: "Địa điểm",
    },
    {
        id: "detailCount",
        header: "Số chuyến đi",
        cell: ({ row }) => {
            const count = row.original.tourDetails?.length || 0;
            return <div className="text-center">{count}</div>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const tour = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>

                        <ItineraryManagerDialog tour={tour}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Thêm lộ trình
                            </DropdownMenuItem>
                        </ItineraryManagerDialog>

                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];