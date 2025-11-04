"use client";
import {useNavigate} from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Tour } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    {
        accessorKey: "location",
        header: "Địa điểm",
    },
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
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.original.status;
            const variant = status === "ACTIVE" ? "default" : "secondary";
            return (
                <Badge variant={variant} className={status.toUpperCase() === "ACTIVE" ? "bg-green-600" : "bg-red-600"}>
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const tour = row.original;
            const navigate = useNavigate();

            return (
                <Button variant="outline" onClick={
                    () => {
                        navigate(`/tours-detail/${tour.id}/edit`);
                    }
                }>Chỉnh sửa</Button>
            );
        },
    },
];