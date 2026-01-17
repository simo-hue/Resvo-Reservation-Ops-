'use client';

import { useState } from 'react';
import { ServiceType } from '@/types';
import { CalendarView } from '@/components/calendar/calendar-view';
import { ServiceToggle } from '@/components/calendar/service-toggle';
import { DayDetailView } from '@/components/calendar/day-detail-view';
import { mockReservations, mockRestaurant } from '@/lib/mock-data';

export default function HomePage() {
    const [selectedService, setSelectedService] = useState<ServiceType>('dinner');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [detailViewOpen, setDetailViewOpen] = useState(false);

    const maxCapacity = selectedService === 'lunch'
        ? mockRestaurant.maxCapacityLunch
        : mockRestaurant.maxCapacityDinner;

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setDetailViewOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calendario Prenotazioni</h1>
                    <p className="text-muted-foreground mt-1">
                        Visualizza e gestisci tutte le prenotazioni del tuo ristorante
                    </p>
                </div>

                <ServiceToggle
                    selectedService={selectedService}
                    onServiceChange={setSelectedService}
                />
            </div>

            {/* Calendar */}
            <CalendarView
                reservations={mockReservations}
                selectedService={selectedService}
                maxCapacity={maxCapacity}
                onDayClick={handleDayClick}
            />

            {/* Day detail modal */}
            <DayDetailView
                date={selectedDate}
                serviceType={selectedService}
                reservations={mockReservations}
                maxCapacityLunch={mockRestaurant.maxCapacityLunch}
                maxCapacityDinner={mockRestaurant.maxCapacityDinner}
                open={detailViewOpen}
                onClose={() => setDetailViewOpen(false)}
            />
        </div>
    );
}
