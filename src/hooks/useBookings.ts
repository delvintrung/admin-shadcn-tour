import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {AxiosAdmin} from "@/lib/axios";
import type { Booking } from "@/types";

export function useGetBookings() {
    return useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            const { data } = await AxiosAdmin.get<Booking[]>("/bookings");
            return data;
        },
    });
}

export function useGetBooking(id: string) {
    return useQuery({
        queryKey: ["bookings", id],
        queryFn: async () => {
            const { data } = await AxiosAdmin.get<Booking>(`/bookings/${id}`);
            return data;
        },
        enabled: !!id, // Chỉ fetch khi có ID
    });
}

export function useAddBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newBooking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => { // Omit id và timestamps
            const { data } = await AxiosAdmin.post<Booking>("/bookings", newBooking);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
}

export function useUpdateBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Booking> }) => { // Partial để cho phép update 1 phần
            const { data: responseData } = await AxiosAdmin.patch<Booking>(
                `/bookings/${id}`,
                data
            );
            return responseData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            // Nếu có query chi tiết, cũng invalidate nó
            // queryClient.invalidateQueries({ queryKey: ["bookings", bookingId] });
        },
    });
}

// 5. Hook để XÓA Booking (DELETE)
export function useDeleteBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await AxiosAdmin.delete(`/bookings/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
}