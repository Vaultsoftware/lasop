import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { CertificateMain, CertificatePayload, UpdateCertificate } from '@/interfaces/interface';

interface InitialState {
  certificates: CertificateMain[];
  certificateDetail: CertificateMain | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Try to find a token anywhere: Redux slices, localStorage, cookies
function pickAnyToken(state: RootState): string {
  const fromSlices =
    (state as any)?.student?.token ||
    (state as any)?.user?.token ||
    (state as any)?.staff?.token ||
    (state as any)?.admin?.token ||
    '';

  if (fromSlices) return fromSlices;

  if (typeof window !== 'undefined') {
    // common localStorage keys
    const keys = [
      'token',
      'authToken',
      'jwt',
      'adminToken',
      'userToken',
      'studentToken',
      'staffToken',
      'lasop_token',
    ];
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v && /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(v)) return v;
      // sometimes tokens are stored as JSON
      try {
        const parsed = JSON.parse(v || '{}');
        if (parsed?.token && /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(parsed.token)) {
          return parsed.token;
        }
      } catch {}
    }

    // try cookies
    const cookie = document.cookie || '';
    const match = cookie.match(/(?:^|;\s*)(token|authToken|jwt)=([^;]+)/i);
    if (match?.[2]) return decodeURIComponent(match[2]);
  }

  return '';
}

function authCfg(token: string) {
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    withCredentials: true, // allow cookie-based auth if used
  };
}

// ---- CREATE (multipart) ----
export const postCertificate = createAsyncThunk<CertificatePayload, FormData, { state: RootState }>(
  'certificate/postCertificate',
  async (formData, { getState }) => {
    const token = pickAnyToken(getState() as RootState);
    const res = await axios.post<CertificatePayload>(
      `${process.env.NEXT_PUBLIC_API_URL}/postCertificate`,
      formData,
      { ...authCfg(token) }
    );
    return res.data;
  }
);

// ---- READ ALL ----
export const fetchCertificates = createAsyncThunk<CertificateMain[], void, { state: RootState }>(
  'certificate/fetchCertificates',
  async (_, { getState }) => {
    const token = pickAnyToken(getState() as RootState);
    const res = await axios.get<CertificateMain[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/getCertificate`,
      { ...authCfg(token) }
    );
    return res.data;
  }
);

// ---- READ ONE ----
export const fetchCertificateDetail = createAsyncThunk<CertificateMain, string, { state: RootState }>(
  'certificate/fetchCertificateDetail',
  async (certId, { getState }) => {
    const token = pickAnyToken(getState() as RootState);
    const res = await axios.get<CertificateMain>(
      `${process.env.NEXT_PUBLIC_API_URL}/getCertificateId/${certId}`,
      { ...authCfg(token) }
    );
    return res.data;
  }
);

// ---- UPDATE ----
export const updateCertificate = createAsyncThunk<CertificatePayload, UpdateCertificate, { state: RootState }>(
  'certificate/updateCertificate',
  async ({ certId, certData }, { getState }) => {
    const token = pickAnyToken(getState() as RootState);
    const res = await axios.put<CertificatePayload>(
      `${process.env.NEXT_PUBLIC_API_URL}/updateCertificate/${certId}`,
      certData,
      { ...authCfg(token) }
    );
    return res.data;
  }
);

// ---- DELETE ----
export const deleteCertificate = createAsyncThunk<string, string, { state: RootState }>(
  'certificate/deleteCertificate',
  async (certId, { getState, rejectWithValue }) => {
    const token = pickAnyToken(getState() as RootState);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteCertificate/${certId}`, {
        ...authCfg(token),
      });
      return certId;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to delete certificate');
    }
  }
);

const initialState: InitialState = {
  certificates: [],
  certificateDetail: null,
  status: 'idle',
  error: null,
};

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
