// Application constants

export const SERVICE_TYPES = {
    LUNCH: 'lunch' as const,
    DINNER: 'dinner' as const,
};

export const RESERVATION_STATUS = {
    CONFIRMED: 'confirmed' as const,
    PENDING: 'pending' as const,
    CANCELLED: 'cancelled' as const,
    COMPLETED: 'completed' as const,
};

export const CAPACITY_THRESHOLDS = {
    GREEN: 70, // Below 70% is green
    YELLOW: 90, // 70-90% is yellow
    RED: 100, // Above 90% is red
};

export const DEFAULT_TIME_SLOTS = {
    LUNCH: [
        '12:00', '12:15', '12:30', '12:45',
        '13:00', '13:15', '13:30', '13:45',
        '14:00', '14:15', '14:30', '14:45',
    ],
    DINNER: [
        '19:00', '19:15', '19:30', '19:45',
        '20:00', '20:15', '20:30', '20:45',
        '21:00', '21:15', '21:30', '21:45',
        '22:00', '22:15', '22:30',
    ],
};

export const TABLE_POSITIONS = [
    { value: 'interno', label: 'Interno' },
    { value: 'esterno', label: 'Esterno' },
    { value: 'veranda', label: 'Veranda' },
] as const;

export const STATUS_COLORS = {
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

export const DAYS_OF_WEEK = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
    'Domenica',
];
