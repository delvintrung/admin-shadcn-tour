import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {type Resolver, useForm} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, type ReactNode } from "react";
// 1. Import CẢ 3 hook
import {
    useAddTourDetail,
    useUpdateTourDetail,
    type AddTourDetailPayload,
    type UpdateTourDetailPayload
} from "@/hooks/useTourDetails";
import { toast } from "sonner";
import type { TourDetail } from "@/types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";

// Zod Schema (như cũ)
const tourDetailSchema = z.object({
    startLocation: z.string().min(1, "Nơi đi là bắt buộc"),
    startDay: z.string().min(1, "Ngày đi là bắt buộc"),
    endDay: z.string().min(1, "Ngày về là bắt buộc"),
    status: z.enum(["ACTIVE", "PENDING", "CLOSED"]),
    adultPrice: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({ error: "Giá phải là số" }).min(0)
    ),
    childPrice: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({ error: "Giá phải là số" }).min(0)
    ),
});

type TourDetailFormValues = z.infer<typeof tourDetailSchema>;

interface TourDetailFormProps {
    tourId: string;
    initialData?: TourDetail;
    children: ReactNode;
}

export function TourDetailForm({ tourId, initialData, children }: TourDetailFormProps) {
    const [isOpen, setOpen] = useState(false);
    const addDetailMutation = useAddTourDetail();
    const updateDetailMutation = useUpdateTourDetail(); // 2. Thêm hook Sửa

    const isEditMode = !!initialData;
    const isPending = addDetailMutation.isPending || updateDetailMutation.isPending;
    const resolver = zodResolver(tourDetailSchema) as Resolver<TourDetailFormValues>;

    const getPrice = (type: "ADULT" | "CHILD") => {
        return initialData?.tourPrices.find(p => p.priceType === type)?.price || 0;
    }

    const form = useForm<TourDetailFormValues>({
        resolver,
        defaultValues: {
            startLocation: initialData?.startLocation || "",
            startDay: initialData?.startDay || "",
            endDay: initialData?.endDay || "",
            status: initialData?.status || "ACTIVE",
            adultPrice: getPrice("ADULT"),
            childPrice: getPrice("CHILD"),
        },
    });

    const onSubmit = (data: TourDetailFormValues) => {
        const tourPrices = [
            { priceType: "ADULT" as const, price: data.adultPrice },
            { priceType: "CHILD" as const, price: data.childPrice },
        ];

        if (isEditMode && initialData) {
            const payload: UpdateTourDetailPayload = {
                tour: { id: tourId },
                id: Number(initialData.id),
                startLocation: data.startLocation,
                startDay: data.startDay,
                endDay: data.endDay,
                status: data.status,
                tourPrices: tourPrices,
            };
            updateDetailMutation.mutate(
                {id: Number(initialData.id!),updatedDetail: payload},
                {
                    onSuccess: () => { toast.success("Cập nhật chi tiết thành công!"); setOpen(false); },
                    onError: (err : any) => toast.error("Lỗi: " + err.message),
                }
            );

        } else {
            const payload: AddTourDetailPayload = {
                tour: { id: tourId },
                startLocation: data.startLocation,
                startDay: data.startDay,
                endDay: data.endDay,
                status: data.status,
                tourPrices: tourPrices,
            };
            addDetailMutation.mutate(payload, {
                onSuccess: () => { toast.success("Thêm chi tiết thành công!"); form.reset(); setOpen(false); },
                onError: (err) => toast.error("Lỗi: " + err.message),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
        <span onClick={() => setOpen(true)}>
          {children}
        </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Chỉnh sửa chi tiết" : `Thêm chi tiết (Tour ID: ${tourId})`}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="startLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nơi khởi hành</FormLabel>
                                    <FormControl><Input placeholder="Ví dụ: Hà Nội" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày khởi hành</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày kết thúc</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="adultPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá người lớn (VND)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="childPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá trẻ em (VND)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField control={form.control} render={({field}) =>
                            (<FormItem>
                                <FormLabel>Trạng Thái</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                                <SelectItem value="PENDING">PENDING</SelectItem>
                                                <SelectItem value="CLOSED">CLOSED</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>)
                        } name="status" />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Đang lưu..." : "Lưu"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}