'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/supabase/auth';
import { toast } from 'sonner';

interface HeaderProps {
    onMobileMenuToggle?: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState<string>('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        // Set date only on client side to avoid hydration mismatch
        setCurrentDate(new Date().toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }));
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const { error } = await signOut();

        if (error) {
            toast.error('Errore durante il logout');
            setIsLoggingOut(false);
            return;
        }

        toast.success('Logout effettuato');
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMobileMenuToggle}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Apri menu</span>
            </Button>

            {/* Current date */}
            <div className="flex-1">
                {currentDate && (
                    <p
                        className="text-sm text-muted-foreground capitalize hidden sm:block"
                        suppressHydrationWarning
                    >
                        {currentDate}
                    </p>
                )}
            </div>

            {/* Logout button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="gap-2"
            >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Esci</span>
            </Button>
        </header>
    );
}
