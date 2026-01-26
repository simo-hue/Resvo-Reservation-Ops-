import { z } from 'zod';

// Reservation validation schema
export const reservationSchema = z.object({
    customerName: z.string().min(2, { message: 'Il nome deve contenere almeno 2 caratteri' }),
    // Rendiamo il campo telefono opzionale: accettiamo stringa vuota oppure un numero valido (9-12 cifre)
    customerPhone: z.string().regex(/(^$)|(^[0-9]{9,12}$)/, { message: 'Inserisci un numero di telefono valido' }),
    customerEmail: z.string().email({ message: 'Inserisci un\'email valida' }).optional().or(z.literal('')),
    date: z.date(),
    time: z.string().min(1, { message: 'Seleziona un orario' }),
    serviceType: z.enum(['lunch', 'dinner']),
    numGuests: z.number().min(1, { message: 'Inserisci un numero di coperti valido' }).max(50, { message: 'Massimo 50 ospiti' }),
    tableId: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['confirmed', 'pending', 'cancelled', 'completed']).default('confirmed'),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

// Space validation schema
export const spaceSchema = z.object({
    label: z.string()
        .min(2, { message: 'Il nome deve essere di almeno 2 caratteri' })
        .max(30, { message: 'Il nome non può superare 30 caratteri' }),
    value: z.string()
        .min(2, { message: 'Il valore deve essere di almeno 2 caratteri' })
        .max(30, { message: 'Il valore non può superare 30 caratteri' })
        .regex(/^[a-z0-9_-]+$/, { message: 'Usa solo lettere minuscole, numeri, trattini e underscore' }),
});

export type SpaceFormData = z.infer<typeof spaceSchema>;

// Table validation schema
export const tableSchema = z.object({
    tableNumber: z.string().min(1, { message: 'Inserisci il numero del tavolo' }),
    capacity: z.number().min(1, { message: 'La capacità deve essere almeno 1' }).max(20, { message: 'Massimo 20 persone' }),
    position: z.string().min(1, { message: 'Seleziona una posizione' }),
    isActive: z.boolean().default(true),
});

export type TableFormData = z.infer<typeof tableSchema>;

// Restaurant settings validation schema
export const restaurantSettingsSchema = z.object({
    name: z.string().min(2, { message: 'Il nome deve contenere almeno 2 caratteri' }).optional().or(z.literal('')),
    maxCapacityLunch: z.number().min(1, { message: 'La capacità deve essere almeno 1' }),
    maxCapacityDinner: z.number().min(1, { message: 'La capacità deve essere almeno 1' }),
    defaultTableDuration: z.number().min(30, { message: 'Minimo 30 minuti' }).max(300, { message: 'Massimo 5 ore' }).optional(),
    greenThreshold: z.number().min(0, { message: 'Minimo 0%' }).max(100, { message: 'Massimo 100%' }).optional(),
    yellowThreshold: z.number().min(0, { message: 'Minimo 0%' }).max(100, { message: 'Massimo 100%' }).optional(),
    orangeThreshold: z.number().min(0, { message: 'Minimo 0%' }).max(100, { message: 'Massimo 100%' }).optional(),
}).refine((data) => {
    // Ensure thresholds are in correct order if all are provided
    if (data.greenThreshold !== undefined && data.yellowThreshold !== undefined) {
        return data.greenThreshold < data.yellowThreshold;
    }
    return true;
}, {
    message: 'La soglia gialla deve essere maggiore della soglia verde',
    path: ['yellowThreshold'],
}).refine((data) => {
    // Ensure yellow < orange
    if (data.yellowThreshold !== undefined && data.orangeThreshold !== undefined) {
        return data.yellowThreshold < data.orangeThreshold;
    }
    return true;
}, {
    message: 'La soglia arancione deve essere maggiore della soglia gialla',
    path: ['orangeThreshold'],
});

export type RestaurantSettingsFormData = z.infer<typeof restaurantSettingsSchema>;

