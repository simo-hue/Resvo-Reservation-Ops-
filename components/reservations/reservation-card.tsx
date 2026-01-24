'use client';

import React, { useState } from 'react';
import { Reservation } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/date-utils';
import { STATUS_COLORS } from '@/lib/constants';
import { Users, Phone, Mail, Clock, UtensilsCrossed, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ReservationCardProps {
    reservation: Reservation;
    onEdit: (reservation: Reservation) => void;
    onDelete: (id: string) => void;
}

export function ReservationCard({ reservation, onEdit, onDelete }: ReservationCardProps) {
    const statusLabel = {
        confirmed: 'Confermata',
        pending: 'In Attesa',
        cancelled: 'Cancellata',
        completed: 'Completata',
    }[reservation.status];

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                    {/* Header with time and status */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            {reservation.time}
                        </div>
                        <Badge className={STATUS_COLORS[reservation.status]}>
                            {statusLabel}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                            {reservation.serviceType === 'lunch' ? '☀️ Pranzo' : '🌙 Cena'}
                        </Badge>
                    </div>

                    {/* Customer info */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{reservation.customerName}</span>
                            <span className="text-muted-foreground">• {reservation.numGuests} {reservation.numGuests === 1 ? 'persona' : 'persone'}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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
                        </div>
                    </div>

                    {/* Date and table */}
                    <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">
                            📅 {formatDate(new Date(reservation.date), 'EEEE, d MMMM yyyy')}
                        </span>
                        {reservation.tableId && reservation.table && (
                            <div className="flex items-center gap-1">
                                <UtensilsCrossed className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    Tavolo {reservation.table.tableNumber}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    {(reservation.notes || reservation.specialRequests) && (
                        <div className="text-sm space-y-1 pl-4 border-l-2 border-muted">
                            {reservation.notes && <div>📝 {reservation.notes}</div>}
                            {reservation.specialRequests && <div>⭐ {reservation.specialRequests}</div>}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(reservation)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsConfirmOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </div>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Conferma Eliminazione</DialogTitle>
                        <DialogDescription>
                            Sei sicuro di voler eliminare la prenotazione di {reservation.customerName}? Questa azione è irreversibile.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Annulla</Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onDelete(reservation.id);
                                setIsConfirmOpen(false);
                            }}
                        >
                            Elimina
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
