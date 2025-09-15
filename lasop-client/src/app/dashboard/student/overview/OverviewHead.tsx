'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toast } from 'react-toastify';
import { CertificateMain } from '@/interfaces/interface';

function getFileNameFromHeaders(headers: Headers, fallback: string): string {
  // Requires server to expose header via: Access-Control-Expose-Headers: Content-Disposition
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

/** Normalize any stored cert URL to the current API base.
 *  Examples it fixes:
 *   - http://localhost:5000/files/<id>   → https://lasop-server-vault.fly.dev/files/<id>
 *   - /files/<id> or files/<id>         → https://.../files/<id>
 */
function normalizeCertUrl(rawUrl: string): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  if (!rawUrl) return rawUrl;

  // Try to extract /files/<objectId> from whatever is stored
  const m = rawUrl.match(/\/files\/([a-f0-9]{24})/i);
  const fileId = m?.[1];

  if (fileId && apiBase) {
    // Always rebuild absolute URL against the known API base
    const base = apiBase.replace(/\/+$/, '');
    return `${base}/files/${fileId}`;
  }

  // If we couldn't parse an ObjectId, fall back to original
  try {
    // If it's relative, resolve against current origin
    const u = new URL(rawUrl, (typeof window !== 'undefined' ? window.location.origin : undefined) as any);
    return u.toString();
  } catch {
    return rawUrl;
  }
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

  async function tryDownload(url: string): Promise<Response> {
    // 1st attempt: as-is
    let res: Response;
    try {
      res = await fetch(url, { method: 'GET', credentials: 'include' });
      if (res.ok) return res;
    } catch {}

    // 2nd attempt: normalized to API base (/files/<id>)
    const normalized = normalizeCertUrl(url);
    if (normalized !== url) {
      try {
        res = await fetch(normalized, { method: 'GET', credentials: 'include' });
        if (res.ok) return res;
      } catch {}
    }

    // 3rd attempt: open in new tab as last resort
    try { window.open(normalized, '_blank'); } catch {}
    throw new Error(`Download failed`);
  }

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
      const res = await tryDownload(url);

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
