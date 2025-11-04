// src/hooks/useRoles.ts
import { useQuery } from "@tanstack/react-query";
import {AxiosAdmin} from "@/lib/axios";

export function useGetRoles() {
    return useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const { data } = await AxiosAdmin.get("/roles");
            const result = data?.data;
            return result || [];
        },
    });
}