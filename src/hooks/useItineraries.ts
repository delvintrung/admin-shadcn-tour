import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {AxiosAdmin} from "@/lib/axios";
import type { Itinerary } from "@/types";

export type ItineraryData = {
    id: string;
    content: number;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export function useGetItineraries() {
    return useQuery({
        queryKey: ["itineraries"],
        queryFn: async () => {
            const { data } = await AxiosAdmin.get("/tour_details/itinerary");
            return data.data.result as Itinerary[];
        },
    });
}

export function useCreateItinerary() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Itinerary>) => {
            const { data: responseData } = await AxiosAdmin.post<Itinerary>(
                "/tour_details/itinerary",
                data
            );
            return responseData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["itineraries"] });
        },
    });

}

export function useUpdateItineraries() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Itinerary> }) => {
            const { data: responseData } = await AxiosAdmin.patch<Itinerary>(
                `/tour_details/itinerary/${id}`,
                data
            );
            return responseData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["itineraries"] });
        },
    });
}



export function useDeleteItineraries() {
const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            await AxiosAdmin.delete(`/itineraries/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["itineraries"] });
        },
    });

}