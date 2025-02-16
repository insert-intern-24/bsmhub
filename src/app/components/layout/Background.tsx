import React from 'react';

const Background = () => {
	return (
    <>
    <div className='z-10'>
      <div className='h-28'></div> {/* div는 공간을 띄우기 위한 element입니다 */}
      <div className="mx-auto bg-white w-full min-h-[calc(100dvh-7em)] text-black"></div>
    </div>
    </>
  );
};

export default Background;