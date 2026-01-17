'use client';

import { useState, useRef, useEffect } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Reservation, ServiceType, CapacityStatus } from '@/types';
import { getReservationsForDateAndService, getCapacityStatus } from '@/lib/utils/capacity-calculator';
import { formatDate } from '@/lib/utils/date-utils';
import { useSwipe } from '@/lib/hooks/use-swipe';

type ViewType = 'month' | 'week' | 'day';

interface WeekViewProps {
    reservations: Reservation[];
    selectedService: ServiceType;
    maxCapacity: number;
    onDayClick: (date: Date) => void;
}

export function WeekView({
    reservations,
    selectedService,
    maxCapacity,
    onDayClick,
}: WeekViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const weekRef = useRef<HTMLDivElement>(null);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const handlePreviousWeek = () => {
        setCurrentDate(subWeeks(currentDate, 1));
    };

    const handleNextWeek = () => {
        setCurrentDate(addWeeks(currentDate, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // Swipe gesture support
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
        onSwipeLeft: handleNextWeek,
        onSwipeRight: handlePreviousWeek,
        threshold: 50,
    });

    useEffect(() => {
        const element = weekRef.current;
        if (!element) return;

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchmove', handleTouchMove);
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    const getDayData = (day: Date) => {
        const dayReservations = getReservationsForDateAndService(reservations, day, selectedService);
        const totalGuests = dayReservations.reduce((sum, r) => sum + r.numGuests, 0);
        const status = getCapacityStatus(totalGuests, maxCapacity);

        return {
            reservations: dayReservations.length,
            guests: totalGuests,
            status,
        };
    };

    const getStatusColor = (status: CapacityStatus) => {
        switch (status.color) {
            case 'green':
                return 'bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700';
            case 'yellow':
                return 'bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700';
            case 'red':
                return 'bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700';
            default:
                return 'bg-muted border-border';
        }
    };

    const getStatusDotColor = (status: CapacityStatus) => {
        switch (status.color) {
            case 'green':
                return 'bg-green-500';
            case 'yellow':
                return 'bg-yellow-500';
            case 'red':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            {/* Week Header with Navigation */}
            <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousWeek}
                        className="h-10 w-10"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <h2 className="text-2xl sm:text-3xl font-bold">
                        {formatDate(weekStart, 'd MMM')} - {formatDate(weekEnd, 'd MMM yyyy')}
                    </h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextWeek}
                        className="h-10 w-10"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Week Grid */}
            <div ref={weekRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 touch-none">
                {weekDays.map((day) => {
                    const dayData = getDayData(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <Card
                            key={day.toISOString()}
                            className={`
                p-4 cursor-pointer transition-all hover:shadow-lg border-2
                ${getStatusColor(dayData.status)}
                ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
                            onClick={() => onDayClick(day)}
                        >
                            <div className="space-y-3">
                                {/* Day Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase">
                                            {formatDate(day, 'EEE')}
                                        </div>
                                        <div className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                                            {formatDate(day, 'd')}
                                        </div>
                                    </div>
                                    <div className={`h-3 w-3 rounded-full ${getStatusDotColor(dayData.status)}`} />
                                </div>

                                {/* Stats */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Prenotazioni</span>
                                        <span className="font-bold">{dayData.reservations}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Coperti</span>
                                        <span className="font-bold">{dayData.guests}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Disponibili</span>
                                        <span className={`font-semibold ${dayData.status.color === 'red' ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                            {dayData.status.available}
                                        </span>
                                    </div>
                                </div>

                                {/* Capacity Bar */}
                                <div className="space-y-1">
                                    <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${dayData.status.color === 'green' ? 'bg-green-500' :
                                                dayData.status.color === 'yellow' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                            style={{ width: `${dayData.status.percentage}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-center text-muted-foreground">
                                        {dayData.status.percentage}% occupato
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
