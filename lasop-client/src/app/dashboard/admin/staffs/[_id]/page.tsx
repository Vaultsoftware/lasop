"use client";

import DashHead from '@/components/dashHead/DashHead';
import { RootState, AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StaffHeadDetails from './StaffHeadDetails';
import StaffMainDetails from './StaffMainDetails';

interface Params {
    _id: string;
}

interface Props {
    params: Params;
}

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

interface StaffData {
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

function page({ params }: Props) {
    const [pageData, setPageData] = useState<StaffData | null>(null);
    const router = useRouter();

    const staff = useSelector((state: RootState) => state.staff.staffs);

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (params._id === undefined) {
            router.push('/');
        } else {
            const data = staff.find((stu) => stu._id === params._id)
            setPageData(data || null)
        }
    }, [params, staff, router]);

    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            {
                pageData ? (
                    <>
                        <StaffHeadDetails role={pageData.role} />
                        <StaffMainDetails
                            firstName={pageData.firstName}
                            lastName={pageData.lastName}
                            email={pageData.email}
                            contact={pageData.contact}
                            address={pageData.address}
                            dateOfEmploy={pageData.dateOfEmploy}
                            salary={pageData.salary}
                            otherInfo={pageData.otherInfo}
                            enrol={pageData.enrol}
                            status={pageData.status}
                        />
                    </>
                ) : (
                    <h1>Loading...</h1>
                )
            }
        </div>
    )
}

export default page