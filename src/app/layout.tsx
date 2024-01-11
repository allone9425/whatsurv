import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import Footer from './(providers)/(root)/_components/Footer';
import Header from './(providers)/(root)/_components/Header';

import ProvidersLayout from './(providers)/layout';
import './globals.css';
import MainWrapper from './(providers)/(root)/_components/MainWrapper';

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
          <MainWrapper>{children}</MainWrapper>
          <Footer />
        </ProvidersLayout>
      </body>
    </html>
  );
}
