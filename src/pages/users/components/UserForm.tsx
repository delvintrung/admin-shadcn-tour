
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type {Role, User} from "@/types";
import { useState, type ReactNode } from "react";
import { useAddUser, useUpdateUser, type UserFormData } from "@/hooks/useUsers";
import { useGetRoles } from "@/hooks/useRoles";
import { toast } from "sonner";

const userSchema = z.object({
    fullname: z.string().min(1, "Tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    // Password là optional, chỉ validate nếu được nhập
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự").optional().or(z.literal("")),
    roleId: z.string().min(1, "Vai trò là bắt buộc"), // Dùng string cho Select
    status: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
    initialData?: User;
    children?: ReactNode;
}

export function UserForm({ initialData, children }: UserFormProps) {
    const [isOpen, setOpen] = useState(false);
    const addUserMutation = useAddUser();
    const updateUserMutation = useUpdateUser();
    const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

    const isPending = addUserMutation.isPending || updateUserMutation.isPending;
    const isEditMode = !!initialData;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullname: initialData?.fullName || "",
            email: initialData?.email || "",
            password: "", // Luôn để trống password
            roleId: initialData?.role?.id.toString() || "",
            status: initialData?.status ?? true,
        },
    });

    const onSubmit = (data: UserFormValues) => {
        const formattedData: UserFormData = {
            fullname: data.fullname,
            email: data.email,
            roleId: Number(data.roleId),
            status: data.status,
        };

        // CHỈ thêm password vào payload nếu nó được nhập
        if (data.password) {
            formattedData.password = data.password;
        }

        if (isEditMode && initialData.id) {
            // Chế độ CẬP NHẬT
            updateUserMutation.mutate(
                { id: initialData.id, data: formattedData },
                {
                    onSuccess: () => {
                        toast.success("Cập nhật user thành công!");
                        setOpen(false);
                    },
                    onError: (err) => toast.error("Lỗi khi cập nhật: " + err.message),
                }
            );
        } else {
            // Chế độ THÊM MỚI
            addUserMutation.mutate(formattedData, {
                onSuccess: () => {
                    toast.success("Thêm user mới thành công!");
                    form.reset();
                    setOpen(false);
                },
                onError: (err) => toast.error("Lỗi khi thêm: " + err.message),
            });
        }
    };

    const trigger = children ? (
        <span onClick={() => setOpen(true)}>
            {children}
        </span>
    ) : (
        <Button onClick={() => setOpen(true)}>Thêm User mới</Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Chỉnh sửa User" : "Thêm User mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên đầy đủ</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nguyễn Văn A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {isEditMode ? "Để trống nếu không muốn thay đổi." : "Ít nhất 6 ký tự."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vai trò</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingRoles}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoadingRoles ? "Đang tải..." : "Chọn vai trò"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles?.map((role : Role) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {role.nameRole}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Trạng thái</FormLabel>
                                        <FormDescription>
                                            Tài khoản này đang hoạt động hay bị vô hiệu hóa.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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