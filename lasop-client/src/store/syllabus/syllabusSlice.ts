import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Syllabus {
    sylTitle: string;
    sylFile: any;
}

interface SyllabusResponsePayload {
    message?: string;
    data?: Syllabus;
}

interface InitialState {
    syllabus: Syllabus[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


export const fetchSyllabus = createAsyncThunk<Syllabus[]>('syllabus/fetchSyllabus', async () => {
    try {
        const response = await axios.get<Syllabus[]>(`${process.env.NEXT_PUBLIC_API_URL}/getSyllabus`)

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const postSyllabus = createAsyncThunk<SyllabusResponsePayload, Syllabus>('syllabus/postSyllabus', async (syllabusData: Syllabus) => {
    try {
        const response = await axios.post<SyllabusResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postSyllabus`, syllabusData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

const initialState: InitialState = {
    syllabus: [],
    status: 'idle',
    error: null
}

const syllabusSlice = createSlice({
    name: 'Syllabus',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSyllabus.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchSyllabus.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.syllabus = action.payload;
            state.error = null
        })
        .addCase(fetchSyllabus.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to fetch syllabus';
        })
        .addCase(postSyllabus.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postSyllabus.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const { data } = action.payload;
            if(data) {
                state.syllabus.push(data);
            }
            state.error = null
        })
        .addCase(postSyllabus.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to fetch syllabus';
        })
    }
});

export default syllabusSlice.reducer;