import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppPreloader } from "@/components/app-preloader"
import { PWAInstaller } from "@/components/pwa-installer"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#dc2626',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  title: "Urbe Village Booking",
  description: "Book your co-working space at Urbe Village for ETH Rome",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-touch-icon-167x167.png', sizes: '167x167', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#dc2626' },
      { rel: 'shortcut icon', url: '/icons/favicon.ico' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Urbe Village',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Urbe Village Booking',
    title: 'Urbe Village Booking',
    description: 'Book your co-working space at Urbe Village for ETH Rome',
    images: [
      {
        url: '/images/UVlogo2.png',
        width: 1200,
        height: 630,
        alt: 'Urbe Village Booking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urbe Village Booking',
    description: 'Book your co-working space at Urbe Village for ETH Rome',
    images: ['/images/UVlogo2.png'],
  },
  other: {
    'application-name': 'Urbe Village Booking',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Urbe Village',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/icons/browserconfig.xml',
    'msapplication-TileColor': '#dc2626',
    'msapplication-tap-highlight': 'no',
    'msapplication-TileImage': '/icons/ms-icon-144x144.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className={inter.className}
        style={{
          backgroundImage: 'url(/images/background1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          margin: 0,
          padding: 0
        }}
      >
        <AppPreloader loadingDuration={2500}>
          {children}
        </AppPreloader>
        <PWAInstaller />
      </body>
    </html>
  )
}
