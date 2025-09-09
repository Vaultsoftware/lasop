import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { CohortMain, Course, CenterData, StudentData, ResultData, ResultMain, ResultPayload } from '@/interfaces/interface';

interface InitialState {
    result: ResultMain[];
    resultDetail: ResultMain | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export const fetchResult = createAsyncThunk<ResultMain[], void, { state: RootState }>('Result/fetchResult', async (_, { getState }) => {
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
        const response = await axios.get<ResultMain[]>(`${process.env.NEXT_PUBLIC_API_URL}/getResult`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const fetchResultDetail = createAsyncThunk<ResultMain, string, { state: RootState }>('Result/fetchResultDetail', async (resultId: string, { getState }) => {
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
        const response = await axios.get<ResultMain>(`${process.env.NEXT_PUBLIC_API_URL}/getResultDetail/${resultId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const postResult = createAsyncThunk<ResultPayload, ResultData, { state: RootState }>('Result/postResult', async (result: ResultData, { getState }) => {
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
        const response = await axios.post<ResultPayload>(`${process.env.NEXT_PUBLIC_API_URL}/postResult`, result, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

const initialState: InitialState = {
    result: [],
    resultDetail: null,
    status: 'idle',
    error: null
}

const resultSlice = createSlice({
    name: 'Result',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchResult.pending, (state) => {
            state.status = 'idle';
        })
        .addCase(fetchResult.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.result = action.payload;
            state.error = null;
        })
        .addCase(fetchResult.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to fetch result';
        })
        .addCase(fetchResultDetail.pending, (state) => {
            state.status = 'idle';
        })
        .addCase(fetchResultDetail.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.resultDetail = action.payload;
            state.error = null;
        })
        .addCase(fetchResultDetail.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to fetch result detail';
        })
        .addCase(postResult.pending, (state) => {
            state.status = 'idle';
        })
        .addCase(postResult.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const { data } = action.payload;
            if(data) {
                state.result.push(data)
            }
            state.error = null;
        })
        .addCase(postResult.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to post result';
        })
    }
})

export default resultSlice.reducer;