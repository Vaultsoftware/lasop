'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCourseDetail } from '@/store/courseSlice/courseStore';
import { clearData, goBack } from '@/store/pageStore/pageStore';
import { toast } from 'react-toastify';
import { postStudent } from '@/store/studentStore/studentStore';
import { FaArrowLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import lasopLogo from '../../../asset/form/logo.png';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';

interface StudentData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    address: string;
    program: {
        courseId: string;
        cohortId: string;
        center: string;
        mode: string;
    };
    allowed: boolean;
    status: string;
};

interface StudentResponsePayload {
    message: string;
}

function Started3() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter();

    // Fetch course details and price
    const course = useSelector((state: RootState) => state.pageData.payment);
    const courseDetail = useSelector((state: RootState) => state.courses.courseDetail);
    const { title, price } = courseDetail;

    // Student data for posting
    const studentDataSub = useSelector((state: RootState) => state.pageData.studentData);

    useEffect(() => {
        if (course.courseId) {
            dispatch(fetchCourseDetail(course.courseId));
        }
    }, [course.courseId, dispatch]);

    // Handle payment selection
    const handlePaymentSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod(e.target.value);
        setError(null);
    };

    const validateStudentData = (studentData: Partial<StudentData>) => {
        const { firstName, lastName, email, password, contact, address, program } = studentData;

        if (!firstName || !lastName || !email || !password || !contact || !address || !program?.courseId || !program?.cohortId || !program?.center || !program?.mode) {
            return false;
        }
        else {
            return true;
        }
    }

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedPaymentMethod) {
            setError('Please choose a payment method.');
            return;
        }
        const isValidData = validateStudentData(studentDataSub);
        console.log(studentDataSub)

        if (!isValidData) {
            toast.error('Please fill out all required fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await dispatch(postStudent(studentDataSub));
            if (postStudent.fulfilled.match(response)) {
                const payload = response.payload as StudentResponsePayload;
                toast.success(payload.message || 'Student data submitted successfully');
                router.push('/login')
            }
            else {
                toast.error(response.error?.message);
            }
        } catch (error: any) {
            console.log(error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Skipping payment
    const skipPayment = async () => {
        const isValidData = validateStudentData(studentDataSub);

        if (!isValidData) {
            toast.error('Please fill out all required fields.');
            return;
        } else {
            try {
                const response = await dispatch(postStudent(studentDataSub));
                if (postStudent.fulfilled.match(response)) {
                    const payload = response.payload;
                    toast.success(payload.message || 'Student data submitted successfully');
                    router.push('/login')
                }
                else {
                    toast.error(response.error?.message || 'An error occurred');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
        {
            loading && <ValidateLoading />
        }
            <main className='w-full md:w-[45vw] h-full'>
                <div className='p-10 flex flex-col justify-center'>
                    <div className='mb-5'>
                        <FaArrowLeft className='text-[20px] text-accent mb-3' onClick={() => dispatch(goBack())} />
                        <h1 className='font-bold text-[25px]'>
                            <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='' />
                        </h1>
                        <h3 className='text-shadow font-semibold'>Complete Your Application</h3>
                    </div>
                    <div className='w-full rounded-md shadow-md shadow-slate-600'>
                        <form onSubmit={handleSubmit} className='w-full p-7'>
                            <div className='mb-3'>
                                <span className='text-[12px] font-semibold'>Step 4/4</span>
                                <h3 className='font-bold'>{title}</h3>
                            </div>
                            <div className='grid gap-3'>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Proceed to pay:</label>
                                    <span className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md font-bold flex items-center'>
                                        {price}
                                    </span>
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Choose payment method:</label>
                                    <div className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md text-bold flex items-center justify-between'>
                                        <label className='text-[12px]' htmlFor="bankTransfer">Pay with Bank Transfer</label>
                                        <input
                                            type="radio"
                                            name="pay"
                                            id="bankTransfer"
                                            value="Bank Transfer"
                                            onChange={handlePaymentSelection}
                                        />
                                    </div>
                                    <div className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md text-bold flex items-center justify-between'>
                                        <label className='text-[12px]' htmlFor="debitCard">Pay with Debit Card</label>
                                        <input
                                            type="radio"
                                            name="pay"
                                            id="debitCard"
                                            value="Debit Card"
                                            onChange={handlePaymentSelection}
                                        />
                                    </div>
                                    {error && <p className='text-red-500 text-[12px]'>{error}</p>}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button type="submit" className='w-full h-[35px] text-[12px] bg-accent text-cyan-50 rounded-md'>Complete Application</button>
                            </div>
                        </form>
                    </div>
                    <div className='mt-6 text-[12px] text-center'>
                        <span>I have an account. <Link href='/login' className='font-bold text-accent'>Log in</Link></span>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Started3;
