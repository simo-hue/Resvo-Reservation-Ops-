'use client';

import { useState } from 'react';
import { Reservation, ServiceType } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayCell } from './day-cell';
import { formatDate, getNumberOfDaysInMonth, getFirstDayOfMonth, goToNextMonth, goToPreviousMonth, createDate } from '@/lib/utils/date-utils';

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

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold capitalize">
                    {formatDate(currentMonth, 'MMMM yyyy')}
                </h2>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePreviousMonth}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setCurrentMonth(new Date());
                            setSelectedDate(null);
                        }}
                    >
                        Oggi
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextMonth}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                    <div
                        key={day}
                        className="text-center text-sm font-semibold text-muted-foreground py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
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
    );
}
