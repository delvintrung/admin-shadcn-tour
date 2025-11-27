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
    capacity: number;
    remainingSeats: number;
    status: "ACTIVE" | "INACTIVE" | "DRAFT"| "FULL";
    tourPrices: TourPrice[];
}

export interface Tour {
    id?: string;
    title: string;
    imageUrl?: string;
    shortDesc: string;
    longDesc: string;
    duration: string;
    location: string;
    status: "ACTIVE" | "INACTIVE" | "DRAFT";
    tourDetails: TourDetail[];
}

export type BookingStatus = "ACTIVE" | "PENDING" | "CANCELLED" | "COMPLETED";

export interface Booking {
    id?: string;
    contactEmail: string;
    contactPhone: string;
    contactFullName: string;
    contactAddress: string;
    createdAt?: string;
    note?: string;
    status: BookingStatus;
    bookingDetails: BookingDetail[];
    updatedAt?: string;
    userId?: string;
}

export interface BookingDetail {
    id?: string;
    tourDetail: TourDetail;
    tourPrice: TourPrice;
    quantity: number;
    price: number;
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