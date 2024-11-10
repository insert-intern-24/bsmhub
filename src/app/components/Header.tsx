import React from 'react';

export default function Header() {
	return (
		<header className="select-none bg-white border-b-[0.12rem] border-strokeColor w-[100%] fixed top-0 z-40">
			<div className='flex items-center justify-between max-w-custom mx-auto py-3'>
				<a href='' className="text-xl text-titleColor">
					<b>부산소프트웨어마이스터고</b> 프로젝트의장
				</a>
        <div className='flex items-center gap-4'>
          <nav>
            <ul className='flex text-titleColor gap-4'>
              <li><a href="/project">프로젝트</a></li>
              <li><a href="">전공동아리</a></li>
              <li><a href="">일반동아리</a></li>
              <li><a href="">포트폴리오</a></li>
            </ul>
          </nav>
          <button className='bg-background text-white px-3 py-1 rounded-2xl'>sign in</button>
        </div>
			</div>
		</header>
	);
}
