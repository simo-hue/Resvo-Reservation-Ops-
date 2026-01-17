'use client';

import { useState } from 'react';
import { isSameDay, format } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Users, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Reservation, ServiceType, CapacityStatus } from '@/types';
import { getReservationsForDateAndService, getCapacityStatus } from '@/lib/utils/capacity-calculator';
import { formatDate } from '@/lib/utils/date-utils';
import { cn } from '@/lib/utils';

interface DayViewProps {
    reservations: Reservation[];
    selectedService: ServiceType;
    maxCapacity: number;
    onDayClick: (date: Date) => void;
    onAddReservation?: (date: Date, service: ServiceType) => void;
}

export function DayView({
    reservations,
    selectedService,
    maxCapacity,
    onDayClick,
    onAddReservation,
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

    const getStatusBadgeColor = (reservationStatus: string) => {
        switch (reservationStatus) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const statusLabels: Record<string, string> = {
        confirmed: 'Confermata',
        pending: 'In attesa',
        cancelled: 'Cancellata',
    };

    return (
        <div className="flex flex-col space-y-4">
            {/* Day Header with Navigation */}
            <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousDay}
                        className="h-9 w-9 sm:h-10 sm:w-10"
                    >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>

                    <div className="text-center">
                        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold capitalize">
                            {formatDate(currentDate, 'EEEE d MMMM')}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatDate(currentDate, 'yyyy')}
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextDay}
                        className="h-9 w-9 sm:h-10 sm:w-10"
                    >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <Card className="p-3 sm:p-4 bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Prenotazioni</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold">{dayReservations.length}</div>
                </Card>
                <Card className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Coperti</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold">{totalGuests}</div>
                </Card>
                <Card className="p-3 sm:p-4 bg-gradient-to-br from-green-500/5 to-green-500/10">
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Disponibili</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{status.available}</div>
                </Card>
            </div>

            {/* Capacity Bar */}
            <Card className="p-3 sm:p-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-medium">Occupazione</span>
                        <span className="font-bold">{status.percentage}%</span>
                    </div>
                    <div className="h-3 sm:h-4 bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${getStatusColor(status)}`}
                            style={{ width: `${status.percentage}%` }}
                        />
                    </div>
                </div>
            </Card>

            {/* Reservations List - Scrolls naturally with page */}
            <div className="space-y-2 sm:space-y-3 pb-24">
                {dayReservations.length === 0 ? (
                    <Card className="p-8 sm:p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
                                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground mb-1">Nessuna prenotazione</p>
                            <p className="text-xs text-muted-foreground">
                                Aggiungi la prima prenotazione per questo giorno
                            </p>
                        </div>
                    </Card>
                ) : (
                    dayReservations
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((reservation) => (
                            <Card
                                key={reservation.id}
                                className={cn(
                                    'p-3 sm:p-4 transition-all duration-200 hover:shadow-md',
                                    'border-l-4',
                                    reservation.status === 'confirmed' && 'border-l-green-500',
                                    reservation.status === 'pending' && 'border-l-yellow-500',
                                    reservation.status === 'cancelled' && 'border-l-red-500'
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-sm sm:text-base truncate">
                                                {reservation.customerName}
                                            </h4>
                                            <Badge
                                                className={cn(
                                                    'text-[10px] sm:text-xs px-1.5 sm:px-2',
                                                    getStatusBadgeColor(reservation.status)
                                                )}
                                            >
                                                {statusLabels[reservation.status]}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span className="font-medium">{reservation.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span>{reservation.numGuests} {reservation.numGuests === 1 ? 'persona' : 'persone'}</span>
                                            </div>
                                            {reservation.customerPhone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <a
                                                        href={`tel:${reservation.customerPhone}`}
                                                        className="hover:underline"
                                                    >
                                                        {reservation.customerPhone}
                                                    </a>
                                                </div>
                                            )}
                                            {reservation.notes && (
                                                <p className="text-xs italic line-clamp-2 mt-2">
                                                    "{reservation.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                )}
            </div>

            {/* Floating Action Button - Mobile */}
            {onAddReservation && (
                <Button
                    onClick={() => onAddReservation(currentDate, selectedService)}
                    size="lg"
                    className={cn(
                        'fixed bottom-20 right-4 sm:bottom-6 sm:right-6',
                        'h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg',
                        'transition-all duration-300 hover:scale-110 active:scale-95',
                        'z-50'
                    )}
                >
                    <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
                </Button>
            )}

            {/* Quick Action - Desktop Only */}
            <div className="hidden sm:flex gap-2">
                <Button onClick={handleToday} variant="outline" className="flex-1">
                    Vai a Oggi
                </Button>
                {onAddReservation && (
                    <Button onClick={() => onAddReservation(currentDate, selectedService)} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuova Prenotazione
                    </Button>
                )}
            </div>
        </div>
    );
}
