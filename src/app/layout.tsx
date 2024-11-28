// src/app/layout.tsx
import Head from 'next/head';
import './globals.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body className='bg-[#F5F5F7]'>
                <Header />
                <main className="mt-14 w-full min-h-dvh"> 
                    <div className='max-w-outer mx-auto'>
                        {children}
                    </div>
                </main>
                <Footer />
            </body>
        </html>
    );
} 