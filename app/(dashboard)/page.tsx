'use client';

import { useState } from 'react';
import { ServiceType, Reservation } from '@/types';
import { CalendarView } from '@/components/calendar/calendar-view';
import { WeekView } from '@/components/calendar/week-view';
import { DayView } from '@/components/calendar/day-view';
import { ServiceToggle } from '@/components/calendar/service-toggle';
import { DayDetailView } from '@/components/calendar/day-detail-view';
import { ReservationFormDialog } from '@/components/reservations/reservation-form-dialog';
import { mockReservations, mockRestaurant } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon, CalendarDays } from 'lucide-react';

type ViewType = 'month' | 'week' | 'day';

export default function HomePage() {
    const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
    const [selectedService, setSelectedService] = useState<ServiceType>('dinner');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [detailViewOpen, setDetailViewOpen] = useState(false);
    const [reservationFormOpen, setReservationFormOpen] = useState(false);
    const [prefilledDate, setPrefilledDate] = useState<Date | null>(null);
    const [prefilledService, setPrefilledService] = useState<ServiceType>('dinner');
    const [viewType, setViewType] = useState<ViewType>('month');

    const maxCapacity = selectedService === 'lunch'
        ? mockRestaurant.maxCapacityLunch
        : mockRestaurant.maxCapacityDinner;

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setDetailViewOpen(true);
    };

    const handleAddReservation = (date: Date, service: ServiceType) => {
        setPrefilledDate(date);
        setPrefilledService(service);
        setDetailViewOpen(false);
        setReservationFormOpen(true);
    };

    const handleSaveReservation = (data: Partial<Reservation>) => {
        setReservations((prev) => [...prev, data as Reservation]);
    };

    return (
        <div className="space-y-6">
            {/* Page header - Mobile optimized */}
            <div className="space-y-4">
                {/* Title */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Calendario Prenotazioni</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Visualizza e gestisci tutte le prenotazioni del tuo ristorante
                    </p>
                </div>

                {/* Service Toggle - Primary control */}
                <div>
                    <ServiceToggle
                        selectedService={selectedService}
                        onServiceChange={setSelectedService}
                    />
                </div>
            </div>

            {/* View Toggle Tabs - Separated */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-1 bg-secondary/50 rounded-lg p-1 w-full max-w-md border border-border">
                    <Button
                        variant={viewType === 'month' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewType('month')}
                        className="gap-2 h-9 flex-1"
                    >
                        <CalendarIcon className="h-4 w-4" />
                        <span className="font-medium">Mese</span>
                    </Button>
                    <Button
                        variant={viewType === 'week' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewType('week')}
                        className="gap-2 h-9 flex-1"
                    >
                        <CalendarDays className="h-4 w-4" />
                        <span className="font-medium">Settimana</span>
                    </Button>
                    <Button
                        variant={viewType === 'day' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewType('day')}
                        className="gap-2 h-9 flex-1"
                    >
                        <CalendarIcon className="h-4 w-4" />
                        <span className="font-medium">Giorno</span>
                    </Button>
                </div>
            </div>

            {/* Calendar Views */}
            <div className="calendar-container">
                {viewType === 'month' ? (
                    <CalendarView
                        reservations={reservations}
                        selectedService={selectedService}
                        maxCapacity={maxCapacity}
                        onDayClick={handleDayClick}
                    />
                ) : viewType === 'week' ? (
                    <WeekView
                        reservations={reservations}
                        selectedService={selectedService}
                        maxCapacity={maxCapacity}
                        onDayClick={handleDayClick}
                    />
                ) : (
                    <DayView
                        reservations={reservations}
                        selectedService={selectedService}
                        maxCapacity={maxCapacity}
                        onDayClick={handleDayClick}
                    />
                )}
            </div>
            {/* Day detail modal */}
            <DayDetailView
                date={selectedDate}
                serviceType={selectedService}
                reservations={reservations}
                maxCapacityLunch={mockRestaurant.maxCapacityLunch}
                maxCapacityDinner={mockRestaurant.maxCapacityDinner}
                open={detailViewOpen}
                onClose={() => setDetailViewOpen(false)}
                onAddReservation={handleAddReservation}
            />

            {/* Reservation form dialog */}
            <ReservationFormDialog
                open={reservationFormOpen}
                onOpenChange={setReservationFormOpen}
                reservation={prefilledDate ? {
                    id: '',
                    restaurantId: 'restaurant-1',
                    date: prefilledDate,
                    time: '',
                    serviceType: prefilledService,
                    customerName: '',
                    customerPhone: '',
                    numGuests: 2,
                    status: 'confirmed',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as Reservation : null}
                onSave={handleSaveReservation}
            />

            <Toaster />
        </div>
    );
}
