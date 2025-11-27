"use client";

import * as React from "react";
import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
} from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Booking } from "@/types";
import { bookingDetailColumns } from "./BookingDetailColumns";
import {BookingDetailDataTable} from "@/pages/bookings/components/BookingDetailDataTable.tsx";

// 1. Thêm filterKey vào Props
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterKey?: string;
    filterPlaceholder?: string; // Placeholder cho ô input
}

const BookingDetailSubComponent: React.FC<{ data: Booking['bookingDetails'] }> = ({ data }) => {
    return (
        <div className="p-4 bg-muted">
            <h3 className="text-lg font-semibold mb-2">Chi tiết đơn đặt</h3>
            <BookingDetailDataTable
                columns={bookingDetailColumns}
                data={data || []}
            />
        </div>
    );
};

export function BookingDataTable<TData, TValue>({
                                                    columns,
                                                    data,
                                                    filterKey = "contactEmail",
                                                    filterPlaceholder = "Lọc dữ liệu..."
                                                }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [expanded, setExpanded] = React.useState({});

    // @ts-ignore
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getRowId: (row) => (row as Booking).id?.toString() || "",
        getRowCanExpand: (row) => (row as unknown as Booking).bookingDetails?.length > 0,
        state: {
            sorting,
            columnFilters,
            expanded,
        },
    });

    // 2. Lấy cột dựa trên prop filterKey thay vì string cứng
    const filterColumn = table.getColumn(filterKey);

    return (
        <div>
            {/* Chỉ hiển thị ô input nếu cột đó thực sự tồn tại */}
            {filterColumn && (
                <div className="flex items-center py-4">
                    <Input
                        placeholder={filterPlaceholder}
                        value={(filterColumn.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            filterColumn.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                    {row.getIsExpanded() && (
                                        <TableRow>
                                            <TableCell colSpan={table.getAllColumns().length}>
                                                <BookingDetailSubComponent
                                                    data={(row.original as Booking).bookingDetails}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Trang trước
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Trang sau
                </Button>
            </div>
        </div>
    );
}