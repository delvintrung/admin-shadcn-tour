// src/pages/users/components/UserColumns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { User } from "@/types";
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
import { useDeleteUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { UserForm } from "./UserForm"; // Sẽ tạo ở bước sau

const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    // Java Instant (2025-11-02T16:03:00Z) có thể convert trực tiếp
    return new Date(dateString).toLocaleDateString("vi-VN");
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên đầy đủ
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="pl-4 font-medium">{row.original.fullName}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Vai trò",
        cell: ({ row }) => {
            const role = row.original.role;
            const isAdmin = role.nameRole.toUpperCase() === "ADMIN";
            return (
                <Badge variant={isAdmin ? "destructive" : "secondary"}>
                    {role.nameRole}
                </Badge>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.original.status; // boolean
            return (
                <Badge variant={status ? "default" : "outline"} className={status ? "bg-green-600" : ""}>
                    {status ? "Active" : "Inactive"}
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
            const user = row.original;
            const deleteUserMutation = useDeleteUser();

            // Cẩn thận: Không cho xóa Admin (ví dụ)
            const isDeletingAdmin = user.role.nameRole.toUpperCase() === "ADMIN";

            const handleDelete = () => {
                if (!user.id) return;
                deleteUserMutation.mutate(user.id, {
                    onSuccess: () => toast.success(`Đã xóa user: ${user.fullName}`),
                    onError: (err) => toast.error("Lỗi khi xóa user: " + err.message),
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

                            <UserForm initialData={user}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </UserForm>

                            <DropdownMenuSeparator />

                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="text-red-600"
                                    disabled={isDeletingAdmin} // Không cho xóa Admin
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
                                User "{user.fullName}" sẽ bị xóa vĩnh viễn.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];