<<<<<<< HEAD
=======
import Header from './(providers)/(root)/_components/Header';
import Footer from './(providers)/(root)/_components/Footer';
>>>>>>> 527eb3c3b7469f99aea75ddd46d1de338b4a07ea
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import Footer from './(providers)/(root)/_components/Footer';
import Header from './(providers)/(root)/_components/Header';
import ProvidersLayout from './(providers)/layout';
import './globals.css';
<<<<<<< HEAD
=======
import ProvidersLayout from './(providers)/layout';
>>>>>>> 527eb3c3b7469f99aea75ddd46d1de338b4a07ea

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'WhatSurv?',
  description: 'Generated by create next app',
};

export default function HTMLLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProvidersLayout>
          <Header />
          {children}
          <Footer />
        </ProvidersLayout>
      </body>
    </html>
  );
}
