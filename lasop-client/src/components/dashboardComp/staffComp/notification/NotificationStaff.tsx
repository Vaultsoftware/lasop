import React, { useState } from 'react';
import Image from 'next/image';
import notify from '../../../../asset/images/notifications.png';
import { MdClose } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { handleNotification } from '@/store/dashMenu/dashStore';

function NotificationStaff() {
    const dispatch: AppDispatch = useDispatch()

    const projectsSubmission = useSelector((state: RootState) => state.project.project)
    const assessmentsSubmission = useSelector((state: RootState) => state.assessment.assessment)

    // Notification array
    const [notifications, setNotifications] = useState<{}[]>([])
    
    return (
        <div className='applicant w-full h-[100vh] fixed top-0 left-0 z-30'>
            <div className='flex flex-col w-[80vw] md:w-[30vw] h-full overflow-y-auto ml-auto bg-white relative'>
                <div onClick={() => dispatch(handleNotification())} className='text-white w-[25px] h-[25px] flex items-center justify-center bg-shadow rounded-md mt-1 ml-auto mr-2'>
                    <MdClose />
                </div>
                <div className='p-4 border-b-2 border-b-slate-500 flex items-center gap-2 w-full'>
                    <div className="dash_icon">
                        <Image className='w-[30px] h-[30px]' src={notify} alt='' />
                    </div>
                    <div>
                        <p className='font-semibold'>Notifications <span className='text-accent'>(12)</span></p>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex items-center gap-2 w-full p-3 border-b border-b-slate-400'>
                        <div className="dash_icon">
                            <Image className='w-[30px] h-[30px]' src={notify} alt='' />
                        </div>
                        <div className='w-[90%] flex justify-between items-center text-[14px]'>
                            <span>Testing notification</span>
                            <FaChevronRight />
                        </div>
                    </div>
                    <div className='flex items-center gap-2 w-full p-3 border-b border-b-slate-400'>
                        <div className="dash_icon">
                            <Image className='w-[30px] h-[30px]' src={notify} alt='' />
                        </div>
                        <div className='w-[90%] flex justify-between items-center text-[14px]'>
                            <span>Testing notification</span>
                            <FaChevronRight />
                        </div>
                    </div>
                    <div className='flex items-center gap-2 w-full p-3 border-b border-b-slate-400'>
                        <div className="dash_icon">
                            <Image className='w-[30px] h-[30px]' src={notify} alt='' />
                        </div>
                        <div className='w-[90%] flex justify-between items-center text-[14px]'>
                            <span>Testing notification</span>
                            <FaChevronRight />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationStaff