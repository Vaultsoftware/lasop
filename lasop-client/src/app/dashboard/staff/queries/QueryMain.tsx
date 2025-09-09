import React from 'react';
import query from '../../../../asset/dashIcon/query.png';
import Image from 'next/image';

function QueryMain() {
    return (
        <main className='w-full p-5'>
            <div className='w-full h-[100vh] border rounded-md flex overflow-hidden'>
                <div className="queries flex flex-col w-[30%] h-full">
                    <div className='flex items-center gap-3 p-3'>
                        <Image className='w-[30px] h-[30px]' src={query} alt='' />
                        <span>Recent (2 new queries)</span>
                    </div>
                    <div className="queries_list flex flex-col border-t-2 h-full overflow-y-scroll">
                        <div className="query_item flex items-center justify-between p-2">
                            <div className="query_info flex items-center gap-3">
                                <div className="query_icon">
                                    <Image className='w-[30px] h-[30px]' src={query} alt='' />
                                </div>
                                <div className="query_desc flex items-center gap-2">
                                    <div className="query_head">
                                        <h3 className='font-semibold text-[14px]'>Query 1.0</h3>
                                        <p className='text-[10px]'>From: Admin</p>
                                    </div>
                                    <button className="status flex  h-[12px] px-2 rounded-md bg-red-500 text-[8px] text-cyan-50">
                                        Unsettled
                                    </button>
                                </div>
                            </div>
                            <div className="query_time text-[12px] font-semibold">
                                <p>18 min</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="query_display w-[70%] border-l">

                </div>
            </div>
        </main>
    )
}

export default QueryMain