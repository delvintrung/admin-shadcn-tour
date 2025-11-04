import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Tour } from "@/types";
import { useState } from "react";
import type { ReactNode } from "react";
import { useAddTour, useUpdateTour, useUploadImage } from "@/hooks/useTours";
import { toast } from "sonner";
import {Label} from "@/components/ui/label.tsx";

const tourSchema = z.object({
    title: z.string().min(1, "Tên tour là bắt buộc"),
    shortDesc: z.string().min(1, "Mô tả ngắn là bắt buộc"),
    longDesc: z.string(),
    duration: z.string().min(1, "Thời lượng là bắt buộc"),
    capacity: z.coerce.number().min(1, "Số chỗ phải lớn hơn 0"),
    location: z.string().min(1, "Địa điểm là bắt buộc"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    startLocation: z.string().min(1, "Nơi đi là bắt buộc"),
    startDay: z.string().min(1, "Ngày đi là bắt buộc"),
    endDay: z.string().min(1, "Ngày về là bắt buộc"),
    adultPrice: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({ error: "Giá phải là số" })
            .min(0, "Giá không được âm")
    ),
    childPrice: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({ error: "Giá phải là số" })
            .min(0, "Giá không được âm")
    ),
});

type TourFormValues = z.infer<typeof tourSchema>;

interface TourFormProps {
    initialData?: Tour;
    children?: ReactNode;
}

export function TourForm({ initialData, children }: TourFormProps) {
    const [isOpen, setOpen] = useState(false);
    const [imageUpload, setImageUpload] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
    const addTourMutation = useAddTour();
    const updateTourMutation = useUpdateTour();
    const uploadImageMutation = useUploadImage();
    const resolver = zodResolver(tourSchema) as Resolver<TourFormValues>;

    const isPending = addTourMutation.isPending || updateTourMutation.isPending;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageUpload(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setImageUpload(null);
            setPreviewUrl(initialData?.imageUrl || null);
        }
    };

    const form = useForm<TourFormValues>({
        resolver,
        defaultValues: {
            title: initialData?.title || "",
            shortDesc: initialData?.shortDesc || "",
            longDesc: initialData?.longDesc || "",
            duration: initialData?.duration || "",
            capacity: initialData?.capacity || 25,
            location: initialData?.location || "",
            status: initialData?.status || "ACTIVE",
            startLocation: initialData?.tourDetails[0]?.startLocation || "",
            startDay: initialData?.tourDetails[0]?.startDay || "",
            endDay: initialData?.tourDetails[0]?.endDay || "",
            adultPrice: initialData?.tourDetails[0]?.tourPrices.find(p => p.priceType === "ADULT")?.price || 0,
            childPrice: initialData?.tourDetails[0]?.tourPrices.find(p => p.priceType === "CHILD")?.price || 0,
        },
    });

    const onSubmit = async (data: TourFormValues) => {
        let finalImageUrl = initialData?.imageUrl || "";

        if (!initialData && imageUpload) {
            try {
                toast.info("Đang tải ảnh lên...");
                const imageUrl = await uploadImageMutation.mutateAsync({
                    imageFile: imageUpload,
                    folder: "tours"
                });
                finalImageUrl = imageUrl;
                toast.success("Tải ảnh lên thành công.");
            } catch (err) {
                toast.error("Tải ảnh thất bại: " + (err as Error).message);
                return;
            }
        }
        const formattedData: Tour = {
            title: data.title,
            imageUrl: finalImageUrl,
            shortDesc: data.shortDesc,
            longDesc: data.longDesc,
            duration: data.duration,
            capacity: data.capacity,
            location: data.location,
            status: data.status,
            tourDetails: [
                {
                    startLocation: data.startLocation,
                    startDay: data.startDay,
                    endDay: data.endDay,
                    status: "ACTIVE",
                    tourPrices: [
                        { priceType: "ADULT", price: data.adultPrice },
                        { priceType: "CHILD", price: data.childPrice == 0 ? 1 : data.childPrice },
                    ],
                },
            ],
        };

        if (initialData && initialData.id) {
            // updateTourMutation.mutate(
            //     { id: initialData.id, data: formattedData },
            //     {
            //         onSuccess: () => {
            //             toast.success("Cập nhật tour thành công!");
            //             setOpen(false);
            //         },
            //         onError: (err) => {
            //             toast.error("Lỗi khi cập nhật tour: " + err.message);
            //         },
            //     }
            // );
        } else {

            addTourMutation.mutate(formattedData, {
                onSuccess: () => {
                    toast.success("Thêm tour mới thành công!");
                    form.reset();
                    setImageUpload(null);
                    setOpen(false);
                },
                onError: (err) => {
                    toast.error("Lỗi khi thêm tour: " + err.message);
                },
            });
        }
    };

    const trigger = children ? (
        <span onClick={() => setOpen(true)}>
            {children}
        </span>
    ) : (
        <Button onClick={() => setOpen(true)}>Thêm Tour mới</Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Chỉnh sửa Tour" : "Thêm Tour mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Tên tour */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên tour</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tour Trung Quốc 8 ngày 7 đêm..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Thời lượng & Địa điểm */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thời lượng</FormLabel>
                                        <FormControl>
                                            <Input placeholder="8 ngày 7 đêm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa điểm</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Trung Quốc" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Số chỗ & Trạng thái */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số chỗ</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trạng thái</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                                <SelectItem value="PENDING">PENDING</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Mô tả ngắn */}
                        <FormField
                            control={form.control}
                            name="shortDesc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả ngắn</FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Mô tả dài */}
                        <FormField
                            control={form.control}
                            name="longDesc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả chi tiết (Long Desc)</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="imageUrl">Picture</Label>
                            <Input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isPending || !!initialData}
                                name="imageUrl"
                            />
                            {initialData && (
                                <p className="text-sm text-muted-foreground">
                                    Không thể thay đổi ảnh ở chế độ chỉnh sửa.
                                </p>
                            )}
                        </div>

                        {previewUrl && (
                            <div className="mt-4">
                                <Label>Xem trước</Label>
                                <img
                                    src={previewUrl}
                                    alt="Xem trước ảnh tour"
                                    className="mt-2 h-48 w-full object-cover rounded-md border border-input"
                                />
                            </div>
                        )}

                        <h3 className="text-lg font-semibold border-t pt-4">Chi tiết chuyến đi</h3>

                        {/* Nơi đi & Ngày đi */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startLocation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nơi khởi hành</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Hồ Chí Minh" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày đi</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Ngày về */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="endDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày về</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Giá */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="adultPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá người lớn (VND)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
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
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
