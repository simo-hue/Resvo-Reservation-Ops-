'use client';

import { useState, useRef, useEffect } from 'react';
import { Reservation, ServiceType } from '@/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DayCell } from './day-cell';
import { formatDate, getNumberOfDaysInMonth, getFirstDayOfMonth, goToNextMonth, goToPreviousMonth, createDate } from '@/lib/utils/date-utils';
import { useSwipe } from '@/lib/hooks/use-swipe';

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

interface CalendarViewProps {
    reservations: Reservation[];
    selectedService: ServiceType;
    maxCapacity: number;
    onDayClick: (date: Date) => void;
}

export function CalendarView({
    reservations,
    selectedService,
    maxCapacity,
    onDayClick,
}: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getNumberOfDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);

    // Adjust for Monday as first day (0 = Monday, 6 = Sunday)
    const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Calculate days to display
    const days: (Date | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayIndex; i++) {
        const prevMonthDate = new Date(year, month, -startingDayIndex + i + 1);
        days.push(prevMonthDate);
    }

    // Add all days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(createDate(year, month, day));
    }

    // Add empty cells to complete the last week
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(year, month + 1, i));
        }
    }

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        onDayClick(date);
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(goToPreviousMonth(currentMonth));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(goToNextMonth(currentMonth));
        setSelectedDate(null);
    };

    // Swipe gesture support
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
        onSwipeLeft: handleNextMonth,
        onSwipeRight: handlePreviousMonth,
        threshold: 50,
    });

    useEffect(() => {
        const element = calendarRef.current;
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

    return (
        <div className="space-y-4">
            {/* Calendar Header with Navigation */}
            <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousMonth}
                        className="h-10 w-10"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <h2 className="text-2xl sm:text-3xl font-bold capitalize">
                        {formatDate(currentMonth, 'MMMM yyyy')}
                    </h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextMonth}
                        className="h-10 w-10"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div ref={calendarRef} className="bg-card rounded-lg border border-border p-2 sm:p-4 md:p-6 touch-none">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                    {DAYS_OF_WEEK.map((day) => (
                        <div
                            key={day}
                            className="text-center text-[10px] sm:text-xs md:text-sm font-semibold text-muted-foreground py-1 sm:py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {days.map((date, index) => (
                        <DayCell
                            key={index}
                            date={date!}
                            currentMonth={date!.getMonth() === month}
                            reservations={reservations}
                            selectedService={selectedService}
                            maxCapacity={maxCapacity}
                            selectedDate={selectedDate}
                            onClick={() => handleDayClick(date!)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
