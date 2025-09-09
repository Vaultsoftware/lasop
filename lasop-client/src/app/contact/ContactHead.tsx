import React from 'react';
import { TbSend } from "react-icons/tb";

function ContactHead() {
    return (
        <header className='flex flex-col justify-center items-center gap-9 md:px-[3rem] w-full h-[100vh] p-[30px] head_bg overflow-hiden'>
            <div data-aos="fade-right" className="contact_head">
                <h1 className='font-[700] text-[45px] text-accent'>Get In Touch</h1>
            </div>
            <div data-aos="fade-left" className="contact_form w-full md:w-fit">
                <form action="" className='w-full md:w-[500px]'>
                    <div className="contact_inp w-full grid gap-4">
                        <div className="cnt_ctrl">
                            <label htmlFor="" className='text-[14px] font-semibold'>Full name</label>
                            <input type="text" placeholder='eg. John Doe'/>
                        </div>
                        <div className="cnt_ctrl">
                            <label htmlFor="" className='text-[14px] font-semibold'>Email address</label>
                            <input type="text" placeholder='eg. Johndoe@gmail.com'/>
                        </div>
                        <div className="cnt_ctrl">
                            <label htmlFor="" className='text-[14px] font-semibold'>Your message</label>
                            <textarea name="" id="" placeholder='What would you like to tell us'></textarea>
                        </div>
                    </div>
                    <div className="cnt_btn flex items-center p-3 gap-2 bg-shadow nav_btn text-cyan-50 mt-3 mx-auto">
                        <TbSend />
                        <span>Send Message</span>
                    </div>
                </form>
            </div>
        </header>
    )
}

export default ContactHead