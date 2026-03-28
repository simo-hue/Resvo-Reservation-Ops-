'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { BottomNav } from '@/components/layout/bottom-nav';
import { RestaurantSettingsProvider } from '@/lib/contexts/restaurant-settings-context';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <RestaurantSettingsProvider>
            <div className="h-[100dvh] flex flex-col bg-background overflow-hidden relative">
                {/* Desktop sidebar */}
                <Sidebar />

                {/* Mobile navigation */}
                <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
                <BottomNav />

                {/* Main content wrapper */}
                <div className="flex-1 flex flex-col lg:pl-64 min-w-0 min-h-0 safe-area-top">
                    <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

                    {/* Scrollable Main Area */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-6 relative w-full touch-pan-y scroller-mobile-fix">
                        {children}
                    </main>
                </div>
            </div>
        </RestaurantSettingsProvider>
    );
}
