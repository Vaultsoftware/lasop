// =============================================================
// File: src/components/.../Started3.tsx (FULLY SYNCED + OVERLAY SPINNERS)
// Unified overlay spinner for parsing/submitting; safe disables while busy
// =============================================================
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCourseDetail } from '@/store/courseSlice/courseStore';
import { goBack } from '@/store/pageStore/pageStore';
import { toast } from 'react-toastify';
import { postStudent } from '@/store/studentStore/studentStore';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import lasopLogo from '../../../asset/form/logo.png';

// Spinner icon (no external lib needed)
function BigSpinner() {
  return (
    <svg
      className="animate-spin h-8 w-8 text-white"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-100"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

type VerifyMode = 'strict' | 'loose' | 'fuzzy' | 'digits' | 'words' | 'parsed';
type VerifyResult =
  | { matched: true; snippet?: string; mode?: VerifyMode; detectedAmount?: number }
  | { matched: false };

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contact: string;
  houseNo: string;
  streetName: string;
  city: string;
  program: {
    courseId: string;
    cohortId: string;
    center: string;
    mode: string;
  };
  allowed: boolean;
  status: string;
  amountPaid?: number;
}

const WHATSAPP_E164 = '2347025713326';
const MIN_PART_PAYMENT = 200_000;
const LS_KEY = 'lasop_started3_v1';
const SHARE_TTL_MS = 2 * 60 * 60 * 1000;
const ACCOUNT_TOKENS = ['lagos', 'school', 'programming'] as const;
const ACCOUNT_NAME_LABEL = 'Lagos School of Programming';

/* ------- tiny local helpers for Pixel↔CAPI dedupe (add-only) ------- */
const readCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
};
const buildFbcFromUrl = (): string | undefined => {
  try {
    const u = new URL(typeof window !== 'undefined' ? window.location.href : '');
    const fbclid = u.searchParams.get('fbclid');
    if (!fbclid) return undefined;
    const ts = Math.floor(Date.now() / 1000);
    return `fb.1.${ts}.${fbclid}`;
  } catch { return undefined; }
};
const getFbpFbc = (): { fbp?: string; fbc?: string } => {
  const fbp = readCookie('_fbp');
  const fbc = readCookie('_fbc') || buildFbcFromUrl();
  return { fbp, fbc };
};
const safeUUID = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const r = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `${Date.now().toString(16)}-${r(16)}`;
};

function Started3() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPartPay, setIsPartPay] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
  const [proof, setProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [parsing, setParsing] = useState<boolean>(false);
  const [receiptText, setReceiptText] = useState<string>('');
  const [receiptHasAmount, setReceiptHasAmount] = useState<boolean>(false);
  const [matchSnippet, setMatchSnippet] = useState<string>('');
  const [matchMode, setMatchMode] = useState<VerifyMode | undefined>(undefined);
  const [detectedAmount, setDetectedAmount] = useState<number | undefined>(undefined);
  const [needsReupload, setNeedsReupload] = useState<boolean>(false);
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [accountNameOK, setAccountNameOK] = useState<boolean>(false);
  const [accountNameMatched, setAccountNameMatched] = useState<string[]>([]);
  const [accountNameSnippet, setAccountNameSnippet] = useState<string>('');
  const [shareStartedAt, setShareStartedAt] = useState<number | null>(null);
  const [shareConfirmed, setShareConfirmed] = useState<boolean>(false);

  const course = useSelector((state: RootState) => state.pageData.payment);
  const courseDetail = useSelector((state: RootState) => state.courses.courseDetail);
  const studentDataSub = useSelector((state: RootState) => state.pageData.studentData) as Partial<StudentData>;
  const { title, price } = courseDetail || {};

  useEffect(() => {
    if (course.courseId) dispatch(fetchCourseDetail(course.courseId));
  }, [course.courseId, dispatch]);

  // Restore persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      setIsPartPay(Boolean(s.isPartPay));
      setAmount(String(s.amount ?? ''));
      setReceiptText(String(s.receiptText ?? ''));
      setMatchSnippet(String(s.matchSnippet ?? ''));
      setReceiptHasAmount(Boolean(s.receiptHasAmount));
      setShareStartedAt(s.shareStartedAt ?? null);
      setShareConfirmed(Boolean(s.shareConfirmed));
      setAccountNameOK(Boolean(s.accountNameOK));
      setAccountNameMatched(Array.isArray(s.accountNameMatched) ? s.accountNameMatched : []);
      setAccountNameSnippet(String(s.accountNameSnippet ?? ''));
      setDetectedAmount(
        typeof s.detectedAmount === 'number' && Number.isFinite(s.detectedAmount) ? s.detectedAmount : undefined
      );
      if (s.receiptText) setNeedsReupload(true);
    } catch {}
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          isPartPay,
          amount,
          receiptText,
          matchSnippet,
          receiptHasAmount,
          shareStartedAt,
          shareConfirmed,
          accountNameOK,
          accountNameMatched,
          accountNameSnippet,
          detectedAmount,
        })
      );
    } catch {}
  }, [
    isPartPay,
    amount,
    receiptText,
    matchSnippet,
    receiptHasAmount,
    shareStartedAt,
    shareConfirmed,
    accountNameOK,
    accountNameMatched,
    accountNameSnippet,
    detectedAmount,
  ]);

  // Full vs Part pay
  useEffect(() => {
    if (!isPartPay) {
      setAmount(price ? String(price) : '');
      setAmountError('');
    }
  }, [isPartPay, price]);

  const validateStudentData = (s: Partial<StudentData>) => {
    const hasProgram = !!(s.program?.courseId && s.program?.cohortId && s.program?.center && s.program?.mode);
    return !!(
      s.firstName &&
      s.lastName &&
      s.email &&
      s.password &&
      s.contact &&
      s.houseNo &&
      s.streetName &&
      s.city &&
      hasProgram
    );
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  };

  const revokePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
  };

  const handleProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setProof(f);
    setReceiptText('');
    setReceiptHasAmount(false);
    setMatchSnippet('');
    setMatchMode(undefined);
    setDetectedAmount(undefined);
    setAccountNameOK(false);
    setAccountNameMatched([]);
    setAccountNameSnippet('');
    setNeedsReupload(false);
    revokePreview();
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setParsing(true); // overlay will show "Verifying payment…"
    try {
      const text = await extractTextFromFile(f);
      setReceiptText(text || '');
    } catch {
      toast.error('Could not read receipt text. Try a clearer file.');
    } finally {
      setParsing(false);
    }
  };

  const shareToWhatsApp = async () => {
    if (!proof) {
      toast.error('Select a file first');
      return;
    }
    const text = `Hello LASOP, please find my proof of payment for ${title || 'my application'}.`;
    const encoded = encodeURIComponent(
      `${text}\nApplicant: ${studentDataSub.firstName || ''} ${studentDataSub.lastName || ''}`
    );
    const now = Date.now();
    setShareStartedAt(now);
    setShareConfirmed(false);
    try {
      const raw = localStorage.getItem(LS_KEY);
      const s = raw ? JSON.parse(raw) : {};
      localStorage.setItem(LS_KEY, JSON.stringify({ ...s, shareStartedAt: now, shareConfirmed: false }));
    } catch {}
    try {
      // @ts-ignore
      if (navigator.canShare && navigator.canShare({ files: [proof] })) {
        await navigator.share({ files: [proof], text, title: 'Proof of Payment' });
        toast.success('Share dialog opened. Please send on WhatsApp.');
        return;
      }
    } catch {}
    window.location.href = `https://wa.me/${WHATSAPP_E164}?text=${encoded}`;
  };

  const normalizedAmount = useMemo(() => {
    const n = Number(String(amount).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? Math.floor(n) : 0;
  }, [amount]);

  // Validate part-pay amount input
  useEffect(() => {
    if (!isPartPay) {
      setAmountError('');
      return;
    }
    if (!amount) {
      setAmountError('Enter an amount');
    } else if (normalizedAmount < MIN_PART_PAYMENT) {
      setAmountError(`Amount can't be less than ₦${MIN_PART_PAYMENT.toLocaleString()}`);
    } else {
      setAmountError('');
    }
  }, [amount, isPartPay, normalizedAmount]);

  // === Core receipt verification: PASS if receipt amount >= typed/course amount ===
  useEffect(() => {
    if (!receiptText || !normalizedAmount) {
      setReceiptHasAmount(false);
      setMatchSnippet('');
      setMatchMode(undefined);
      setDetectedAmount(undefined);
      setAccountNameOK(false);
      setAccountNameMatched([]);
      setAccountNameSnippet('');
      return;
    }
    const direct = verifyAmount(receiptText, normalizedAmount);
    if (direct.matched) {
      setReceiptHasAmount(true);
      setMatchSnippet(direct.snippet || '');
      setMatchMode(direct.mode);
      setDetectedAmount(
        typeof direct.detectedAmount === 'number' ? direct.detectedAmount : normalizedAmount
      );
    } else {
      const parsed = detectReceiptAmountAtLeast(receiptText, normalizedAmount);
      setReceiptHasAmount(parsed.ok);
      setMatchSnippet(parsed.snippet || '');
      setMatchMode(parsed.ok ? 'parsed' : undefined);
      setDetectedAmount(parsed.bestAmount ?? undefined);
    }

    const nameRes = verifyAccountName(receiptText);
    setAccountNameOK(nameRes.ok);
    setAccountNameMatched(nameRes.matchedTokens);
    setAccountNameSnippet(nameRes.snippet || '');
  }, [receiptText, normalizedAmount]);

  const rerunVerification = () => {
    if (!receiptText) {
      toast.error('Upload payment receipt first.');
      return;
    }
    if (!normalizedAmount) {
      toast.error('Enter an amount.');
      return;
    }
    const direct = verifyAmount(receiptText, normalizedAmount);
    let ok = false;
    let snip = '';
    let mode: VerifyMode | undefined = undefined;
    let det: number | undefined = undefined;

    if (direct.matched) {
      ok = true;
      snip = direct.snippet || '';
      mode = direct.mode;
      det = typeof direct.detectedAmount === 'number' ? direct.detectedAmount : normalizedAmount;
    } else {
      const parsed = detectReceiptAmountAtLeast(receiptText, normalizedAmount);
      ok = parsed.ok;
      snip = parsed.snippet || '';
      mode = ok ? 'parsed' : undefined;
      det = parsed.bestAmount ?? undefined;
    }

    setReceiptHasAmount(ok);
    setMatchSnippet(snip);
    setMatchMode(mode);
    setDetectedAmount(det);

    const nameRes = verifyAccountName(receiptText);
    setAccountNameOK(nameRes.ok);
    setAccountNameMatched(nameRes.matchedTokens);
    setAccountNameSnippet(nameRes.snippet || '');

    toast[ok && nameRes.ok ? 'success' : 'error'](
      ok && nameRes.ok ? 'Verified against receipt.' : 'Verification failed: amount and/or account name.'
    );
  };

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);
  const isShareRecent = (ts: number | null) => !!ts && Date.now() - ts < SHARE_TTL_MS;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStudentData(studentDataSub)) {
      toast.error('Please fill out all required fields.');
      return;
    }
    if (!proof) {
      toast.error('Upload payment receipt to continue.');
      return;
    }
    if (isPartPay && amountError) {
      toast.error(amountError);
      return;
    }
    if (!receiptHasAmount) {
      toast.error('Receipt amount does not meet the required amount yet.');
      return;
    }
    if (!accountNameOK) {
      toast.error(`Receipt account name must include at least two of: ${ACCOUNT_NAME_LABEL}.`);
      return;
    }
    if (!isShareRecent(shareStartedAt)) {
      toast.error('Please send your receipt to WhatsApp first.');
      return;
    }
    if (!shareConfirmed) {
      toast.error('Please confirm you have sent it on WhatsApp.');
      return;
    }

    setLoading(true); // overlay will show "Submitting application…"
    try {
      const payload: StudentData = {
        ...(studentDataSub as StudentData),
        amountPaid: normalizedAmount || Number(price) || 0,
      };
      const response = await dispatch(postStudent(payload as any));
      if (postStudent.fulfilled.match(response)) {
        localStorage.removeItem(LS_KEY);

        // ✅ Facebook Pixel + Conversion API (add-only dedupe + cookies + customer)
        try {
          const amountVal = normalizedAmount || Number(price) || 0;

          // Generate event_id + read cookies for fbp/fbc
          const event_id = safeUUID();
          const { fbp, fbc } = getFbpFbc();

          // Fire browser Pixel WITH eventID for dedupe
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', { value: amountVal, currency: 'NGN' }, { eventID: event_id });
          }

          // Send CAPI with same event_id and cookies + richer customer fields (optional)
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://lasop-server-vault.fly.dev'}/facebook/conversion`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event_name: 'Purchase',
                event_id,               // <-- dedupe
                fbp, fbc,               // <-- cookies
                value: amountVal,
                currency: 'NGN',
                event_source_url: typeof window !== 'undefined' ? window.location.href : '',
                customer: {
                  email: studentDataSub.email,
                  phone: studentDataSub.contact,
                  first_name: studentDataSub.firstName,
                  last_name: studentDataSub.lastName,
                  city: studentDataSub.city,
                  country: 'NG',
                },
              }),
            }
          );
        } catch (err) {
          console.error('⚠️ Facebook tracking failed:', err);
        }

        toast.success('Application complete', {
          autoClose: 2500,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => router.push('/login'),
        });
      } else {
        toast.error(response.error?.message || 'Failed to complete application.');
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unexpected error.');
      setLoading(false);
    }
  };

  const overlayVisible = loading || parsing;
  const completeDisabled = overlayVisible;

  return (
    <>
      {/* Full-screen overlay used for BOTH parsing and submitting */}
      {overlayVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90">
          <div className="w-[90%] max-w-md rounded-2xl border border-white/20 bg-slate-900 p-6 text-center text-slate-100 shadow-xl">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
              <BigSpinner />
            </div>
            <h3 className="text-lg font-semibold">
              {loading ? 'Submitting application…' : 'Verifying payment…'}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Please hold while we verify your receipt and sync your application.
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full"
                style={{
                  width: '100%',
                  background:
                    'linear-gradient(90deg, rgba(59,130,246,1) 0%, rgba(99,102,241,1) 100%)',
                  animation: 'loadbar 1.8s ease-in-out infinite',
                }}
              />
            </div>
            <style>{`
              @keyframes loadbar {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        </div>
      )}

      <main className="w-full md:w-[45vw] h-full">
        <div className="p-10 flex flex-col justify-center">
          <div className="mb-5">
            <FaArrowLeft
              className="text-[20px] text-accent mb-3 cursor-pointer"
              onClick={() => dispatch(goBack())}
            />
            <h1 className="font-bold text-[25px]">
              <Image className="w-[120px] h-[80px]" src={lasopLogo} alt="" />
            </h1>
            <h3 className="text-shadow font-semibold">Complete Your Application</h3>
          </div>

          {needsReupload && (
            <div className="mb-4 text-[12px] p-3 rounded border border-amber-300 bg-amber-50 text-amber-700">
              You previously uploaded a receipt. For security reasons, please re-upload the file to
              complete verification.
            </div>
          )}

          <div className="w-full rounded-md shadow-md shadow-slate-600">
            <form onSubmit={handleSubmit} className="w-full p-7">
              <div className="mb-3">
                <span className="text-[12px] font-semibold">Step 4/4</span>
                <h3 className="font-bold">{title}</h3>
              </div>

              <div className="grid gap-4">
                {/* Payment Type */}
                <div className="grid gap-2">
                  <label className="text-[12px]">Payment Type:</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPartPay(false)}
                      className={`h-8 px-3 rounded-md border text-[12px] ${
                        !isPartPay ? 'bg-accent text-white border-accent' : ''
                      }`}
                      disabled={overlayVisible}
                      aria-disabled={overlayVisible}
                    >
                      Full Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPartPay(true)}
                      className={`h-8 px-3 rounded-md border text-[12px] ${
                        isPartPay ? 'bg-accent text-white border-accent' : ''
                      }`}
                      disabled={overlayVisible}
                      aria-disabled={overlayVisible}
                    >
                      Part Payment
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div className="grid gap-2">
                  <label className="text-[12px]">Amount due:</label>
                  {isPartPay ? (
                    <div>
                      <div className="relative">
                        <input
                          inputMode="numeric"
                          pattern="[0-9,₦.]*"
                          placeholder="Enter amount e.g. 200,000"
                          value={amount}
                          onChange={handleAmountInput}
                          disabled={overlayVisible}
                          className={`w-full h-[35px] pr-28 px-2 outline-none border text-[12px] rounded-md font-bold ${
                            receiptHasAmount ? 'border-green-500' : 'border-shadow'
                          } ${overlayVisible ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                        {receiptHasAmount && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 flex items-center gap-1 text-[12px]">
                            <FaCheckCircle className="text-green-600" />{' '}
                            {matchMode === 'strict' ? 'Matched' : `Matched (${matchMode})`}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={rerunVerification}
                          disabled={overlayVisible}
                          className={`h-8 px-3 rounded-md border text-[12px] ${
                            overlayVisible ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Re-run verification"
                          aria-disabled={overlayVisible}
                        >
                          Re-run verification
                        </button>
                        {amountError && <p className="text-[11px] text-red-600">{amountError}</p>}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Minimum part payment: ₦{MIN_PART_PAYMENT.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <span className="w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md font-bold flex items-center">
                      {price?.toLocaleString?.() ?? price}
                    </span>
                  )}
                </div>

                {/* Payment Details + Copy */}
                <div className="grid gap-2">
                  <label className="text-[12px]">Payment method:</label>
                  <div className="rounded-md border border-shadow p-3 text-[12px]">
                    <div className="font-semibold mb-2">Bank Transfer</div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="text-[12px]">Account No:</div>
                          <div className="font-bold select-all">1223017613</div>
                        </div>
                        <button
                          type="button"
                          className="h-8 px-3 rounded-md border text-[12px]"
                          onClick={() => copyToClipboard('1223017613', 'Account No')}
                          disabled={overlayVisible}
                          aria-disabled={overlayVisible}
                        >
                          Copy
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="text-[12px]">Name:</div>
                          <div className="font-bold select-all">Lagos School of Programming Ltd</div>
                        </div>
                        <button
                          type="button"
                          className="h-8 px-3 rounded-md border text-[12px]"
                          onClick={() =>
                            copyToClipboard('Lagos School of Programming Ltd', 'Name')
                          }
                          disabled={overlayVisible}
                          aria-disabled={overlayVisible}
                        >
                          Copy
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="text-[12px]">Bank:</div>
                          <div className="font-bold select-all">Zenith</div>
                        </div>
                        <button
                          type="button"
                          className="h-8 px-3 rounded-md border text-[12px]"
                          onClick={() => copyToClipboard('Zenith', 'Bank')}
                          disabled={overlayVisible}
                          aria-disabled={overlayVisible}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2">
                      Receipt must include at least two of: <b>Lagos</b>, <b>School</b>,{' '}
                      <b>Programming</b> (fuzzy match allowed).
                    </p>
                  </div>
                </div>

                {/* Upload + Preview + Verify + Share */}
                <div className="grid gap-2">
                  <label className="text-[12px]">Upload proof of payment:</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleProofChange}
                    className="w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md bg-white"
                    disabled={overlayVisible}
                    aria-disabled={overlayVisible}
                  />

                  {/* Preview */}
                  {previewUrl && (
                    <div className="mt-2 border rounded-md p-2">
                      {proof?.type === 'application/pdf' ? (
                        <embed src={previewUrl} type="application/pdf" className="w-full h-64 rounded" />
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Receipt preview"
                          className="w-full max-h-64 object-contain rounded"
                        />
                      )}
                    </div>
                  )}

                  {/* Parsing status + match (inline parsing message removed; overlay covers it) */}
                  <div className="text-[11px]">
                    {!parsing && (proof || receiptText) && (
                      <>
                        {/* Amount status (>= check) */}
                        {receiptHasAmount ? (
                          <div className="space-y-1">
                            <span className="text-green-700">
                              ✓ Receipt amount{' '}
                              {typeof detectedAmount === 'number'
                                ? `₦${detectedAmount.toLocaleString()}`
                                : `₦${normalizedAmount.toLocaleString()}`}
                              {' '}meets requirement (≥ ₦{normalizedAmount.toLocaleString()}).
                              {matchMode ? ` (${matchMode})` : ''}
                            </span>
                            {matchSnippet && (
                              <div className="mt-1">
                                <div className="text-gray-500">Matched snippet:</div>
                                <pre className="mt-0.5 bg-gray-50 border rounded px-2 py-1 text-[10px] whitespace-pre-wrap break-words">
{matchSnippet}
                                </pre>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-red-700">
                            {!normalizedAmount
                              ? 'Type an amount to verify against the receipt.'
                              : 'Receipt does not yet show an amount that meets the required amount.'}
                          </span>
                        )}

                        {/* Account name status */}
                        <div className="mt-2">
                          {accountNameOK ? (
                            <span className="text-green-700">
                              ✓ Account name matches ({accountNameMatched.join(', ')}).
                            </span>
                          ) : (
                            <span className="text-red-700">
                              Account name not confirmed. Must include at least two of: Lagos, School, Programming.
                            </span>
                          )}
                          {accountNameSnippet && (
                            <div className="mt-1">
                              <div className="text-gray-500">Name snippet:</div>
                              <pre className="mt-0.5 bg-gray-50 border rounded px-2 py-1 text-[10px] whitespace-pre-wrap break-words">
{accountNameSnippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* WhatsApp flow */}
                  <button
                    type="button"
                    className={`mt-2 h-9 w-full rounded-md border text-[12px] ${
                      overlayVisible ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={shareToWhatsApp}
                    aria-label="Send to WhatsApp"
                    title="Send to WhatsApp"
                    disabled={overlayVisible}
                    aria-disabled={overlayVisible}
                  >
                    Send to WhatsApp (+{WHATSAPP_E164})
                  </button>

                  {/* Status + Confirm */}
                  <div className="text-[11px]">
                    {isShareRecent(shareStartedAt) ? (
                      <div className="mt-1">
                        <div className="text-green-700">
                          WhatsApp opened. After sending, come back and confirm below.
                        </div>
                        <label className="mt-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={shareConfirmed}
                            onChange={(e) => setShareConfirmed(e.target.checked)}
                            className="h-3 w-3"
                            disabled={overlayVisible}
                            aria-disabled={overlayVisible}
                          />
                          <span>I have sent the receipt via WhatsApp to +{WHATSAPP_E164}.</span>
                        </label>
                      </div>
                    ) : (
                      <div className="mt-1 text-gray-600">
                        You must send your receipt to WhatsApp before completing the application.
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500">
                    On mobile devices, the system may open a native share dialog. On desktop, WhatsApp Web opens in
                    the same tab. Use the Back button to return here after sending.
                  </p>

                  {/* Debug toggle */}
                  {receiptText && (
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={() => setShowRaw((s) => !s)}
                        className="h-7 px-2 rounded-md border text-[11px]"
                        title="Toggle extracted text for debugging"
                        disabled={overlayVisible}
                        aria-disabled={overlayVisible}
                      >
                        {showRaw ? 'Hide extracted text' : 'Show extracted text'}
                      </button>
                      {showRaw && (
                        <pre className="mt-1 max-h-48 overflow-auto bg-gray-50 border rounded p-2 text-[10px] whitespace-pre-wrap break-words">
{receiptText.slice(0, 4000)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  disabled={completeDisabled}
                  className={`w-full h-[35px] text-[12px] rounded-md ${
                    completeDisabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-accent text-cyan-50'
                  }`}
                >
                  Complete Application
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-[12px] text-center">
            <span>
              I have an account.{' '}
              <Link href="/login" className="font-bold text-accent">
                Log in
              </Link>
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

export default Started3;

/* ================= Helpers (amount >= check + fuzzy name check) ================= */

/**
 * Primary verifier:
 * - First tries to match the EXACT typed amount via strict/loose/fuzzy/words (for nice UX).
 * - If not found, a secondary pass (detectReceiptAmountAtLeast) will parse all monetary tokens
 *   and PASS if any detected amount >= required (supports tips/overpayment).
 */
function verifyAmount(text: string, amount: number): VerifyResult {
  const strictNorm = normalizeOcrText(text);
  const amt = Math.floor(Math.abs(amount));
  const amtStr = String(amt);
  const amtStrCents = String(amt * 100);

  for (const rx of buildAmountRegexes(amt)) {
    const m = strictNorm.match(rx);
    if (m?.[0]) return { matched: true, snippet: liftToOriginalSnippet(text, m[0]), mode: 'strict', detectedAmount: amt };
  }

  {
    const looseRx = buildLooseDigitRegex(amt);
    const loose = text.match(looseRx);
    if (loose?.[0]) return { matched: true, snippet: loose[0], mode: 'loose', detectedAmount: amt };
  }

  {
    const src = canonicalDigits(text);
    const tokens = getMoneyLikeTokens(src);
    for (const t of tokens) {
      const compact = t.replace(/[^0-9]/g, '').replace(/^0+/, '');
      if (closeEnoughDigits(compact, amtStr) || closeEnoughDigits(compact, amtStrCents)) {
        return { matched: true, snippet: t.trim(), mode: 'fuzzy', detectedAmount: amt };
      }
    }
  }

  {
    const digitsOnly = canonicalDigits(text).replace(/[^0-9]/g, '');
    if (digitsOnly.includes(amtStr)) return { matched: true, snippet: amtStr, mode: 'digits', detectedAmount: amt };
    if (digitsOnly.includes(amtStrCents)) return { matched: true, snippet: amtStrCents, mode: 'digits', detectedAmount: amt };
  }

  {
    const wordsRx = buildAmountInWordsRegex(amt);
    if (wordsRx) {
      const m = normalizeForWords(text).match(wordsRx);
      if (m?.[0]) return { matched: true, snippet: m[0], mode: 'words', detectedAmount: amt };
    }
  }

  return { matched: false };
}

/**
 * Secondary verifier:
 * - Parse ALL money-like tokens in the receipt and PASS if any amount >= required.
 * - Returns the best (largest) qualifying amount + a snippet.
 */
function detectReceiptAmountAtLeast(text: string, required: number): { ok: boolean; bestAmount: number | null; snippet: string } {
  const tokens = collectMoneyCandidates(text);
  const candidates: Array<{ val: number; tok: string; idx: number; score: number }> = [];
  const seen = new Set<string>();
  const hay = text.toLowerCase();

  const posHints = ['total', 'amount', 'amount paid', 'paid', 'debit', 'credit', 'ngn', '₦', 'you paid', 'cash received', 'grand total'];
  const negHints = ['transaction id', 'rrn', 'stan', 'reference', 'ref', 'account', 'acct', 'terminal', 'pos', 'auth', 'card', 'pan'];

  for (const { tok, idx } of tokens) {
    const n = parseMoneyTokenToNaira(tok);
    if (n == null) continue;
    const whole = Math.floor(Math.abs(n));
    const key = `${tok}@${idx}:${whole}`;
    if (seen.has(key)) continue;
    seen.add(key);

    let score = 0;
    if (/[₦]|NGN/i.test(tok)) score += 6;
    if (/\d+[.,]\d{2}\b/.test(tok)) score += 2;

    const tail = hay.slice(Math.max(0, idx - 50), Math.min(hay.length, idx + tok.length + 50));
    if (posHints.some((p) => tail.includes(p))) score += 4;
    if (negHints.some((p) => tail.includes(p))) score -= 6;

    if (whole >= required) score += 6;
    else if (whole >= required * 0.9) score += 2;

    candidates.push({ val: whole, tok, idx, score });
  }

  if (!candidates.length) return { ok: false, bestAmount: null, snippet: '' };

  candidates.sort((a, b) => (b.score - a.score) || (b.val - a.val));
  const best = candidates[0];
  const ok = best.val >= Math.floor(Math.abs(required));
  return { ok, bestAmount: best.val, snippet: best.tok.trim() };
}

/* === Account name verifier with fuzzy (≤1 edit) === */
function verifyAccountName(text: string): { ok: boolean; matchedTokens: string[]; snippet?: string } {
  const norm = normalizeForWords(text);
  const wordsArr = norm.split(' ').filter(Boolean);
  const wordsSet = new Set(wordsArr);

  const hits: string[] = [];

  for (const tok of ACCOUNT_TOKENS) {
    if (wordsSet.has(tok)) {
      hits.push(capitalize(tok));
      continue;
    }
    const foundFuzzy = wordsArr.some((w) => isWithinOneEdit(w, tok));
    if (foundFuzzy) hits.push(capitalize(tok));
  }

  let snippet = '';
  const firstHitLower = hits[0]?.toLowerCase();
  if (firstHitLower) {
    const idx = wordsArr.findIndex((w) => w === firstHitLower || isWithinOneEdit(w, firstHitLower));
    if (idx >= 0) {
      const start = Math.max(0, idx - 6);
      const end = Math.min(wordsArr.length, idx + 7);
      snippet = wordsArr.slice(start, end).join(' ');
    }
  }

  return { ok: hits.length >= 2, matchedTokens: hits.slice(0, 3), snippet };
}

/* === ≤1 edit distance (insert/delete/substitute) === */
function isWithinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (la > lb) return isWithinOneEdit(b, a);

  let i = 0, j = 0, edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++; j++;
      continue;
    }
    if (edits === 1) return false;
    edits++;
    if (la === lb) { i++; j++; } else { j++; }
  }
  if (j < lb || i < la) edits++;
  return edits <= 1;
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Money-like tokens for fuzzy path (drop-in fix)
function getMoneyLikeTokens(s: string): string[] {
  if (!s) return [];
  const raw = s.match(/[0-9][0-9\.\,\s_:-]*/g) || [];
  return raw
    .map((tok) => tok.trim())
    .filter((tok) => {
      const hasSep = /[.,]/.test(tok);
      const hasDot00 = /\.\s*0{2}\b|,\s*0{2}\b/.test(tok);
      const digits = tok.replace(/[^0-9]/g, '');
      return (hasSep || hasDot00) && digits.length >= 4 && digits.length <= 10;
    });
}

// Exact or ≤1 digit difference
function closeEnoughDigits(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diff += 1;
      if (diff > 1) return false;
    }
  }
  return true;
}

function liftToOriginalSnippet(original: string, normSnippet: string): string {
  try {
    const pat = buildOriginalMatchPattern(normSnippet);
    const mo = original.match(new RegExp(pat, 'i'));
    return mo?.[0] || normSnippet;
  } catch {
    return normSnippet;
  }
}

function normalizeOcrText(input: string): string {
  return unicodeSpaceCollapse(input)
    .normalize('NFKD')
    .replace(/NGN/gi, 'ngn')
    .replace(/(?<=\d)[oO](?=\d)/g, '0')
    .replace(/([.,])\s*[oO]{1,2}\b/g, '$10')
    .replace(/[’`]/g, "'")
    .toLowerCase();
}

function canonicalDigits(s: string): string {
  return unicodeSpaceCollapse(s)
    .normalize('NFKD')
    .replace(/\u0660/g, '0').replace(/\u0661/g, '1').replace(/\u0662/g, '2').replace(/\u0663/g, '3').replace(/\u0664/g, '4')
    .replace(/\u06F9/g, '9')
    .replace(/\u06F0/g, '0').replace(/\u06F1/g, '1').replace(/\u06F2/g, '2').replace(/\u06F3/g, '3').replace(/\u06F4/g, '4')
    .replace(/\u06F5/g, '5').replace(/\u06F6/g, '6').replace(/\u06F7/g, '7').replace(/\u06F8/g, '8').replace(/\u06F9/g, '9')
    .replace(/O/g, '0').replace(/o/g, '0');
}

function unicodeSpaceCollapse(input: string): string {
  return input
    .replace(/\u00A0|\u2009|\u202F|\u2007|\u2060/g, ' ')
    .replace(/\s+/g, ' ');
}

function buildAmountRegexes(amount: number): RegExp[] {
  const n = Math.floor(Math.abs(amount));
  const digits = String(n);
  const withComma = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const SEP = `[\\s,_\\.\\-]?`;
  const groupedFlex = withComma.split(',').join(SEP);
  const CUR = `(?:₦|ngn|n)?\\s*`;
  const DEC = `(?:[\\.,][0o]{1,2})?`;

  const rxs: RegExp[] = [
    new RegExp(`${CUR}${groupedFlex}${DEC}`, 'i'),
    new RegExp(`${groupedFlex}${DEC}`, 'i'),
    new RegExp(`${CUR}${digits}${DEC}`, 'i'),
    new RegExp(`${digits}${DEC}`, 'i'),
  ];

  const eu = withComma.replace(/,/g, '.');
  const euBody = eu.split('.').join(SEP);
  rxs.push(new RegExp(`${CUR}${euBody}(?:,${'[0o]{1,2}'})?`, 'i'));

  return rxs;
}

function buildLooseDigitRegex(amount: number): RegExp {
  const ds = String(Math.floor(Math.abs(amount))).split('');
  const gap = `[^0-9]{0,6}`;
  const parts = ds.map((d) => (d === '0' ? `[0oO]` : d)).join(gap);
  const cur = `(?:₦|NGN|N)?(?:\\s|\\u00A0|\\u2009|\\u202F)*`;
  const dec = `(?:${gap}[\\.,][0oO]{1,2})?`;
  return new RegExp(`${cur}${parts}${dec}`, 'i');
}

function buildOriginalMatchPattern(normSnippet: string): string {
  const escaped = normSnippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escaped
    .replace(/\s+/g, '[\\s\\u00A0\\u2009\\u202F]+')
    .replace(/0/g, '[0O]');
}

function normalizeForWords(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildAmountInWordsRegex(amount: number): RegExp | null {
  try {
    const words = numberToWords(amount);
    const wordsAlt = words.replace(' and ', ' ');
    const base = words.replace(/\s+/g, '\\s+');
    const alt = wordsAlt.replace(/\s+/g, '\\s+');
    const naira = '(?:\\s+(?:naira|ngn))?';
    return new RegExp(`\\b(?:${base}|${alt})${naira}\\b`, 'i');
  } catch {
    return null;
  }
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  const below20 = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  const thousands = ['','thousand','million','billion'];

  const chunk = (n: number): string => {
    let res = '';
    if (n >= 100) {
      res += below20[Math.floor(n/100)] + ' hundred';
      n %= 100;
      if (n) res += ' and ';
    }
    if (n >= 20) {
      res += tens[Math.floor(n/10)];
      if (n % 10) res += ' ' + below20[n%10];
    } else if (n > 0) {
      res += below20[n];
    }
    return res;
  };

  let i = 0, res: string[] = [];
  while (num > 0) {
    const cur = num % 1000;
    if (cur) {
      const part = chunk(cur) + (thousands[i] ? ' ' + thousands[i] : '');
      res.unshift(part.trim());
    }
    num = Math.floor(num / 1000);
    i++;
  }
  return res.join(' ').replace(/\s+/g, ' ').trim();
}

/* -------- Money parsing helpers for >= check -------- */

function collectMoneyCandidates(s: string): Array<{ tok: string; idx: number }> {
  const out: Array<{ tok: string; idx: number }> = [];
  const Usp = '\u00A0\u2007\u2009\u202F';
  const src = String(s || '');

  const patterns = [
    new RegExp(`(?:₦|NGN|N)[${Usp}\\s]*[\\d${Usp}\\s.,]+(?:[.,]\\d{1,2})?`, 'gi'),
    new RegExp(`\\b\\d{1,3}(?:[${Usp}\\s.,]\\d{3})+(?:[.,]\\d{2})?\\b`, 'g'),
    /\b\d{4,}(?:[.,]\d{2})\b/g,
    /\b\d{5,}\b/g,
    /\b\d{1,3}(?:[.,]\d{1,2})?\s*[kK]\b/g, // 120.5k
  ];

  for (const pat of patterns) {
    for (const m of src.matchAll(pat)) {
      const tok = m[0];
      const idx = m.index ?? -1;
      out.push({ tok, idx });
    }
  }
  return out;
}

function parseMoneyTokenToNaira(tok: string): number | null {
  if (!tok) return null;
  let s = String(tok);

  const hasK = /k$/i.test(s.replace(/\s+/g, ''));

  s = s
    .replace(/[\u00A0\u2007\u2009\u202F]/g, ' ')
    .replace(/[Oo]/g, '0')
    .replace(/[Il|]/g, '1')
    .replace(/S/g, '5')
    .replace(/B/g, '8')
    .replace(/Z/g, '2');

  s = s
    .replace(/\s+/g, '')
    .replace(/₦/g, '')
    .replace(/N\s*G\s*N/gi, 'NGN')
    .replace(/NGN/gi, '')
    .replace(/\bN\b/gi, '');

  let multiplier = 1;
  if (hasK) { s = s.replace(/k$/i, ''); multiplier = 1000; }

  const hasComma = s.includes(','), hasDot = s.includes('.');
  if (hasComma && hasDot) {
    const lastComma = s.lastIndexOf(','), lastDot = s.lastIndexOf('.');
    const decSep = lastDot > lastComma ? '.' : ',';
    s = s.replace(decSep === '.' ? /,/g : /\./g, '');
    if (decSep === ',') s = s.replace(',', '.');
  } else {
    s = s.replace(/,/g, '');
  }

  const n = Number.parseFloat(s.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n * multiplier : null;
}

/* ---------- OCR safe for SSR/build ---------- */
async function extractTextFromFile(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    if (file.type === 'application/pdf') {
      const pdfjsLib: any = await import('pdfjs-dist/build/pdf');
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const data = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data }).promise;

      let text = '';
      const pages = Math.min(doc.numPages, 5);
      for (let i = 1; i <= pages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += ' ' + (content.items as any[]).map((it: any) => it.str ?? '').join(' ');
      }
      return text.trim();
    }

    if (file.type.startsWith('image/')) {
      const mod: any = await import('tesseract.js');
      const Tesseract: any = mod.default ?? mod;
      const { data } = await Tesseract.recognize(file, 'eng');
      return (data?.text ?? '').trim();
    }
  } catch {}
  return '';
}
