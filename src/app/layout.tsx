// import Head from 'next/head';
import './globals.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className='bg-[#F5F5F7]'>
				<Header />
				{/* header부터 거리를 두기 위한 element입니다 */}
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
