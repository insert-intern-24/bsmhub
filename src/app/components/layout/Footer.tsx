import React from 'react';
import Image from 'next/image';

export default function Footer() {
	return (
		<footer className="w-[100%] bg-footerBgColor">
			<div className="max-w-outer mx-auto py-10 text-footerTextColor flex justify-between items-center">
				<div className="flex flex-col">
					<a href="" className="text-xl mb-4">
						<b>부산소프트웨어마이스터고</b> 프로젝트의장
					</a>
					<a href="https://maps.app.goo.gl/4BsSV2Kr4PXQ6JYD8">부산광역시 강서구 가락대로 1393 부산소프트웨어마이스터고등학교</a>
					<a href="">산학문의 (051) 000-0000</a>
				</div>
				<div>
					<div className="flex gap-4 mb-2">
						<a href="">Term of Use</a>
						<a href="">Privacy Policy</a>
					</div>
          <div className='flex gap-2 justify-end'>
            <Image src="images/logo/insert.svg" alt="insert-logo" width={22} height={20}/>
            <span>Powered by INSERT</span>
          </div>
				</div>
			</div>
		</footer>
	);
}
