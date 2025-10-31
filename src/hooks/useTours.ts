// src/hooks/useTours.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {AxiosAdmin} from "@/lib/axios";
import type { Tour } from "@/types";

// 1. Hook để LẤY TẤT CẢ Tour (GET)
export function useGetTours() {
    return useQuery({
        queryKey: ["tours"], // Đây là "khóa" để cache
        queryFn: async () => {
            const { data } = await AxiosAdmin.get("/tours");
            const results = data?.data.result;
            return results;
        },
    });
}

// 2. Hook để THÊM Tour (POST)
export function useAddTour() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTour: Tour) => {
            const { data } = await AxiosAdmin.post<Tour>("/tours", newTour);
            return data;
        },
        onSuccess: () => {
            // Tự động fetch lại query 'tours' sau khi thêm thành công
            queryClient.invalidateQueries({ queryKey: ["tours"] });
        },
    });
}

// 3. Hook để CẬP NHẬT Tour (PATCH/PUT)
export function useUpdateTour() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Tour }) => {
            const { data: responseData } = await AxiosAdmin.patch<Tour>(
                `/tours/${id}`,
                data
            );
            return responseData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tours"] });
        },
    });
}

// 4. Hook để XÓA Tour (DELETE)
export function useDeleteTour() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await AxiosAdmin.delete(`/tours/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tours"] });
        },
    });
}