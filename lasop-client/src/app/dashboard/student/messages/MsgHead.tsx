import React from 'react';
import { IoFilter } from "react-icons/io5";

function MsgHead() {
    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Messages</h3>
            </div>
        </header>
    )
}

export default MsgHead