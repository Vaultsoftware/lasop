'use client';

import Terms from '@/components/terms/Terms';
import { addData, setPage } from '@/store/staffData/staffData';
import { AppDispatch } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, FormHTMLAttributes, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';
import lasopLogo from '../../../asset/form/logo.png';
import { sendVerificationCode } from '@/store/verifyEmailStore/verifyEmailStore';
import { toast } from 'react-toastify';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';

interface PageData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    address: string;
    status: string
}

interface PostEmail {
    email: string;
}

function Started1() {
    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter()

    const [openTerms, setOpenTerms] = useState<boolean>(false);

    const handleTerm = (e: FormEvent) => {
        e.preventDefault();
        setOpenTerms(!openTerms);

        scroll.scrollToTop({
            duration: 1000,
            smooth: 'easeInOutQuint',
        });
    }

    const [pageData1, setPageData1] = useState<PageData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contact: '',
        address: '',
        status: 'pending'
    });

    const [error, setError] = useState<Partial<PageData>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const validateForm = () => {
        const newError: Partial<PageData> = {};

        // First name
        if (!pageData1.firstName.trim()) {
            newError.firstName = 'First name is required';
        }
        else if (pageData1.firstName.trim().length < 3) {
            newError.firstName = 'First name cannot be less than 3 characters';
        }
        else if (pageData1.firstName.trim().length > 15) {
            newError.firstName = `First name cannot be greater than 15 characters`;
        };

        // Last name
        if (!pageData1.lastName.trim()) {
            newError.lastName = 'Last name is required';
        }
        else if (pageData1.lastName.trim().length < 3) {
            newError.lastName = 'Last name cannot be less than 3 characters';
        }
        else if (pageData1.lastName.trim().length > 15) {
            newError.lastName = `Last name cannot be greater than 15 characters`;
        };

        // Email
        const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!pageData1.email.trim()) {
            newError.email = 'Email account is required';
        }
        else if (!emailRegEx.test(pageData1.email.trim())) {
            newError.email = 'Invalid email address';
        };

        // Password
        if (!pageData1.password.trim()) {
            newError.password = `Password is required`;
        }
        else if (pageData1.password.trim().length < 3) {
            newError.password = `Password cannot be lesser than 3 characters`;
        }
        else if (pageData1.password.trim().length > 15) {
            newError.password = `Password cannot be greater than 15 characters`;
        };

        // Contact
        const contactPattern = /^[0-9]+$/
        if (!contactPattern.test(pageData1.contact.trim())) {
            newError.contact = 'Invalid contact address'
        }

        // Address
        if (!pageData1.address.trim()) {
            newError.address = 'Home address is required';
        }
        else if (pageData1.address.trim().length < 3) {
            newError.address = 'Home address cannot be less than 3 characters';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setPageData1({
            ...pageData1,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            try {
                dispatch(addData(pageData1));
                dispatch(setPage());
                setPageData1({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    contact: '',
                    address: '',
                    status: ''
                });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        else {
            setOpenTerms(!openTerms);
        };
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
                        <h3 className='text-shadow font-semibold'>Start Your Application</h3>
                    </div>
                    <div className='w-full rounded-md shadow-md shadow-slate-600'>
                        <form action="" className='w-full p-7'>
                            <div className='mb-3'>
                                <span className='text-[12px] font-semibold'>Step 1/2</span>
                                <h3 className='font-bold'>Personal Information</h3>
                            </div>
                            <div className='grid gap-3'>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>First name</label>
                                    <input
                                        type="text"
                                        placeholder='eg. John'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={pageData1.firstName}
                                        name='firstName'
                                        onChange={handleChange}
                                    />
                                    {error.firstName && <span className="err_msg text-red-500 text-[10px]">{error.firstName}</span>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Last name</label>
                                    <input
                                        type="text"
                                        placeholder='eg. Doe'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={pageData1.lastName}
                                        name='lastName'
                                        onChange={handleChange}
                                    />
                                    {error.lastName && <span className="err_msg text-red-500 text-[10px]">{error.lastName}</span>}
                                </div>
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
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Password</label>
                                    <input
                                        type="password"
                                        placeholder='********'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={pageData1.password}
                                        name='password'
                                        onChange={handleChange}
                                    />
                                    {error.password && <span className="err_msg text-red-500 text-[10px]">{error.password}</span>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>contact number</label>
                                    <input
                                        type="text"
                                        placeholder='eg. 23470*******'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={pageData1.contact}
                                        name='contact'
                                        onChange={handleChange}
                                    />
                                    {error.contact && <span className="err_msg text-red-500 text-[10px]">{error.contact}</span>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>address</label>
                                    <input
                                        type="text"
                                        placeholder='Address'
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                        value={pageData1.address}
                                        name='address'
                                        onChange={handleChange}
                                    />
                                    {error.address && <span className="err_msg text-red-500 text-[10px]">{error.address}</span>}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button onClick={handleSubmit} className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Read Terms and Condition</button>
                            </div>
                        </form>
                    </div>
                    <div className='mt-6 text-[12px] text-center'>
                        <span>I have an account. <Link href='/staffLogin' className='font-bold text-accent'>Log in</Link></span>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Started1;