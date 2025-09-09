import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { StudentDataMain, LogStudent, UpdateStudentPayload, AddCourse, AddCoursePayload, StudentResponsePayload } from "@/interfaces/interface";

interface StudentData {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    address: string;
    program: {
        courseId: string | any;
        cohortId: string | any;
        center: string | any;
        mode: string;
    };
    allowed: boolean;
    status: string;
    createdAt?: string;
}

interface InitialState {
    student: StudentDataMain[];
    token: string,
    studentDetails: StudentDataMain | null;
    logDetails: StudentDataMain | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: InitialState = {
    student: [],
    token: '',
    studentDetails: null,
    logDetails: null,
    status: 'idle',
    error: null
};

// Async thunks
export const fetchStudent = createAsyncThunk<StudentDataMain[]>('student/fetchStudent', async () => {
    try {
        const response = await axios.get<StudentDataMain[]>(`${process.env.NEXT_PUBLIC_API_URL}/getStudent`);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchStudentDetails = createAsyncThunk<StudentDataMain, string, { state: RootState }>('student/fetchStudentDetails', async (studentId: string, { getState }) => {
    const state = getState().student;
    const { token } = state;

    try {
        const response = await axios.get<StudentDataMain>(`${process.env.NEXT_PUBLIC_API_URL}/studentDetails/${studentId}`);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchStudentLogDetails = createAsyncThunk<StudentDataMain, string, { state: RootState }>('student/fetchStudentLogDetails', async (studentId: string, { getState }) => {
    const state = getState().student;
    const { token } = state;

    try {
        const response = await axios.get<StudentDataMain>(`${process.env.NEXT_PUBLIC_API_URL}/studentDetails/${studentId}`);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const postStudent = createAsyncThunk<StudentResponsePayload, StudentData>(
    'student/postStudent',
    async (studentData: StudentData) => {
        try {
            const response = await axios.post<StudentResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/signStudent`, studentData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

export const logStudent = createAsyncThunk<StudentResponsePayload, LogStudent>(
    'student/logStudent',
    async (logStudent: LogStudent) => {
        try {
            const response = await axios.post<StudentResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/logStudent`, logStudent);

            const { data, token } = response.data;
            if (!token) {
                throw new Error('Authentication token not provided');
            }

            return { data, token };
        } catch (error: any) {
            throw error.response?.data;
        }
    }
);

export const updateStudent = createAsyncThunk<StudentResponsePayload, UpdateStudentPayload, { state: RootState }>(
    'student/updateStudent',
    async ({ updateData, studentId }: UpdateStudentPayload, { getState }) => {
        const state = getState().student;
        const { token } = state;

        try {
            let config = {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            let dataToSend = updateData;

            // If updateData is an instance of FormData, adjust headers
            if (updateData instanceof FormData) {
                config.headers['Content-Type'] = 'multipart/form-data';
                dataToSend = updateData;
            }

            const response = await axios.put<StudentResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/updateStudent/${studentId}`, updateData, config);
            return response.data;
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

export const deleteStudent = createAsyncThunk<string, string, { state: RootState }>(
    'student/deleteStudent',
    async (studentId: string, { getState }) => {
        const state = getState().student;
        const { token } = state;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteStudent/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return studentId;
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

export const addCourse = createAsyncThunk<StudentResponsePayload, AddCoursePayload, { state: RootState }>(
    'student/addCourse',
    async ({ courseData, studentId }: AddCoursePayload, { getState }) => {
        const state = getState().student;
        const { token } = state;

        try {
            const response = await axios.put<StudentResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/addCourse/${studentId}`, courseData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data.message;
        }
    }
);

// Slice
const studentSlice = createSlice({
    name: 'student',
    initialState,
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
            .addCase(fetchStudent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStudent.fulfilled, (state, action) => {
                state.student = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchStudent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch student';
            })
            .addCase(fetchStudentDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStudentDetails.fulfilled, (state, action) => {
                state.studentDetails = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchStudentDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch student';
            })
            .addCase(fetchStudentLogDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStudentLogDetails.fulfilled, (state, action) => {
                state.logDetails = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchStudentLogDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch student';
            })
            .addCase(postStudent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postStudent.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    state.student.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postStudent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to signup';
            })
            .addCase(logStudent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logStudent.fulfilled, (state, action) => {
                const { data, token } = action.payload;
                if (data && token) {
                    state.logDetails = data;
                    state.token = token;
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(logStudent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to login';
            })
            .addCase(updateStudent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    const index = state.student.findIndex(student => student._id === data._id);
                    if (index !== -1) {
                        state.student[index] = data;
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update student';
            })
            .addCase(deleteStudent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.student = state.student.filter(student => student._id !== action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete student';
            })
            .addCase(addCourse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    const index = state.student.findIndex(student => student._id === data._id);
                    if (index !== -1) {
                        state.student[index] = data;
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to add course';
            });
    }
});

export default studentSlice.reducer;
export const { logOut } = studentSlice.actions;