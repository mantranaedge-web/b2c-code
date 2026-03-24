import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '../components/GoogleAnalytics'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'B2B EdTech Platform - Corporate Training Solutions',
  description: 'Professional training and certification programs for businesses',
}

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}