import RootProvider from '@/components/providers/root-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kauter Store',
  description: 'Explora nuestras diversas categorías de ropa para hombres, mujeres y niños. Desde elegantes conjuntos para ocasiones especiales hasta prendas casuales para el día a día',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
