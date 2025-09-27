// File: src/components/.../Started3.tsx
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
import ValidateLoading from '@/components/validateLoading/ValidateLoading';

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
const SHARE_TTL_MS = 2 * 60 * 60 * 1000; // why: avoid stale confirmations (2h)

function Started3() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Payment controls
  const [isPartPay, setIsPartPay] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');

  // Receipt controls
  const [proof, setProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [parsing, setParsing] = useState<boolean>(false);
  const [receiptText, setReceiptText] = useState<string>('');
  const [receiptHasAmount, setReceiptHasAmount] = useState<boolean>(false);
  const [matchSnippet, setMatchSnippet] = useState<string>('');
  const [matchMode, setMatchMode] = useState<VerifyMode | undefined>(undefined);
  const [needsReupload, setNeedsReupload] = useState<boolean>(false);
  const [showRaw, setShowRaw] = useState<boolean>(false);

  // WhatsApp flow controls
  const [shareStartedAt, setShareStartedAt] = useState<number | null>(null);
  const [shareConfirmed, setShareConfirmed] = useState<boolean>(false);

  // Store data
  const course = useSelector((state: RootState) => state.pageData.payment);
  const courseDetail = useSelector((state: RootState) => state.courses.courseDetail);
  const studentDataSub = useSelector((state: RootState) => state.pageData.studentData) as Partial<StudentData>;
  const { title, price } = courseDetail || {};

  useEffect(() => {
    if (course.courseId) dispatch(fetchCourseDetail(course.courseId));
  }, [course.courseId, dispatch]);

  // Restore progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as {
        isPartPay: boolean;
        amount: string;
        receiptText: string;
        matchSnippet: string;
        receiptHasAmount: boolean;
        shareStartedAt?: number | null;
        shareConfirmed?: boolean;
      };
      setIsPartPay(Boolean(s.isPartPay));
      setAmount(String(s.amount ?? ''));
      setReceiptText(String(s.receiptText ?? ''));
      setMatchSnippet(String(s.matchSnippet ?? ''));
      setReceiptHasAmount(Boolean(s.receiptHasAmount));
      setShareStartedAt(s.shareStartedAt ?? null);
      setShareConfirmed(Boolean(s.shareConfirmed));
      if (s.receiptText) setNeedsReupload(true);
    } catch {}
  }, []);

  // Persist progress
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
        })
      );
    } catch {}
  }, [isPartPay, amount, receiptText, matchSnippet, receiptHasAmount, shareStartedAt, shareConfirmed]);

  // Sync amount for Full Payment
  useEffect(() => {
    if (!isPartPay) {
      setAmount(price ? String(price) : '');
      setAmountError('');
    }
  }, [isPartPay, price]);

  const validateStudentData = (s: Partial<StudentData>) => {
    const hasProgram = !!(s.program?.courseId && s.program?.cohortId && s.program?.center && s.program?.mode);
    return !!(s.firstName && s.lastName && s.email && s.password && s.contact && s.houseNo && s.streetName && s.city && hasProgram);
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
    setNeedsReupload(false);
    revokePreview();
    if (!f) return;

    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    setParsing(true);
    try {
      const text = await extractTextFromFile(f);
      setReceiptText(text || '');
    } catch {
      toast.error('Could not read receipt text. Try a clearer file.');
    } finally {
      setParsing(false);
    }
  };

  // open WA in same tab; mark attempt time
  const shareToWhatsApp = async () => {
    if (!proof) {
      toast.error('Select a file first');
      return;
    }
    const text = `Hello LASOP, please find my proof of payment for ${title || 'my application'}.`;
    const encoded = encodeURIComponent(`${text}\nApplicant: ${studentDataSub.firstName || ''} ${studentDataSub.lastName || ''}`);

    const now = Date.now();
    setShareStartedAt(now);
    setShareConfirmed(false);
    try {
      // persist immediately so it's available when user returns
      const raw = localStorage.getItem(LS_KEY);
      const s = raw ? JSON.parse(raw) : {};
      localStorage.setItem(LS_KEY, JSON.stringify({ ...s, shareStartedAt: now, shareConfirmed: false }));
    } catch {}

    // Try native share first (mobile). Keep same-tab behavior for WA web as fallback.
    try {
      // @ts-ignore optional API
      if (navigator.canShare && navigator.canShare({ files: [proof] })) {
        await navigator.share({ files: [proof], text, title: 'Proof of Payment' });
        toast.success('Share dialog opened. Please send on WhatsApp.');
        return;
      }
    } catch {
      /* ignore; fallback below */
    }

    // Fallback: open WhatsApp Web in SAME TAB. User returns via Back.
    window.location.href = `https://wa.me/${WHATSAPP_E164}?text=${encoded}`;
  };

  const normalizedAmount = useMemo(() => {
    const n = Number(String(amount).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? Math.floor(n) : 0;
  }, [amount]);

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

  useEffect(() => {
    if (!receiptText || !normalizedAmount) {
      setReceiptHasAmount(false);
      setMatchSnippet('');
      setMatchMode(undefined);
      return;
    }
    const res = verifyAmount(receiptText, normalizedAmount);
    setReceiptHasAmount(res.matched);
    setMatchSnippet(res.snippet || '');
    setMatchMode(res.mode);
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
    const { matched } = verifyAmount(receiptText, normalizedAmount);
    setReceiptHasAmount(matched);
    toast[matched ? 'success' : 'error'](matched ? 'Verified against receipt.' : 'Amount not found on receipt.');
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
      toast.error('Receipt does not show the typed amount yet.');
      return;
    }

    // Enforce WhatsApp flow
    if (!isShareRecent(shareStartedAt)) {
      toast.error('Please send your receipt to WhatsApp first.');
      return;
    }
    if (!shareConfirmed) {
      toast.error('Please confirm you have sent it on WhatsApp.');
      return;
    }

    setLoading(true);
    try {
      const payload: StudentData = {
        ...(studentDataSub as StudentData),
        amountPaid: normalizedAmount || Number(price) || 0,
      };
      const response = await dispatch(postStudent(payload as any));
      if (postStudent.fulfilled.match(response)) {
        localStorage.removeItem(LS_KEY);
        toast.success('Application complete');
        router.push('/login');
      } else {
        toast.error(response.error?.message || 'Failed to complete application.');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  const completeDisabled = loading;

  return (
    <>
      {loading && <ValidateLoading />}
      <main className="w-full md:w-[45vw] h-full">
        <div className="p-10 flex flex-col justify-center">
          <div className="mb-5">
            <FaArrowLeft className="text-[20px] text-accent mb-3 cursor-pointer" onClick={() => dispatch(goBack())} />
            <h1 className="font-bold text-[25px]">
              <Image className="w-[120px] h-[80px]" src={lasopLogo} alt="" />
            </h1>
            <h3 className="text-shadow font-semibold">Complete Your Application</h3>
          </div>

          {needsReupload && (
            <div className="mb-4 text-[12px] p-3 rounded border border-amber-300 bg-amber-50 text-amber-700">
              You previously uploaded a receipt. For security reasons, please re-upload the file to complete verification.
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
                      className={`h-8 px-3 rounded-md border text-[12px] ${!isPartPay ? 'bg-accent text-white border-accent' : ''}`}
                    >
                      Full Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPartPay(true)}
                      className={`h-8 px-3 rounded-md border text-[12px] ${isPartPay ? 'bg-accent text-white border-accent' : ''}`}
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
                          className={`w-full h-[35px] pr-28 px-2 outline-none border text-[12px] rounded-md font-bold ${receiptHasAmount ? 'border-green-500' : 'border-shadow'}`}
                        />
                        {receiptHasAmount && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 flex items-center gap-1 text-[12px]">
                            <FaCheckCircle className="text-green-600" /> {matchMode === 'strict' ? 'Matched' : `Matched (${matchMode})`}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={rerunVerification}
                          className="h-8 px-3 rounded-md border text-[12px]"
                          title="Re-run verification"
                        >
                          Re-run verification
                        </button>
                        {amountError && <p className="text-[11px] text-red-600">{amountError}</p>}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Minimum part payment: ₦{MIN_PART_PAYMENT.toLocaleString()}</p>
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
                        <button type="button" className="h-8 px-3 rounded-md border text-[12px]" onClick={() => copyToClipboard('1223017613', 'Account No')}>Copy</button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="text-[12px]">Name:</div>
                          <div className="font-bold select-all">Lagos School of Programming Ltd</div>
                        </div>
                        <button type="button" className="h-8 px-3 rounded-md border text-[12px]" onClick={() => copyToClipboard('Lagos School of Programming Ltd', 'Name')}>Copy</button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="text-[12px]">Bank:</div>
                          <div className="font-bold select-all">Zenith</div>
                        </div>
                        <button type="button" className="h-8 px-3 rounded-md border text-[12px]" onClick={() => copyToClipboard('Zenith', 'Bank')}>Copy</button>
                      </div>
                    </div>
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
                  />

                  {/* Preview */}
                  {previewUrl && (
                    <div className="mt-2 border rounded-md p-2">
                      {proof?.type === 'application/pdf' ? (
                        <embed src={previewUrl} type="application/pdf" className="w-full h-64 rounded" />
                      ) : (
                        <img src={previewUrl} alt="Receipt preview" className="w-full max-h-64 object-contain rounded" />
                      )}
                    </div>
                  )}

                  {/* Parsing status + match */}
                  <div className="text-[11px]">
                    {parsing && <span className="text-gray-600">Reading receipt…</span>}
                    {!parsing && (proof || receiptText) && (
                      <>
                        {receiptHasAmount ? (
                          <div className="space-y-1">
                            <span className="text-green-700">
                              ✓ Receipt shows the amount ₦{normalizedAmount.toLocaleString()} ({matchMode}).
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
                              : 'Receipt does not show the typed amount yet.'}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* WhatsApp flow */}
                  <button
                    type="button"
                    className="mt-2 h-9 w-full rounded-md border text-[12px]"
                    onClick={shareToWhatsApp}
                    aria-label="Send to WhatsApp"
                    title="Send to WhatsApp"
                  >
                    Send to WhatsApp (+{WHATSAPP_E164})
                  </button>

                  {/* Status + Confirm */}
                  <div className="text-[11px]">
                    {isShareRecent(shareStartedAt) ? (
                      <div className="mt-1">
                        <div className="text-green-700">WhatsApp opened. After sending, come back and confirm below.</div>
                        <label className="mt-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={shareConfirmed}
                            onChange={(e) => setShareConfirmed(e.target.checked)}
                            className="h-3 w-3"
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
                    On mobile devices, the system may open a native share dialog. On desktop, WhatsApp Web opens in the same tab.
                    Use the Back button to return here after sending.
                  </p>

                  {/* Debug toggle */}
                  {receiptText && (
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={() => setShowRaw((s) => !s)}
                        className="h-7 px-2 rounded-md border text-[11px]"
                        title="Toggle extracted text for debugging"
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

/* ================= Helpers (unchanged matching from previous step) ================= */

type VerifyMode = 'strict' | 'loose' | 'fuzzy' | 'digits' | 'words';
type VerifyResult = { matched: boolean; snippet?: string; mode?: VerifyMode };

function verifyAmount(text: string, amount: number): VerifyResult {
  const strictNorm = normalizeOcrText(text);
  const amt = Math.floor(Math.abs(amount));
  const amtStr = String(amt);
  const amtStrCents = String(amt * 100);

  for (const rx of buildAmountRegexes(amt)) {
    const m = strictNorm.match(rx);
    if (m?.[0]) return { matched: true, snippet: liftToOriginalSnippet(text, m[0]), mode: 'strict' };
  }

  {
    const looseRx = buildLooseDigitRegex(amt);
    const loose = text.match(looseRx);
    if (loose?.[0]) return { matched: true, snippet: loose[0], mode: 'loose' };
  }

  {
    const src = canonicalDigits(text);
    const tokens = getMoneyLikeTokens(src);
    for (const t of tokens) {
      const compact = t.replace(/[^0-9]/g, '').replace(/^0+/, '');
      if (closeEnoughDigits(compact, amtStr) || closeEnoughDigits(compact, amtStrCents)) {
        return { matched: true, snippet: t.trim(), mode: 'fuzzy' };
      }
    }
  }

  {
    const digitsOnly = canonicalDigits(text).replace(/[^0-9]/g, '');
    if (digitsOnly.includes(amtStr)) return { matched: true, snippet: amtStr, mode: 'digits' };
    if (digitsOnly.includes(amtStrCents)) return { matched: true, snippet: amtStrCents, mode: 'digits' };
  }

  {
    const wordsRx = buildAmountInWordsRegex(amt);
    if (wordsRx) {
      const m = normalizeForWords(text).match(wordsRx);
      if (m?.[0]) return { matched: true, snippet: m[0], mode: 'words' };
    }
  }

  return { matched: false };
}

// Money-like tokens (avoid IDs)
function getMoneyLikeTokens(s: string): string[] {
  const raw = s.match(/[0-9][0-9\.\,\s_:-]*/g) || [];
  return raw.filter((tok) => {
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
    .replace(/\u0665/g, '5').replace(/\u0666/g, '6').replace(/\u0667/g, '7').replace(/\u0668/g, '8').replace(/\u0669/g, '9')
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

async function extractTextFromFile(file: File): Promise<string> {
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
      text += ' ' + content.items.map((it: any) => it.str ?? '').join(' ');
    }
    return text;
  }

  if (file.type.startsWith('image/')) {
    const mod: any = await import('tesseract.js');
    const Tesseract: any = mod.default ?? mod;
    const { data } = await Tesseract.recognize(file, 'eng');
    return data?.text ?? '';
  }

  return '';
}
