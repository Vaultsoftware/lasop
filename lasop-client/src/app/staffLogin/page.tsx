'use client';

import { AppDispatch } from '@/store/store';
import { logStaff } from '@/store/staffStore/staffSlice';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import form from '../../asset/form/form.jpeg';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearData } from '@/store/pageStore/pageStore';
import lasopLogo from '../../asset/form/logo.png';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';
import { LogStaff } from '@/interfaces/interface';

interface StaffResponsePayload {
    message: string;
}

function Login() {
    const [logData, setLogData] = useState<LogStaff>({
        email: '',
        password: ''
    });
    const dispatch = useDispatch<AppDispatch>();

    const [error, setError] = useState<Partial<LogStaff>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const validateLogin = () => {
        const newError: Partial<LogStaff> = {};
        // Email
        const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!logData.email.trim()) {
            newError.email = 'Email account is required';
        }
        else if (!emailRegEx.test(logData.email.trim())) {
            newError.email = 'Invalid email address';
        };

        // Password
        if (!logData.password.trim()) {
            newError.password = `Password is required`;
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setLogData({
            ...logData, [name]: value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validateLogin()) {
            setLoading(true)
            try {
                const response = await dispatch(logStaff(logData));

                if (logStaff.fulfilled.match(response)) {
                    const payload = response.payload as StaffResponsePayload;
                    setLogData({
                        email: '',
                        password: ''
                    })

                    toast.success(payload.message || 'Logged in successfully');
                    dispatch(clearData())
                    router.push('/dashboard/staff')
                } else {
                    toast.error(response.error?.message);
                }
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
            <main className='w-full h-fit flex items-center'>
                <div className='w-full md:w-[45vw] h-full p-10 flex flex-col justify-center'>
                    <div className='mb-5'>
                        <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='' />
                        <h3 className='text-shadow font-semibold'>Welcome Back</h3>
                    </div>
                    <div className='w-full rounded-md shadow-md shadow-slate-600'>
                        <form onSubmit={handleSubmit} action="" className='w-full p-7'>
                            <div className='mb-3'>
                                <h3 className='font-bold'>Input your login details</h3>
                            </div>
                            <div className='grid gap-3'>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Email address</label>
                                    <input
                                        type="email"
                                        placeholder='eg. JohnDoe@gmail.com'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={logData.email}
                                        name='email'
                                        onChange={handleChange}
                                    />
                                    {error.email && <span className="err_msg text-red-500 text-[10px]">{error.email}</span>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Password</label>
                                    <input
                                        type="password"
                                        placeholder='********'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={logData.password}
                                        name='password'
                                        onChange={handleChange}
                                    />
                                    {error.password && <span className="err_msg text-red-500 text-[10px]">{error.password}</span>}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Login</button>
                            </div>
                        </form>
                    </div>
                    <div className='mt-6 text-[12px] text-center'>
                        <span>I don't have an account. <Link href='/staffSignup' className='font-bold text-accent'>Sign up</Link></span>
                    </div>
                </div>
                <div className='w-[55vw] h-[100vh] hidden md:flex fixed right-0 top-0'>
                    <Image className='w-full h-full object-cover' src={form} alt='' />
                </div>
            </main>
        </>
    )
}

export default Login