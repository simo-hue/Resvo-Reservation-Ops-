'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tableSchema, type TableFormData } from '@/lib/utils/validators';
import { Table } from '@/types';
import { useRestaurantSettings } from '@/lib/contexts/restaurant-settings-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, UtensilsCrossed } from 'lucide-react';

export function TableManagement() {
    const { spaces, tables, addTable, updateTable, deleteTable } = useRestaurantSettings();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<TableFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(tableSchema) as any,
        defaultValues: {
            tableNumber: '',
            capacity: 2,
            position: 'interno',
            isActive: true,
        },
    });

    const watchedPosition = useWatch({ control, name: 'position' });

    const handleAddTable = () => {
        setEditingTable(null);
        reset({
            tableNumber: '',
            capacity: 2,
            position: spaces[0]?.value || 'interno',
            isActive: true,
        });
        setIsDialogOpen(true);
    };

    const handleEditTable = (table: Table) => {
        setEditingTable(table);
        reset({
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            position: table.position,
            isActive: table.isActive,
        });
        setIsDialogOpen(true);
    };

    const handleDeleteTable = async (tableId: string) => {
        try {
            await deleteTable(tableId);
            toast.success('Tavolo eliminato');
        } catch {
            toast.error('Errore durante l\'eliminazione');
        }
    };

    const onSubmit = async (data: TableFormData) => {
        try {
            if (editingTable) {
                // Update existing table
                await updateTable(editingTable.id, data);
                toast.success('Tavolo aggiornato!');
            } else {
                // Add new table
                await addTable(data);
                toast.success('Tavolo aggiunto!');
            }

            setIsDialogOpen(false);
            reset();
        } catch {
            toast.error('Errore durante il salvataggio');
        }
    };

    // Group tables by position
    const tablesByPosition = tables.reduce((acc, table) => {
        if (!acc[table.position]) acc[table.position] = [];
        acc[table.position].push(table);
        return acc;
    }, {} as Record<string, Table[]>);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Gestione Tavoli</CardTitle>
                        <CardDescription>
                            Aggiungi, modifica o rimuovi i tavoli del tuo ristorante
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddTable}>
                                <Plus className="mr-2 h-4 w-4" />
                                Aggiungi Tavolo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingTable ? 'Modifica Tavolo' : 'Nuovo Tavolo'}
                                </DialogTitle>
                                <DialogDescription>
                                    Inserisci i dettagli del tavolo
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tableNumber">Numero Tavolo</Label>
                                    <Input
                                        id="tableNumber"
                                        {...register('tableNumber')}
                                        placeholder="1"
                                    />
                                    {errors.tableNumber && (
                                        <p className="text-sm text-destructive">{errors.tableNumber.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacità (persone)</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        {...register('capacity', { valueAsNumber: true })}
                                        placeholder="4"
                                    />
                                    {errors.capacity && (
                                        <p className="text-sm text-destructive">{errors.capacity.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="position">Posizione</Label>
                                    <Select
                                        value={watchedPosition}
                                        onValueChange={(value) => setValue('position', value)}
                                    >
                                        <SelectTrigger id="position">
                                            <SelectValue placeholder="Seleziona posizione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {spaces.map((space) => (
                                                <SelectItem key={space.id} value={space.value}>
                                                    {space.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.position && (
                                        <p className="text-sm text-destructive">{errors.position.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Annulla
                                    </Button>
                                    <Button type="submit">
                                        {editingTable ? 'Aggiorna' : 'Crea'} Tavolo
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-muted p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold">{tables.length}</div>
                            <div className="text-sm text-muted-foreground">Tavoli Totali</div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold">
                                {tables.reduce((sum, t) => sum + t.capacity, 0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Posti Totali</div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold">
                                {tables.filter(t => t.isActive).length}
                            </div>
                            <div className="text-sm text-muted-foreground">Tavoli Attivi</div>
                        </div>
                    </div>

                    {/* Tables grouped by position */}
                    {Object.entries(tablesByPosition).map(([position, posTables]) => {
                        const spaceLabel = spaces.find(s => s.value === position)?.label || position;
                        return (
                            <div key={position} className="space-y-3">
                                <h3 className="font-semibold text-lg">{spaceLabel}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {posTables.map((table) => (
                                        <Card key={table.id} className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <UtensilsCrossed className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">Tavolo {table.tableNumber}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {table.capacity} {table.capacity === 1 ? 'persona' : 'persone'}
                                                        </div>
                                                        {!table.isActive && (
                                                            <Badge variant="secondary" className="mt-1">Inattivo</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleEditTable(table)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteTable(table.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
