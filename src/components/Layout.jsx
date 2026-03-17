import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Layout — Main app shell. Uses CSS vars for theme-aware background.
 */
export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
            <Navbar />

            {/* Floating teal shapes for depth */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="floating-shape w-[420px] h-[420px] -top-48 -right-24" style={{ animationDelay: '0s' }} />
                <div className="floating-shape w-[320px] h-[320px] bottom-[-80px] left-[-60px]" style={{ animationDelay: '3s' }} />
                <div className="floating-shape w-[220px] h-[220px] top-1/2 right-[-40px]" style={{ animationDelay: '5s' }} />
            </div>

            {/* Page content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 relative z-10 overflow-x-hidden">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="text-center py-4 text-[11px] themed-text-muted backdrop-blur-sm border-t" style={{ borderColor: 'var(--color-border)' }}>
                DoseWise AI — Your Health Data Stays Private 🔒
            </footer>
        </div>
    );
}
