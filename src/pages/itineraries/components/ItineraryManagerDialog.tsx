import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import type { Tour, TourDetail } from "@/types";
import { ItineraryForm } from "./ItineraryForm";

interface ItineraryManagerDialogProps {
    tour: Tour;
    children: React.ReactNode;
}

export function ItineraryManagerDialog({ tour, children }: ItineraryManagerDialogProps) {
    const [isOpen, setOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<TourDetail | null>(null);

    // Helper format ngày
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setOpen(open);
            if (!open) setSelectedDetail(null); // Reset khi đóng
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chọn chuyến đi để thêm lộ trình</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Tour: {tour.title}
                    </p>
                </DialogHeader>

                {!selectedDetail ? (
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-3">
                            {tour.tourDetails && tour.tourDetails.length > 0 ? (
                                tour.tourDetails.map((detail) => (
                                    <div
                                        key={detail.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                        onClick={() => setSelectedDetail(detail)}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium">{detail.startLocation}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(detail.startDay)} - {formatDate(detail.endDay)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge variant={detail.status === "ACTIVE" ? "default" : "secondary"}>
                                                {detail.status}
                                            </Badge>
                                            <Button size="icon" variant="ghost">
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    Tour này chưa có chuyến đi nào. Vui lòng tạo chuyến đi trước.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDetail(null)}
                            className="mb-2"
                        >
                            ← Quay lại danh sách
                        </Button>

                        <div className="border p-4 rounded-md">
                            <h4 className="font-semibold mb-4">
                                Thêm lộ trình cho chuyến: {formatDate(selectedDetail.startDay)}
                            </h4>
                            <ItineraryForm
                                initialData={{
                                    tour_detail_id: Number(selectedDetail.id),
                                    title: "",
                                    content: 0
                                } as any}
                            >
                                <Button className="w-full">Mở Form Nhập Liệu</Button>
                            </ItineraryForm>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}