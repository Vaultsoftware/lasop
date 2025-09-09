'use client';

import React, { useState, useEffect } from 'react';
import { IoFilter } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toast } from 'react-toastify';
import { CertificateMain } from '@/interfaces/interface';

function OverviewHead() {
    const certificate = useSelector((state: RootState) => state.certificate.certificates);
    const studentDetail = useSelector((state: RootState) => state.student.logDetails);

    const [studentCertificate, setStudentCertificate] = useState<CertificateMain | null>(null)
    const [certAvail, setCertAvail] = useState<boolean>(false)

    const [studentStatus, setStudentStatus] = useState<string>('');
    const [colorStatus, setColorStatus] = useState<string>('');

    useEffect(() => {
        const certExist = certificate.find((cert) => cert.studentId?._id === studentDetail?._id)

        if (certExist) {
            setCertAvail(true)
            setStudentCertificate(certExist)
        } else {
            setCertAvail(false);
            setStudentCertificate(null);
        }
    }, [certificate, studentDetail])

    useEffect(() => {
        if (studentDetail?.status === 'applicant') {
            setStudentStatus('pending');
            setColorStatus('bg-yellow-400')
        }
        else if (studentDetail?.status === 'student') {
            setStudentStatus('admitted')
            setColorStatus('bg-green-400')
        }
        else if (studentDetail?.status === 'rejected') {
            setStudentStatus('rejected')
            setColorStatus('bg-red-400')
        }
        else if (studentDetail?.status === 'expelled') {
            setStudentStatus('expelled')
            setColorStatus('bg-black')
        }
        else if (studentDetail?.status === 'graduate') {
            setStudentStatus('graduated')
            setColorStatus('bg-blue-400')
        }
        console.log(studentDetail)
    }, [studentDetail])

    const handleViewCertificate = () => {
        if (studentCertificate) {
            window.open(studentCertificate.certificate, '_blank');
        }
    };

    const displayError = () => {
        toast.info('Certificate not available yet')
    }

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Overview</h3>
                <div className='flex items-center gap-1'>
                    <p className='text-[12px] text-shadow font-semibold'>user status:</p>
                    <p className={`p-1 rounded-md ${colorStatus} text-white text-[12px]`}>{studentStatus}</p>
                </div>
            </div>
            <div className="filter flex items-center gap-3">
                <div className="from flex items-center gap-2">
                    {
                        certAvail ? <button onClick={handleViewCertificate} className='px-3 py-2 rounded-md bg-green-400 text-white text-[14px]'>Get Certificate</button> : <button onClick={displayError} className='px-3 py-2 rounded-md bg-slate-500 text-white text-[14px]'>Get Certificate</button>
                    }
                </div>
            </div>
        </header>
    )
}

export default OverviewHead