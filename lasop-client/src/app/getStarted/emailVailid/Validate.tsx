'use client';

import React, { useRef, useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa6';
import { toast } from 'react-toastify';

import lasopLogo from '../../../asset/form/logo.png';
import { AppDispatch, RootState } from '@/store/store';
import { goBack, setPage } from '@/store/pageStore/pageStore';
import { verifyCode } from '@/store/verifyEmailStore/verifyEmailStore';
import ValidateLoading from '@/components/validateLoading/ValidateLoading';

function Validate() {
  const dispatch = useDispatch<AppDispatch>();
  const verifyData = useSelector((state: RootState) => state.verifyOtp.verifyData);
  // ⬇️ NEW: fallback email from the slice
  const lastSentTo = useSelector((s: RootState) => s.verifyOtp.lastSentTo);

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // autofocus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const val = event.target.value.replace(/\D/g, ''); // digits only
    if (!val) return;

    const next = [...code];
    next[index] = val.slice(-1); // keep only last typed digit
    setCode(next);

    // move to next box if not last
    if (index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const next = [...code];
      if (next[index]) {
        next[index] = '';
        setCode(next);
        return;
      }
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const prev = [...code];
        prev[index - 1] = '';
        setCode(prev);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const digits = pasted.split('');
    const next = [...code];
    for (let i = 0; i < 6; i++) next[i] = digits[i] || '';
    setCode(next);
    // focus the first empty box (or last if filled)
    const firstEmpty = next.findIndex((d) => d === '');
    const focusIndex = firstEmpty === -1 ? 5 : firstEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit code.');
      return;
    }

    // ⬇️ UPDATED: fallback to lastSentTo if verifyData.email is missing
    const email = (verifyData?.email || lastSentTo || '').trim();
    if (!email) {
      toast.error('We could not determine your email for verification.');
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(verifyCode({ email, code: verificationCode }));

      if (verifyCode.fulfilled.match(res)) {
        const payload = res.payload as { message?: string };
        toast.success(payload?.message || 'Verification successful');
        dispatch(setPage());
      } else {
        const msg =
          (res.payload as string) ||
          res.error?.message ||
          'Failed to verify code';
        toast.error(msg);
      }
    } catch {
      toast.error('An error occurred while verifying the code');
    } finally {
      setLoading(false);
    }
  };

  const filledCount = code.filter(Boolean).length;
  const disabled = loading || filledCount < 6;

  const displayEmail = verifyData?.email || lastSentTo || '';

  return (
    <>
      {loading && <ValidateLoading />}

      <main className="w-full md:w-[45vw] h-full">
        <div className="p-10 flex flex-col justify-center">
          <div className="mb-5">
            <FaArrowLeft
              className="text-[20px] text-accent mb-3 cursor-pointer"
              onClick={() => dispatch(goBack())}
              aria-label="Go back"
            />
            <h1>
              <Image className="w-[120px] h-[80px]" src={lasopLogo} alt="LASOP" />
            </h1>
            <h3 className="text-shadow font-semibold">Verify your Email address</h3>
            {displayEmail && (
              <p className="text-sm text-gray-600 mt-1">
                Code sent to <span className="font-semibold">{displayEmail}</span>
              </p>
            )}
          </div>

          <div className="w-full rounded-md shadow-md shadow-slate-600">
            <form onSubmit={handleSubmit} className="w-full p-7">
              <div className="mb-3">
                <span className="text-[12px] font-semibold">Step 3/4</span>
                <h3 className="font-bold">Type in the 6-digit code sent to your email</h3>
              </div>

              <div className="create_ctrl_code flex gap-2 justify-between">
                {code.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    className="code-input w-12 h-12 text-center border rounded-md text-lg tracking-widest"
                    required
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  disabled={disabled}
                  className={`w-full h-[35px] rounded-md text-cyan-50 ${
                    disabled ? 'bg-accent/60 cursor-not-allowed' : 'bg-accent'
                  }`}
                >
                  {loading ? 'Verifying…' : 'Verify Email'}
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

export default Validate;
