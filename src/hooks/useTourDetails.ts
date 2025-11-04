import { useMutation, useQueryClient } from "@tanstack/react-query";
import {AxiosAdmin} from "@/lib/axios";
import type { TourDetail } from "@/types";
export interface AddTourDetailPayload {
    tour: {
        id: string;
    };
    startLocation: string;
    startDay: string;
    endDay: string;
    status: "ACTIVE" | "PENDING" | "CLOSED";
    tourPrices: Array<{
        priceType: "ADULT" | "CHILD";
        price: number;
    }>;
}

export interface UpdateTourDetailPayload {
    startLocation: string;

    startDay: string;

    endDay: string;

    status: "ACTIVE" | "PENDING" | "CLOSED";

    tourPrices: Array<{
        priceType: "ADULT" | "CHILD";
        price: number;
    }>;
}

export function useAddTourDetail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newDetail: AddTourDetailPayload) => {
            const { data } = await AxiosAdmin.post<TourDetail>("/tours/details", newDetail);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tours-detail"] });
        },
    });
}

export function useDeleteTourDetail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (detailId: string) => {
            await AxiosAdmin.delete(`/tour-details/${detailId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tours-detail"] });
        },
    });
}

export function useUpdateTourDetail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedDetail: TourDetail) => {
            const { data } = await AxiosAdmin.put<TourDetail>(`/tour-details/${updatedDetail.id}`, updatedDetail);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tours"] });
        },
    });
}
