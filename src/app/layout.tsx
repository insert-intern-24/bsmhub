// import Head from 'next/head';
import './globals.css';
import Header from './components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Header />
				<main className="bg-[#F5F5F7]">
					{/* 페이지 콘텐츠 */}
					{children}
				</main>
			</body>
		</html>
	);
}
