import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Certificate, CertificateMain, CertificatePayload, UpdateCertificate } from '@/interfaces/interface';

interface InitialState {
    certificates: CertificateMain[];
    certificateDetail: CertificateMain | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Async thunks for API operations
export const postCertificate = createAsyncThunk<CertificatePayload, Certificate, { state: RootState }>(
    'certificate/postCertificate',
    async (certificateData: Certificate, { getState }) => {
        const state = getState().student;
        const { token } = state;

        try {
            const response = await axios.post<CertificatePayload>(
                `${process.env.NEXT_PUBLIC_API_URL}/postCertificate`,
                certificateData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            return response.data;
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

export const fetchCertificates = createAsyncThunk<CertificateMain[], void, { state: RootState }>(
    'certificate/fetchCertificates',
    async (_, { getState }) => {
        const state = getState().student;
        const { token } = state;

        try {
            const response = await axios.get<CertificateMain[]>(
                `${process.env.NEXT_PUBLIC_API_URL}/getCertificate`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

export const fetchCertificateDetail = createAsyncThunk<CertificateMain, string, { state: RootState }>(
    'certificate/fetchCertificateDetail',
    async (certId: string, { getState }) => {
        const state = getState().student;
        const { token } = state;

        try {
            const response = await axios.get<CertificateMain>(
                `${process.env.NEXT_PUBLIC_API_URL}/getCertificateId/${certId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

export const updateCertificate = createAsyncThunk<CertificatePayload, UpdateCertificate, { state: RootState }>('certificate/updateCertificate', async ({ certId, certData }: UpdateCertificate, { getState }) => {
    const state = getState().student;
    const { token } = state;

    try {
        const response = await axios.put<CertificatePayload>(`${process.env.NEXT_PUBLIC_API_URL}/updateCertificate/${certId}`, certData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const deleteCertificate = createAsyncThunk<string, string, { state: RootState }>(
    'certificate/deleteCertificate',
    async (certId: string, { getState }) => {
        const state = getState().student;
        const { token } = state;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteCertificate/${certId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return certId;
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

// Initial State
const initialState: InitialState = {
    certificates: [],
    certificateDetail: null,
    status: 'idle',
    error: null,
};

// Slice for Certificate
const certificateSlice = createSlice({
    name: 'certificate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCertificates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCertificates.fulfilled, (state, action) => {
                state.certificates = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchCertificates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch certificates';
            })
            .addCase(fetchCertificateDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCertificateDetail.fulfilled, (state, action) => {
                state.certificateDetail = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchCertificateDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch certificate detail';
            })
            .addCase(postCertificate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCertificate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCertificate.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    const index = state.certificates.findIndex(coh => coh._id === data._id);
                    if (index !== -1) {
                        state.certificates[index] = data;
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateCertificate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update certificates';
            })
            .addCase(postCertificate.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    state.certificates.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postCertificate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post certificate';
            })
            .addCase(deleteCertificate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCertificate.fulfilled, (state, action) => {
                state.certificates = state.certificates.filter(cert => cert._id !== action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(deleteCertificate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete certificate';
            });
    }
});

export default certificateSlice.reducer;
