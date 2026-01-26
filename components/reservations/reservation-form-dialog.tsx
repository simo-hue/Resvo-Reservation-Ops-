'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon, Save, User, UtensilsCrossed, FileText } from 'lucide-react';
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
        control,
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
            numGuests: 0,
            tableId: '',
            notes: '',
            status: 'confirmed',
        },
    });

    const watchedTime = useWatch({ control, name: 'time' });
    const watchedTableId = useWatch({ control, name: 'tableId' });
    const watchedStatus = useWatch({ control, name: 'status' });

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
                    customerPhone: reservation.customerPhone || '',
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
                    numGuests: 0,
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
            <DialogContent className="w-[95vw] max-w-[92vw] h-[85vh] p-0 gap-0 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
                    <DialogTitle className="text-xl font-bold text-primary">
                        {reservation?.id ? 'Modifica Prenotazione' : 'Nuova Prenotazione'}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Gestisci i dettagli della prenotazione
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">

                        {/* TOP ROW: Customer & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Customer Info Card */}
                            <Card className="border-l-4 border-l-blue-500 shadow-sm">
                                <CardHeader className="py-3 px-4 bg-blue-50/50 dark:bg-blue-900/10">
                                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-400 text-base">
                                        <User className="w-4 h-4 mr-2" />
                                        Dati Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 grid gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="customerName" className="text-xs font-semibold">Nome Cliente</Label>
                                        <Input
                                            id="customerName"
                                            {...register('customerName')}
                                            placeholder="Mario Rossi"
                                            className={cn(
                                                "bg-white dark:bg-slate-900 h-9",
                                                errors.customerName && "border-destructive ring-1 ring-destructive"
                                            )}
                                        />
                                        {errors.customerName && (
                                            <p className="text-xs text-destructive">{errors.customerName.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="customerPhone" className="text-xs">Telefono</Label>
                                            <Input
                                                id="customerPhone"
                                                type="tel"
                                                inputMode="tel"
                                                {...register('customerPhone')}
                                                placeholder="333..."
                                                className="bg-white dark:bg-slate-900 h-9"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="customerEmail" className="text-xs">Email</Label>
                                            <Input
                                                id="customerEmail"
                                                type="email"
                                                {...register('customerEmail')}
                                                placeholder="email@..."
                                                className="bg-white dark:bg-slate-900 h-9"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status Card */}
                            <Card className="border-l-4 border-l-amber-500 shadow-sm">
                                <CardHeader className="py-3 px-4 bg-amber-50/50 dark:bg-amber-900/10">
                                    <CardTitle className="flex items-center text-amber-700 dark:text-amber-400 text-base">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Stato & Note
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 grid gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="status" className="text-xs font-semibold">Stato</Label>
                                        <Select
                                            value={watchedStatus}
                                            onValueChange={(value) => setValue('status', value as 'confirmed' | 'pending' | 'cancelled' | 'completed')}
                                        >
                                            <SelectTrigger
                                                id="status"
                                                className={cn(
                                                    "bg-white dark:bg-slate-900 h-9",
                                                    errors.status && "border-destructive ring-1 ring-destructive"
                                                )}
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="confirmed" className="text-green-600 font-medium">Confermata</SelectItem>
                                                <SelectItem value="pending" className="text-amber-600 font-medium">In Attesa</SelectItem>
                                                {!!reservation?.id && (
                                                    <>
                                                        <SelectItem value="cancelled" className="text-red-600 font-medium">Cancellata</SelectItem>
                                                        <SelectItem value="completed" className="text-blue-600 font-medium">Completata</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="notes" className="text-xs">Note</Label>
                                        <Input
                                            id="notes"
                                            {...register('notes')}
                                            placeholder="Note..."
                                            className="bg-white dark:bg-slate-900 h-9"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* BOTTOM ROW: Table Details (Full Width) */}
                        <Card className="border-l-4 border-l-green-500 shadow-sm w-full">
                            <CardHeader className="py-3 px-4 bg-green-50/50 dark:bg-green-900/10">
                                <CardTitle className="flex items-center text-green-700 dark:text-green-400 text-base">
                                    <UtensilsCrossed className="w-4 h-4 mr-2" />
                                    Dettagli Tavolo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {/* Row 1: Data, Servizio, Orario */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold">Data</Label>
                                        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal bg-white dark:bg-slate-900 h-9',
                                                        !selectedDate && 'text-muted-foreground',
                                                        errors.date && "border-destructive ring-1 ring-destructive"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                                    {selectedDate ? formatDate(selectedDate, 'dd/MM/yyyy') : 'Seleziona data'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
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
                                        {errors.date && (
                                            <p className="text-xs text-destructive">{errors.date.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="serviceType" className="text-xs">Servizio</Label>
                                        <Select
                                            value={selectedService}
                                            onValueChange={(value) => {
                                                setSelectedService(value as ServiceType);
                                                setValue('serviceType', value as ServiceType);
                                                setValue('time', '');
                                            }}
                                        >
                                            <SelectTrigger
                                                id="serviceType"
                                                className={cn(
                                                    "bg-white dark:bg-slate-900 h-9",
                                                    errors.serviceType && "border-destructive ring-1 ring-destructive"
                                                )}
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lunch">Pranzo</SelectItem>
                                                <SelectItem value="dinner">Cena</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="time" className="text-xs">Orario</Label>
                                        <Select
                                            value={watchedTime}
                                            onValueChange={(value) => setValue('time', value)}
                                        >
                                            <SelectTrigger
                                                id="time"
                                                className={cn(
                                                    "bg-white dark:bg-slate-900 h-9",
                                                    errors.time && "border-destructive ring-1 ring-destructive"
                                                )}
                                            >
                                                <SelectValue placeholder="--" />
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
                                            <p className="text-xs text-destructive">{errors.time.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Coperti, Tavolo */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1 md:col-span-1">
                                        <Label htmlFor="numGuests" className="text-xs">Coperti</Label>
                                        <Input
                                            id="numGuests"
                                            type="number"
                                            inputMode="numeric"
                                            {...register('numGuests', { valueAsNumber: true })}
                                            placeholder="2"
                                            min="1"
                                            max="50"
                                            className={cn(
                                                "bg-white dark:bg-slate-900 h-9",
                                                errors.numGuests && "border-destructive ring-1 ring-destructive"
                                            )}
                                        />
                                        {errors.numGuests && (
                                            <p className="text-xs text-destructive">{errors.numGuests.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="tableId" className="text-xs">Tavolo</Label>
                                        <Select
                                            value={watchedTableId}
                                            onValueChange={(value) => setValue('tableId', value)}
                                        >
                                            <SelectTrigger id="tableId" className="bg-white dark:bg-slate-900 h-9">
                                                <SelectValue placeholder="Auto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="_auto">Assegna dopo</SelectItem>
                                                {tables.length > 0 ? (
                                                    tables.map((table) => (
                                                        <SelectItem key={table.id} value={table.id}>
                                                            T.{table.tableNumber} ({table.capacity}p)
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                                        Nessun tavolo
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* STICKY FOOTER ACTIONS */}
                    <div className="p-4 border-t bg-white dark:bg-slate-950 flex justify-end gap-3 shrink-0">
                        <Button type="button" variant="outline" size="default" onClick={() => onOpenChange(false)}>
                            Annulla
                        </Button>
                        <Button type="submit" size="default" className="px-6 bg-primary hover:bg-primary/90">
                            <Save className="mr-2 h-4 w-4" />
                            {reservation?.id ? 'Salva Modifiche' : 'Crea Prenotazione'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
