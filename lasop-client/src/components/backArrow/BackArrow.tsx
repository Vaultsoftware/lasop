import React from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
function BackArrow() {
    const router = useRouter();

    const goBack = () => {
        router.back();
    };

  return (
    <div onClick={goBack} className='w-[30px] h-[30px] rounded-full bg-secondary text-shadow flex items-center justify-center text-[20px] cursor-pointer'>
        <IoIosArrowBack />
    </div>
  )
}

export default BackArrow