"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { BookingDetail } from "@/types";
import { Badge } from "@/components/ui/badge";

// Helper format tiền (xử lý 2.3E7)
const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(numericPrice);
};

export const bookingDetailColumns: ColumnDef<BookingDetail>[] = [
    {
        id: "tourInfo",
        header: "Chi tiết chuyến",
        cell: ({ row }) => {
            const detail = row.original.tourDetail;
            return (
                <div>
                    <div><strong>Chuyến:</strong> {detail.startLocation} (ID: {detail.id})</div>
                    <div className="text-xs text-muted-foreground">
                        {new Date(detail.startDay).toLocaleDateString("vi-VN")} - {new Date(detail.endDay).toLocaleDateString("vi-VN")}
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "quantity",
        header: "Số lượng",
    },
    {
        id: "priceType",
        header: "Loại vé",
        cell: ({ row }) => {
            const priceType = row.original.tourPrice.priceType;
            return (
                <Badge variant={priceType === "ADULT" ? "default" : "secondary"}>
                    {priceType}
                </Badge>
            )
        }
    },
    {
        id: "unitPrice",
        header: "Đơn giá",
        cell: ({ row }) => formatPrice(row.original.tourPrice.price)
    },
    {
        accessorKey: "price", // Đây là tổng của line item
        header: "Tổng (Line)",
        cell: ({ row }) => <div className="font-semibold">{formatPrice(row.original.price)}</div>
    },
];