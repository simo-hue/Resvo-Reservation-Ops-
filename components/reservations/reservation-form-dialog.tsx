'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema, type ReservationFormData } from '@/lib/utils/validators';
import { Reservation, ServiceType, Table } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { CalendarIcon, Save } from 'lucide-react';
import { formatDate, normalizeToMidnight } from '@/lib/utils/date-utils';
import { cn } from '@/lib/utils';
import { DEFAULT_TIME_SLOTS } from '@/lib/constants';
import { useRestaurantSettings } from '@/lib/contexts/restaurant-settings-context';
import { tablesService } from '@/lib/supabase/services/tables.service';

interface ReservationFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reservation?: Reservation | null;
    onSave: (data: Partial<Reservation>) => void;
}

export function ReservationFormDialog({
    open,
    onOpenChange,
    reservation,
    onSave
}: ReservationFormDialogProps) {
    const { restaurant } = useRestaurantSettings();
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        reservation ? normalizeToMidnight(new Date(reservation.date)) : normalizeToMidnight(new Date())
    );
    const [selectedService, setSelectedService] = useState<ServiceType>(
        reservation?.serviceType || 'dinner'
    );
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<ReservationFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(reservationSchema) as any,
        defaultValues: {
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            date: new Date(),
            time: '',
            serviceType: 'dinner',
            numGuests: 2,
            tableId: '',
            notes: '',
            status: 'confirmed',
        },
    });

    const watchedTime = watch('time');
    const watchedTableId = watch('tableId');
    const watchedStatus = watch('status');

    // Fetch tables
    useEffect(() => {
        const fetchTables = async () => {
            if (restaurant?.id) {
                try {
                    const data = await tablesService.getTables(restaurant.id);
                    setTables(data);
                } catch (error) {
                    console.error('Error loading tables:', error);
                    toast.error('Errore nel caricamento dei tavoli');
                }
            }
        };
        fetchTables();
    }, [restaurant, open]);

    useEffect(() => {
        if (open) {
            if (reservation) {
                const date = normalizeToMidnight(new Date(reservation.date));
                setSelectedDate(date);
                setSelectedService(reservation.serviceType);
                reset({
                    customerName: reservation.customerName,
                    customerPhone: reservation.customerPhone,
                    customerEmail: reservation.customerEmail || '',
                    date: date,
                    time: reservation.time,
                    serviceType: reservation.serviceType,
                    numGuests: reservation.numGuests,
                    tableId: reservation.tableId,
                    notes: reservation.notes || '',
                    status: reservation.status,
                });
            } else {
                setSelectedDate(normalizeToMidnight(new Date()));
                setSelectedService('dinner');
                reset({
                    customerName: '',
                    customerPhone: '',
                    customerEmail: '',
                    date: new Date(),
                    time: '',
                    serviceType: 'dinner',
                    numGuests: 2,
                    tableId: '',
                    notes: '',
                    status: 'confirmed',
                });
            }
        }
    }, [reservation, open, reset]);

    const onSubmit = async (data: ReservationFormData) => {
        const reservationData = {
            ...data,
            date: selectedDate!,
            serviceType: selectedService,
            id: reservation?.id,
            restaurantId: restaurant?.id || 'restaurant-1',
            createdAt: reservation?.createdAt || new Date(),
            updatedAt: new Date(),
        };

        onSave(reservationData);
        // toast.success(reservation ? 'Prenotazione aggiornata!' : 'Prenotazione creata!'); // Handled by parent
        onOpenChange(false);
        reset();
    };

    const timeSlots = selectedService === 'lunch'
        ? DEFAULT_TIME_SLOTS.LUNCH
        : DEFAULT_TIME_SLOTS.DINNER;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {reservation?.id ? 'Modifica Prenotazione' : 'Nuova Prenotazione'}
                    </DialogTitle>
                    <DialogDescription>
                        Inserisci i dettagli della prenotazione
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Nome Cliente *</Label>
                            <Input
                                id="customerName"
                                {...register('customerName')}
                                placeholder="Mario Rossi"
                            />
                            {errors.customerName && (
                                <p className="text-sm text-destructive">{errors.customerName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customerPhone">Telefono *</Label>
                            <Input
                                id="customerPhone"
                                type="tel"
                                inputMode="tel"
                                {...register('customerPhone')}
                                placeholder="3331234567"
                            />
                            {errors.customerPhone && (
                                <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email (opzionale)</Label>
                        <Input
                            id="customerEmail"
                            type="email"
                            {...register('customerEmail')}
                            placeholder="mario.rossi@email.it"
                        />
                        {errors.customerEmail && (
                            <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Data *</Label>
                            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !selectedDate && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? formatDate(selectedDate, 'dd/MM/yyyy') : 'Seleziona data'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            const normalized = normalizeToMidnight(date);
                                            setSelectedDate(normalized);
                                            setValue('date', normalized);
                                            setIsDatePickerOpen(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="serviceType">Servizio *</Label>
                            <Select
                                value={selectedService}
                                onValueChange={(value) => {
                                    setSelectedService(value as ServiceType);
                                    setValue('serviceType', value as ServiceType);
                                    setValue('time', ''); // Reset time when service changes
                                }}
                            >
                                <SelectTrigger id="serviceType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lunch">Pranzo</SelectItem>
                                    <SelectItem value="dinner">Cena</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Orario *</Label>
                            <Select
                                value={watchedTime}
                                onValueChange={(value) => setValue('time', value)}
                            >
                                <SelectTrigger id="time">
                                    <SelectValue placeholder="Seleziona orario" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                            {slot}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.time && (
                                <p className="text-sm text-destructive">{errors.time.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Guests & Table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="numGuests">Numero Ospiti *</Label>
                            <Input
                                id="numGuests"
                                type="number"
                                inputMode="numeric"
                                {...register('numGuests', { valueAsNumber: true })}
                                placeholder="2"
                                min="1"
                                max="50"
                            />
                            {errors.numGuests && (
                                <p className="text-sm text-destructive">{errors.numGuests.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tableId">Tavolo (opzionale)</Label>
                            <Select
                                value={watchedTableId}
                                onValueChange={(value) => setValue('tableId', value)}
                            >
                                <SelectTrigger id="tableId">
                                    <SelectValue placeholder="Assegna dopo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tables.length > 0 ? (
                                        tables.map((table) => (
                                            <SelectItem key={table.id} value={table.id}>
                                                Tavolo {table.tableNumber} ({table.capacity} posti - {table.position})
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            Nessun tavolo disponibile
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Stato</Label>
                        <Select
                            value={watchedStatus}
                            onValueChange={(value) => setValue('status', value as 'confirmed' | 'pending' | 'cancelled' | 'completed')}
                        >
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="confirmed">Confermata</SelectItem>
                                <SelectItem value="pending">In Attesa</SelectItem>
                                <SelectItem value="cancelled">Cancellata</SelectItem>
                                <SelectItem value="completed">Completata</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Note e Richieste Speciali</Label>
                        <Input
                            id="notes"
                            {...register('notes')}
                            placeholder="Intolleranze, preferenze, seggiolone, torta..."
                        />
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annulla
                        </Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            {reservation?.id ? 'Aggiorna' : 'Inserisci'} Prenotazione
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
