import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import AppHeader from '@/components/appBar/AppHeader';
import AppBarMenu from '@/components/appBar/AppBarMenu';
import CategorySearch from '@/components/appBar/CategorySearch';
import Footer from '@/components/footer/Footer';

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
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <AppHeader />
            <AppBarMenu />
            <CategorySearch />
            {children}
            <Footer />
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
