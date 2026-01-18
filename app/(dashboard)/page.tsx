'use client';

import { useState, useEffect, useCallback } from 'react';
import { ServiceType, Reservation } from '@/types';
import { CalendarView } from '@/components/calendar/calendar-view';
import { WeekView } from '@/components/calendar/week-view';
import { DayView } from '@/components/calendar/day-view';
import { ServiceToggle } from '@/components/calendar/service-toggle';
import { ReservationFormDialog } from '@/components/reservations/reservation-form-dialog';
import { useRestaurantSettings } from '@/lib/contexts/restaurant-settings-context';
import { reservationsService } from '@/lib/supabase/services/reservations.service';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CalendarDays, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type ViewType = 'month' | 'week' | 'day';

export default function HomePage() {
    const { restaurant, isLoading: settingsLoading } = useRestaurantSettings();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedService, setSelectedService] = useState<ServiceType>('dinner');
    const [viewDate, setViewDate] = useState<Date>(new Date());

    const [reservationFormOpen, setReservationFormOpen] = useState(false);
    const [prefilledDate, setPrefilledDate] = useState<Date | null>(null);
    const [prefilledService, setPrefilledService] = useState<ServiceType>('dinner');
    const [viewType, setViewType] = useState<ViewType>('month');
    const [isLoadingReservations, setIsLoadingReservations] = useState(true);

    const loadReservations = useCallback(async () => {
        if (!restaurant) return;

        try {
            setIsLoadingReservations(true);

            // Get reservations for +/- 2 months to cover all calendar views
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
            const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

            const data = await reservationsService.getReservationsForPeriod(
                restaurant.id,
                startDate,
                endDate
            );

            setReservations(data);
        } catch (error) {
            console.error('Error loading reservations:', error);
            toast.error('Errore durante il caricamento delle prenotazioni');
        } finally {
            setIsLoadingReservations(false);
        }
    }, [restaurant]);

    // Load reservations for the current month
    useEffect(() => {
        if (restaurant && restaurant.id) {
            loadReservations();
        }
    }, [restaurant, loadReservations]);

    const maxCapacity = selectedService === 'lunch'
        ? restaurant?.maxCapacityLunch || 80
        : restaurant?.maxCapacityDinner || 100;

    const handleDayClick = (date: Date) => {
        setViewDate(date);
        setViewType('day'); // Switch to day view instead of opening modal
    };


    const handleAddReservation = (date: Date, service: ServiceType) => {
        setPrefilledDate(date);
        setPrefilledService(service);
        setReservationFormOpen(true);
    };

    const handleSaveReservation = async (data: Partial<Reservation>) => {
        if (!restaurant) return;

        try {
            if (data.id) {
                // Update existing reservation  
                await reservationsService.updateReservation(data.id, data);
                toast.success('Prenotazione aggiornata');
            } else {
                // Create new reservation
                await reservationsService.createReservation(restaurant.id, data as Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>);
                toast.success('Prenotazione creata');
            }

            // Reload reservations
            await loadReservations();
        } catch (error) {
            console.error('Error saving reservation:', error);
            toast.error('Errore durante il salvataggio');
        }
    };

    // Show loading state
    if (settingsLoading || isLoadingReservations) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Caricamento...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page header - Mobile optimized */}
            <div className="space-y-3 sm:space-y-4">
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
                        onClick={() => {
                            setViewType('day');
                            setViewDate(new Date());
                        }}
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
                        onAddReservation={handleAddReservation}
                        date={viewDate}
                        onDateChange={setViewDate}
                    />

                )}
            </div>
            {/* Day detail modal - Disabled, now using DayView directly */}
            {/* <DayDetailView
                date={selectedDate}
                serviceType={selectedService}
                reservations={reservations}
                maxCapacityLunch={mockRestaurant.maxCapacityLunch}
                maxCapacityDinner={mockRestaurant.maxCapacityDinner}
                open={detailViewOpen}
                onClose={() => setDetailViewOpen(false)}
                onAddReservation={handleAddReservation}
            /> */}

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
