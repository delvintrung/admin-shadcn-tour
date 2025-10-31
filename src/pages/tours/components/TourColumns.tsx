"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { Tour } from "@/types";
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
import { TourForm } from "./TourForm";
import {useDeleteTour} from "@/hooks/useTours.ts";
import {toast} from "sonner";

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};


export const columns: ColumnDef<Tour>[] = [
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
        cell: ({ row }) => (
            <div className="pl-4 font-medium max-w-xs truncate">
                {row.original.title}
            </div>
        ),
    },
    // Cột Địa điểm
    {
        accessorKey: "location",
        header: "Địa điểm",
    },
    // Cột Giá (Lấy từ dữ liệu lồng)
    {
        id: "price",
        header: "Giá (Người lớn)",
        accessorFn: (row) => {
            // Helper tìm giá người lớn
            const adultPrice = row.tourDetails[0]?.tourPrices.find(
                (p) => p.priceType === "ADULT"
            )?.price;
            return adultPrice || 0;
        },
        cell: ({ row }) => {
            const price = row.getValue("price") as number;
            return <div className="font-medium">{formatPrice(price)}</div>;
        },
    },
    // Cột Trạng thái (Dùng Badge)
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.original.status;
            const variant = status === "ACTIVE" ? "default" : "secondary";
            return (
                <Badge variant={variant} className={status === "ACTIVE" ? "bg-green-600" : ""}>
                    {status}
                </Badge>
            );
        },
    },
    // Cột Actions (Dropdown)
    {
        id: "actions",
        cell: ({ row }) => {
            const tour = row.original;
            const deleteTourMutation = useDeleteTour();

            const handleDelete = () => {
                if (!tour.id) {
                    toast.error("Tour ID không hợp lệ!");
                    return;
                }

                deleteTourMutation.mutate(tour.id, {
                    onSuccess: () => {
                        toast.success(`Đã xóa tour: ${tour.title}`);
                    },
                    onError: (err) => {
                        toast.error("Lỗi khi xóa tour: " + err.message);
                    },
                });
                console.log("Xóa tour:", tour.id);
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

                            {/* Nút Edit: Mở TourForm với dữ liệu ban đầu */}
                            <TourForm initialData={tour}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </TourForm>

                            <DropdownMenuSeparator />

                            {/* Nút Xóa: Mở Dialog xác nhận */}
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600">
                                    Xóa
                                </DropdownMenuItem>
                            </AlertDialogTrigger>

                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dialog Xác Nhận Xóa */}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Tour "{tour.title}" sẽ bị xóa vĩnh viễn.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];