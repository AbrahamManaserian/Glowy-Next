// import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppHeader from '@/components/AppHeader';


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
      <body>
        <AppRouterCacheProvider>
          <AppHeader />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
