import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './_components/footer';
import AuthProvider from './_providers/auth';
import { Toaster } from './_components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Barber App',
  description: 'Created by Lucas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
        <AuthProvider>
          <div className="flex w-full justify-center flex-1">{children}</div>
          <Toaster />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
