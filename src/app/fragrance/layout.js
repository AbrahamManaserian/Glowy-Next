import { Geist, Geist_Mono } from 'next/font/google';
// import '../globals.css';

export const metadata = {
  title: 'Fragrance',
  description: 'Buy Fragrance',
};

export default function RootLayout({ children }) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
