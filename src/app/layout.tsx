import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import StyleProvider from '~/components/lib/StypeProvider'
import './globals.css'
import ReduxProvider from '~/lib/ReduxProvicer'
import { open_sans, poppins } from '~/lib/fonts'

const inter = Inter({ subsets: ['cyrillic-ext'] })

export const metadata: Metadata = {
  title: 'Fast Guess',
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  return (
    <html lang={locale}>
      <body className={`${inter.className} ${poppins.variable} ${open_sans.variable}`}>
        <ReduxProvider>
          <StyleProvider>
            <AntdRegistry>{children}</AntdRegistry>
          </StyleProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
