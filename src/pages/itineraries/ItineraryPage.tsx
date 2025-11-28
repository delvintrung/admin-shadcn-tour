
import { ItineraryDataTable } from "./components/ItineraryDataTable";
import { itineraryTourColumns } from "./components/ItineraryTourColumns.tsx";
import { ItineraryForm } from "./components/ItineraryForm";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import {useGetTours} from "@/hooks/useTours.ts";

export default function ItineraryPage() {
    const { data: tours, isLoading, isError } = useGetTours();

    if (isLoading) {
        return <div className="container mx-auto py-10">Đang tải danh sách lịch trình...</div>;
    }

    if (isError) {
        return <div className="container mx-auto py-10 text-red-500">Lỗi khi tải dữ liệu!</div>;
    }

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Quản lý Lịch Trình</h1>
                </div>

                <ItineraryForm>
                    <Button>Thêm Lịch Trình Mới</Button>
                </ItineraryForm>
            </div>

            <ItineraryDataTable columns={itineraryTourColumns} data={tours || []} />
        </div>
    );
}