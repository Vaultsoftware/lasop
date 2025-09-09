import Image from 'next/image';
import React from 'react';
import { CgProfile } from "react-icons/cg";
import { LuBookMarked } from "react-icons/lu";

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

interface Props {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    address: string;
    dateOfEmploy: string;
    salary: string;
    otherInfo: OtherInfoData[];
    enrol: string;
    status: string;
}

function StaffMainDetails({ firstName, lastName, email, contact, address, dateOfEmploy, salary, otherInfo, enrol, status }: Props) {
    return (
        <div className='w-full p-5'>
            <div className='grid gap-5 p-3'>
                <div>
                    <div className='flex gap-1 items-center mb-3'>
                        <div className='flex items-center gap-2 w-fit'>
                            <CgProfile />
                            <h3 className='text-[14px] font-semibold'>PERSONAL INFORMATION</h3>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        <div className='w-fit'>
                            <Image className='w-[150px] h-[150px] object-cover rounded-md border border-shadow' src='' alt='' />
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Name</h3>
                                <p className='text-[14px] font-bold'>{firstName} {lastName}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Phone number</h3>
                                <p className='text-[14px] font-bold'>{contact}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Email address</h3>
                                <p className='text-[14px] font-bold'>{email}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Address</h3>
                                <p className='text-[14px] font-bold'>{address}</p>
                            </div>
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Job title</h3>
                                <p className='text-[14px] font-bold'>{enrol}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Date of employment</h3>
                                <p className='text-[14px] font-bold'>{dateOfEmploy}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Status</h3>
                                <p className='text-[14px] font-bold'>{status}</p>
                            </div>
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Net salary</h3>
                                <p className='text-[14px] font-bold'>{salary}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Commend</h3>
                                <p className='text-[14px] font-bold'>under development</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Queries</h3>
                                <p className='text-[14px] font-bold'>under development</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex gap-1 items-center mb-3'>
                        <div className='flex items-center gap-2 w-fit'>
                            <LuBookMarked />
                            <h3 className='text-[14px] font-semibold'>OTHER INFORMATION</h3>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Next of kin</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.kin?.fName?.length > 0 ? otherInfo[0].kin.fName : 'N/A'}
                                    {otherInfo?.[0]?.kin?.lName?.length > 0 ? ` ${otherInfo[0].kin.lName}` : ' N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Phone number</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.kin?.contact?.length > 0 ? otherInfo[0].kin.contact : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Address</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.kin?.address?.length > 0 ? otherInfo[0].kin.address : 'N/A'}
                                </p>
                            </div>

                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>1st Guarantor</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.guarantor1?.fName?.length > 0 ? otherInfo[0].guarantor1.fName : 'N/A'}
                                    {otherInfo?.[0]?.guarantor1?.lName?.length > 0 ? ` ${otherInfo[0].guarantor1.lName}` : ' N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Phone number</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.guarantor1?.contact?.length > 0 ? otherInfo[0].guarantor1.contact : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Address</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.guarantor1?.address?.length > 0 ? otherInfo[0].guarantor1.address : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>2nd Guarantor</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.guarantor2?.fName?.length > 0 ? otherInfo[0].guarantor2.fName : 'N/A'}
                                    {otherInfo?.[0]?.guarantor2?.lName?.length > 0 ? ` ${otherInfo[0].guarantor2.lName}` : ' N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Phone number</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.guarantor2?.contact?.length > 0 ? otherInfo[0].guarantor2.contact : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Address</h3>
                                <p className='text-[14px] font-bold'>
                                    {otherInfo?.[0]?.guarantor2?.address?.length > 0 ? otherInfo[0].guarantor2.address : 'N/A'}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffMainDetails