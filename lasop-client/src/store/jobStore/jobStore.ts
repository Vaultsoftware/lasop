import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { JobData, JobPayload, UpdateJob } from '@/interfaces/interface';

interface InitialState {
    job: JobData[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export const fetchJob = createAsyncThunk<JobData[]>('Job/fetchJob', async () => {
    try {
        const response = await axios.get<JobData[]>(`${process.env.NEXT_PUBLIC_API_URL}/getJob`);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const postJob = createAsyncThunk<JobPayload, JobData>('Job/postJob', async (job: JobData) => {
    try {
        const response = await axios.post<JobPayload>(`${process.env.NEXT_PUBLIC_API_URL}/postJob`, job)

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const updateJob = createAsyncThunk<JobPayload, UpdateJob>('Job/updateJob', async ({ updateJobId, jobId }: UpdateJob) => {
    try {
        const response = await axios.put<JobPayload>(`${process.env.NEXT_PUBLIC_API_URL}/updateJob/${jobId}`, updateJobId);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const deleteJob = createAsyncThunk<string, string>('Job/deleteJob', async (jobId: string) => {
    try {
        const response = await axios.delete<string>(`${process.env.NEXT_PUBLIC_API_URL}/updateJob/${jobId}`);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

const initialState: InitialState = {
    job: [],
    status: 'idle',
    error: null
}

const jobSlice = createSlice({
    name: 'Job',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchJob.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchJob.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.job = action.payload;
            state.error = null;
        })
        .addCase(fetchJob.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to fetch job'
        })
        .addCase(postJob.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postJob.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const { data } = action.payload;
            if(data) {
                state.job.push(data)
            }
            state.error = null;
        })
        .addCase(postJob.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to post job'
        })
        .addCase(updateJob.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(updateJob.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const { data } = action.payload;
            if(data) {
                const index = state.job.findIndex((jobId) => jobId._id === data._id);
                if(index !== -1) {
                    state.job[index] = data;                }
            }
            state.error = null;
        })
        .addCase(updateJob.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to update job'
        })
        .addCase(deleteJob.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(deleteJob.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.job = state.job.filter((jobId) => jobId._id !== action.payload);
            state.error = null;
        })
        .addCase(deleteJob.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to delete job'
        })
    }
})

export default jobSlice.reducer;