import { useMutation, useQueryClient } from "@tanstack/react-query";
import {AxiosAdmin} from "@/lib/axios";
import type { TourDetail } from "@/types";
export interface AddTourDetailPayload {
    tourId: number
    startLocation: string;
    startDay: string;
    endDay: string;
    capacity: number;
    remainingSeats: number;
    status: "ACTIVE" | "INACTIVE" | "DRAFT"| "FULL";
    tourPrices: Array<{
        priceType: "ADULT" | "CHILD";
        price: number;
    }>;
}

export interface UpdateTourDetailPayload {
    tourId: number
    id: number;
    startLocation: string;

    startDay: string;

    endDay: string;
    capacity: number;
    remainingSeats: number;

    status: "ACTIVE" | "INACTIVE" | "DRAFT"| "FULL";

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

type updatePayload = {
    id: number;
    updatedDetail: UpdateTourDetailPayload;
}


export function useUpdateTourDetail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (variables: updatePayload) => {
            const { id, updatedDetail } = variables;
            const { data } = await AxiosAdmin.put(`/tours/details/${id}`, updatedDetail);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tours"] });
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
