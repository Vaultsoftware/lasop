import React from 'react';
import Image from 'next/image';
import lasopLogo from '../asset/form/logo.png';

function Loading() {
  return (
    <div className='flex items-center justify-center fixed top-0 left-0 bg-white w-full h-[100vh] z-50'>
      <Image className='w-[150px] h-[100px] loadImg' src={lasopLogo} alt='Lasop logo' />
    </div>
  )
}

export default Loading