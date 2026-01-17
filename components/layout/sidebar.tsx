'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ListOrdered, BarChart3, Settings, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Calendario', href: '/', icon: Calendar },
    { name: 'Prenotazioni', href: '/reservations', icon: ListOrdered },
    { name: 'Statistiche', href: '/statistics', icon: BarChart3 },
    { name: 'Impostazioni', href: '/settings/restaurant', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
            {/* Logo */}
            <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Resvo</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
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

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                    Resvo v1.0.0
                </p>
            </div>
        </aside>
    );
}
