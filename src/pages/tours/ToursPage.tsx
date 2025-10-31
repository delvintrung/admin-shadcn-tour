import { TourForm } from "./components/TourForm";
import { TourDataTable } from "./components/TourDataTable";
import { columns } from "./components/TourColumns";
import {Button} from "@/components/ui/button.tsx";
import { useGetTours } from "@/hooks/useTours";


export function ToursPage() {

    const { data: tours, isLoading, isError } = useGetTours();





    if (isLoading) {
        return <div>Đang tải dữ liệu tour...</div>;
    }

    if (isError) {
        return <div>Lỗi khi tải dữ liệu!</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Tour</h1>

                <TourForm>
                    <Button>Thêm Tour mới</Button>
                </TourForm>
            </div>

            <TourDataTable columns={columns} data={tours || []} />
        </div>
    );
}