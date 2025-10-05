import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import Footer from '@/components/footer/Footer';
import { Suspense } from 'react';
import TopOfPage from '@/components/appBar/TopOfPage';
import Loading from './loading';
import { GlobalProvider } from './GlobalContext';
import AlertAddCartItem from './cart/components/AlertAddCartItem';
import AlertItemAlreadyAdded from './cart/components/AlertItemAlreadyAdded';

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
          <Suspense fallback={<Loading />}>
            <GlobalProvider>
              <TopOfPage />
              <AlertAddCartItem />
              <AlertItemAlreadyAdded />
              {children}
              <Footer />
            </GlobalProvider>
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
