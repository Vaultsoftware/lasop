import React from 'react';
import { ImSpinner3 } from "react-icons/im";

function ValidateLoading() {
    return (
        <div className='flex items-center justify-center fixed top-0 left-0 applicant w-full h-[100vh] z-50'>
            <div className='p-4 flex flex-col items-center justify-center gap-2 rounded-md bg-white'>
                <ImSpinner3 className='text-[28px] text-accent spinner' />
                <h3 className='font-semibold text-[12px]'>Please wait, while your data is being validated</h3>
            </div>
        </div>
    )
}

export default ValidateLoading