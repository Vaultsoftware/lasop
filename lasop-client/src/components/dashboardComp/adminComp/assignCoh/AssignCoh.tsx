'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { FaRegCalendarCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { handleAssCoh } from '@/store/dashMenu/dashStore';
import { assignCohortStaff, fetchCohort } from '@/store/cohortSlice/cohortStore';
import { toast } from 'react-toastify';

interface OtherInfo {
    fName: string;
    lName: string;
    contact: string;
    address: string;
}

interface OtherInfoData {
    id?: string;
    staffId: string;
    kin: OtherInfo;
    guarantor1: OtherInfo;
    guarantor2: OtherInfo;
}

interface StaffMain {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    address: string;
    dateOfEmploy: string;
    salary: string;
    password: string;
    otherInfo: OtherInfoData[];
    role: string;
    enrol: string;
    status: string;
    createdAt: string;
}

interface CohortMain {
    _id: string;
    cohortName: string;
    courseId: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    }[];
    startDate: string;
    endDate: string;
    center: {
        _id?: string;
        title: string;
    }[];
    mode: string[];
    courseTutors: {
        course: {
            _id: string;
            title: string;
            code: string;
            price: string;
            exams: string[];
        };
        center: {
            _id?: string;
            title: string;
        };
        mode: string;
        tutors: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            contact: string;
            address: string;
            dateOfEmploy: string;
            salary: string;
            password: string;
            otherInfo: OtherInfoData[];
            role: string;
            enrol: string;
            status: string;
            createdAt: string;
        };
    }[];
    isActive: boolean;
    status: string;
}

interface CourseTutor {
    course: string;
    center: string;
    mode: string;
    tutors: string;
}

interface Course {
    _id: string;
    title: string;
    code: string;
    price: string;
    exams: string[];
}

interface Center {
    _id?: string;
    title: string;
}

interface ResponsePayload {
    message?: string;
    data?: CohortMain;
}

function AssignCoh() {
    const dispatch = useDispatch<AppDispatch>();

    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const course = useSelector((state: RootState) => state.courses.courses);
    const staff = useSelector((state: RootState) => state.staff.staffs);

    const [currentActiveCoh, setCurrentActiveCoh] = useState<CohortMain[]>([])
    const [cohortIdDet, setCohortIdDet] = useState<string>('')
    const [selectedCohort, setSelectedCohort] = useState<CohortMain | undefined>(undefined);
    const [courseStaff, setCourseStaff] = useState<StaffMain[]>([]);

    const [courseTutorData, setCourseTutorData] = useState<CourseTutor>({
        course: '',
        center: '',
        mode: '',
        tutors: ''
    });

    const [error, setError] = useState<Partial<CourseTutor>>({});

    const validateCourse = () => {
        const newError: Partial<CourseTutor> = {};

        if (!courseTutorData.course) {
            newError.course = 'Course is required';
        }
        if (!courseTutorData.center) {
            newError.center = 'Center is required';
        }
        if (!courseTutorData.mode) {
            newError.mode = 'Mode is required';
        }
        if (!courseTutorData.tutors) {
            newError.tutors = 'Tutor is required';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCourseTutorData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (validateCourse()) {
                if (cohortIdDet) {
                    const response = await dispatch(assignCohortStaff({ courseTutorData, cohortIdDet }));

                    if (assignCohortStaff.fulfilled.match(response)) {
                        toast.success('Cohort assigned to staff')
                        dispatch(fetchCohort())
                        dispatch(handleAssCoh())
                    }
                    else {
                        toast.error(response.error?.message);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const currentAct = cohort.filter((coh) => coh.status === 'inactive' || coh.status === 'current')
        setCurrentActiveCoh(currentAct);
    }, [cohort])

    useEffect(() => {
        const getCoh = currentActiveCoh.find((coh) => coh._id === cohortIdDet)
        setSelectedCohort(getCoh)
    }, [currentActiveCoh, cohortIdDet]);

    useEffect(() => {
        const courseData = course.find((cou) => cou._id === courseTutorData.course)

        const cohortCourse = staff.filter((sta) => sta.enrol === courseData?.title);
        setCourseStaff(cohortCourse);
    }, [staff, course, courseTutorData.course])

    return (
        <div className='fixed left-0 top-0 w-full h-[100vh] flex justify-center items-center applicant'>
            <div className='w-[70vw] md:w-[40vw] h-[100vh] py-3 bg-white  ml-auto'>
                <div onClick={() => dispatch(handleAssCoh())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent ml-auto rounded-sm mr-3'>
                    <MdClose />
                </div>
                <div className='flex items-center gap-2 w-full px-3 pb-3 border-b border-accent'>
                    <FaRegCalendarCheck />
                    <h3>Assign Cohort</h3>
                </div>
                <div className='h-full pb-6'>
                    <form onSubmit={handleSubmit} action="" className='w-full px-3 pt-3'>
                        <div className='w-full grid gap-3'>
                            <div className='w-full grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Cohort</label>
                                <select
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={cohortIdDet}
                                    name="cohort"
                                    onChange={(e) => setCohortIdDet(e.target.value)}
                                    id="">
                                    {
                                        currentActiveCoh.map((coh) => (
                                            <option value={coh._id}>{coh.cohortName}</option>
                                        ))
                                    }
                                    <option value="">Select Cohort</option>
                                </select>
                            </div>
                            <div className='w-full grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Course</label>
                                <select
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={courseTutorData.course}
                                    name="course"
                                    onChange={handleChange}
                                    id="">
                                    {
                                        selectedCohort ? selectedCohort?.courseId.map((avail) => (
                                            <option key={avail._id} value={avail._id}>{avail.title}</option>
                                        )) : (
                                            <option value="">No course available for selected Cohort</option>
                                        )
                                    }
                                    <option value="">Select a course</option>
                                </select>
                                {error.course && <span className='text-red-500 text-xs'>{error.course}</span>}
                            </div>
                            <div className='w-full grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Center</label>
                                <select
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={courseTutorData.center}
                                    name="center"
                                    onChange={handleChange}
                                    id="">
                                    {
                                        selectedCohort ? selectedCohort?.center.map((avail) => (
                                            <option key={avail._id} value={avail._id}>{avail.title}</option>
                                        )) : (
                                            <option value="">No center available for selected Cohort</option>
                                        )
                                    }
                                    <option value="">Select a center</option>
                                </select>
                                {error.center && <span className='text-red-500 text-xs'>{error.center}</span>}
                            </div>
                            <div className='w-full grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Mode</label>
                                <select
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={courseTutorData.mode}
                                    name="mode"
                                    onChange={handleChange}
                                    id="">
                                    {
                                        selectedCohort ? selectedCohort?.mode.map((avail) => (
                                            <option key={avail} value={avail}>{avail}</option>
                                        )) : (
                                            <option value="">No mode available for selected Cohort</option>
                                        )
                                    }
                                    <option value="">Select a mode</option>
                                </select>
                                {error.mode && <span className='text-red-500 text-xs'>{error.mode}</span>}
                            </div>
                            <div className='w-full grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Tutor</label>
                                <select
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    name="tutors"
                                    value={courseTutorData.tutors}
                                    onChange={handleChange}
                                    id=""
                                >
                                    {
                                        courseStaff.length > 0 ? courseStaff.map((avail) => (
                                            <option key={avail._id} value={avail._id}>{avail.firstName} {avail.lastName}</option>
                                        )) : (
                                            <option value="">No tutors available for the selected course</option>
                                        )
                                    }
                                    <option value="">Select a staff</option>
                                </select>
                                {error.tutors && <span className='text-red-500 text-xs'>{error.tutors}</span>}
                            </div>
                        </div>
                        <div className='w-ful mt-6'>
                            <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Assign Cohort</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AssignCoh