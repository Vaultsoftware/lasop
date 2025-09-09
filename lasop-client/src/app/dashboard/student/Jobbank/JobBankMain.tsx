'use client';

import { RootState } from '@/store/store';
import React from 'react';
import { MdOutlineVerified } from "react-icons/md";
import { useSelector } from 'react-redux';

function JobBankMain() {
    const job = useSelector((state: RootState) => state.job.job)
    return (
        <main className='w-full p-5'>
            <div className="bank_list grid md:grid-cols-2 lmd:grid-cols-3 gap-3">
                {
                    job.map((view) => (
                        <div key={view._id} className="bank_item grid gap-2 rounded-md border border-secondary p-3">
                            <div className="bank_head flex items-center justify-between">
                                <h3 className='font-bold'>{view.jobTitle}</h3>
                                <div className="bk_hd_icon flex items-center gap-1">
                                    <MdOutlineVerified />
                                    <span className='text-[12px]'>LASOP</span>
                                </div>
                            </div>
                            <div className="bank_det">
                                <div className="bank_com">
                                    <h5>{view.company}</h5>
                                    <h6>{view.location}</h6>
                                </div>
                                <div className="bank_req flex flex-wrap gap-2">
                                    <div className='w-fit p-1 border border-shadow bg-secondary rounded-md text-[8px] text-shadow'>
                                        <span>{view.salary} per month</span>
                                    </div>
                                </div>
                                <div className="bank_post mt-2 text-[10px]">
                                    <span>Posted 1 week ago</span>
                                </div>
                            </div>
                            <div className="bank_more">
                                <button className='w-full h-10 text-[14px] border-2 rounded-md transition-all duration-500 hover:border-none hover:bg-accent hover:text-cyan-50 font-semibold '>View Job details</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </main>
    )
}

export default JobBankMain