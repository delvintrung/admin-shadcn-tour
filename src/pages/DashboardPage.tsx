import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DollarSign, Map, Users } from "lucide-react";

export function DashboardPage() {
    // TODO: Dữ liệu này sau sẽ được fetch từ API
    const stats = {
        totalRevenue: 125000000,
        totalTours: 12,
        activeBookings: 88,
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Lưới hiển thị các thẻ Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Thẻ 1: Doanh thu */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tổng doanh thu
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatPrice(stats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +10.5% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                {/* Thẻ 2: Tổng số Tour */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tổng số Tour
                        </CardTitle>
                        <Map className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalTours}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 tour mới trong tháng này
                        </p>
                    </CardContent>
                </Card>

                {/* Thẻ 3: Đặt chỗ */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Đặt chỗ (Active)
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.activeBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            +15 so với tuần trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Biểu đồ Doanh thu (Sắp có)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 text-center text-muted-foreground">
                        [Biểu đồ sẽ hiển thị ở đây]
                    </CardContent>
                </Card>
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Tour được xem nhiều (Sắp có)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 text-center text-muted-foreground">
                        [Danh sách tour sẽ hiển thị ở đây]
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}