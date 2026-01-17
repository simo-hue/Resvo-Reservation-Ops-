'use client';

import { useState } from 'react';
import { mockRestaurant } from '@/lib/mock-data';
import { DAYS_OF_WEEK } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

type OpeningHours = {
    [key: string]: {
        lunch?: { start: string; end: string };
        dinner?: { start: string; end: string };
        closed?: boolean;
    };
};

export function OpeningHoursConfig() {
    const [hours, setHours] = useState<OpeningHours>(mockRestaurant.openingHours);
    const [isSaving, setIsSaving] = useState(false);

    const handleToggleClosed = (day: string) => {
        setHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                closed: !prev[day]?.closed,
            },
        }));
    };

    const handleTimeChange = (
        day: string,
        service: 'lunch' | 'dinner',
        type: 'start' | 'end',
        value: string
    ) => {
        setHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [service]: {
                    ...prev[day]?.[service],
                    [type]: value,
                } as { start: string; end: string },
            },
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Opening hours saved:', hours);
        toast.success('Orari di apertura salvati!');
        setIsSaving(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Orari di Apertura</CardTitle>
                <CardDescription>
                    Configura gli orari di pranzo e cena per ogni giorno della settimana
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                    const dayHours = hours[day] || {};
                    const isClosed = dayHours.closed || false;

                    return (
                        <div key={day} className="space-y-3 pb-4 border-b last:border-0">
                            {/* Day header with closed toggle */}
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">{day}</Label>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`closed-${day}`} className="text-sm text-muted-foreground">
                                        Chiuso
                                    </Label>
                                    <Switch
                                        id={`closed-${day}`}
                                        checked={isClosed}
                                        onCheckedChange={() => handleToggleClosed(day)}
                                    />
                                </div>
                            </div>

                            {!isClosed && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                                    {/* Lunch hours */}
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Pranzo</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="time"
                                                value={dayHours.lunch?.start || '12:00'}
                                                onChange={(e) => handleTimeChange(day, 'lunch', 'start', e.target.value)}
                                                className="flex-1"
                                            />
                                            <span className="text-muted-foreground">-</span>
                                            <Input
                                                type="time"
                                                value={dayHours.lunch?.end || '15:00'}
                                                onChange={(e) => handleTimeChange(day, 'lunch', 'end', e.target.value)}
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Dinner hours */}
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Cena</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="time"
                                                value={dayHours.dinner?.start || '19:00'}
                                                onChange={(e) => handleTimeChange(day, 'dinner', 'start', e.target.value)}
                                                className="flex-1"
                                            />
                                            <span className="text-muted-foreground">-</span>
                                            <Input
                                                type="time"
                                                value={dayHours.dinner?.end || '23:00'}
                                                onChange={(e) => handleTimeChange(day, 'dinner', 'end', e.target.value)}
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'Salvataggio...' : 'Salva Orari'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
