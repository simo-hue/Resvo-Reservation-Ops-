import { format, isToday, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';

/**
 * Format a date for display
 */
export function formatDate(date: Date, formatStr: string = 'dd/MM/yyyy'): string {
    return format(date, formatStr, { locale: it });
}

/**
 * Check if a date is today
 */
export function checkIsToday(date: Date): boolean {
    return isToday(date);
}

/**
 * Get the number of days in a month
 */
export function getNumberOfDaysInMonth(date: Date): number {
    return getDaysInMonth(date);
}

/**
 * Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
 */
export function getFirstDayOfMonth(date: Date): number {
    return getDay(startOfMonth(date));
}

/**
 * Navigate to next month
 */
export function goToNextMonth(date: Date): Date {
    return addMonths(date, 1);
}

/**
 * Navigate to previous month
 */
export function goToPreviousMonth(date: Date): Date {
    return subMonths(date, 1);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

/**
 * Format time for display (HH:mm)
 */
export function formatTime(time: string): string {
    return time;
}

/**
 * Get current date at midnight
 */
export function getTodayAtMidnight(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

/**
 * Create a date from year, month, day
 */
export function createDate(year: number, month: number, day: number): Date {
    return new Date(year, month, day);
}

/**
 * Format a date for database (YYYY-MM-DD) using local time
 * This avoids timezone issues where toISOString() might return previous day
 */
export function formatDateForDatabase(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
