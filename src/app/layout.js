import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import Footer from '@/components/footer/Footer';
import { Suspense } from 'react';
import TopOfPage from '@/components/appBar/TopOfPage';
import HistoryNavigationListener from '@/components/HistoryNavigationListener';
import ScrollManager from '@/components/ScrollManager';

export const metadata = {
  title: 'Glowy Perfume & Cosmetics',
  description: 'Perfume & Cosmetics Online Store ',
  icons: {
    icon: '/logo.svg', // app/favicon.ico
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ position: 'relative' }}>
        <div></div>
        <ThemeRegistry>
          <Suspense fallback={null}>
            <TopOfPage />
            <Suspense fallback={null}>
              <HistoryNavigationListener />
            </Suspense>
            {/* <ScrollManager /> */}
            {children}
            <Footer />
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
