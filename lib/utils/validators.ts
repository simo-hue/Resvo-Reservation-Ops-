import { z } from 'zod';

// Reservation validation schema
export const reservationSchema = z.object({
    customerName: z.string().min(2, { message: 'Il nome deve contenere almeno 2 caratteri' }),
    customerPhone: z.string().regex(/^[0-9]{9,12}$/, { message: 'Inserisci un numero di telefono valido' }),
    customerEmail: z.string().email({ message: 'Inserisci un\'email valida' }).optional().or(z.literal('')),
    date: z.date(),
    time: z.string().min(1, { message: 'Seleziona un orario' }),
    serviceType: z.enum(['lunch', 'dinner']),
    numGuests: z.number().min(1, { message: 'Minimo 1 ospite' }).max(50, { message: 'Massimo 50 ospiti' }),
    tableId: z.string().optional(),
    notes: z.string().optional(),
    specialRequests: z.string().optional(),
    status: z.enum(['confirmed', 'pending', 'cancelled', 'completed']).default('confirmed'),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

// Table validation schema
export const tableSchema = z.object({
    tableNumber: z.string().min(1, { message: 'Inserisci il numero del tavolo' }),
    capacity: z.number().min(1, { message: 'La capacità deve essere almeno 1' }).max(20, { message: 'Massimo 20 persone' }),
    position: z.enum(['interno', 'esterno', 'veranda']),
    isActive: z.boolean().default(true),
});

export type TableFormData = z.infer<typeof tableSchema>;

// Restaurant settings validation schema
export const restaurantSettingsSchema = z.object({
    name: z.string().min(2, { message: 'Il nome deve contenere almeno 2 caratteri' }),
    maxCapacityLunch: z.number().min(1, { message: 'La capacità deve essere almeno 1' }),
    maxCapacityDinner: z.number().min(1, { message: 'La capacità deve essere almeno 1' }),
    defaultTableDuration: z.number().min(30, { message: 'Minimo 30 minuti' }).max(300, { message: 'Massimo 5 ore' }),
});

export type RestaurantSettingsFormData = z.infer<typeof restaurantSettingsSchema>;
