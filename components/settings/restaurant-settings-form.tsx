'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { restaurantSettingsSchema, type RestaurantSettingsFormData } from '@/lib/utils/validators';
import { useRestaurantSettings } from '@/lib/contexts/restaurant-settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export function RestaurantSettingsForm() {
    const [isSaving, setIsSaving] = useState(false);
    const { restaurant, updateSettings } = useRestaurantSettings();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RestaurantSettingsFormData>({
        resolver: zodResolver(restaurantSettingsSchema),
        defaultValues: {
            maxCapacityLunch: restaurant?.maxCapacityLunch || 80,
            maxCapacityDinner: restaurant?.maxCapacityDinner || 100,
        },
    });

    // Update form values when restaurant data is loaded
    useEffect(() => {
        if (restaurant) {
            reset({
                maxCapacityLunch: restaurant.maxCapacityLunch,
                maxCapacityDinner: restaurant.maxCapacityDinner,
            });
        }
    }, [restaurant, reset]);

    const onSubmit = async (data: RestaurantSettingsFormData) => {
        setIsSaving(true);

        try {
            await updateSettings(data);
            toast.success('Impostazioni salvate con successo!');
        } catch (error) {
            toast.error('Errore nel salvataggio delle impostazioni');
            console.error('Error saving settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Configurazione Sala</CardTitle>
                    <CardDescription>
                        Imposta la capacità massima per servizio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
