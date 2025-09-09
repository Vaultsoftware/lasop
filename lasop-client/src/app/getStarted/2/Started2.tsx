'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { applyProgram, clearData, goBack, setPage } from '@/store/pageStore/pageStore';
import { toast } from 'react-toastify';
import { MdInfoOutline } from "react-icons/md";
import lasopLogo from '../../../asset/form/logo.png';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';
import CohCode from '@/components/cohortCode/CohCode';
import { handleCode } from '@/store/dashMenu/dashStore';
import { CohortMain } from '@/interfaces/interface';

interface CourseDetail {
    courseId: string;
    cohortId: string;
    center: string;
    mode: string;
}

function Started2() {
    // State management
    const dispatch = useDispatch<AppDispatch>();
    const course = useSelector((state: RootState) => state.courses.courses);
    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const centerAvail = useSelector((state: RootState) => state.centers.centers);
    const codeDet = useSelector((state: RootState) => state.dashMenu.openCode)

    const [courseData, setCourseData] = useState<CourseDetail>({
        courseId: '',
        cohortId: '',
        center: '',
        mode: '',
    });

    const [availCohort, setAvailCohort] = useState<CohortMain[]>([]);
    const [getCohort, setGetCohort] = useState<CohortMain | undefined>(undefined);

    const router = useRouter()

    const [error, setError] = useState<Partial<CourseDetail>>({});
    const [loading, setLoading] = useState(false);

    // Form validation
    const validateCourse = () => {
        const newError: Partial<CourseDetail> = {};

        if (!courseData.courseId) {
            newError.courseId = 'Course is required';
        }
        if (!courseData.cohortId) {
            newError.cohortId = 'Cohort is required';
        }
        if (!courseData.center) {
            newError.center = 'Center is required';
        }
        if (!courseData.mode) {
            newError.mode = 'Mode of study is required';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCourseData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const now = new Date();

        // Calculate one month before and one month after
        const oneMonthBefore = new Date();
        oneMonthBefore.setMonth(now.getMonth() - 1);
        const oneMonthAfter = new Date();
        oneMonthAfter.setMonth(now.getMonth() + 1);

        // Filter cohorts active within the range of one month before to one month after
        const activeCohort = cohort.filter((coh) => {
            if (coh.isActive) {
                const startDate = new Date(coh.startDate);
                return startDate >= oneMonthBefore && startDate <= oneMonthAfter;
            }
            return false;
        });

        // Filter cohorts with the specified course ID
        const availableCohortForCourse = activeCohort.filter((co) =>
            co.courseId.some((c) => c._id === courseData.courseId)
        );

        setAvailCohort(availableCohortForCourse);

        // Find and set the selected cohort
        const selectedCohort = cohort.find((coh) => coh._id === courseData.cohortId);
        setGetCohort(selectedCohort);
    }, [cohort, courseData.courseId, courseData.cohortId]);


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (validateCourse()) {
            setLoading(true)
            try {
                dispatch(applyProgram(courseData))
                // dispatch(clearData());
                dispatch(setPage());
            } catch (error: any) {
                toast.error(error.message || 'Failed to submit the application.');
            } finally {
                setLoading(false);
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
                        <h1>
                            <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='' />
                        </h1>
                        <h3 className='text-shadow font-semibold'>Continue Your Application</h3>
                    </div>
                    <div className='w-full rounded-md shadow-md shadow-slate-600'>
                        <form onSubmit={handleSubmit} className='w-full p-7'>
                            <div className='mb-3'>
                                <span className='text-[12px] font-semibold'>Step 1/4</span>
                                <h3 className='font-bold'>Course of Study</h3>
                                <div className='flex gap-2 items-center'>
                                    <p className='text-[10px] text-shadow'>Having problem understanding the cohort name ? click the info icon</p>
                                    <MdInfoOutline onClick={() => dispatch(handleCode())} className='text-accent ' />
                                </div>
                            </div>
                            <div className='grid gap-3'>
                                <div className='grid gap-2'>
                                    <label htmlFor="course" className='text-[12px]'>Course</label>
                                    <select
                                        id="course"
                                        name="courseId"
                                        value={courseData.courseId}
                                        onChange={handleChange}
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    >
                                        <option value="">Select a course</option>
                                        {
                                            course.map((cou) => (
                                                <option key={cou._id} value={cou._id}>{cou.title}</option>
                                            ))
                                        }
                                    </select>
                                    {error.courseId && <p className='text-red-500 text-[12px]'>{error.courseId}</p>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="cohort" className='text-[12px]'>Cohort</label>
                                    <select
                                        id="cohort"
                                        name="cohortId"
                                        value={courseData.cohortId}
                                        onChange={handleChange}
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    >
                                        {
                                            availCohort.length > 0 ? availCohort.map((avail) => (
                                                <option key={avail._id} value={avail._id}>{avail.cohortName}</option>
                                            )) : (
                                                <option value="">No Cohort available for selected Course</option>
                                            )
                                        }
                                        <option value="">Select a Cohort</option>
                                    </select>
                                    {error.cohortId && <p className='text-red-500 text-[12px]'>{error.cohortId}</p>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="center" className='text-[12px]'>Center</label>
                                    <select
                                        id="center"
                                        name="center"
                                        value={courseData.center}
                                        onChange={handleChange}
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    >
                                        {
                                            getCohort ? getCohort.center.map((cen) => (
                                                <option key={cen._id} value={cen._id}>{cen.title}</option>
                                            )) : <option value="">Select a Cohort</option>
                                        }
                                        <option value="">Select center</option>
                                    </select>
                                    {error.center && <p className='text-red-500 text-[12px]'>{error.center}</p>}
                                </div>
                                <div className='grid gap-2'>
                                    <label htmlFor="modes" className='text-[12px]'>Mode of study</label>
                                    <select
                                        id="modes"
                                        name="mode"
                                        value={courseData.mode}
                                        onChange={handleChange}
                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    >
                                        {
                                            getCohort ? getCohort.mode.map((mod) => (
                                                <option key={mod} value={mod}>{mod}</option>
                                            )) : <option value="">Select a cohort</option>
                                        }
                                        <option value="">Select mode of study</option>
                                    </select>
                                    {error.mode && <p className='text-red-500 text-[12px]'>{error.mode}</p>}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button type="submit" className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Continue</button>
                            </div>
                        </form>
                    </div>
                    <div className='mt-6 text-[12px] text-center'>
                        <span>I have an account. <Link href='/login' className='font-bold text-accent'>Log in</Link></span>
                    </div>
                </div>
                {codeDet && <CohCode />}
            </main>
        </>
    )
}

export default Started2;
