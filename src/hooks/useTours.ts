// src/hooks/useTours.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {AxiosAdmin} from "@/lib/axios";
import type { Tour } from "@/types";

export function useGetTours() {
    return useQuery({
        queryKey: ["tours"],
        queryFn: async () => {
            const { data } = await AxiosAdmin.get("/tours");
            const results = data?.data.result;
            return results;
        },
    });
}

type UploadImagePayload = {
    imageFile: File;
    folder: string;
}

export function useUploadImage() {
    return useMutation({
        mutationFn: async (variables: UploadImagePayload) => {
            const { imageFile, folder } = variables;
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("folder", folder);

            const { data } = await AxiosAdmin.post(
                "/tours/file",
                formData,
                {
                    headers: {
                    },
                }
            );


            if (typeof data.data.fileName === "string") {
                return data.data.fileName as string;
            }
            if (typeof data === "string") {
                return data;
            }

            throw new Error("API upload không trả về URL/filename dạng string");
        },
    });
}

export function useGetTourById(id: string) {
    return useQuery({
        queryKey: ["tour", id],
        queryFn: async () => {
            const { data } = await AxiosAdmin.get(`/tours/${id}`);
            return data?.data;
        },
    });
}

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

export function useDeleteTour() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (variables: { id: string; body: any }) => {
            const { id, body } = variables;
            await AxiosAdmin.patch(`/tours/${id}/status`, body);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tours"] });
        },
    });
}