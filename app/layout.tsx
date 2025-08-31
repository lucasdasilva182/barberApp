import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './_components/footer';
import AuthProvider from './_providers/auth';
import { Toaster } from './_components/ui/sonner';
import Header from './_components/header';
import { ThemeProvider } from './_components/theme-provider';

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
    <html lang="pt-BR">
      <body className={`${inter.className} dark`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <div className="flex w-full justify-center flex-1">{children}</div>
            <Toaster />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
