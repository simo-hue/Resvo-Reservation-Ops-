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
    greenThreshold?: number;
    yellowThreshold?: number;
    orangeThreshold?: number;
}

export function DayCell({
    date,
    currentMonth,
    reservations,
    selectedService,
    maxCapacity,
    selectedDate,
    onClick,
    greenThreshold = 60,
    yellowThreshold = 80,
    orangeThreshold = 99,
}: DayCellProps) {
    const dayReservations = getReservationsForDateAndService(
        reservations,
        date,
        selectedService
    );

    const totalGuests = dayReservations.reduce((sum, r) => sum + r.numGuests, 0);
    const percentage = maxCapacity > 0 ? (totalGuests / maxCapacity) * 100 : 0;

    // Determine capacity color using dynamic thresholds
    let capacityColor = 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    let barColor = 'bg-green-500';

    if (percentage > orangeThreshold) {
        capacityColor = 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
        barColor = 'bg-red-500';
    } else if (percentage >= yellowThreshold) {
        capacityColor = 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800';
        barColor = 'bg-orange-500';
    } else if (percentage >= greenThreshold) {
        capacityColor = 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800';
        barColor = 'bg-yellow-500';
    }

    const isToday = checkIsToday(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);

    return (
        <div
            onClick={currentMonth ? onClick : undefined}
            className={cn(
                // Fixed height: uniform on all screens
                // Fixed height: uniform on all screens
                'h-[85px] sm:h-[100px] md:h-[110px]',
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
            <div className="flex flex-col h-full justify-between gap-1">
                {/* Date number - always visible */}
                <div className="flex items-start justify-center sm:justify-between w-full">
                    <span
                        className={cn(
                            'text-xs sm:text-sm md:text-base font-semibold leading-none',
                            isToday && 'bg-primary text-primary-foreground rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center text-xs sm:text-sm'
                        )}
                    >
                        {date.getDate()}
                    </span>
                </div>

                {/* Stats - always visible for current month */}
                {currentMonth && (
                    <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center text-[10px] sm:text-xs text-muted-foreground">
                            <span className="hidden sm:inline">Pren:</span>
                            <span className="sm:hidden">P:</span>
                            <span className="font-medium text-foreground">{dayReservations.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] sm:text-xs text-muted-foreground">
                            <span className="hidden sm:inline">Cop:</span>
                            <span className="sm:hidden">C:</span>
                            <span className="font-medium text-foreground">{totalGuests}</span>
                        </div>
                    </div>
                )}

                {/* Capacity info - always visible for current month */}
                {currentMonth && (
                    <div className="space-y-1 mt-auto">
                        <div className="w-full bg-background/50 rounded-full h-1 sm:h-1.5 overflow-hidden">
                            <div
                                className={cn(
                                    'h-full transition-all duration-300',
                                    barColor
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

