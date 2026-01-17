// TypeScript types for Resvo application

export type ServiceType = 'lunch' | 'dinner';

export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Restaurant {
    id: string;
    name: string;
    maxCapacityLunch: number;
    maxCapacityDinner: number;
    defaultTableDuration: number; // in minutes
    openingHours: {
        [key: string]: {
            lunch?: { start: string; end: string };
            dinner?: { start: string; end: string };
            closed?: boolean;
        };
    };
    createdAt: Date;
}

export interface Table {
    id: string;
    restaurantId: string;
    tableNumber: string;
    capacity: number;
    position: 'interno' | 'esterno' | 'veranda';
    isActive: boolean;
}

export interface Reservation {
    id: string;
    restaurantId: string;
    date: Date;
    time: string;
    serviceType: ServiceType;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    numGuests: number;
    tableId?: string;
    table?: Table;
    status: ReservationStatus;
    notes?: string;
    specialRequests?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DailyStats {
    id: string;
    restaurantId: string;
    date: Date;
    serviceType: ServiceType;
    totalReservations: number;
    totalGuests: number;
    capacityPercentage: number;
    noShows: number;
}

export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface CapacityStatus {
    available: number;
    total: number;
    percentage: number;
    color: 'green' | 'yellow' | 'red';
}
