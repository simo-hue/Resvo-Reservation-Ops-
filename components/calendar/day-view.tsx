'use client';

import { useState } from 'react';
import { isSameDay, format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Reservation, ServiceType, CapacityStatus } from '@/types';
import { getReservationsForDateAndService, getCapacityStatus } from '@/lib/utils/capacity-calculator';
import { formatDate } from '@/lib/utils/date-utils';

type ViewType = 'month' | 'week' | 'day';

interface DayViewProps {
    reservations: Reservation[];
    selectedService: ServiceType;
    maxCapacity: number;
    onDayClick: (date: Date) => void;
}

export function DayView({
    reservations,
    selectedService,
    maxCapacity,
    onDayClick,
}: DayViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const dayReservations = getReservationsForDateAndService(reservations, currentDate, selectedService);
    const totalGuests = dayReservations.reduce((sum, r) => sum + r.numGuests, 0);
    const status = getCapacityStatus(totalGuests, maxCapacity);

    const getStatusColor = (status: CapacityStatus) => {
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
            {/* Day Header with Navigation */}
            <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousDay}
                        className="h-10 w-10"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <h2 className="text-2xl sm:text-3xl font-bold capitalize">
                        {formatDate(currentDate, 'EEEE d MMMM yyyy')}
                    </h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextDay}
                        className="h-10 w-10"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Day Content */}
            <Card className="p-6">
                <div className="space-y-6">
                    {/* Day Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 bg-primary/5">
                            <div className="text-sm text-muted-foreground mb-1">Prenotazioni</div>
                            <div className="text-3xl font-bold">{dayReservations.length}</div>
                        </Card>
                        <Card className="p-4 bg-blue-500/5">
                            <div className="text-sm text-muted-foreground mb-1">Coperti</div>
                            <div className="text-3xl font-bold">{totalGuests}</div>
                        </Card>
                        <Card className="p-4 bg-green-500/5">
                            <div className="text-sm text-muted-foreground mb-1">Disponibili</div>
                            <div className="text-3xl font-bold text-green-600">{status.available}</div>
                        </Card>
                    </div>

                    {/* Capacity Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Occupazione</span>
                            <span className="font-bold">{status.percentage}%</span>
                        </div>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all ${getStatusColor(status)}`}
                                style={{ width: `${status.percentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <Button onClick={handleToday} variant="outline" className="flex-1">
                            Vai a Oggi
                        </Button>
                        <Button onClick={() => onDayClick(currentDate)} className="flex-1">
                            Vedi Dettagli Giorno
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
