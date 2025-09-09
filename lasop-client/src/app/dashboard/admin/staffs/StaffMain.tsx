'use client';

import { calendar } from '@/data/data';
import React, { useEffect, useState } from 'react';
import { GoDot } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from 'next/link';
import { IoEyeOutline } from "react-icons/io5";

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

function StaffMain() {
    const staffData = useSelector((state: RootState) => state.staff.staffs);

    const roles = [
        {
            id: 'academic',
            title: 'Academic'
        },
        {
            id: 'non-academic',
            title: 'Non-academic'
        }
    ]

    const statusTab: string[] = ['pending', 'probation', 'rejected', 'fired', 'suspended', 'permanent']

    const [staffToDisplay, setStaffToDisplay] = useState<StaffMain[]>([]);
    const [roleType, setRoleType] = useState<string>('academic');

    const [status, setStatus] = useState<string>('pending')

    const [nonAcademic, setNonAcademic] = useState<StaffMain[]>([]);
    const [academic, setAcademic] = useState<StaffMain[]>([]);

    useEffect(() => {
        if (staffData.length > 0) {
            const nonAcademicData = staffData.filter((staff) => staff.role === 'non-academic');
            setNonAcademic(nonAcademicData);
    
            const academicData = staffData.filter((staff) => staff.role === 'academic');
            setAcademic(academicData);
        }
    }, [staffData]);

    useEffect(() => {
        if (roleType === 'academic') {
            setStaffToDisplay(academic);
        } else {
            setStaffToDisplay(nonAcademic);
        }
    }, [academic, nonAcademic, roleType]);

    const handleToDisplay = (arg: string) => {
        if(arg === `academic` ) {
            setStaffToDisplay(academic);
            setRoleType(arg)
        }
        else if(arg === `non-academic`) {
            setStaffToDisplay(nonAcademic);
            setRoleType(arg)
        }
    }

    const handleDisplayStatus = (arg: string) => {
        setStatus(arg);
    };

    const [staffStatusDisplay, setStaffStatusDisplay] = useState<StaffMain[]>([]);

    useEffect(() => {
        if (staffToDisplay.length > 0 && status) {
            const getStaff = staffToDisplay.filter((staff) => staff.status === status);
            setStaffStatusDisplay(getStaff);
        }
    }, [staffToDisplay, status])

    return (
        <main className='w-full p-5'>
            <div className="academic">
                <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                    {
                        roles.map((cal) => (
                            <div
                                key={cal.id}
                                className={`${roleType === cal.id ? 'border-b-2 border-shadow text-shadow font-semibold' : ''}package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                onClick={() => handleToDisplay(cal.id)}
                            >
                                <span>{cal.title}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal bg-lightSec">
                    {
                        statusTab.map((cal, ind) => (
                            <div
                                key={ind}
                                className={`${status === cal ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                onClick={() => handleDisplayStatus(cal)}
                            >
                                <span>{cal}</span>
                            </div>
                        ))
                    }
                </div>

                <div className="academic_cohort mt-4">
                    <table className='w-full border-b border-shadow'>
                        <thead>
                            <tr >
                                <th className='text-start py-3 block md:table-cell'>S/N</th>
                                <th className='text-start py-3 block md:table-cell'>NAME</th>
                                <th className='text-start py-3 block md:table-cell'>EMAIL</th>
                                <th className='text-start py-3 block md:table-cell'>PHONE NO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                staffStatusDisplay.map((staff, ind) => (
                                    <tr key={staff._id} className='border-t border-shadow text-start'>
                                        <td className='py-3 block md:table-cell'>{ind + 1}</td>
                                        <td className='py-3 block md:table-cell'>{staff.firstName} {staff.lastName}</td>
                                        <td className='py-3 block md:table-cell'>{staff.email}</td>
                                        <td className='py-3 block md:table-cell'>{staff.contact}</td>
                                        <Link href={`/dashboard/admin/staffs/${staff._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                                            <IoEyeOutline />
                                            <span>View</span>
                                        </Link>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}

export default StaffMain