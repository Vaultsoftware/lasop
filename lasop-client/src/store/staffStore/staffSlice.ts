// lasop-client/src/store/staffStore/staffSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { StaffData, StaffMain, StaffResponsePayload, OtherInfoResponsePayload, LogStaff } from '@/interfaces/interface';

interface OtherInfo {
  fName: string;
  lName: string;
  contact: string;
  address: string;
}
interface OtherInfoData {
  id?: string;
  staffId: string;
  kin: OtherInfo;
  guarantor1: OtherInfo;
  guarantor2: OtherInfo;
}

// token persistence helpers
function saveToken(token: string) {
  if (typeof window === 'undefined') return;
  const plain = token.startsWith('Bearer ') ? token.slice(7) : token;
  try {
    localStorage.setItem('token', plain);
    document.cookie = `token=${encodeURIComponent(plain)}; path=/; SameSite=Lax`;
  } catch {}
}
function clearToken() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/; SameSite=Lax';
  } catch {}
}

// ===================== Thunks =====================

export const fetchStaff = createAsyncThunk<StaffMain[]>(
  'staff/fetchStaff',
  async () => {
    const response = await axios.get<StaffMain[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/getStaff`
    );
    return response.data;
  }
);

export const fetchStaffDetail = createAsyncThunk<StaffMain, string>(
  'staff/fetchStaffDetail',
  async (staffId: string) => {
    const response = await axios.get<StaffMain>(
      `${process.env.NEXT_PUBLIC_API_URL}/getStaffDet/${staffId}`
    );
    return response.data;
  }
);

export const postStaff = createAsyncThunk<StaffResponsePayload, StaffData>(
  'staff/postStaff',
  async (staffData: StaffData) => {
    const response = await axios.post<StaffResponsePayload>(
      `${process.env.NEXT_PUBLIC_API_URL}/postStaff`,
      staffData
    );
    return response.data;
  }
);

export const logStaff = createAsyncThunk<StaffResponsePayload, LogStaff>(
  'student/LogStaff',
  async (logStaffDet: LogStaff) => {
    const response = await axios.post<StaffResponsePayload>(
      `${process.env.NEXT_PUBLIC_API_URL}/logStaff`,
      logStaffDet
    );
    const { data, token } = response.data;
    if (!token) {
      throw new Error('Authentication token not provided');
    }
    saveToken(token);
    return { data, token };
  }
);

// Additional Info
export const fetchOtherInfo = createAsyncThunk<OtherInfoData[]>(
  'staff/fetchOtherInfo',
  async () => {
    const response = await axios.get<OtherInfoData[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/getOtherInfo`
    );
    return response.data;
  }
);

export const fetchOtherInfoDet = createAsyncThunk<OtherInfoData, string>(
  'staff/fetchOtherInfoDetail',
  async (otherId: string) => {
    const response = await axios.get<OtherInfoData>(
      `${process.env.NEXT_PUBLIC_API_URL}/getOtherInfoDet/${otherId}`
    );
    return response.data;
  }
);

export const postOtherInfo = createAsyncThunk<OtherInfoResponsePayload, OtherInfoData>(
  'staff/postOtherInfo',
  async (otherData: OtherInfoData) => {
    const response = await axios.post<OtherInfoResponsePayload>(
      `${process.env.NEXT_PUBLIC_API_URL}/postOtherInfo`,
      otherData
    );
    return response.data;
  }
);

// ===================== Slice =====================

interface InitialState {
  staffs: StaffMain[];
  staffDetail: StaffMain | null;
  logDetails: StaffMain | null;
  otherInfos: OtherInfoData[];
  otherInfoDetail: OtherInfoData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  token: string;
}

const initialState: InitialState = {
  staffs: [],
  staffDetail: null,
  logDetails: null,
  otherInfos: [],
  otherInfoDetail: null,
  token: '',
  status: 'idle',
  error: null,
};

const staffSlice = createSlice({
  name: 'Staff',
  initialState: initialState,
  reducers: {
    logOut: (state) => {
      state.token = '';
      state.logDetails = null;
      state.error = null;
      state.status = 'idle';
      clearToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.staffs = action.payload;
        state.error = null;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch staff';
      })
      .addCase(fetchStaffDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStaffDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.staffDetail = action.payload;
        state.error = null;
      })
      .addCase(fetchStaffDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch staff details';
      })
      .addCase(postStaff.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postStaff.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { data } = action.payload;
        if (data) {
          state.staffs.push(data);
        }
        state.error = null;
      })
      .addCase(postStaff.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to post staff';
      })
      .addCase(logStaff.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logStaff.fulfilled, (state, action) => {
        const { data, token } = action.payload;
        if (data && token) {
          state.logDetails = data;
          state.token = token;
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(logStaff.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(fetchOtherInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOtherInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.otherInfos = action.payload;
        state.error = null;
      })
      .addCase(fetchOtherInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch additional information';
      })
      .addCase(fetchOtherInfoDet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOtherInfoDet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.otherInfoDetail = action.payload;
        state.error = null;
      })
      .addCase(fetchOtherInfoDet.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message || 'Failed to fetch additional information for staff';
      })
      .addCase(postOtherInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postOtherInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { data } = action.payload;
        if (data) {
          state.otherInfos.push(data);
        }
        state.error = null;
      })
      .addCase(postOtherInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message || 'Failed to additional information for staff';
      });
  },
});

export default staffSlice.reducer;
export const { logOut } = staffSlice.actions;
