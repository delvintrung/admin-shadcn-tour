
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {AxiosAdmin} from "@/lib/axios";
import type { User } from "@/types";

export type UserFormData = {
    fullname: string;
    email: string;
    password?: string;
    roleId: number;
    status: boolean;
}

export function useGetUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await AxiosAdmin.get("/users");
            return data.data.result;
        },
    });
}

// 2. Hook để THÊM User (POST)
export function useAddUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newUser: UserFormData) => {
            const { data } = await AxiosAdmin.post<User>("/users", newUser);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// 3. Hook để CẬP NHẬT User (PATCH/PUT)
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<UserFormData> }) => {
            const { data: responseData } = await AxiosAdmin.patch<User>(
                `/users/${id}`,
                data
            );
            return responseData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// 4. Hook để XÓA User (DELETE)
export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await AxiosAdmin.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}