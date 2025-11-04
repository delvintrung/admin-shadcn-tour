import { useNavigate, useParams } from "react-router-dom";
import { useGetTourById } from "@/hooks/useTours";
import { TourDetailDataTable } from "./TourDetailTableData";
import { detailColumns } from "./TourDetailByIdColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin } from "lucide-react";
import { TourDetailForm } from "./TourDetailByIdForm.tsx";

export function ToursDetailByIdPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: tour, isLoading, isError } = useGetTourById(id!);

    if (isLoading) {
        return <div className="container mx-auto py-10">Đang tải chi tiết tour...</div>;
    }

    if (isError || !tour) {
        return <div className="container mx-auto py-10">Lỗi: Không tìm thấy tour.</div>;
    }

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <Button variant="outline" onClick={() => navigate("/tours")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại danh sách
                </Button>
                <h1 className="text-3xl font-bold truncate">Chi tiết: {tour.title}</h1>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
                        <Badge variant={tour.status === "ACTIVE" ? "default" : "secondary"} className={tour.status === "ACTIVE" ? "bg-green-600" : ""}>
                            {tour.status}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tour.location}</div>
                        <p className="text-xs text-muted-foreground flex items-center"><MapPin className="mr-1 h-3 w-3" /> Địa điểm</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mô tả chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{tour.longDesc}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Các chuyến đi (Tour Details)</CardTitle>
                    <TourDetailForm tourId={tour.id}>
                        <Button>Thêm chuyến đi mới</Button>
                    </TourDetailForm>
                </CardHeader>
                <CardContent>
                    <TourDetailDataTable columns={detailColumns} data={tour.tourDetails || []} />
                </CardContent>
            </Card>

        </div>
    );
}