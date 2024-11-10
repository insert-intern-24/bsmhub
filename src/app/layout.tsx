// import Head from 'next/head';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className='bg-[#F5F5F7]'>
				<Header />
				<main className="bg-[#F5F5F7] mt-14">
					{/* 페이지 콘텐츠 */}
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
