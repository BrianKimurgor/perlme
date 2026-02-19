import BottomNav from '@/components/navigation/BottomNav'
import TopNav from '@/components/navigation/TopNav'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* Top Navigation */}
            <TopNav />
            
            {/* Main Content - Full width */}
            <main className="pb-16 md:pb-0">
                {children}
            </main>
            
            {/* Bottom Navigation - Mobile only */}
            <BottomNav />
        </>
    )
}