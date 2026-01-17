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
    let capacityColor = 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    if (percentage >= 90) {
        capacityColor = 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    } else if (percentage >= 70) {
        capacityColor = 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    }

    const isToday = checkIsToday(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);

    return (
        <div
            onClick={currentMonth ? onClick : undefined}
            className={cn(
                'min-h-[100px] p-2 border border-border rounded-lg transition-all duration-200 relative',
                currentMonth
                    ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] hover:z-10'
                    : 'opacity-40 cursor-not-allowed',
                isSelected && 'ring-2 ring-primary shadow-lg',
                isToday && 'bg-accent/50',
                currentMonth && capacityColor
            )}
        >
            {/* Date number */}
            <div className="flex items-center justify-between mb-2">
                <span
                    className={cn(
                        'text-sm font-medium',
                        isToday && 'bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center'
                    )}
                >
                    {date.getDate()}
                </span>

                {/* Reservation count badge */}
                {currentMonth && dayReservations.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                        {dayReservations.length}
                    </Badge>
                )}
            </div>

            {/* Capacity indicator */}
            {currentMonth && dayReservations.length > 0 && (
                <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                        {totalGuests}/{maxCapacity} coperti
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
    );
}
