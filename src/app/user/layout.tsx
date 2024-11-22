// app/user/page.tsx
import React from 'react';
import Background from '@components/shared/Background';

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div className="z-20 absolute left-1/2 -translate-x-1/2 max-w-inner mx-auto top-[7rem] w-full flex gap-7 flex-col">
        {children}
			</div>
			<Background />
		</>
	);
};

export default Layout;