'use client';
import React, { useMemo, useState } from 'react';
import { TiMessages } from 'react-icons/ti';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { handleCert } from '@/store/dashMenu/dashStore';
import { deleteCertificate, fetchCertificates } from '@/store/certificate/certificateStore';
import { toast } from 'react-toastify';

interface CertificateMain {
  _id: string;
  studentId: {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    address: string;
    program: {
      courseId: string | any;
      cohortId: string | any;
      center: string | any;
      mode: string;
    }[];
    allowed: boolean;
    status: string;
    createdAt?: string;
  };
  certTitle: string;
  certificate: string;
}

function StudentIdHead() {
  const [option, setOption] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const studentDet = useSelector((state: RootState) => state.student.studentDetails);
  const certificates = useSelector((state: RootState) => state.certificate.certificates);
  const status = useSelector((state: RootState) => state.certificate.status);

  const handleOption = () => setOption((p) => !p);

  const haveCertificate = useMemo(() => {
    if (!studentDet?._id) return false;
    return certificates.some((cert) => cert.studentId?._id === studentDet._id);
  }, [certificates, studentDet]);

  const handleDeactivate = async () => {
    if (!studentDet?._id) return;

    const certsToDelete = certificates.filter((c) => c.studentId?._id === studentDet._id);

    if (certsToDelete.length === 0) {
      setOption(false);
      return;
    }

    try {
      for (const cert of certsToDelete) {
        const res = await dispatch(deleteCertificate(cert._id));
        if (deleteCertificate.rejected.match(res)) {
          throw new Error((res.payload as string) || res.error?.message || 'Delete failed');
        }
      }
      await dispatch(fetchCertificates());
      setOption(false);
      toast.success('Certificate deactivated');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to deactivate certificate');
    }
  };

  const loading = status === 'loading';

  return (
    <header className="w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent">
      <div className="logo">
        <h3 className="font-bold text-xl">Student / Profile</h3>
      </div>
      <div className="filter flex items-center gap-3">
        <div className="msg flex items-center gap-2 border border-accent text-accent px-3 py-1 rounded-md h-fit text-[14px]">
          <TiMessages />
          <span>Message</span>
        </div>
        <div
          onClick={handleOption}
          className="opt w-[30px] h-[30px] border border-slate-800 rounded-md flex items-center justify-center text-[14px] cursor-pointer"
        >
          <HiOutlineDotsHorizontal />
        </div>
      </div>

      {option && (
        <div className="opt_list grid gap-2 p-2 w-fit h-fit rounded-md fixed right-3 top-36 bg-white shadow shadow-shadow">
          {haveCertificate ? (
            <div className="text-[14px] cursor-default">
              <span>Certified</span>
            </div>
          ) : (
            <div onClick={() => dispatch(handleCert())} className="text-[14px] cursor-pointer">
              <span>Issue Certificate</span>
            </div>
          )}

          <div
            onClick={loading ? undefined : handleDeactivate}
            className={`text-[14px] ${loading ? 'opacity-60' : 'cursor-pointer'}`}
          >
            <span>{loading ? 'Deactivating…' : 'Deactivate'}</span>
          </div>
        </div>
      )}
    </header>
  );
}

export default StudentIdHead;
