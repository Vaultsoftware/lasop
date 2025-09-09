'use client';

import React, { useEffect, useState } from 'react';
import { TiMessages } from "react-icons/ti";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { CertificateMain } from '@/interfaces/interface';

function StudentIdHead() {
    const [option, setOption] = useState<boolean>(false)

    const handleOption = () => {
        setOption(!option)
    }

    const studentDet = useSelector((state: RootState) => state.student.studentDetails);

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Student / Profile</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div className="msg flex items-center gap-2 border border-accent text-accent px-3 py-1 rounded-md h-fit text-[14px]">
                    <TiMessages />
                    <span>Message</span>
                </div>
                <div onClick={handleOption} className="opt w-[30px] h-[30px] border border-slate-800 rounded-md flex items-center justify-center text-[14px]">
                    <HiOutlineDotsHorizontal />
                </div>
            </div>
        </header>
    )
}

export default StudentIdHead