'use client';

import { ServiceType } from '@/types';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';

interface ServiceToggleProps {
    selectedService: ServiceType;
    onServiceChange: (service: ServiceType) => void;
}

export function ServiceToggle({ selectedService, onServiceChange }: ServiceToggleProps) {
    return (
        <div className="inline-flex items-center bg-muted p-1 rounded-lg">
            <button
                onClick={() => onServiceChange('lunch')}
                className={cn(
                    'px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2',
                    selectedService === 'lunch'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                )}
            >
                <Sun className="h-4 w-4" />
                Pranzo
            </button>
            <button
                onClick={() => onServiceChange('dinner')}
                className={cn(
                    'px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2',
                    selectedService === 'dinner'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                )}
            >
                <Moon className="h-4 w-4" />
                Cena
            </button>
        </div>
    );
}
