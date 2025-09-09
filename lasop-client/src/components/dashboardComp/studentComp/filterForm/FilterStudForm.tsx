'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdManageSearch } from "react-icons/md";
import { handleAppDet, handleClassStatus } from '@/store/dashMenu/dashStore';
import { CohortMain, StudentDataMain } from '@/interfaces/interface';
import { TbCalendarSearch } from "react-icons/tb";
import { setAdminCohortSelectedCohort } from '@/store/filterStore/adminFilStore';
import Link from 'next/link';
import { fetchStudentDetails } from '@/store/studentStore/studentStore';
import ApplicantDetails from '../../adminComp/applicants/ApplicantDetails';

interface FilterData {
    from: string;
    to: string;
}

interface Props {
    tabData: string;
    filterData: string;
}

function FilterStudForm({ tabData, filterData }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const students = useSelector((state: RootState) => state.student.student);
    const applicantData = useSelector((state: RootState) => state.student.studentDetails);
    const appDisplay = useSelector((state: RootState) => state.dashMenu.appDet)

    // Getting student ID to display their details
    const [applicantId, setApplicantId] = useState<string>('');

    const handleApplicantsId = (arg: string) => {
        if (arg) {
            setApplicantId(arg);
            // dispatch(handleAppDet())
        }
    }

    useEffect(() => {
        if (applicantId.length > 0) {
            dispatch(fetchStudentDetails(applicantId))
        }
    }, [applicantId, dispatch])

    //   setting data based on component
    const [studentData, setStudentData] = useState<StudentDataMain[]>();
    useEffect(() => {
        if (students.length > 0 && filterData) {
            if (filterData === 'applicant') {
                const filtered = students.filter((stu) => stu.status === 'applicant');
                setStudentData(filtered)
            }
            else if (filterData === 'student') {
                const filtered = students.filter((stu) => stu.status === 'student');
                setStudentData(filtered)
            }
        }
    }, [students, filterData])

    // Function for converting date to string
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        return formattedDate;
    }

    // Setting selected cohort

    // Displaying different form base on tab
    const [tabStatus, setTabStatus] = useState<string>(tabData)

    const handleTabStatus = (tab: string) => {
        setTabStatus(tab);
    }

    // List for storing filtered Item based on startDate and functionalities
    const [filterListCohort, setFilterListCohort] = useState<StudentDataMain[]>([]);

    // Formdata state
    const [formData, setFormData] = useState<FilterData>({
        from: '',
        to: new Date(Date.now()).toISOString().slice(0, 10),
    })

    // Error state for form date validation
    const [formErr, setFormErr] = useState<Partial<FilterData>>({
        from: '',
        to: '',
    });

    // Search result message
    const [calMsg, setCalMsg] = useState<string>(`Fill the form to filter ${filterData} based on their startDate`);

    const handleCalMsg = () => {
        setCalMsg(`No result for ${filterData} starting within the date of '${formatDate(formData.from)} - ${formatDate(formData.to)}'`);
    }

    const validate = () => {
        const newErr: Partial<FilterData> = {};

        if (!formData.from.trim()) {
            newErr.from = 'From date is required';
        }
        if (!formData.to.trim()) {
            newErr.to = 'To date is required';
        }

        setFormErr(newErr);
        return Object.keys(newErr).length === 0;
    }

    // Handle date data change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // Submitting date data and filtering cohorts between the data
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const fromDate = new Date(formData.from).toISOString().slice(0, 10);
            const toDate = new Date(formData.to).toISOString().slice(0, 10);

            const cohortFiltered = studentData?.filter((coh) => {
                const startDate = new Date(coh.program.cohortId.startDate).toISOString().slice(0, 10);

                return startDate >= fromDate && startDate <= toDate;
            });

            if (cohortFiltered) {
                setFilterListCohort(cohortFiltered);
                setFormErr({});
            }
            else {
                handleCalMsg();
                setFilterListCohort([]);
            }
        }
    }

    // List for storing searched cohorts based on name and functionalities
    const [searchlistCohort, setSearchListCohort] = useState<StudentDataMain[]>([]);

    // Search data state
    const [searchData, setSearchData] = useState<string>('')

    // Error state
    const [searchErr, setSearchErr] = useState<string>('')

    // Search result message
    const [srchMsg, setSrchMsg] = useState<string>(`Fill the form to search ${filterData} based on their name`);

    const handleSrchMsg = () => {
        setSrchMsg(`No result for ${filterData} with the name '${searchData}'`);
    }

    // Searching cohorts based on name and functionalities
    const handleSubmitSearch = (e: FormEvent) => {
        e.preventDefault();

        if (!searchData.trim()) {
            setSearchErr('Search field is required');
            return;
        }
        else {
            const cohortFiltered = studentData?.filter((coh) => coh.firstName.toLowerCase().includes(searchData.toLowerCase()));
            if (cohortFiltered) {
                setSearchListCohort(cohortFiltered);
                setSearchData('');
                setSearchErr('');
            }
            else {
                handleSrchMsg();
                setSearchListCohort([]);
            }
        }
    }

    return (
        <div className='fixed top-0 left-0 z-30 w-full h-[100vh] applicant flex items-center justify-center'>
            <div className='w-[300px] h-fit p-2 bg-white rounded-md'>
                <div className='mb-4 flex justify-between'>
                    <div className='flex gap-2'>
                        <div onClick={() => handleTabStatus('calendar')} className={`w-[25px] h-[25px] flex items-center justify-center ${tabStatus === 'calendar' ? 'text-cyan-100 bg-accent' : 'text-accent border border-accent'} rounded-sm`}>
                            <TbCalendarSearch />
                        </div>
                        <div onClick={() => handleTabStatus('search')} className={`w-[25px] h-[25px] flex items-center justify-center ${tabStatus === 'search' ? 'text-cyan-100 bg-accent' : 'text-accent border border-accent'} rounded-sm`}>
                            <MdManageSearch />
                        </div>
                    </div>
                    <div onClick={() => dispatch(handleClassStatus())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent rounded-sm'>
                        <MdClose />
                    </div>
                </div>
                {
                    tabStatus === 'calendar' ? <>
                        <form action="" onSubmit={handleSubmit} className='flex flex-col gap-3 w-full'>
                            <div className="from flex flex-col w-full gap-2 ">
                                <span className='text-[12px]'>From:</span>
                                <div className='p-[4px] border border-shadow rounded-md h-fit'>
                                    <input onChange={handleChange} value={formData.from} name='from' type="date" className='w-full h-[30px] text-[14px] outline-none' id="" />
                                </div>
                                {formErr.from && <span className='text-red-500 text-[10px]'>{formErr.from}</span>}
                            </div>
                            <div className="from flex flex-col w-full gap-2 ">
                                <span className='text-[12px]'>To:</span>
                                <div className='p-[4px] border border-shadow rounded-md h-fit'>
                                    <input onChange={handleChange} value={formData.to} name='to' type="date" className='w-full h-[30px] text-[14px] outline-none' id="" />
                                </div>
                                {formErr.to && <span className='text-red-500 text-[10px]'>{formErr.to}</span>}
                            </div>
                            <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Search</button>
                        </form>
                        <div className='mt-6'>
                            <h2 className='font-semibold text-[14px]'>Filtered {filterData}</h2>
                            <div className={`grid gap-1 ${filterListCohort.length > 4 ? 'h-[200px]' : 'h-fit'} overflow-y-auto mt-4`}>
                                {
                                    filterListCohort.length > 0 ? filterListCohort.map((coh) => (
                                        <Link href={`/dashboard/admin/${filterData}s/${coh._id}`} onClick={() => coh._id ? handleApplicantsId(coh._id) : ''} className={`flex justify-between text-[15px] ${applicantId === coh._id ? 'bg-slate-400 text-cyan-50' : ''} border-slate-600 border-b-2 pl-1 py-2`}>
                                            <p className='w-[60%]'>{coh.firstName}</p>
                                            <p>{formatDate(coh.program.cohortId.startDate)}</p>
                                        </Link>
                                    )) : (
                                        <p className='text-center text-[14px]'>{calMsg}</p>
                                    )
                                }
                            </div>
                        </div>
                    </> : <>
                        <form action="" onSubmit={handleSubmitSearch} className='flex flex-col gap-3 w-full'>
                            <div className="from">
                                <div className='p-[4px] border border-shadow rounded-md h-fit'>
                                    <input onChange={(e) => setSearchData(e.target.value)} value={searchData} name='searchData' type="search" placeholder='John Doe' className='w-full h-[30px] text-[14px] outline-none' id="" />
                                </div>
                                {searchErr && <span className='text-red-500 text-[10px]'>{searchErr}</span>}
                            </div>
                            <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Search</button>
                        </form>
                        <div className='mt-6'>
                            <h2 className='font-semibold text-[14px]'>{filterData} result</h2>
                            <div className={`grid gap-1 ${searchlistCohort.length > 4 ? 'h-[200px]' : 'h-fit'} overflow-y-auto mt-4`}>
                                {
                                    searchlistCohort.length > 0 ? searchlistCohort.map((coh) => (
                                        <Link href={`/dashboard/admin/${filterData}s/${coh._id}`} onClick={() => coh._id ? handleApplicantsId(coh._id) : ''} className={`flex justify-between text-[15px] ${applicantId === coh._id ? 'bg-slate-400 text-cyan-50' : ''} border-slate-600 border-b-2 pl-1 py-2`}>
                                            <p className='w-[60%]'>{coh.firstName}</p>
                                            <p>{formatDate(coh.program.cohortId.startDate)}</p>
                                        </Link>
                                    )) : (
                                        <p className='text-center text-[14px]'>{srchMsg}</p>
                                    )
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
            {
                appDisplay && <ApplicantDetails
                    studentId={applicantData?._id}
                    firstName={applicantData?.firstName}
                    lName={applicantData?.lastName}
                    contact={applicantData?.contact}
                    address={applicantData?.address}
                    sex={applicantData?.gender ?? 'N/A'} status={applicantData?.status}
                    regDate={formatDate(applicantData?.createdAt as string)}
                    cohort={applicantData?.program?.cohortId?.cohortName ?? 'N/A'}
                    center={applicantData?.program?.center?.title ?? 'N/A'}
                    mode={applicantData?.program?.mode ?? 'N/A'}
                    course={applicantData?.program?.courseId?.title ?? 'N/A'}
                    courseDuration={`${Math.floor(
                        (new Date(applicantData?.program.cohortId.endDate).getTime() -
                            new Date(applicantData?.program.cohortId.startDate).getTime()
                        ) / (1000 * 60 * 60 * 24 * 7)
                    )} weeks`}
                    started={applicantData?.program?.cohortId?.startDate ? formatDate(applicantData.program.cohortId.startDate) : 'N/A'}
                    tuition={applicantData?.program?.courseId?.price ?? 'N/A'}
                    feeBal='None'
                    dueDate='None'
                    id={applicantId}
                />
            }
        </div>
    )
}

export default FilterStudForm