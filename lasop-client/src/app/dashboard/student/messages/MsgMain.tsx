'use client';

import React, { useEffect, useState } from 'react';
import query from '../../../../asset/dashIcon/query.png';
import Image from 'next/image';
import { FaUserLarge } from "react-icons/fa6";
import { GrAttachment } from "react-icons/gr";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchMessages, postMessage } from '@/store/messageStore/msgStore';

function MsgMain() {
    const messages = useSelector((state: RootState) => state.message.messages);
    const staff = useSelector((state: RootState) => state.staff.staffs)
    const student = useSelector((state: RootState) => state.student.student)

    const [messageInput, setMessageInput] = useState('');

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchMessages())
    }, [])

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
    };
    return (
        <main className='w-full p-5'>
            <div className='w-full h-[100vh] border rounded-md flex overflow-hidden'>
                <div className="queries flex flex-col w-[30%] h-full">
                    <div className='flex items-center gap-3 p-3'>
                        <div className="icon w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                            <FaUserLarge />
                        </div>
                        <span>Chats (2 new messages)</span>
                    </div>
                    <div className="queries_list flex flex-col border-t-2 h-full overflow-y-scroll">
                        {/* {
                            messages.map((msg) => (
                                <div key={msg._id} className="query_item flex items-center justify-between p-2 cursor-pointer">
                                    <div className="query_info flex items-center gap-3">
                                        <div className="icon w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                            <FaUserLarge />
                                        </div>
                                        <div className="query_desc flex flex-col justify-center">
                                            <div className="query_head">
                                                <h3 className='font-semibold text-[14px]'>{msg.sender.email}</h3>
                                                <p className='text-[10px]'></p>
                                            </div>
                                            <div className='flex items-center text-green-400'>
                                                <div>
                                                    <BsDot />
                                                </div>
                                                <p className='text-[8px] w-[100px] overflow-x-hidden whitespace-nowrap text-ellipsis'>{msg.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="query_time text-[7px] font-semibold">
                                        <p><p>{new Date(msg.createdAt).toLocaleTimeString()}</p></p>
                                    </div>
                                </div>
                            ))
                        } */}
                    </div>
                </div>
                <div className="query_display w-[70%] border-l">
                    <div className='p-3 h-full flex flex-col'>
                        <div className='flex flex-col gap-2'>
                            <div className="sender flex items-center gap-2 relative left-0">
                                <div className="icon w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                    <FaUserLarge />
                                </div>
                                <div className="msg px-3 py-2 bg-secondary text-shadow rounded-md h-fit">
                                    <h3 className='text-[6px]'>Yusuf Jimoh</h3>
                                    <p className='text-[10px]'>I love bread</p>
                                </div>
                            </div>
                            <div className="receiver flex flex-row-reverse items-center gap-2 relative right-0">
                                <div className="icon w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                    <FaUserLarge />
                                </div>
                                <div className="msg px-3 py-2 bg-shadow text-white rounded-md h-fit">
                                    <h3 className='text-[6px]'>Yusuf Jimoh</h3>
                                    <p className='text-[10px]'>I love bread</p>
                                </div>
                            </div>
                        </div>
                        <div className="message_box mt-auto w-full">
                            <form action="" className='flex gap-2 items-center w-full'>
                                <div className="msg_inp flex items-center w-full bg-slate-400 h-[40px] p-[5px] rounded-md">
                                    <input type="text" className='w-full h-full bg-transparent outline-none text-[11px] text-white' placeholder='Type your message' />
                                    <div className="attach text-accent">
                                        <GrAttachment />
                                    </div>
                                </div>
                                <div className="send w-[40px] h-[40px] flex items-center justify-center bg-accent text-white text-[16px] rounded-md">
                                    <IoPaperPlaneOutline />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default MsgMain