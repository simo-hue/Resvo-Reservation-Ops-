'use client';

import { Reservation, ServiceType } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils/date-utils';
import { getReservationsForDateAndService, calculateDailyStats } from '@/lib/utils/capacity-calculator';
import { Users, Phone, Mail, Clock, UtensilsCrossed } from 'lucide-react';
import { STATUS_COLORS } from '@/lib/constants';

interface DayDetailViewProps {
    date: Date | null;
    serviceType: ServiceType;
    reservations: Reservation[];
    maxCapacityLunch: number;
    maxCapacityDinner: number;
    open: boolean;
    onClose: () => void;
}

export function DayDetailView({
    date,
    serviceType,
    reservations,
    maxCapacityLunch,
    maxCapacityDinner,
    open,
    onClose,
}: DayDetailViewProps) {
    if (!date) return null;

    const dayReservations = reservations.filter((r) => {
        const resDate = new Date(r.date);
        return (
            resDate.getFullYear() === date.getFullYear() &&
            resDate.getMonth() === date.getMonth() &&
            resDate.getDate() === date.getDate()
        );
    });

    const stats = calculateDailyStats(dayReservations, maxCapacityLunch, maxCapacityDinner);
    const serviceReservations = getReservationsForDateAndService(dayReservations, date, serviceType);
    const serviceStats = serviceType === 'lunch' ? stats.lunch : stats.dinner;

    // Sort reservations by time
    const sortedReservations = [...serviceReservations].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {formatDate(date, 'EEEE, d MMMM yyyy')}
                    </DialogTitle>
                    <p className="text-muted-foreground capitalize">
                        {serviceType === 'lunch' ? 'Pranzo' : 'Cena'}
                    </p>
                </DialogHeader>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground mb-1">Prenotazioni</div>
                        <div className="text-3xl font-bold">{serviceStats.reservations}</div>
                    </Card>

                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground mb-1">Coperti</div>
                        <div className="text-3xl font-bold">{serviceStats.guests}</div>
                    </Card>

                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground mb-1">Capacità</div>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold">{serviceStats.capacity.percentage}%</div>
                            <div
                                className={`h-3 w-3 rounded-full ${serviceStats.capacity.color === 'green'
                                        ? 'bg-green-500'
                                        : serviceStats.capacity.color === 'yellow'
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                    }`}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {serviceStats.capacity.available} posti disponibili
                        </div>
                    </Card>
                </div>

                <Separator />

                {/* Reservations list */}
                <div className="space-y-3 mt-4">
                    <h3 className="text-lg font-semibold">
                        Prenotazioni ({sortedReservations.length})
                    </h3>

                    {sortedReservations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nessuna prenotazione per questo servizio
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {sortedReservations.map((reservation) => (
                                <Card key={reservation.id} className="p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-semibold">{reservation.time}</span>
                                                <Badge className={STATUS_COLORS[reservation.status]}>
                                                    {reservation.status === 'confirmed' ? 'Confermata' :
                                                        reservation.status === 'pending' ? 'In attesa' :
                                                            reservation.status === 'cancelled' ? 'Cancellata' : 'Completata'}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{reservation.customerName}</span>
                                                <span className="text-muted-foreground">• {reservation.numGuests} persone</span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3" />
                                                    {reservation.customerPhone}
                                                </div>
                                                {reservation.customerEmail && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3" />
                                                        {reservation.customerEmail}
                                                    </div>
                                                )}
                                                {reservation.tableId && (
                                                    <div className="flex items-center gap-2">
                                                        <UtensilsCrossed className="h-3 w-3" />
                                                        Tavolo {reservation.table?.tableNumber}
                                                    </div>
                                                )}
                                            </div>

                                            {(reservation.notes || reservation.specialRequests) && (
                                                <div className="text-sm text-muted-foreground pl-7 space-y-1">
                                                    {reservation.notes && <div>📝 {reservation.notes}</div>}
                                                    {reservation.specialRequests && <div>⭐ {reservation.specialRequests}</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
