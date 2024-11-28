export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="z-[-1]">
			<div className="h-28"></div> {/* div는 공간을 띄우기 위한 element입니다 */}
			<div className="mx-auto bg-white w-full h-[calc(100dvh-7rem)] text-black max-w-outer">{children}</div>
		</div>
	);
}
