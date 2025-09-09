import React from 'react';
import user from '../../../../asset/dashIcon/user.png';
import Image from 'next/image';

function FinanceMain() {
    return (
        <main className='w-full p-5'>
            <div className="money grid md:grid-cols-3 gap-3">
                <div className="spend p-3 w-auto border border-secondary rounded-md grid gap-2">
                    <span className='font-semibold'>Income</span>
                    <h1 className='font-bold text-[30px] text-shadow'>N21,200,000</h1>
                </div>
                <div className="spend p-3 w-auto border border-secondary rounded-md grid gap-3">
                    <span className='font-semibold'>Expenses</span>
                    <h1 className='font-bold text-[30px] text-shadow'>N-1,200,000</h1>
                </div>
                <div className="spend p-3 w-auto border border-secondary rounded-md grid gap-3 border-red-500 text-red-500">
                    <span className='font-semibold'>Debt</span>
                    <h1 className='font-bold text-[30px]'>N120,000</h1>
                </div>
            </div>

            <div className="chart_dis grid grid-cols-2 gap-3 mt-10">
                <div className="chart w-[700px]"></div>
                <div className="recent">
                    <div className='flex justify-between'>
                        <h3>Recent payment</h3>
                        <span>See all</span>
                    </div>
                    <div className="not_item flex flex-col gap-3 mt-3">
                        <div className="not flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <Image className='w-[30px] h-[30px]' src={user} alt='' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Nathan Kingsley</h3>
                                    <div className='flex items-center gap-2'>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className='font-bold text-[14px] text-shadow'>N400, 000</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default FinanceMain