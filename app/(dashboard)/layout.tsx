'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Mobile navigation */}
            <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            {/* Main content */}
            <div className="lg:pl-64">
                <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
