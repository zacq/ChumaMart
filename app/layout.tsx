// app/layout.tsx — Root layout
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SITE, YARD } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'ChumaMart Hardware – Building Materials Prices in Nakuru',
    template: '%s | ChumaMart Hardware Nakuru',
  },
  description:
    'ChumaMart Hardware sells cement, steel, iron sheets, water tanks, paints and more from Nakuru Industrial Area. Free delivery in Nakuru town. Order online, pay by M-Pesa.',
  keywords: [
    'hardware shop Nakuru', 'cement price Nakuru', 'iron sheets price Nakuru',
    'building materials Nakuru', 'steel price Kenya', 'Kentank price',
    'Crown paint prices Kenya', 'ChumaMart',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: SITE.name,
    title: 'ChumaMart Hardware – Building Materials Prices in Nakuru',
    description: 'Cement, steel, iron sheets, tanks, paint and more. Free delivery in Nakuru town. Pay by M-Pesa.',
  },
  robots: { index: true, follow: true },
  verification: { google: 'REPLACE_WITH_SEARCH_CONSOLE_TOKEN' },
}

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* LocalBusiness structured data (SEO-2) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HardwareStore',
              name: SITE.name,
              url: SITE.url,
              telephone: SITE.phoneIntl,
              email: SITE.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Nakuru Industrial Area (P29X+C8)',
                addressLocality: 'Nakuru',
                addressCountry: 'KE',
              },
              geo: { '@type': 'GeoCoordinates', latitude: YARD.lat, longitude: YARD.lng },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                  opens: '00:00',
                  closes: '23:59',
                },
              ],
              hasMap: YARD.mapsUrl,
              priceRange: 'KSh',
              description: 'Building materials supplier in Nakuru Industrial Area. Cement, steel, iron sheets, water tanks, paints and more.',
            }),
          }}
        />
      </head>
      <body className="min-h-screen">
        {children}

        {/* Google Analytics 4 (AN-1) */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname});`}
            </Script>
          </>
        )}

        {/* Meta Pixel (AN-1) */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  )
}
