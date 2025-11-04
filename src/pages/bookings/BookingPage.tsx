
import { TourDataTable } from "@/pages/tours/components/TourDataTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useGetBookings } from "@/hooks/useBookings.ts";
import {BookingForm} from "@/pages/bookings/components/BookingForm.tsx";
import {columns} from "@/pages/tours/components/TourColumns.tsx";
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
                <BookingForm>
                    <Button>Thêm Booking mới</Button>
                </BookingForm>
            </div>
            <BookingDataTable columns={columns} data={bookings || []} />
        </div>
    );
}