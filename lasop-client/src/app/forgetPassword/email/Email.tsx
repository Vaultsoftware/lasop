'use client';

import { AppDispatch, RootState } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import lasopLogo from '../../../asset/form/logo.png';
import { sendVerificationCode } from '@/store/verifyEmailStore/verifyEmailStore';
import { toast } from 'react-toastify';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';
import { addId, addPage } from '@/store/forgetPwdStore/forgetStore';

interface PageData {
    email: string;
}

interface PostEmail {
    email: string;
}

function Email() {
    const dispatch = useDispatch<AppDispatch>();
    const students = useSelector((state: RootState) => state.student.student);

    const [loading, setLoading] = useState<boolean>(false)

    const [pageData1, setPageData1] = useState<PageData>({
        email: '',
    });

    const [error, setError] = useState<Partial<PageData>>({});

    const validateForm = () => {
        const newError: Partial<PageData> = {};

        // Email
        const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!pageData1.email.trim()) {
            newError.email = 'Email account is required';
        }
        else if (!emailRegEx.test(pageData1.email.trim())) {
            newError.email = 'Invalid email address';
        };

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPageData1({
            ...pageData1,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true)
            try {
                const emailData: PostEmail = {
                    email: pageData1.email,
                };

                const studentId = students.find((stuId) => stuId.email === pageData1.email)
                if (studentId) {
                    dispatch(addId(studentId._id))
                    const response = await dispatch(sendVerificationCode(emailData))
                    if (sendVerificationCode.fulfilled.match(response)) {
                        const payload = response.payload;
                        toast.success(payload.message || 'Verification code sent to your email');
    
                        dispatch(addPage());
                    }
                    else {
                        toast.error(response.error?.message);
                    }
                } else {
                    toast.error('Email not found in our system');
                }

                setPageData1({
                    email: '',
                });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <>
            {
                loading && <ValidateLoading />
            }
            <main className='w-full md:w-[45vw] h-full '>
                <div className='p-10 flex flex-col justify-center'>
                    <div className='mb-5'>
                        <h1 className=''>
                            <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='' />
                        </h1>
                        <h3 className='text-shadow font-semibold'>Reset password</h3>
                    </div>
                    <div className='w-full rounded-md shadow-md shadow-slate-600'>
                        <form action="" onSubmit={handleSubmit} className='w-full p-7'>
                            <div className='mb-3'>
                                <span className='text-[12px] font-semibold'>Step 1/3</span>
                                <h3 className='font-bold'>Type in email address to get a code</h3>
                            </div>
                            <div className='grid gap-3'>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Email address</label>
                                    <input
                                        type="email"
                                        placeholder='eg. JohnDoe@gmail.com'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={pageData1.email.toLowerCase()}
                                        name='email'
                                        onChange={handleChange}
                                    />
                                    {error.email && <span className="err_msg text-red-500 text-[10px]">{error.email}</span>}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Send code</button>
                            </div>
                        </form>
                    </div>
                    <div className='mt-6 text-[12px] text-center'>
                        <span>I have an account. <Link href='/login' className='font-bold text-accent'>Log in</Link></span>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Email