'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { restaurantSettingsSchema, type RestaurantSettingsFormData } from '@/lib/utils/validators';
import { mockRestaurant } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export function RestaurantSettingsForm() {
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RestaurantSettingsFormData>({
        resolver: zodResolver(restaurantSettingsSchema),
        defaultValues: {
            name: mockRestaurant.name,
            maxCapacityLunch: mockRestaurant.maxCapacityLunch,
            maxCapacityDinner: mockRestaurant.maxCapacityDinner,
            defaultTableDuration: mockRestaurant.defaultTableDuration,
        },
    });

    const onSubmit = async (data: RestaurantSettingsFormData) => {
        setIsSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Settings saved:', data);
        toast.success('Impostazioni salvate con successo!');
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Informazioni Ristorante</CardTitle>
                    <CardDescription>
                        Configura nome, capacità e durata media dei tavoli
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Restaurant Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Ristorante</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Il mio ristorante"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Capacities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="maxCapacityLunch">Capacità Pranzo</Label>
                            <Input
                                id="maxCapacityLunch"
                                type="number"
                                {...register('maxCapacityLunch', { valueAsNumber: true })}
                                placeholder="80"
                            />
                            {errors.maxCapacityLunch && (
                                <p className="text-sm text-destructive">{errors.maxCapacityLunch.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Numero massimo di coperti a pranzo
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxCapacityDinner">Capacità Cena</Label>
                            <Input
                                id="maxCapacityDinner"
                                type="number"
                                {...register('maxCapacityDinner', { valueAsNumber: true })}
                                placeholder="100"
                            />
                            {errors.maxCapacityDinner && (
                                <p className="text-sm text-destructive">{errors.maxCapacityDinner.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Numero massimo di coperti a cena
                            </p>
                        </div>
                    </div>

                    {/* Table Duration */}
                    <div className="space-y-2">
                        <Label htmlFor="defaultTableDuration">Durata Media Tavolo (minuti)</Label>
                        <Input
                            id="defaultTableDuration"
                            type="number"
                            {...register('defaultTableDuration', { valueAsNumber: true })}
                            placeholder="120"
                        />
                        {errors.defaultTableDuration && (
                            <p className="text-sm text-destructive">{errors.defaultTableDuration.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Tempo medio che un cliente trascorre al tavolo
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
