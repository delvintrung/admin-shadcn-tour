// src/pages/bookings/components/BookingColumns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useDeleteBooking } from "@/hooks/useBookings"; // Import hook
import { toast } from "sonner";
import { BookingForm } from "./BookingForm"; // Sẽ tạo ở bước sau

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
};

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID Booking
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
        accessorKey: "contactEmail",
        header: "Email",
    },
    {
        accessorKey: "contactPhone",
        header: "Điện thoại",
    },
    {
        accessorKey: "totalPrice",
        header: "Tổng tiền",
        cell: ({ row }) => <div className="font-medium">{formatPrice(row.original.totalPrice)}</div>,
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
            const deleteBookingMutation = useDeleteBooking();

            const handleDelete = () => {
                if (!booking.id) {
                    toast.error("Booking ID không hợp lệ!");
                    return;
                }
                deleteBookingMutation.mutate(booking.id, {
                    onSuccess: () => {
                        toast.success(`Đã xóa booking: ${booking.id}`);
                    },
                    onError: (err) => {
                        toast.error("Lỗi khi xóa booking: " + err.message);
                    },
                });
            };

            return (
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>

                            <BookingForm initialData={booking}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </BookingForm>

                            <DropdownMenuSeparator />

                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="text-red-600"
                                    disabled={deleteBookingMutation.isPending}
                                >
                                    Xóa
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Booking ID "{booking.id}" sẽ bị xóa vĩnh viễn.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteBookingMutation.isPending}>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteBookingMutation.isPending}
                            >
                                {deleteBookingMutation.isPending ? "Đang xóa..." : "Xóa"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];