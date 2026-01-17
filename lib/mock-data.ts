import { Restaurant, Table, Reservation } from '@/types';

// Mock restaurant data
export const mockRestaurant: Restaurant = {
    id: 'restaurant-1',
    name: 'Ristorante Demo',
    maxCapacityLunch: 80,
    maxCapacityDinner: 100,
    defaultTableDuration: 120, // 2 hours
    openingHours: {
        Lunedì: { lunch: { start: '12:00', end: '15:00' }, dinner: { start: '19:00', end: '23:00' } },
        Martedì: { lunch: { start: '12:00', end: '15:00' }, dinner: { start: '19:00', end: '23:00' } },
        Mercoledì: { closed: true },
        Giovedì: { lunch: { start: '12:00', end: '15:00' }, dinner: { start: '19:00', end: '23:00' } },
        Venerdì: { lunch: { start: '12:00', end: '15:00' }, dinner: { start: '19:00', end: '23:00' } },
        Sabato: { lunch: { start: '12:00', end: '15:00' }, dinner: { start: '19:00', end: '23:00' } },
        Domenica: { lunch: { start: '12:00', end: '15:00' }, dinner: { start: '19:00', end: '23:00' } },
    },
    createdAt: new Date(),
};

// Mock tables data
export const mockTables: Table[] = [
    { id: 'table-1', restaurantId: 'restaurant-1', tableNumber: '1', capacity: 2, position: 'interno', isActive: true },
    { id: 'table-2', restaurantId: 'restaurant-1', tableNumber: '2', capacity: 2, position: 'interno', isActive: true },
    { id: 'table-3', restaurantId: 'restaurant-1', tableNumber: '3', capacity: 4, position: 'interno', isActive: true },
    { id: 'table-4', restaurantId: 'restaurant-1', tableNumber: '4', capacity: 4, position: 'interno', isActive: true },
    { id: 'table-5', restaurantId: 'restaurant-1', tableNumber: '5', capacity: 6, position: 'interno', isActive: true },
    { id: 'table-6', restaurantId: 'restaurant-1', tableNumber: '6', capacity: 6, position: 'interno', isActive: true },
    { id: 'table-7', restaurantId: 'restaurant-1', tableNumber: '7', capacity: 4, position: 'esterno', isActive: true },
    { id: 'table-8', restaurantId: 'restaurant-1', tableNumber: '8', capacity: 4, position: 'esterno', isActive: true },
    { id: 'table-9', restaurantId: 'restaurant-1', tableNumber: '9', capacity: 8, position: 'veranda', isActive: true },
    { id: 'table-10', restaurantId: 'restaurant-1', tableNumber: '10', capacity: 8, position: 'veranda', isActive: true },
];

// Mock reservations data (for current month)
// Using seeded random to avoid hydration mismatch
const seededRandom = (seed: number) => {
    let value = seed;
    return () => {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
};

const generateMockReservations = (): Reservation[] => {
    const reservations: Reservation[] = [];
    const statuses: Array<'confirmed' | 'pending'> = ['confirmed', 'confirmed', 'confirmed', 'pending'];
    const random = seededRandom(12345); // Fixed seed for consistent data

    // Fixed date to avoid hydration issues with new Date()
    const baseDate = new Date(2026, 0, 17); // 17 January 2026

    // Generate reservations for the next 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);

        // Skip Wednesdays (closed day)
        if (date.getDay() === 3) continue;

        // Lunch reservations (using seed for consistent count)
        const numLunchReservations = Math.floor(random() * 6) + 3;
        for (let j = 0; j < numLunchReservations; j++) {
            const lunchTimes = ['12:00', '12:30', '13:00', '13:30', '14:00'];
            const time = lunchTimes[Math.floor(random() * lunchTimes.length)];
            const guests = Math.floor(random() * 6) + 2;

            reservations.push({
                id: `res-lunch-${i}-${j}`,
                restaurantId: 'restaurant-1',
                date: new Date(date),
                time,
                serviceType: 'lunch',
                customerName: `Cliente ${i}-${j}`,
                customerPhone: `33${Math.floor(random() * 100000000).toString().padStart(8, '0')}`,
                customerEmail: i % 3 === 0 ? `cliente${i}${j}@email.it` : undefined,
                numGuests: guests,
                tableId: mockTables[Math.floor(random() * mockTables.length)].id,
                status: statuses[Math.floor(random() * statuses.length)],
                notes: i % 5 === 0 ? 'Cliente abituale' : undefined,
                specialRequests: j % 4 === 0 ? 'Tavolo vicino alla finestra' : undefined,
                createdAt: new Date(baseDate),
                updatedAt: new Date(baseDate),
            });
        }

        // Dinner reservations (using seed for consistent count)
        const numDinnerReservations = Math.floor(random() * 8) + 5;
        for (let j = 0; j < numDinnerReservations; j++) {
            const dinnerTimes = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
            const time = dinnerTimes[Math.floor(random() * dinnerTimes.length)];
            const guests = Math.floor(random() * 6) + 2;

            reservations.push({
                id: `res-dinner-${i}-${j}`,
                restaurantId: 'restaurant-1',
                date: new Date(date),
                time,
                serviceType: 'dinner',
                customerName: `Cliente ${i}-${j}`,
                customerPhone: `34${Math.floor(random() * 100000000).toString().padStart(8, '0')}`,
                customerEmail: i % 2 === 0 ? `cliente${i}${j}@email.it` : undefined,
                numGuests: guests,
                tableId: mockTables[Math.floor(random() * mockTables.length)].id,
                status: statuses[Math.floor(random() * statuses.length)],
                notes: i % 7 === 0 ? 'Intolleranza al glutine' : undefined,
                specialRequests: j % 3 === 0 ? 'Seggiolone per bambino' : undefined,
                createdAt: new Date(baseDate),
                updatedAt: new Date(baseDate),
            });
        }
    }

    return reservations;
};

export const mockReservations = generateMockReservations();

