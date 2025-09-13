// lasop-client/store/verify/verifyEmailStore.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Verify {
  email: string;
  code: string;
  codeExpiration: string;
}

interface VerifyResponsePayload {
  message?: string;
  data?: Verify;
  // optional extras your backend may return
  expiresInMinutes?: number;
  provider?: string;   // 'gmail' | 'ethereal'
  previewUrl?: string; // Ethereal preview link (dev)
  smtp?: string;       // SMTP response text
  verified?: boolean;  // on verify
}

interface PostEmail {
  email: string;
}

interface VerifyEmail {
  email: string;
  code: string;
}

interface InitialState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  verifyData: Verify | null;
}

const initialState: InitialState = {
  status: 'idle',
  error: null,
  verifyData: null,
};

export const sendVerificationCode = createAsyncThunk<
  VerifyResponsePayload,
  PostEmail,
  { rejectValue: string }
>('verifyOtp/sendOtp', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post<VerifyResponsePayload>(
      `${process.env.NEXT_PUBLIC_API_URL}/sendOtp`,
      payload,
      { withCredentials: true }
    );
    return response.data;
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
>('verifyOtp/verifyCode', async (codeData, { rejectWithValue }) => {
  try {
    const response = await axios.post<VerifyResponsePayload>(
      `${process.env.NEXT_PUBLIC_API_URL}/verifyOtp`,
      codeData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
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
      .addCase(sendVerificationCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendVerificationCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.verifyData = action.payload.data || null;
        state.error = null;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to send OTP';
      })

      // verify OTP
      .addCase(verifyCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.verifyData = action.payload.data || null;
        state.error = null;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to verify code';
      });
  },
});

export default verifyOtpSlice.reducer;
