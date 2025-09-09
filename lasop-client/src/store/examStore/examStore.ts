import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { ExamData, CohortExam, CohortExamResponsePayload, ExamResponsePayload } from '@/interfaces/interface';

interface InitialState {
    exam: ExamData[];
    cohortExam: CohortExam[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Exam
export const fetchExam = createAsyncThunk<ExamData[], void, { state: RootState }>('exam/fetchExam', async (_, { getState }) => {
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
        const response = await axios.get<ExamData[]>(`${process.env.NEXT_PUBLIC_API_URL}/getExam`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const postExam = createAsyncThunk<ExamResponsePayload, ExamData, { state: RootState }>('exam/postExam', async (examData: ExamData, { getState }) => {
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
        const response = await axios.post<ExamResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postExam`, examData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

// Cohort Exam
export const fetchCohortExam = createAsyncThunk<CohortExam[], void, { state: RootState }>('exam/fetchCohortExam', async (_, { getState }) => {
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
        const response = await axios.get<CohortExam[]>(`${process.env.NEXT_PUBLIC_API_URL}/getCohortExam`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const postCohortExam = createAsyncThunk<CohortExamResponsePayload, CohortExam, { state: RootState }>('exam/postCohortExam', async (cohortExamData: CohortExam, { getState }) => {
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
        const response = await axios.post<CohortExamResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postCohortExam`, cohortExamData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

const initialState: InitialState = {
    exam: [],
    cohortExam: [],
    status: 'idle',
    error: null
}

const examSlice = createSlice({
    name: 'Exam',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExam.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchExam.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.exam = action.payload;
                state.error = null;
            })
            .addCase(fetchExam.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch exam';
            })
            .addCase(postExam.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(postExam.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { data } = action.payload;
                if (data) {
                    state.exam.push(data);
                }
                state.error = null;
            })
            .addCase(postExam.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post exam';
            })
            .addCase(fetchCohortExam.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchCohortExam.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cohortExam = action.payload;
                state.error = null;
            })
            .addCase(fetchCohortExam.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch cohort exam';
            })
            .addCase(postCohortExam.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(postCohortExam.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { data } = action.payload;
                if (data) {
                    state.cohortExam.push(data);
                }
                state.error = null;
            })
            .addCase(postCohortExam.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post cohort exam';
            })
    }
})

export default examSlice.reducer;