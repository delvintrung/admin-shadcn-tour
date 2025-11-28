"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
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
import type { Itinerary } from "@/types";
import { ItineraryForm } from "./ItineraryForm";
import { useDeleteItineraries } from "@/hooks/useItineraries";
import { toast } from "sonner";

const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
};

export const columns: ColumnDef<Itinerary>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tiêu đề
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "content",
        header: "Content (Num)",
    },
    {
        accessorKey: "tour_detail_id",
        header: "Tour Detail ID",
    },
    {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
        accessorKey: "updatedAt",
        header: "Cập nhật cuối",
        cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const itinerary = row.original;
            const deleteMutation = useDeleteItineraries();

            const handleDelete = () => {
                if (!itinerary.id) return;
                deleteMutation.mutate(itinerary.id, {
                    onSuccess: () => toast.success("Đã xóa lịch trình"),
                    onError: (err) => toast.error("Lỗi xóa: " + err.message),
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

                            <ItineraryForm initialData={itinerary}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </ItineraryForm>

                            <DropdownMenuSeparator />

                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600">
                                    Xóa
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Lịch trình "{itinerary.title}" sẽ bị xóa vĩnh viễn.
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