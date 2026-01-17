'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ListOrdered, BarChart3, Settings, X, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
    { name: 'Calendario', href: '/', icon: Calendar },
    { name: 'Prenotazioni', href: '/reservations', icon: ListOrdered },
    { name: 'Statistiche', href: '/statistics', icon: BarChart3 },
    { name: 'Impostazioni', href: '/settings/restaurant', icon: Settings },
];

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const pathname = usePathname();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                onClick={onClose}
            />

            {/* Mobile sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:hidden transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">Resvo</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Chiudi menu</span>
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
