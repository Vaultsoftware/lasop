import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Classroom, ClassroomMain, ClassroomResponsePayload, UpdateClassroom, UpdateAttendance } from '@/interfaces/interface';

interface InitialState {
    classroom: ClassroomMain[];
    classroomDetail: ClassroomMain | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export const postClassroom = createAsyncThunk<ClassroomResponsePayload, Classroom, { state: RootState }>('classroom/postClassroom', async (classroomData: Classroom, { getState }) => {
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
        const response = await axios.post<ClassroomResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postClassroom`, classroomData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchClassroom = createAsyncThunk<ClassroomMain[], void, { state: RootState }>('classroom/fetchClassroom', async (_, { getState }) => {
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
        const response = await axios.get<ClassroomMain[]>(`${process.env.NEXT_PUBLIC_API_URL}/getClassroom`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const fetchClassroomDetail = createAsyncThunk<ClassroomMain, string, { state: RootState }>('classroom/fetchClassroomDetail', async (classId: string, { getState }) => {
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
        const response = await axios.get<ClassroomMain>(`${process.env.NEXT_PUBLIC_API_URL}/getClassroomDet/${classId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const postAttendance = createAsyncThunk<ClassroomResponsePayload, UpdateAttendance>('classroom/postAttendance', async ({ classId, attendance }: UpdateAttendance) => {
    try {
        const response = await axios.put<ClassroomResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postAttendance/${classId}`, attendance)

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const updateClassroom = createAsyncThunk<ClassroomResponsePayload, UpdateClassroom, { state: RootState }>('classroom/updateClassroom', async ({ classId, classData }: UpdateClassroom, { getState }) => {
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
        const response = await axios.put<ClassroomResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/updateClassroom/${classId}`, classData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const delClassroom = createAsyncThunk<string, string, { state: RootState }>('classroom/delClassroom', async (classId: string, { getState }) => {
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
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delClassroom/${classId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return classId;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

const initialState: InitialState = {
    classroom: [],
    classroomDetail: null,
    status: 'idle',
    error: null
}

const classroomSlice = createSlice({
    name: 'Classroom',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassroom.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchClassroom.fulfilled, (state, action) => {
                state.classroom = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchClassroom.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch Classroom';
            })
            .addCase(fetchClassroomDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchClassroomDetail.fulfilled, (state, action) => {
                state.classroomDetail = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchClassroomDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch Classroom detail';
            })
            .addCase(postClassroom.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postClassroom.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    state.classroom.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postClassroom.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post Classroom';
            })
            .addCase(updateClassroom.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateClassroom.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    const index = state.classroom.findIndex(coh => coh._id === data._id);
                    if (index !== -1) {
                        state.classroom[index] = data;
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateClassroom.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update Classroom';
            })
            .addCase(postAttendance.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postAttendance.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    const index = state.classroom.findIndex(coh => coh._id === data._id);
                    if (index !== -1) {
                        state.classroom[index] = data;
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postAttendance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update Classroom';
            })
            .addCase(delClassroom.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(delClassroom.fulfilled, (state, action) => {
                state.classroom = state.classroom.filter(coh => coh._id !== action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(delClassroom.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete Classroom';
            });
    }
})
export default classroomSlice.reducer;