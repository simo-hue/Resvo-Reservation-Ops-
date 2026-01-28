'use client';

import { Reservation, ServiceType } from '@/types';
import { cn } from '@/lib/utils';
import { isSameDay, checkIsToday } from '@/lib/utils/date-utils';
import { getReservationsForDateAndService } from '@/lib/utils/capacity-calculator';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

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
                {/* Header: Date (Left) and Reservation Count (Right) */}
                <div className="flex items-start justify-between w-full">
                    {/* Date Number */}
                    <span
                        className={cn(
                            'text-xs sm:text-sm md:text-base font-semibold leading-none flex items-center justify-center',
                            isToday
                                ? 'bg-primary text-primary-foreground rounded-full h-6 w-6'
                                : 'text-foreground'
                        )}
                    >
                        {date.getDate()}
                    </span>

                    {/* Reservation Count - Top Right Badge */}
                    {currentMonth && (
                        <Badge
                            variant="secondary"
                            className={cn(
                                "h-5 min-w-[1.25rem] px-1 flex items-center justify-center text-[10px] font-bold shadow-sm",
                                dayReservations.length > 0 ? "bg-primary/10 text-primary border-primary/20" : "opacity-50"
                            )}
                        >
                            {dayReservations.length}
                        </Badge>
                    )}
                </div>

                {/* Content: Covers and Capacity */}
                {currentMonth && (
                    <div className="space-y-1.5 mt-auto">
                        {/* Covers Count */}
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span className="text-[10px] sm:text-xs font-medium">
                                {totalGuests}
                            </span>
                        </div>

                        {/* Capacity Bar */}
                        <div className="w-full bg-secondary/50 rounded-full h-1 sm:h-1.5 overflow-hidden">
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

