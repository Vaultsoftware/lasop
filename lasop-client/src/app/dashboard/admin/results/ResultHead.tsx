import React from 'react'
import { IoFilter } from "react-icons/io5";

function ResultHead() {
    return (
        <header className='w-full h-fit md:h-[70px] grid gap-2 justify-center md:flex md:gap-0 items-center md:justify-between px-[30px] border-t-2 border-b-2 border-accent py-3 md:py-0'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Results</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div className="from flex items-center gap-2 ">
                    <span className='text-[12px]'>From:</span>
                    <form action="" className='p-[4px] border border-shadow rounded-md h-fit'>
                        <input type="date" className='w-[130px] h-[30px] text-[14px] outline-none' id="" />
                    </form>
                </div>
                <div className="from flex items-center gap-2 ">
                    <span className='text-[12px]'>To:</span>
                    <form action="" className='p-[4px] border border-shadow rounded-md h-fit'>
                        <input type="date" className='w-[130px] h-[30px] text-[14px] outline-none' id="" />
                    </form>
                </div>
                <div className="from flex items-center gap-2">
                    <form action="" className='p-[4px] border border-shadow rounded-md h-fit'>
                        <div className="select_ctrl w-[100px] flex items-center justify-between">
                            <IoFilter className='text-accent' />
                            <select className='' id="">
                                <option value=""></option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>
        </header>
    )
}

export default ResultHead