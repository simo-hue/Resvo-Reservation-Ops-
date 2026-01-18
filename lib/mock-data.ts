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



