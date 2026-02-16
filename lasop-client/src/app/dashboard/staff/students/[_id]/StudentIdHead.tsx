'use client';

import React, { useEffect, useState } from 'react';
import { TiMessages } from "react-icons/ti";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setToBeMessageInfo } from '@/store/messageStore/msgStore';
import { useRouter } from 'next/navigation';

function StudentIdHead() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [option, setOption] = useState<boolean>(false)

    const handleOption = () => {
        setOption(!option)
    }

    const studentDet = useSelector((state: RootState) => state.student.studentDetails);

    const handleMessage = () => {
        dispatch(setToBeMessageInfo({
            _id: studentDet?._id as string,
            firstName: studentDet?.firstName as string,
            lastName: studentDet?.lastName as string,
            senderModel: 'User',
            recieverModel: 'Student'
        }))

        router.push('/dashboard/admin/messages');
    }

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Student / Profile</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div onClick={handleMessage} className="msg flex items-center gap-2 border border-accent text-accent px-3 py-1 rounded-md h-fit text-[14px] cursor-pointer">
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