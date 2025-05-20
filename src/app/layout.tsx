import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Voluntariado',
  description: 'Conectando voluntários e ONGs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={inter.className + ' bg-gray-50 min-h-screen'}>
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}