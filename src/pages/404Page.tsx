import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

export function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <TriangleAlert className="h-24 w-24 text-destructive mb-6" />
            <h1 className="text-6xl font-bold text-destructive">404</h1>
            <h2 className="text-2xl font-semibold mt-4 mb-2">
                Trang không tồn tại
            </h2>
            <p className="text-muted-foreground mb-8">
                Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
            </p>
            <Button asChild>
                <Link to="/">Quay về Trang chủ</Link>
            </Button>
        </div>
    );
}
