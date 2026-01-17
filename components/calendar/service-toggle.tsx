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
        <div className="inline-flex items-center bg-muted p-1 rounded-lg w-full sm:w-auto">
            <button
                onClick={() => onServiceChange('lunch')}
                className={cn(
                    'flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2',
                    selectedService === 'lunch'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                )}
            >
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Pranzo
            </button>
            <button
                onClick={() => onServiceChange('dinner')}
                className={cn(
                    'flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2',
                    selectedService === 'dinner'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                )}
            >
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Cena
            </button>
        </div>
    );
}
