import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CohortMain, CohortData, AssignCohort, UpdateCohort, CohortResponsePayload } from "@/interfaces/interface";

interface InitialState {
    cohort: CohortMain[];
    cohortDetail: CohortMain | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: InitialState = {
    cohort: [],
    cohortDetail: null,
    status: 'idle',
    error: null
};

// Async thunks
export const fetchCohort = createAsyncThunk<CohortMain[]>(
    'cohort/fetchCohort',
    async () => {
        const response = await axios.get<CohortMain[]>(`${process.env.NEXT_PUBLIC_API_URL}/getCohort`);
        return response.data;
    }
);

export const fetchCohortDetail = createAsyncThunk<CohortMain, string>(
    'cohort/fetchCohortDetail',
    async (cohortId: string) => {
        const response = await axios.get<CohortMain>(`${process.env.NEXT_PUBLIC_API_URL}/getCohortDetail/${cohortId}`);
        return response.data;
    }
);

export const postCohort = createAsyncThunk<CohortResponsePayload, CohortData>(
    'cohort/postCohort',
    async (cohortData: CohortData) => {
        const response = await axios.post<CohortResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postCohort`, cohortData);
        return response.data;
    }
);

export const updateCohortDet = createAsyncThunk<CohortResponsePayload, UpdateCohort>(
    'cohort/updateCohort',
    async ({ updateCohort, cohortIdDet }: UpdateCohort) => {
        const response = await axios.put<CohortResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/updateCohort/${cohortIdDet}`, updateCohort);
        return response.data;
    }
);

export const assignCohortStaff = createAsyncThunk<CohortResponsePayload, AssignCohort>(
    'cohort/assignCohort',
    async ({ courseTutorData, cohortIdDet }: AssignCohort) => {
        const response = await axios.put<CohortResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/assignCohort/${cohortIdDet}`, courseTutorData);
        return response.data;
    }
);

export const deleteCohort = createAsyncThunk<string, string>(
    'cohort/deleteCohort',
    async (cohortId: string) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteCohort/${cohortId}`);
        return cohortId;
    }
);

export const updateCohortStatus = createAsyncThunk<void, void>('cohort/updateCohortStatus', async (_) => {
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cohortStatus`);

        return;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

// Slice
const cohortSlice = createSlice({
    name: 'cohort',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCohort.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCohort.fulfilled, (state, action) => {
                state.cohort = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchCohort.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch cohort';
            })
            .addCase(fetchCohortDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCohortDetail.fulfilled, (state, action) => {
                state.cohortDetail = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchCohortDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch cohort detail';
            })
            .addCase(postCohort.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postCohort.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    state.cohort.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postCohort.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post cohort';
            })
            .addCase(updateCohortDet.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCohortDet.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    const index = state.cohort.findIndex(coh => coh._id === data._id);
                    if (index !== -1) {
                        state.cohort[index] = data;
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateCohortDet.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update cohort';
            })
            .addCase(assignCohortStaff.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(assignCohortStaff.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    const index = state.cohort.findIndex(coh => coh._id === data._id);
                    if (index !== -1) {
                        state.cohort[index] = data;
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(assignCohortStaff.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update cohort';
            })
            .addCase(deleteCohort.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCohort.fulfilled, (state, action) => {
                state.cohort = state.cohort.filter(coh => coh._id !== action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(deleteCohort.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete cohort';
            })
            .addCase(updateCohortStatus.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateCohortStatus.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updateCohortStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update status';
            });
    }
});

export default cohortSlice.reducer;
