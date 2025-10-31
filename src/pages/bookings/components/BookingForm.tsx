// src/pages/bookings/components/BookingForm.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Booking, BookingStatus } from "@/types"; // Import Booking và BookingStatus
import { useState, type ReactNode } from "react";
import { useAddBooking, useUpdateBooking } from "@/hooks/useBookings"; // Import hooks Booking
import { toast } from "sonner";

// Schema cho Booking Form
const bookingSchema = z.object({
    contactEmail: z.string().email("Email không hợp lệ"),
    contactPhone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
    note: z.string().optional(), // note là tùy chọn
    status: z.enum(["ACTIVE", "PENDING", "CANCELLED", "COMPLETED"]),
    totalPrice: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({ invalid_type_error: "Tổng tiền phải là số" })
            .min(0, "Tổng tiền không được âm")
    ),
    // id_user (nếu có, có thể để là string hoặc number tùy DB)
    // Hiện tại chúng ta không thêm vào form nếu nó tự động được backend xử lý.
    // Nếu muốn user tự điền, thêm field này vào schema
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    initialData?: Booking;
    children?: ReactNode;
}

export function BookingForm({ initialData, children }: BookingFormProps) {
    const [isOpen, setOpen] = useState(false);
    const addBookingMutation = useAddBooking();
    const updateBookingMutation = useUpdateBooking();

    const isPending = addBookingMutation.isPending || updateBookingMutation.isPending;

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            contactEmail: initialData?.contactEmail || "",
            contactPhone: initialData?.contactPhone || "",
            note: initialData?.note || "",
            status: initialData?.status || "PENDING", // Mặc định là PENDING
            totalPrice: initialData?.totalPrice || 0,
        },
    });

    const onSubmit = (data: BookingFormValues) => {
        // Tạo đối tượng Booking từ dữ liệu form
        const formattedData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            note: data.note,
            status: data.status,
            totalPrice: data.totalPrice,
            // id_user: ... (nếu bạn muốn gửi từ form)
        };

        if (initialData && initialData.id) {
            // Chế độ CẬP NHẬT
            updateBookingMutation.mutate(
                { id: initialData.id, data: formattedData },
                {
                    onSuccess: () => {
                        toast.success("Cập nhật booking thành công!");
                        setOpen(false);
                    },
                    onError: (err) => {
                        toast.error("Lỗi khi cập nhật booking: " + err.message);
                    },
                }
            );
        } else {
            // Chế độ THÊM MỚI
            addBookingMutation.mutate(formattedData, {
                onSuccess: () => {
                    toast.success("Thêm booking mới thành công!");
                    form.reset();
                    setOpen(false);
                },
                onError: (err) => {
                    toast.error("Lỗi khi thêm booking: " + err.message);
                },
            });
        }
    };

    const trigger = children ? (
        <span onClick={() => setOpen(true)} className="w-full">
            {children}
        </span>
    ) : (
        <Button onClick={() => setOpen(true)}>Thêm Booking mới</Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Chỉnh sửa Booking" : "Thêm Booking mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email liên hệ</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0987654321" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tổng tiền (VND)</FormLabel>
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
                                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ghi chú</FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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