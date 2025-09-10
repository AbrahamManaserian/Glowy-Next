import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import AppHeader from '@/components/appBar/AppHeader';
import AppBarMenu from '@/components/appBar/AppBarMenu';
import Footer from '@/components/footer/Footer';
import { Grid } from '@mui/material';
import SearchComponent from '@/components/ui/SearchComponent';
import CategoriesDekstop from '@/components/ui/CategoriesDekstop';
import ScrollToTop from '@/components/ui/ScrollToTop';

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
        {/* <ScrollToTop /> */}
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <AppHeader />
            <AppBarMenu />
            <Grid sx={{ p: '10px 25px' }} item xs={12} container>
              <CategoriesDekstop />
              <SearchComponent />
            </Grid>
            {children}
            <Footer />
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
