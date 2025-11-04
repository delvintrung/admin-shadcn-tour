// src/types/index.ts
export interface TourPrice {
    priceType: "ADULT" | "CHILD";
    price: number;
}

export interface TourDetail {
    id?: string;
    startLocation: string;
    startDay: string;
    endDay: string;
    status: "ACTIVE" | "PENDING" | "CLOSED";
    tourPrices: TourPrice[];
}

export interface Tour {
    id?: string;
    title: string;
    imageUrl?: string;
    shortDesc: string;
    longDesc: string;
    duration: string;
    capacity: number;
    location: string;
    status: "ACTIVE" | "INACTIVE";
    tourDetails: TourDetail[];
}

export type BookingStatus = "ACTIVE" | "PENDING" | "CANCELLED" | "COMPLETED";

export interface Booking {
    id?: string;
    contactEmail: string;
    contactPhone: string;
    createdAt?: string;
    note?: string;
    status: BookingStatus;
    totalPrice: number;
    updatedAt?: string;
    id_user?: string; 
}

export interface Role {
    id: number;
    nameRole: string;
    description?: string;
    status?: boolean;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    status: boolean;
    createdAt?: string;
    updatedAt?: string;
}