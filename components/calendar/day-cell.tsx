'use client';

import { Reservation, ServiceType } from '@/types';
import { cn } from '@/lib/utils';
import { isSameDay, checkIsToday } from '@/lib/utils/date-utils';
import { getReservationsForDateAndService } from '@/lib/utils/capacity-calculator';
import { Badge } from '@/components/ui/badge';

interface DayCellProps {
    date: Date;
    currentMonth: boolean;
    reservations: Reservation[];
    selectedService: ServiceType;
    maxCapacity: number;
    selectedDate: Date | null;
    onClick: () => void;
}

export function DayCell({
    date,
    currentMonth,
    reservations,
    selectedService,
    maxCapacity,
    selectedDate,
    onClick,
}: DayCellProps) {
    const dayReservations = getReservationsForDateAndService(
        reservations,
        date,
        selectedService
    );

    const totalGuests = dayReservations.reduce((sum, r) => sum + r.numGuests, 0);
    const percentage = maxCapacity > 0 ? (totalGuests / maxCapacity) * 100 : 0;

    // Determine capacity color
    let capacityColor = 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    let dotColor = 'bg-green-500';
    if (percentage >= 90) {
        capacityColor = 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
        dotColor = 'bg-red-500';
    } else if (percentage >= 70) {
        capacityColor = 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800';
        dotColor = 'bg-yellow-500';
    }

    const isToday = checkIsToday(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);

    return (
        <div
            onClick={currentMonth ? onClick : undefined}
            className={cn(
                // Responsive height: smaller on mobile, larger on desktop
                'min-h-[56px] sm:min-h-[80px] md:min-h-[100px]',
                // Responsive padding
                'p-1.5 sm:p-2 md:p-3',
                // Border and radius
                'border rounded-lg',
                // Transitions
                'transition-all duration-200',
                // Conditional states
                currentMonth
                    ? 'cursor-pointer active:scale-95 sm:hover:shadow-lg sm:hover:scale-[1.02] sm:hover:z-10 touch-target'
                    : 'opacity-30 cursor-not-allowed',
                isSelected && 'ring-2 ring-primary shadow-lg scale-105 z-20',
                isToday && 'bg-accent/30',
                currentMonth && capacityColor
            )}
        >
            <div className="flex flex-col h-full justify-between">
                {/* Date number and badge - always visible */}
                <div className="flex items-start justify-between gap-1">
                    <span
                        className={cn(
                            'text-xs sm:text-sm md:text-base font-semibold leading-none',
                            isToday && 'bg-primary text-primary-foreground rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center text-xs sm:text-sm'
                        )}
                    >
                        {date.getDate()}
                    </span>

                    {/* Reservation indicator - mobile: dot, desktop: badge */}
                    {currentMonth && dayReservations.length > 0 && (
                        <>
                            {/* Mobile: simple dot */}
                            <div className={cn('h-2 w-2 rounded-full sm:hidden', dotColor)} />
                            {/* Desktop: badge with count */}
                            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                                {dayReservations.length}
                            </Badge>
                        </>
                    )}
                </div>

                {/* Capacity info - only on larger screens */}
                {currentMonth && dayReservations.length > 0 && (
                    <div className="hidden sm:block space-y-1">
                        <div className="text-xs text-muted-foreground">
                            {totalGuests}/{maxCapacity}
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={cn(
                                    'h-full transition-all duration-300',
                                    percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                )}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

