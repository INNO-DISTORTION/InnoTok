import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { I18nProvider } from '@/i18n/context';

export const metadata: Metadata = {
  title: 'Innogram',
  description: 'Share your moments with the world',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="antialiased">
        <I18nProvider>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
