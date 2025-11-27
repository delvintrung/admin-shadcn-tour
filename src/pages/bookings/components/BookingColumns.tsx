"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, ChevronDown } from "lucide-react";
import type { Booking, BookingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUpdateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";


const formatDate = (dateString?: string)=> {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
};

export const columns: ColumnDef<Booking>[] = [
    {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
            return (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={row.getToggleExpandedHandler()}
                    disabled={!row.getCanExpand()}
                >
                    <ChevronDown
                        className={row.getIsExpanded() ? 'rotate-180 transition-transform' : 'transition-transform'}
                    />
                </Button>
            );
        },
    },
    {
        accessorKey: "id",
        header: "ID Đơn",
    },
    {
        accessorKey: "contactFullname",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Người đặt
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="pl-4">
                <div className="font-medium">{row.original.contactFullName}</div>
                <div className="text-xs text-muted-foreground">ID User: {row.original.userId}</div>
            </div>
        )
    },
    {
        accessorKey: "contactEmail",
        header: "Liên hệ",
        cell: ({ row }) => (
            <div>
                <div>{row.original.contactEmail}</div>
                <div className="text-xs text-muted-foreground">{row.original.contactPhone}</div>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.original.status;
            let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
            let className = "";
            switch (status) {
                case "ACTIVE":
                    variant = "default";
                    className = "bg-green-600 hover:bg-green-700";
                    break;
                case "PENDING":
                    variant = "outline";
                    className = "border-yellow-500 text-yellow-600";
                    break;
                case "CANCELLED":
                    variant = "destructive";
                    break;
                case "COMPLETED":
                    variant = "default";
                    className = "bg-blue-600 hover:bg-blue-700";
                    break;
            }
            return (
                <Badge variant={variant} className={className}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const booking = row.original;
            const updateBookingMutation = useUpdateBooking();

            const handleStatusUpdate = (newStatus: BookingStatus) => {
                if (!booking.id) return;
                const partialData: Partial<Booking> = {
                    status: newStatus,
                };

                updateBookingMutation.mutate(
                    { id: booking.id.toString(), data: partialData },
                    {
                        onSuccess: () => toast.success(`Cập nhật trạng thái sang ${newStatus}`),
                        onError: (err) => toast.error("Lỗi: " + err.message),
                    }
                );
            };

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
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Cập nhật trạng thái</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate("ACTIVE")}>
                                        ACTIVE (Xác nhận)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate("COMPLETED")}>
                                        COMPLETED (Hoàn thành)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate("CANCELLED")}>
                                        CANCELLED (Hủy)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate("PENDING")}>
                                        PENDING (Chờ)
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];