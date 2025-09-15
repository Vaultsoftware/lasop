// lasop-client/src/store/certificate/certificateStore.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { RootState } from '../store';
import { pickAnyToken } from '@/utils/token';
import { CertificateMain, CertificatePayload, UpdateCertificate } from '@/interfaces/interface';

interface InitialState {
  certificates: CertificateMain[];
  certificateDetail: CertificateMain | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: InitialState = {
  certificates: [],
  certificateDetail: null,
  status: 'idle',
  error: null,
};

// ---- CREATE (multipart) ----
export const postCertificate = createAsyncThunk<CertificatePayload, FormData, { state: RootState }>(
  'certificate/postCertificate',
  async (formData, { getState }) => {
    const token = pickAnyToken(getState());
    const res = await api.post<CertificatePayload>(
      '/postCertificate',
      formData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return res.data;
  }
);

// ---- READ ALL ----
export const fetchCertificates = createAsyncThunk<CertificateMain[], void, { state: RootState }>(
  'certificate/fetchCertificates',
  async (_, { getState }) => {
    const token = pickAnyToken(getState());
    const res = await api.get<CertificateMain[]>('/getCertificate', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  }
);

// ---- READ ONE (protected when REQUIRE_AUTH !== '0') ----
export const fetchCertificateDetail = createAsyncThunk<CertificateMain, string, { state: RootState }>(
  'certificate/fetchCertificateDetail',
  async (certId, { getState }) => {
    const token = pickAnyToken(getState());
    const res = await api.get<CertificateMain>(`/getCertificateId/${certId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  }
);

// ---- UPDATE (protected) ----
export const updateCertificate = createAsyncThunk<CertificatePayload, UpdateCertificate, { state: RootState }>(
  'certificate/updateCertificate',
  async ({ certId, certData }, { getState, rejectWithValue }) => {
    try {
      const token = pickAnyToken(getState());
      const res = await api.put<CertificatePayload>(`/updateCertificate/${certId}`, certData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: err?.message });
    }
  }
);

// ---- DELETE (protected) ----
export const deleteCertificate = createAsyncThunk<string, string, { state: RootState }>(
  'certificate/deleteCertificate',
  async (certId, { getState, rejectWithValue }) => {
    try {
      const token = pickAnyToken(getState());
      await api.delete(`/deleteCertificate/${certId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return certId;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to delete certificate');
    }
  }
);

const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch list
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
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch certificates';
      })

      // fetch one
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
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch certificate detail';
      })

      // create
      .addCase(postCertificate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postCertificate.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (data) state.certificates.push(data);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(postCertificate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to post certificate';
      })

      // update
      .addCase(updateCertificate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCertificate.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (data) {
          const i = state.certificates.findIndex((c) => c._id === data._id);
          if (i !== -1) state.certificates[i] = data;
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateCertificate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update certificates';
      })

      // delete
      .addCase(deleteCertificate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        state.certificates = state.certificates.filter((c) => c._id !== action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteCertificate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Failed to delete certificate';
      });
  },
});

export default certificateSlice.reducer;
