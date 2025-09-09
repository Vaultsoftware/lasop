'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { LuListTodo } from "react-icons/lu";
import { IoIosCalendar } from "react-icons/io";
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { CgPlayTrackNextR } from "react-icons/cg";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaVideo } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import { VscWarning } from "react-icons/vsc";
import { handleStartClass } from '@/store/dashMenu/dashStore';
import StartActivateClass from '@/components/dashboardComp/staffComp/classroom/StartActivateClass';
import { ClassroomMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate';
import { updateTab } from '@/store/pageStore/pageStore';
import { useRouter } from 'next/navigation';

interface MyObject {
    id: number;
    title: string;
    numCol: number;
    icon: any;
}

function ClassMain() {
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails?._id);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffClassroomSelectedCohort);
    const startClass = useSelector((state: RootState) => state.dashMenu.startClass);

    const dispatch = useDispatch<AppDispatch>();
    const classrooms = useSelector((state: RootState) => state.classroom.classroom);

    const router = useRouter()

    // Function for converting date to string
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Filtering classes that are starting next based on selected/active cohort
    const [nextClasses, setNextClasses] = useState<ClassroomMain[]>([]);

    useEffect(() => {
        if (staffActiveCohort && staffDetail) {
            const allNextClasses = classrooms.filter((cls) => cls.cohortId._id === staffActiveCohort && cls.tutorId._id === staffDetail && cls.status === 'next');
            setNextClasses(allNextClasses);
        }
    }, [staffActiveCohort, staffDetail])

    // Filtering completed classes based on selected/active cohort
    const [completedClasses, setCompletedClasses] = useState<ClassroomMain[]>([]);

    useEffect(() => {
        if (staffActiveCohort && staffDetail) {
            const allCompletedClasses = classrooms.filter((cls) => cls.cohortId._id === staffActiveCohort && cls.tutorId._id === staffDetail && cls.status === 'completed');
            setCompletedClasses(allCompletedClasses);
        }
    }, [staffActiveCohort, staffDetail])

    // Filtering canceled classes based on selected/active cohort
    const [canceledClasses, setCanceledClasses] = useState<ClassroomMain[]>([]);

    useEffect(() => {
        if (staffActiveCohort && staffDetail) {
            const allCompletedClasses = classrooms.filter((cls) => cls.cohortId._id === staffActiveCohort && cls.tutorId._id === staffDetail && cls.status === 'cancelled');
            setCanceledClasses(allCompletedClasses);
        }
    }, [staffActiveCohort, staffDetail])

    // Filtering missed classes based on selected/active cohort
    const [missedClasses, setMissedClasses] = useState<ClassroomMain[]>([]);

    useEffect(() => {
        if (staffActiveCohort && staffDetail) {
            const allCompletedClasses = classrooms.filter((cls) => cls.cohortId._id === staffActiveCohort && cls.tutorId._id === staffDetail && cls.status === 'missed');
            setMissedClasses(allCompletedClasses);
        }
    }, [staffActiveCohort, staffDetail])

    // Filtering rescheduled classes based on selected/active cohort
    const [rescheduledClasses, setRescheduledClasses] = useState<ClassroomMain[]>([]);

    useEffect(() => {
        if (staffActiveCohort && staffDetail) {
            const allCompletedClasses = classrooms.filter((cls) => cls.cohortId._id === staffActiveCohort && cls.tutorId._id === staffDetail && cls.status === 'rescheduled');
            setRescheduledClasses(allCompletedClasses);
        }
    }, [staffActiveCohort, staffDetail])

    // Getting id of class to be started
    const [classId, setClassId] = useState<string>('');

    const handleStarting = (id: string) => {
        if (id) {
            setClassId(id);
            dispatch(handleStartClass());
        }
    }

    // Pagination
    const [pageNumber, setPageNumber] = useState(0);

    const prevClassPerPage = 10;
    const pageVisited = pageNumber * prevClassPerPage

    const displayPrvClass = completedClasses.slice(pageVisited, pageVisited + prevClassPerPage).map((coh, ind) => {
        return (
            <tr key={coh._id} className='border-t border-shadow text-start'>
                <td className='py-3 block md:table-cell'>{coh.title}</td>
                <td className='py-3 block md:table-cell'>{coh.cohortId.cohortName}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.date)}</td>
                <td className='py-3 block md:table-cell'>{coh.time}</td>
                <td className='py-3 block md:table-cell'>{coh.attendance.length}</td>
                <td className='py-3 block md:table-cell'>{coh.duration}</td>
                <Link href={`/dashboard/staff/classroom/${coh._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                    <IoEyeOutline />
                    <span>View</span>
                </Link>
            </tr>
        )
    })

    const changePage = ({ selected }: any) => {
        setPageNumber(selected)
    }

    // Navigating to tab
    const navigatingTab = (props: string) => {
        dispatch(updateTab(props));
        router.push(`/dashboard/staff/classroom/classes`)
    }

    return (
        <main className='w-full p-5'>
            <div className="classes grid md:grid-cols-2 gap-3">
                <div className="not_list p-3 border border-secondary rounded-md h-fit">
                    <div className="rec_head flex justify-between items-center">
                        <div className='flex gap-2 items-center'>
                            <LuListTodo />
                            <h3>Next class(es)</h3>
                        </div>
                        <Link href='/dashboard/staff/classroom/classes' className='text-shadow text-[12px]'>
                            See all
                        </Link>
                    </div>
                    <div className="not_item flex flex-col gap-3 mt-3">
                        {nextClasses.length > 0 ? nextClasses.map((cls) => (
                            <Link href={`/dashboard/staff/classroom/${cls._id}`} key={cls._id} className="not flex items-center justify-between p-2 bg-secondary rounded-md">
                                <div className='flex items-center gap-2'>
                                    <div className='flex items-center justify-center w-[30px] h-[30px] rounded-full border border-shadow'>
                                        <CgPlayTrackNextR className='text-shadow' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-[14px]'>{cls.title}</h3>
                                        <div className='flex items-center gap-2'>
                                            <span className='flex items-center gap-1 text-[10px]'>
                                                <FaRegCalendarAlt />
                                                <p>{formatDate(cls.date)}</p>
                                            </span>
                                            <span className='flex items-center gap-1 text-[10px]'>
                                                <CiClock2 />
                                                <p>{cls.time}</p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='flex items-center gap-1 text-[10px] text-shadow font-semibold p-1 border border-shadow rounded-md cursor-pointer'>
                                        <RiCalendarScheduleLine />
                                        <span>Reschedule</span>
                                    </div>
                                    <div onClick={() => handleStarting(cls._id)} className='flex items-center gap-2 text-[10px] text-white font-semibold py-1 px-2 bg-shadow rounded-md cursor-pointer'>
                                        <FaVideo />
                                        <span>Start</span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className='p-4 text-[14px] font-semibold w-full text-center'>
                                <p>No upcoming classes at the moment</p>
                            </div>
                        )
                        }
                    </div>
                </div>
                <div className="not_list p-3 border border-secondary rounded-md">
                    <div className="rec_head flex justify-between items-center">
                        <div className='flex gap-2 items-center'>
                            <LuListTodo />
                            <h3>Classrooms tracking</h3>
                        </div>
                        <Link href='/dashboard/staff/classroom/classes' className='text-shadow text-[12px]'>
                            See all
                        </Link>
                    </div>
                    <div className="not_item flex flex-col gap-3 mt-3">
                        <div onClick={() => navigatingTab('completed')} className="not flex items-center justify-between p-2 rounded-md cursor-pointer">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <FiThumbsUp />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Completed classes</h3>
                                </div>
                                <div className='font-bold text-shadow'>
                                    <h3>-- {completedClasses.length}</h3>
                                </div>
                            </div>
                            <div>
                                <FaChevronRight />
                            </div>
                        </div>
                        <div onClick={() => navigatingTab('missed')} className="not flex items-center justify-between p-2 rounded-md cursor-pointer">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <FiThumbsDown />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Missed classes</h3>
                                </div>
                                <div className='font-bold text-shadow'>
                                    <h3>-- {missedClasses.length}</h3>
                                </div>
                            </div>
                            <div>
                                <FaChevronRight />
                            </div>
                        </div>
                        <div onClick={() => navigatingTab('rescheduled')} className="not flex items-center justify-between p-2 rounded-md cursor-pointer">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <FaRegCalendarAlt />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Rescheduled classes</h3>
                                </div>
                                <div className='font-bold text-shadow'>
                                    <h3>-- {rescheduledClasses.length}</h3>
                                </div>
                            </div>
                            <div>
                                <FaChevronRight />
                            </div>
                        </div>
                        <div onClick={() => navigatingTab('cancelled')} className="not flex items-center justify-between p-2 rounded-md cursor-pointer">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <VscWarning />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Canceled classes</h3>
                                </div>
                                <div className='font-bold text-shadow'>
                                    <h3>-- {canceledClasses.length}</h3>
                                </div>
                            </div>
                            <div>
                                <FaChevronRight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="academic mt-10 p-3 border border-secondary rounded-md">
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-2 font-semibold'>
                        <IoIosCalendar />
                        <p>Previous classes</p>
                    </div>
                    <Link className='text-shadow' href='/dashboard/staff/classroom/classes'>see all</Link>
                </div>

                <div className="academic_cohort mt-4">
                    <table className='w-full border-b border-shadow'>
                        <thead>
                            <tr >
                                <th className='text-start py-3 block md:table-cell'>Class title</th>
                                <th className='text-start py-3 block md:table-cell'>Cohort</th>
                                <th className='text-start py-3 block md:table-cell'>Date</th>
                                <th className='text-start py-3 block md:table-cell'>Time</th>
                                <th className='text-start py-3 block md:table-cell'>Attendance</th>
                                <th className='text-start py-3 block md:table-cell'>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                completedClasses.length > 0 ? displayPrvClass : <tr><td className='' colSpan={4}>No completed class yet</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    previousLabel='Previous'
                    nextLabel='Next'
                    breakLabel="..."
                    pageCount={Math.ceil(completedClasses.length / prevClassPerPage)}
                    onPageChange={changePage}
                    containerClassName='paginationBtn'
                    previousLinkClassName='prvBtn'
                    nextLinkClassName='nxtBtn'
                    disabledClassName='dsbBtn'
                    activeClassName='actBtn'
                />
            </div>

            {
                startClass && <StartActivateClass _id={classId} />
            }
        </main>
    )
}

export default ClassMain