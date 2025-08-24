// import { Geist, Geist_Mono } from "next/font/google";
// import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
