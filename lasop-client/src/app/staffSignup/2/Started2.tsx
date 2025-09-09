'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addData, clearData, goBack, setPage } from '@/store/staffData/staffData';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa6';
import lasopLogo from '../../../asset/form/logo.png';
import { postStaff } from '@/store/staffStore/staffSlice';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';
import { Course } from '@/interfaces/interface';

interface ApplicationDetail {
    role: string;
    enrol: string;
}

interface StaffResponsePayload {
    message: string;
}

interface NonCourse {
    _id: string;
    title: string;
    code: string;
    price: string;
}

function Started2() {
    // State management
    const dispatch = useDispatch<AppDispatch>();
    const staffDataSub = useSelector((state: RootState) => state.staffData.staffData);
    const router = useRouter();

    const [applicationData, setApplicationData] = useState<ApplicationDetail>({
        role: '',
        enrol: ''
    })

    const academic = useSelector((state: RootState) => state.courses.courses);
    const nonAcademic = useSelector((state: RootState) => state.nonCourse.nonCourses);

    const [position, setPosition] = useState<Course[] | NonCourse[]>([]);

    const [error, setError] = useState<Partial<ApplicationDetail>>({});
    const [loading, setLoading] = useState<boolean>(false);

    // Form validation
    const validateCourse = () => {
        const newError: Partial<ApplicationDetail> = {};

        if (!applicationData.role) {
            newError.role = 'Role is required';
        }
        if (!applicationData.enrol) {
            newError.enrol = 'Position is required';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setApplicationData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validateCourse()) {
            // dispatch(clearData());
            setLoading(true)
            try {
                dispatch(addData(applicationData));

                const updatedStaffData = { ...staffDataSub, ...applicationData };

                console.log(updatedStaffData)

                const response = await dispatch(postStaff(updatedStaffData))
                if (postStaff.fulfilled.match(response)) {
                    const payload = response.payload as StaffResponsePayload;
                    toast.success(payload.message || 'Staff data submitted successfully');
                    router.push('/staffLogin')
                }
                else {
                    toast.error(response.error?.message);
                }
            } catch (err: any) {
                toast.error(err.message || 'Failed to submit staff data');
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (applicationData.role.toLowerCase() === 'academic') {
            setPosition(academic)
        }
        else if (applicationData.role.toLowerCase() === 'non-academic') {
            setPosition(nonAcademic)
        }
    }, [applicationData.role])

    return (
        <>
        {
            loading && <ValidateLoading />
        }
            <main className='w-full md:w-[45vw] h-full'>
                <div className='p-10 flex flex-col justify-center'>
                    <div className='mb-5'>
                        <FaArrowLeft className='text-[20px] text-accent mb-3' onClick={() => dispatch(goBack())} />
                        <h1>
                            <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='' />
                        </h1>
                        <h3 className='text-shadow font-semibold'>Continue Your Application</h3>
                    </div>
                    <div className='w-full rounded-md shadow-md shadow-slate-600'>
                        <form onSubmit={handleSubmit} className='w-full p-7'>
                            <div className='mb-3'>
                                <span className='text-[12px] font-semibold'>Step 2/2</span>
                                <h3 className='font-bold'>Application</h3>
                            </div>
                            <div className='grid gap-3'>
                                <div className='grid gap-2'>
                                    <label htmlFor="course" className='text-[12px]'>Role</label>
                                    <select
                                        id="course"
                                        name="role"
                                        value={applicationData.role}
                                        onChange={handleChange}
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    >
                                        <option value="">Select a role</option>
                                        <option value="academic">Academic</option>
                                        <option value="non-academic">Non-academic</option>
                                    </select>
                                    {error.role && <p className='text-red-500 text-[12px]'>{error.role}</p>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="cohort" className='text-[12px]'>Position</label>
                                    <select
                                        id="cohort"
                                        name="enrol"
                                        value={applicationData.enrol}
                                        onChange={handleChange}
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    >
                                        {
                                            position.length > 0 ? position.map((avail, ind) => (
                                                <option key={ind} value={avail._id}>{avail.title}</option>
                                            )) : (
                                                <option value="">No position available for selected role</option>
                                            )
                                        }
                                        <option value="">Select a position</option>
                                    </select>
                                    {error.enrol && <p className='text-red-500 text-[12px]'>{error.enrol}</p>}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button type="submit" className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Submit Application</button>
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

export default Started2;
