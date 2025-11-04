"use client";

import {useParams} from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import type { TourDetail } from "@/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useDeleteTourDetail } from "@/hooks/useTourDetails"; // 1. Import hook xóa
import { toast } from "sonner";
import { TourDetailForm } from "./TourDetailByIdForm";

const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
};

export const detailColumns: ColumnDef<TourDetail>[] = [
    {
        accessorKey: "startLocation",
        header: "Nơi khởi hành",
    },
    {
        accessorKey: "startDay",
        header: "Ngày đi",
        cell: ({ row }) => formatDate(row.original.startDay),
    },
    {
        accessorKey: "endDay",
        header: "Ngày về",
        cell: ({ row }) => formatDate(row.original.endDay),
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.original.status;
            return <Badge variant={status === "ACTIVE" ? "default" : "destructive"} className={status === "ACTIVE" ? "bg-green-600" : ""}>{status}</Badge>;
        },
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const detail = row.original;
            const deleteDetailMutation = useDeleteTourDetail();
            const { id } = useParams<{ id: string }>();

            const handleDelete = () => {
                deleteDetailMutation.mutate(detail.id!, {
                    onSuccess: () => toast.success("Đã xóa chi tiết tour."),
                    onError: (err) => toast.error("Lỗi: " + err.message),
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

                            <TourDetailForm tourId={id!} initialData={detail}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </TourDetailForm>

                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600" disabled={deleteDetailMutation.isPending}>
                                    Xóa
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteDetailMutation.isPending}>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={deleteDetailMutation.isPending}>
                                {deleteDetailMutation.isPending ? "Đang xóa..." : "Xóa"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];