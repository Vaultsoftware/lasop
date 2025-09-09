import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface CenterData {
    _id?: string;
    title: string;
}

interface ResponsePayload {
    message?: string;
    data?: CenterData;
}

interface InitialState {
    centers: CenterData[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export const fetchCenter = createAsyncThunk<CenterData[]>('center/fetchCenter', async () => {
    try {
        const response = await axios.get<CenterData[]>(`${process.env.NEXT_PUBLIC_API_URL}/getCenter`);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const postCenter = createAsyncThunk<ResponsePayload, CenterData, { state: RootState }>('center/postCenter', async (center: CenterData, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) {
        token = stateStudent.token;
    } else if (stateStaff?.token) {
        token = stateStaff.token;
    } else {
        throw new Error('No token found');
    }
    
    try {
        const response = await axios.post<ResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postCenter`, center, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

const initialState: InitialState = {
    centers: [],
    status: 'idle',
    error: null
};

const centerSlice = createSlice({
    name: 'center',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCenter.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchCenter.fulfilled, (state, action) => {
            state.centers = action.payload;
            state.status = 'succeeded';
            state.error = null;
        })
        .addCase(fetchCenter.rejected, (state, action) => {
            state.centers = [];
            state.status = 'failed';
            state.error = action.error.message || 'Failed to fetch center detail';;
        })
        .addCase(postCenter.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postCenter.fulfilled, (state, action) => {
            const { data } = action.payload;
            if(data) {
                state.centers.push(data);
            };
            state.status = 'succeeded';
            state.error = null;
        })
        .addCase(postCenter.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to post center detail';;
        })
    }
});

export default centerSlice.reducer;