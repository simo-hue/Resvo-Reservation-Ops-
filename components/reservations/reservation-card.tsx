'use client';

import React, { useState } from 'react';
import { Reservation } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { STATUS_COLORS } from '@/lib/constants';
import { Users, Phone, Mail, Clock, UtensilsCrossed, Edit, Trash2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReservationCardProps {
    reservation: Reservation;
    onEdit: (reservation: Reservation) => void;
    onDelete: (id: string) => void;
    onConfirm: (reservation: Reservation) => void;
}

export function ReservationCard({ reservation, onEdit, onDelete, onConfirm }: ReservationCardProps) {
    const statusLabel = {
        confirmed: 'Confermata',
        pending: 'In Attesa',
        cancelled: 'Cancellata',
        completed: 'Completata',
    }[reservation.status];

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                    {/* Primary Info: Customer Name */}
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg leading-none">{reservation.customerName}</h3>
                        <Badge className={STATUS_COLORS[reservation.status]}>
                            {statusLabel}
                        </Badge>
                    </div>

                    {/* Secondary Info: Time, Guests, Table */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap pt-1">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Clock className="h-4 w-4 text-primary" />
                            {reservation.time}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{reservation.numGuests} {reservation.numGuests === 1 ? 'ospite' : 'ospiti'}</span>
                        </div>
                        {reservation.tableId && reservation.table && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <UtensilsCrossed className="h-3 w-3" />
                                    <span>Tavolo {reservation.table.tableNumber}</span>
                                </div>
                            </>
                        )}
                        <Badge variant="outline" className="ml-1 h-5 text-[10px] px-1.5 capitalize">
                            {reservation.serviceType === 'lunch' ? '☀️ Pranzo' : '🌙 Cena'}
                        </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            {reservation.customerPhone}
                        </div>
                        {reservation.customerEmail && (
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-3 w-3" />
                                {reservation.customerEmail}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    {(reservation.notes || reservation.specialRequests) && (
                        <div className="text-sm space-y-1 pt-2">
                            {reservation.notes && (
                                <div className="flex items-start gap-2 text-amber-600/90 dark:text-amber-500/90 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md text-xs">
                                    <span className="font-semibold">Note:</span> {reservation.notes}
                                </div>
                            )}
                            {reservation.specialRequests && (
                                <div className="flex items-start gap-2 text-blue-600/90 dark:text-blue-500/90 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-md text-xs">
                                    <span className="font-semibold">Richiesta:</span> {reservation.specialRequests}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                    <TooltipProvider>
                        {reservation.status === 'pending' && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => setIsStatusConfirmOpen(true)}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Conferma Prenotazione</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onEdit(reservation)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Modifica / Sposta</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => setIsConfirmOpen(true)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Elimina</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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

            <Dialog open={isStatusConfirmOpen} onOpenChange={setIsStatusConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Conferma Prenotazione</DialogTitle>
                        <DialogDescription>
                            Vuoi confermare la prenotazione di {reservation.customerName}?
                            Lo stato passerà a &quot;Confermata&quot;.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsStatusConfirmOpen(false)}>Annulla</Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                                onConfirm(reservation);
                                setIsStatusConfirmOpen(false);
                            }}
                        >
                            Conferma
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
