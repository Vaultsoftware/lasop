import React from 'react';
import { TiMessages } from "react-icons/ti";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface Props {
    role: string;
}

function StaffHeadDetails({ role }: Props) {
    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Staff / {role} / Profile</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div className="msg flex items-center gap-2 border border-accent text-accent px-3 py-1 rounded-md h-fit text-[14px]">
                    <TiMessages />
                    <span>Message</span>
                </div>
                <div className="opt w-[30px] h-[30px] border border-slate-800 rounded-md flex items-center justify-center text-[14px]">
                    <HiOutlineDotsHorizontal />
                </div>
            </div>
            {/* {
                option && (
                    <div className="opt_list grid gap-2 p-2 w-fit h-fit rounded-md fixed right-3 top-36 bg-white shadow shadow-shadow">
                        {
                            haveCertificate ? <div className='text-[14px] cursor-pointer'>
                                <span>Certified</span>
                            </div> : <div onClick={() => dispatch(handleCert())} className='text-[14px] cursor-pointer'>
                                <span>Issue Certificate</span>
                            </div>
                        }
                        <div className='text-[14px] cursor-pointer'>
                            <span>Deactivate</span>
                        </div>
                    </div>
                )
            } */}
        </header>
    )
}

export default StaffHeadDetails