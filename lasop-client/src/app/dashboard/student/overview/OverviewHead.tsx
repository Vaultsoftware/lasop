// app/components/OverviewHead.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toast } from 'react-toastify';
import { CertificateMain } from '@/interfaces/interface';

function getFileNameFromHeaders(headers: Headers, fallback: string): string {
  const cd = headers.get('content-disposition') || '';
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
  const encoded = match?.[1];
  const plain = match?.[2];
  try {
    if (encoded) return decodeURIComponent(encoded);
    if (plain) return plain;
  } catch {/* ignore */}
  return fallback;
}

function getExtFromContentType(type?: string | null): string {
  if (!type) return 'pdf';
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('png')) return 'png';
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  if (type.includes('webp')) return 'webp';
  return 'bin';
}

function deriveStudentName(detail: unknown): string | undefined {
  // why: avoid TS property errors by probing common keys safely
  const d = (detail as Record<string, unknown>) || {};
  const val = (k: string) => (typeof d[k] === 'string' ? String(d[k]) : undefined);
  const join = (...keys: string[]) => keys.map(val).filter(Boolean).join(' ').trim() || undefined;
  return (
    val('fullName') ||
    val('name') ||
    join('firstName', 'lastName') ||
    join('first_name', 'last_name') ||
    join('surname', 'otherNames') ||
    (val('email') ? val('email')!.split('@')[0] : undefined) ||
    val('_id')
  );
}

export default function OverviewHead() {
  const certificate = useSelector((state: RootState) => state.certificate.certificates);
  const studentDetail = useSelector((state: RootState) => state.student.logDetails);

  const [studentCertificate, setStudentCertificate] = useState<CertificateMain | null>(null);
  const [certAvail, setCertAvail] = useState<boolean>(false);
  const [studentStatus, setStudentStatus] = useState<string>('');
  const [colorStatus, setColorStatus] = useState<string>('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const certExist = certificate.find((cert) => cert.studentId?._id === (studentDetail as any)?._id);
    if (certExist) {
      setCertAvail(true);
      setStudentCertificate(certExist);
    } else {
      setCertAvail(false);
      setStudentCertificate(null);
    }
  }, [certificate, studentDetail]);

  useEffect(() => {
    if ((studentDetail as any)?.status === 'applicant') {
      setStudentStatus('pending');
      setColorStatus('bg-yellow-400');
    } else if ((studentDetail as any)?.status === 'student') {
      setStudentStatus('admitted');
      setColorStatus('bg-green-400');
    } else if ((studentDetail as any)?.status === 'rejected') {
      setStudentStatus('rejected');
      setColorStatus('bg-red-400');
    } else if ((studentDetail as any)?.status === 'expelled') {
      setStudentStatus('expelled');
      setColorStatus('bg-black');
    } else if ((studentDetail as any)?.status === 'graduate') {
      setStudentStatus('graduated');
      setColorStatus('bg-blue-400');
    }
  }, [studentDetail]);

  const defaultFileName = useMemo(() => {
    const name = deriveStudentName(studentDetail) || 'certificate';
    return name.replace(/\s+/g, '_');
  }, [studentDetail]);

  async function handleDownloadCertificate() {
    if (!studentCertificate) {
      toast.info('Certificate not available yet');
      return;
    }

    const url = (studentCertificate as any).certificate as string | undefined;
    if (!url) {
      toast.error('Certificate URL is missing');
      return;
    }

    try {
      setDownloading(true);
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Download failed (${res.status})`);
      }

      const blob = await res.blob();
      const ext = getExtFromContentType(res.headers.get('content-type'));
      const fileFromHeader = getFileNameFromHeaders(res.headers, `${defaultFileName}.${ext}`);
      const fileName = fileFromHeader.includes('.') ? fileFromHeader : `${fileFromHeader}.${ext}`;

      const href = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(href);
      toast.success('Certificate downloaded');
    } catch (err: any) {
      // Fallback: open in new tab if direct download rejected (CORS or headers)
      try { window.open(url, '_blank'); } catch {/* ignore */}
      toast.error(err?.message || 'Could not download certificate');
    } finally {
      setDownloading(false);
    }
  }

  const displayError = () => toast.info('Certificate not available yet');

  return (
    <header className="w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent">
      <div className="logo">
        <h3 className="font-bold text-xl">Overview</h3>
        <div className="flex items-center gap-1">
          <p className="text-[12px] text-shadow font-semibold">user status:</p>
          <p className={`p-1 rounded-md ${colorStatus} text-white text-[12px]`}>{studentStatus}</p>
        </div>
      </div>
      <div className="filter flex items-center gap-3">
        <div className="from flex items-center gap-2">
          {certAvail ? (
            <button
              onClick={handleDownloadCertificate}
              disabled={downloading}
              className={`px-3 py-2 rounded-md text-white text-[14px] ${downloading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-400'}`}
              aria-busy={downloading}
            >
              {downloading ? 'Downloading…' : 'Get Certificate'}
            </button>
          ) : (
            <button onClick={displayError} className="px-3 py-2 rounded-md bg-slate-500 text-white text-[14px]">Get Certificate</button>
          )}
        </div>
      </div>
    </header>
  );
}
