import React from 'react'

function PostHead() {
    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Post a Job</h3>
            </div>
            <div className="filter">
                <button className='nav_btn bg-accent text-cyan-50 text-[14px]'>Post Job</button>
            </div>
        </header>
    )
}

export default PostHead