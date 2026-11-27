// app/(site)/layout.tsx — Public site layout (header + footer + sticky bar)
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import StickyMobileBar from '@/components/layout/StickyMobileBar'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 pb-mobile-bar">
        {children}
      </main>
      <SiteFooter />
      <StickyMobileBar />
    </div>
  )
}
