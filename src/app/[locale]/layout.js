import '../globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ThemeRegistry from '@/_components/ThemeRegistry';
import Footer from '@/_components/footer/Footer';
import { Suspense } from 'react';
import TopOfPage from '@/_components/appBar/TopOfPage';
import Loading from './loading';
import { GlobalProvider } from '../GlobalContext';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata = {
  title: 'Glowy Perfume & Cosmetics',
  description: 'Perfume & Cosmetics Online Store ',
  icons: {
    icon: '/logo.svg', // app/favicon.ico
  },
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body style={{ position: 'relative' }}>
        <NextIntlClientProvider messages={messages}>
          <ThemeRegistry>
            <Suspense fallback={<Loading />}>
              <GlobalProvider>
                <TopOfPage />

                {children}
                <Footer />
              </GlobalProvider>
            </Suspense>
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
