'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Reservation, ServiceType, ReservationStatus } from '@/types';
import { ReservationCard } from '@/components/reservations/reservation-card';
import { ReservationFormDialog } from '@/components/reservations/reservation-form-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Plus, Search, Filter, Loader2, X } from 'lucide-react';
import { useRestaurantSettings } from '@/lib/contexts/restaurant-settings-context';
import { reservationsService } from '@/lib/supabase/services/reservations.service';

export default function ReservationsPage() {
    const { restaurant, isLoading: settingsLoading } = useRestaurantSettings();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [isLoadingReservations, setIsLoadingReservations] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'time'>('date');

    const loadReservations = useCallback(async () => {
        if (!restaurant) return;

        try {
            setIsLoadingReservations(true);
            const data = await reservationsService.getReservations(restaurant.id);
            setReservations(data);
        } catch (error) {
            console.error('Error loading reservations:', error);
            toast.error('Errore durante il caricamento');
        } finally {
            setIsLoadingReservations(false);
        }
    }, [restaurant]);

    // Load reservations
    useEffect(() => {
        if (restaurant && restaurant.id) {
            loadReservations();
        }
    }, [restaurant, loadReservations]);

    // Filter and search logic
    const filteredReservations = useMemo(() => {
        let filtered = [...reservations];

        // Search by customer name or phone
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (res) =>
                    res.customerName.toLowerCase().includes(query) ||
                    res.customerPhone.includes(query) ||
                    res.customerEmail?.toLowerCase().includes(query)
            );
        }

        // Filter by service
        if (serviceFilter !== 'all') {
            filtered = filtered.filter((res) => res.serviceType === serviceFilter);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((res) => res.status === statusFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                if (dateCompare !== 0) return dateCompare;
                return a.time.localeCompare(b.time);
            }
            return a.time.localeCompare(b.time);
        });

        return filtered;
    }, [reservations, searchQuery, serviceFilter, statusFilter, sortBy]);

    // Statistics
    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return {
            total: reservations.length,
            today: reservations.filter((r) => {
                const resDate = new Date(r.date);
                resDate.setHours(0, 0, 0, 0);
                return resDate.getTime() === today.getTime() && r.status !== 'cancelled';
            }).length,
            upcoming: reservations.filter((r) => {
                const resDate = new Date(r.date);
                return resDate >= today && r.status !== 'cancelled' && r.status !== 'completed';
            }).length,
            pending: reservations.filter((r) => r.status === 'pending').length,
        };
    }, [reservations]);

    const handleAddNew = () => {
        setEditingReservation(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (reservation: Reservation) => {
        setEditingReservation(reservation);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!restaurant) return;

        try {
            await reservationsService.deleteReservation(id);
            toast.success('Prenotazione eliminata');
            await loadReservations();
        } catch (error) {
            console.error('Error deleting reservation:', error);
            toast.error('Errore durante l\'eliminazione');
        }
    };

    const handleSave = async (data: Partial<Reservation>) => {
        if (!restaurant) return;

        try {
            if (editingReservation) {
                await reservationsService.updateReservation(editingReservation.id, data);
                toast.success('Prenotazione aggiornata');
            } else {
                await reservationsService.createReservation(restaurant.id, data as Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>);
                toast.success('Prenotazione creata');
            }

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Prenotazioni</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestisci tutte le prenotazioni del ristorante
                    </p>
                </div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuova Prenotazione
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Totali</div>
                </Card>
                <Card className="p-4">
                    <div className="text-2xl font-bold text-green-600">{stats.today}</div>
                    <div className="text-sm text-muted-foreground">Oggi</div>
                </Card>
                <Card className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                    <div className="text-sm text-muted-foreground">In Arrivo</div>
                </Card>
                <Card className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-muted-foreground">Da Confermare</div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4 border-none shadow-md bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold">Filtri</h3>
                        </div>
                        {(searchQuery || serviceFilter !== 'all' || statusFilter !== 'all') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setServiceFilter('all');
                                    setStatusFilter('all');
                                }}
                                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Reset
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search - Full width on mobile, Flex-1 on desktop */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cerca..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-background/50 h-10"
                            />
                        </div>

                        {/* Selectors - Side by side on mobile, centered */}
                        <div className="flex flex-row justify-center gap-3 w-full md:w-auto">
                            <div className="w-[45%] md:w-[150px] max-w-[200px]">
                                <Select value={serviceFilter} onValueChange={(value) => setServiceFilter(value as ServiceType | 'all')}>
                                    <SelectTrigger className="h-10 bg-background/50">
                                        <SelectValue placeholder="Servizio" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="all">Tutti</SelectItem>
                                        <SelectItem value="lunch">☀️ Pranzo</SelectItem>
                                        <SelectItem value="dinner">🌙 Cena</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-[45%] md:w-[150px] max-w-[200px]">
                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReservationStatus | 'all')}>
                                    <SelectTrigger className="h-10 bg-background/50">
                                        <SelectValue placeholder="Stato" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="all">Tutti</SelectItem>
                                        <SelectItem value="confirmed">Confermate</SelectItem>
                                        <SelectItem value="pending">In Attesa</SelectItem>
                                        <SelectItem value="cancelled">Cancellate</SelectItem>
                                        <SelectItem value="completed">Completate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Reservations List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        {filteredReservations.length} {filteredReservations.length === 1 ? 'Prenotazione' : 'Prenotazioni'}
                    </h3>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'time')}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Ordina per Data</SelectItem>
                            <SelectItem value="time">Ordina per Orario</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {filteredReservations.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold mb-2">Nessuna prenotazione trovata</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery || serviceFilter !== 'all' || statusFilter !== 'all'
                                ? 'Prova a modificare i filtri di ricerca'
                                : 'Inizia creando una nuova prenotazione'}
                        </p>
                        <Button onClick={handleAddNew}>
                            <Plus className="mr-2 h-4 w-4" />
                            Crea Prenotazione
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredReservations.map((reservation) => (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Form Dialog */}
            <ReservationFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                reservation={editingReservation}
                onSave={handleSave}
            />

            <Toaster />
        </div>
    );
}
