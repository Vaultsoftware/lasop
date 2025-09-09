import React from 'react'

function PostMain() {
    return (
        <main className='w-full p-5'>
            <div className='w-full md:w-[80%]'>
                <form action="" className='grid gap-8'>
                    <div className="job_info">
                        <div className="job_head">
                            <h3 className='font-bold text-[16px]'>JOB INFORMATION</h3>
                        </div>
                        <div className="post_inp mt-4 grid md:grid-cols-2 gap-3">
                            <div className="post_ctrl grid gap-1">
                                <label htmlFor="" className='font-semibold text-[14px]'>Title</label>
                                <input  className='w-full h-[40px] border border-shadow outline-none rounded-md px-3' type="text" placeholder='Title'  />
                            </div>
                            <div className="post_ctrl grid gap-1">
                                <label htmlFor="" className='font-semibold text-[14px]'>Salary range</label>
                                <input  className='w-full h-[40px] border border-shadow outline-none rounded-md px-3' type="text" placeholder='Input'  />
                            </div>
                            <div className="post_ctrl grid gap-1">
                                <label htmlFor="" className='font-semibold text-[14px]'>Job type</label>
                                <input  className='w-full h-[40px] border border-shadow outline-none rounded-md px-3' type="text" placeholder='Job type'  />
                            </div>
                            <div className="post_ctrl grid gap-1">
                                <label htmlFor="" className='font-semibold text-[14px]'>Requirements</label>
                                <input  className='w-full h-[40px] border border-shadow outline-none rounded-md px-3' type="text" placeholder='Input'  />
                            </div>
                        </div>
                    </div>
                    <div className="job_info">
                        <div className="job_head">
                            <h3 className='font-bold text-[16px]'>COMPANY INFO</h3>
                        </div>
                        <div className="post_inp mt-4 grid md:grid-cols-2 gap-3">
                            <div className="post_ctrl grid gap-1">
                                <label htmlFor="" className='font-semibold text-[14px]'>Company</label>
                                <input  className='w-full h-[40px] border border-shadow outline-none rounded-md px-3' type="text" placeholder='Company name'  />
                            </div>
                            <div className="post_ctrl grid gap-1">
                                <label htmlFor="" className='font-semibold text-[14px]'>Location</label>
                                <select className='w-full h-[40px] border border-shadow outline-none rounded-md px-3'  name="" id="">
                                    <option value=""></option>
                                </select>
                            </div>
                            <div className="post_ctrl grid gap-1">
                                <label htmlFor="" className='font-semibold text-[14px]'>City</label>
                                <select className='w-full h-[40px] border border-shadow outline-none rounded-md px-3'  name="" id="">
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="job_info">
                        <div className="job_head">
                            <h3 className='font-bold text-[16px]'>JOB DESCRIPTION</h3>
                        </div>
                        <div className="post_inp mt-4">
                            <div className="post_ctrl grid gap-1">
                                <label htmlFor="" className='font-semibold text-[14px]'>Job description</label>
                                <textarea className='w-full h-[200px] border border-shadow outline-none rounded-md px-3' name="" id=""></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default PostMain