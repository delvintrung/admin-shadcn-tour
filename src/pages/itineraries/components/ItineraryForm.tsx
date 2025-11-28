import { useState, type ReactNode } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {type Resolver, useForm} from "react-hook-form";
import { toast } from "sonner";
import type { Itinerary } from "@/types";
import { useCreateItinerary, useUpdateItineraries } from "@/hooks/useItineraries";

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
import {Textarea} from "@/components/ui/textarea.tsx";

const itinerarySchema = z.object({
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    content: z.string().min(1, "Nội dung là bắt buộc"),
    tourDetailId: z.coerce.number().min(1, "Tour Detail ID là bắt buộc"),
});

type ItineraryFormValues = z.infer<typeof itinerarySchema>;

interface ItineraryFormProps {
    initialData?: Itinerary;
    children?: ReactNode;
}

export function ItineraryForm({ initialData, children }: ItineraryFormProps) {
    const [isOpen, setOpen] = useState(false);
    const createMutation = useCreateItinerary();
    const updateMutation = useUpdateItineraries();

    const isPending = createMutation.isPending || updateMutation.isPending;
    const resolver = zodResolver(itinerarySchema) as Resolver<ItineraryFormValues>;

    const form = useForm<ItineraryFormValues>({
        resolver,
        defaultValues: {
            title: initialData?.title || "",
            content: initialData?.content || "",
            tourDetailId: initialData?.tourDetailId || 0,
        },
    });

    const onSubmit = (data: ItineraryFormValues) => {
        if (initialData && initialData.id) {
            updateMutation.mutate(
                { id: initialData.id, data: data },
                {
                    onSuccess: () => {
                        toast.success("Cập nhật lịch trình thành công!");
                        setOpen(false);
                    },
                    onError: (err) => toast.error("Lỗi cập nhật: " + err.message),
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    toast.success("Thêm lịch trình thành công!");
                    form.reset();
                    setOpen(false);
                },
                onError: (err) => toast.error("Lỗi thêm mới: " + err.message),
            });
        }
    };

    const trigger = children ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer">{children}</span>
    ) : (
        <Button onClick={() => setOpen(true)}>Thêm Lịch Trình</Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Sửa Lịch Trình" : "Thêm Lịch Trình Mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ví dụ: Ngày 1 - Khám phá..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Nhập vào lộ trình từng ngày..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tourDetailId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tour Detail ID</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="ID chi tiết tour" {...field} disabled={!!initialData}/>
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