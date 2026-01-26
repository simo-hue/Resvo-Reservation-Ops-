'use client';

import { Reservation } from '@/types';
import { ReservationCard } from './reservation-card';
import { formatDate } from '@/lib/utils/date-utils';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';

interface ReservationListGroupedProps {
    reservations: Reservation[];
    onEdit: (reservation: Reservation) => void;
    onDelete: (id: string) => void;
    onConfirm: (reservation: Reservation) => void;
}

type GroupedReservations = Record<string, {
    date: Date;
    lunch: Reservation[];
    dinner: Reservation[];
}>;

export function ReservationListGrouped({ reservations, onEdit, onDelete, onConfirm }: ReservationListGroupedProps) {
    // 1. Group reservations by Date -> Service
    const grouped = reservations.reduce<GroupedReservations>((acc, reservation) => {
        const dateKey = formatDate(reservation.date, 'yyyy-MM-dd');

        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: reservation.date,
                lunch: [],
                dinner: []
            };
        }

        if (reservation.serviceType === 'lunch') {
            acc[dateKey].lunch.push(reservation);
        } else {
            acc[dateKey].dinner.push(reservation);
        }

        return acc;
    }, {});

    // 2. Sort dates chronologically
    const sortedDates = Object.keys(grouped).sort();

    if (reservations.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2">Nessuna prenotazione</h3>
                <p className="text-muted-foreground">
                    Non ci sono prenotazioni che corrispondono ai filtri selezionati.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {sortedDates.map((dateKey) => {
                const group = grouped[dateKey];
                const hasLunch = group.lunch.length > 0;
                const hasDinner = group.dinner.length > 0;

                return (
                    <div key={dateKey} className="space-y-4">
                        {/* Date Header */}
                        <div className="flex items-center gap-2 sticky top-[72px] bg-background/95 backdrop-blur z-10 py-3 border-b">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">
                                {formatDate(group.date, 'EEEE d MMMM')}
                            </h2>
                            <Badge variant="outline" className="ml-2">
                                {group.lunch.length + group.dinner.length} prenotazioni
                            </Badge>
                        </div>

                        {/* Lunch Section */}
                        {hasLunch && (
                            <div className="space-y-3 pl-4 border-l-2 border-orange-200/50">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                    <span>☀️</span>
                                    PRANZO
                                </div>
                                <div className="grid gap-3">
                                    {group.lunch.map(reservation => (
                                        <ReservationCard
                                            key={reservation.id}
                                            reservation={reservation}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            onConfirm={onConfirm}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dinner Section */}
                        {hasDinner && (
                            <div className="space-y-3 pl-4 border-l-2 border-indigo-200/50">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                    <span>🌙</span>
                                    CENA
                                </div>
                                <div className="grid gap-3">
                                    {group.dinner.map(reservation => (
                                        <ReservationCard
                                            key={reservation.id}
                                            reservation={reservation}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            onConfirm={onConfirm}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
