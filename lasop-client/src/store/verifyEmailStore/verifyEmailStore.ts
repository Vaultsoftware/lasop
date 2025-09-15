// src/store/verifyEmailStore/verifyEmailStore.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api'; // shared axios instance with interceptor; or swap to axios

function sanitizeOtp(input: unknown, length = 6): string {
  const s = String(input ?? '').replace(/\D/g, '');
  if (!s) return '';
  return s.padStart(length, '0').slice(-length);
}

interface Verify {
  email: string;
  code?: string;           // present only in dev
  codeExpiration?: string; // present only in dev
}

interface VerifyResponsePayload {
  message?: string;
  data?: Verify;
  expiresInMinutes?: number;
  provider?: string;
  previewUrl?: string;
  smtp?: string;
  verified?: boolean;
}

interface PostEmail { email: string; }
interface VerifyEmail { email: string; code: string | number; }

interface InitialState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  verifyData: Verify | null;
  lastSentTo: string | null; // <-- fallback for email
}

const initialState: InitialState = {
  status: 'idle',
  error: null,
  verifyData: null,
  lastSentTo: null,
};

export const sendVerificationCode = createAsyncThunk<
  VerifyResponsePayload & { data: Verify }, // ensure data.email exists
  PostEmail,
  { rejectValue: string }
>('verifyOtp/sendOtp', async ({ email }, { rejectWithValue }) => {
  try {
    const clean = String(email || '').trim().toLowerCase();
    if (!clean) return rejectWithValue('Email is required');

    const res = await api.post<VerifyResponsePayload>('/sendOtp', { email: clean }, { withCredentials: true });
    const payload = res.data || {};
    // Guarantee we always have data.email, even if server didn't include it (older deployments)
    const data: Verify = { email: clean, ...(payload.data || {}) };
    return { ...payload, data };
  } catch (error: any) {
    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'Failed to send OTP';
    return rejectWithValue(msg);
  }
});

export const verifyCode = createAsyncThunk<
  VerifyResponsePayload,
  VerifyEmail,
  { rejectValue: string }
>('verifyOtp/verifyCode', async ({ email, code }, { rejectWithValue }) => {
  try {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const codeStr = sanitizeOtp(code);

    if (!cleanEmail) return rejectWithValue('Email is required');
    if (!codeStr) return rejectWithValue('OTP code is required');

    // Send both keys to be tolerant with server expectations
    const res = await api.post<VerifyResponsePayload>(
      '/verifyOtp',
      { email: cleanEmail, code: codeStr, otp: codeStr },
      { withCredentials: true }
    );
    return res.data || {};
  } catch (error: any) {
    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to verify code';
    return rejectWithValue(msg);
  }
});

const verifyOtpSlice = createSlice({
  name: 'verifyOtp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // send OTP
      .addCase(sendVerificationCode.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(sendVerificationCode.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.verifyData = a.payload.data || null;
        s.lastSentTo = a.payload.data?.email || s.lastSentTo;
        s.error = null;
      })
      .addCase(sendVerificationCode.rejected, (s, a) => {
        s.status = 'failed';
        s.error = (a.payload as string) || a.error.message || 'Failed to send OTP';
      })

      // verify OTP
      .addCase(verifyCode.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(verifyCode.fulfilled, (s, a) => {
        s.status = 'succeeded';
        // keep the email in state; server may or may not return data here
        if (a.payload?.data?.email) {
          s.verifyData = a.payload.data;
        }
        s.error = null;
      })
      .addCase(verifyCode.rejected, (s, a) => {
        s.status = 'failed';
        s.error = (a.payload as string) || a.error.message || 'Failed to verify code';
      });
  },
});

export default verifyOtpSlice.reducer;
