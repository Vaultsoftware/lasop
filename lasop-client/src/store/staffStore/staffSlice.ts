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

// Staff
export const fetchStaff = createAsyncThunk<StaffMain[]>('staff/fetchStaff', async () => {
    try {
        const response = await axios.get<StaffMain[]>(`${process.env.NEXT_PUBLIC_API_URL}/getStaff`)

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchStaffDetail = createAsyncThunk<StaffMain, string>('staff/fetchStaffDetail', async (staffId: string) => {
    try {
        const response = await axios.get<StaffMain>(`${process.env.NEXT_PUBLIC_API_URL}/getStaffDet/${staffId}`)

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const postStaff = createAsyncThunk<StaffResponsePayload, StaffData>('staff/postStaff', async (staffData: StaffData) => {
    try {
        const response = await axios.post<StaffResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postStaff`, staffData);

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const logStaff = createAsyncThunk<StaffResponsePayload, LogStaff>(
    'student/LogStaff',
    async (logStaffDet: LogStaff) => {
        try {
            const response = await axios.post<StaffResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/logStaff`, logStaffDet);

            const { data, token } = response.data;
            if (!token) {
                throw new Error('Authentication token not provided');
            }

            return { data, token };
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

// Additional Info
export const fetchOtherInfo = createAsyncThunk<OtherInfoData[]>('staff/fetchOtherInfo', async () => {
    try {
        const response = await axios.get<OtherInfoData[]>(`${process.env.NEXT_PUBLIC_API_URL}/getOtherInfo`)

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchOtherInfoDet = createAsyncThunk<OtherInfoData, string>('staff/fetchOtherInfoDetail', async (otherId: string) => {
    try {
        const response = await axios.get<OtherInfoData>(`${process.env.NEXT_PUBLIC_API_URL}/getOtherInfoDet/${otherId}`)

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const postOtherInfo = createAsyncThunk<OtherInfoResponsePayload, OtherInfoData>('staff/postOtherInfo', async (otherData: OtherInfoData) => {
    try {
        const response = await axios.post<OtherInfoResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postOtherInfo`, otherData);

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

interface InitialState {
    staffs: StaffMain[];
    staffDetail: StaffMain | null;
    logDetails: StaffMain | null;
    otherInfos: OtherInfoData[];
    otherInfoDetail: OtherInfoData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    token: string
}

const initialState: InitialState = {
    staffs: [],
    staffDetail: null,
    logDetails: null,
    otherInfos: [],
    otherInfoDetail: null,
    token: '',
    status: 'idle',
    error: null
}

const staffSlice = createSlice({
    name: 'Staff',
    initialState: initialState,
    reducers: {
        logOut: (state) => {
            state.token = '';
            state.logDetails = null;
            state.error = null;
            state.status = 'idle'; 
        }
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
            if(data) {
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
            state.error = action.error.message || 'Failed to fetch additional information for staff';
        })
        .addCase(postOtherInfo.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postOtherInfo.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const { data } = action.payload;
            if(data) {
                state.otherInfos.push(data);
            }
            state.error = null;
        })
        .addCase(postOtherInfo.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to additional information for staff';
        })
    }
});

export default staffSlice.reducer;
export const { logOut } = staffSlice.actions;