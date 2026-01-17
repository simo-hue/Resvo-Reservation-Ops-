'use client';

import { useTheme } from '@/components/theme-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Sun, Monitor } from 'lucide-react';

export function AppearanceSettings() {
    const { theme, setTheme, actualTheme } = useTheme();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Aspetto</CardTitle>
                <CardDescription>
                    Personalizza il tema dell'applicazione
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Theme selector */}
                <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
                        <SelectTrigger id="theme">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">
                                <div className="flex items-center gap-2">
                                    <Sun className="h-4 w-4" />
                                    Chiaro
                                </div>
                            </SelectItem>
                            <SelectItem value="dark">
                                <div className="flex items-center gap-2">
                                    <Moon className="h-4 w-4" />
                                    Scuro
                                </div>
                            </SelectItem>
                            <SelectItem value="system">
                                <div className="flex items-center gap-2">
                                    <Monitor className="h-4 w-4" />
                                    Sistema
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        {theme === 'system'
                            ? `Attualmente in modalità ${actualTheme === 'dark' ? 'scura' : 'chiara'} (da impostazioni sistema)`
                            : `Modalità ${actualTheme === 'dark' ? 'scura' : 'chiara'} attiva`
                        }
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
