'use client';

import { AppDispatch, RootState } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState, ChangeEvent, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import lasopLogo from '../../../asset/form/logo.png';
import { verifyCode } from '@/store/verifyEmailStore/verifyEmailStore';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa6';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';
import { addPage, subPage } from '@/store/forgetPwdStore/forgetStore';

function Validate() {
    const dispatch = useDispatch<AppDispatch>();

    const verifyData = useSelector((state: RootState) => state.verifyOtp.verifyData)

    const [code, setCode] = useState<string[]>(new Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const element = event.target;
        if (!isNaN(Number(element.value)) && element.value !== '') {
            const newCode = [...code];
            newCode[index] = element.value;
            setCode(newCode);

            // Move to next input if current is filled
            if (element.value !== '' && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleBackspace = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === 'Backspace' && code[index] === '') {
            if (index !== 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (event.key === 'Backspace') {
            const newCode = [...code];
            newCode[index] = '';
            setCode(newCode);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const verificationCode = code.join('')

        const codeData = {
            email: verifyData?.email as string,
            code: verificationCode
        }

        setLoading(true);
        try {
            const response = await dispatch(verifyCode(codeData));

            if (verifyCode.fulfilled.match(response)) {
                const payload = response.payload;
                toast.success(payload.message || 'Verification successful');
                dispatch(addPage())
            } else {
                toast.error(response.error?.message);
            }
        } catch {
            toast.error('An error occurred while verifying the code');
        } finally {
            setLoading(false);
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
                        <h3 className='text-shadow font-semibold'>Verify your Email address</h3>
                    </div>
                    <div className='w-full rounded-md shadow-md shadow-slate-600'>
                        <form onSubmit={handleSubmit} action="" className='w-full p-7'>
                            <div className='mb-3'>
                                <span className='text-[12px] font-semibold'>Step 2/3</span>
                                <h3 className='font-bold'>Type in the code sent to your email address</h3>
                            </div>
                            <div className="create_ctrl_code">
                                {code.map((value, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={value}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleBackspace(e, index)}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        className="code-input"
                                        required
                                    />
                                ))}
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Verify Email</button>
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

export default Validate;