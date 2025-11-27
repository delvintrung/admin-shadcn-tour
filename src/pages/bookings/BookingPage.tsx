
import { useGetBookings } from "@/hooks/useBookings.ts";
import { columns } from "@/pages/bookings/components/BookingColumns.tsx";
import {BookingDataTable} from "@/pages/bookings/components/BookingDataTable.tsx"; // Import hook bookings

export function BookingsPage() {
    const { data: bookings, isLoading, isError } = useGetBookings();

    if (isLoading) {
        return <div>Đang tải dữ liệu booking...</div>;
    }

    if (isError) {
        return <div>Lỗi khi tải dữ liệu booking!</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Booking</h1>
            </div>
            <BookingDataTable columns={columns} filterKey={"contactEmail"} data={bookings || []} />
        </div>
    );
}