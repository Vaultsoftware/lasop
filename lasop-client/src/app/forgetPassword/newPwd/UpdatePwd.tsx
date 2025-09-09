'use client';

import { AppDispatch, RootState } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import lasopLogo from '../../../asset/form/logo.png';
import { FaArrowLeft } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';
import { updateStudent } from '@/store/studentStore/studentStore';
import { clearData, subPage } from '@/store/forgetPwdStore/forgetStore';

interface PageData {
    newPassword: string;
    password: string;
}

interface Password {
    password: string;
}

function UpdatePwd() {
    const dispatch = useDispatch<AppDispatch>();
    const studentId = useSelector((state: RootState) => state.forget.studentId)
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const [pageData1, setPageData1] = useState<PageData>({
        newPassword: '',
        password: '',
    });

    const [error, setError] = useState<Partial<PageData>>({});

    const validateForm = () => {
        const newError: Partial<PageData> = {};

        // Password
        if (!pageData1.password.trim()) {
            newError.newPassword = `Password is required`;
        }
        else if (pageData1.newPassword.trim().length < 3) {
            newError.password = `Password cannot be lesser than 3 characters`;
        }
        else if (pageData1.newPassword.trim().length > 15) {
            newError.password = `Password cannot be greater than 15 characters`;
        };

        if (!pageData1.password.trim()) {
            newError.password = `Password is required`;
        }
        else if (pageData1.password.trim() !== pageData1.newPassword) {
            newError.password = `Password doesn't match`;
        }

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
                const updateData: Password = {
                    password: pageData1.password,
                };

                const response = await dispatch(updateStudent({ updateData, studentId}))
                if (updateStudent.fulfilled.match(response)) {
                    const payload = response.payload;
                    toast.success(payload.message || 'Password updated successfully')
                    dispatch(clearData());
                    router.push('/login');
                }
                else {
                    toast.error(response.error?.message);
                }

                setPageData1({
                    newPassword: '',
                    password: '',
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
                        <FaArrowLeft className='text-[20px] text-accent mb-3' onClick={() => dispatch(subPage())} />
                        <h1 className=''>
                            <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='' />
                        </h1>
                        <h3 className='text-shadow font-semibold'>Update password</h3>
                    </div>
                    <div className='w-full rounded-md shadow-md shadow-slate-600'>
                        <form action="" onSubmit={handleSubmit} className='w-full p-7'>
                            <div className='mb-3'>
                                <span className='text-[12px] font-semibold'>Step 3/3</span>
                                <h3 className='font-bold'>Set a new password</h3>
                            </div>
                            <div className='grid gap-3'>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>New password</label>
                                    <input
                                        type="text"
                                        placeholder='eg. JohnDoe@gmail.com'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={pageData1.newPassword}
                                        name='newPassword'
                                        onChange={handleChange}
                                    />
                                    {error.newPassword && <span className="err_msg text-red-500 text-[10px]">{error.newPassword}</span>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Confirm password</label>
                                    <input
                                        type="text"
                                        placeholder='eg. JohnDoe@gmail.com'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={pageData1.password}
                                        name='password'
                                        onChange={handleChange}
                                    />
                                    {error.password && <span className="err_msg text-red-500 text-[10px]">{error.password}</span>}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Change password</button>
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

export default UpdatePwd