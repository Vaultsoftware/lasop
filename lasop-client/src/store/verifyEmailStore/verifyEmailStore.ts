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

export const sendVerificationCode = createAsyncThunk<VerifyResponsePayload, PostEmail>('verifyOtp/sendOtp', async (email: PostEmail) => {
    try {
        const response = await axios.post<VerifyResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/sendOtp`, email)

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const verifyCode = createAsyncThunk<VerifyResponsePayload, VerifyEmail>('verifyOtp/verifyCode', async (codeData: VerifyEmail) => {
    try {
        const response = await axios.post<VerifyResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/verifyOtp`, codeData)

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

const verifyOtpSlice = createSlice({
    name: 'verifyOtp',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
                state.error = action.error.message || 'Failed to send OTP';
            })
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
                state.error = action.error.message || 'Failed to verify code';
            });
    },
});

export default verifyOtpSlice.reducer;