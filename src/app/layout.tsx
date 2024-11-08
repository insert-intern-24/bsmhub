import Head from 'next/head';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				{/* 페이지 콘텐츠 */}
				{children}
			</body>
		</html>
	);
}
