import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface NonCourse {
    _id: string;
    title: string;
    code: string;
    price: string;
}


interface InitialState {
    nonCourses: NonCourse[];
    nonCourseDetail: NonCourse;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface CourseResponsePayload {
    message?: string;
    data?: NonCourse;
}

// Define the initial state
const initialState: InitialState = {
    nonCourses: [],
    nonCourseDetail: {
        _id: '',
        title: '',
        code: '',
        price: ''
    },
    status: 'idle',
    error: null
};

// Async thunks
export const fetchNonCourse = createAsyncThunk<NonCourse[]>(
    'nonCourse/fetchNonCourse',
    async () => {
        const response = await axios.get<NonCourse[]>(`${process.env.NEXT_PUBLIC_API_URL}/getNonCourse`);
        return response.data;
    }
);

// export const fetchNonCourseDetail = createAsyncThunk<Course, string>(
//     'nonCourse/fetchNonCourseDetail',
//     async (courseId: string) => {
//         const response = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/getCourseDetail/${courseId}`);
//         return response.data;
//     }
// );

export const postNonCourse = createAsyncThunk<CourseResponsePayload, NonCourse>(
    'nonCourse/postNonCourse',
    async (courseData: NonCourse) => {
        const response = await axios.post<CourseResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postNonCourse`, courseData);
        return response.data;
    }
);

// export const updateCourse = createAsyncThunk<CourseResponsePayload, UpdateCourse>(
//     'nonCourse/updateCourse',
//     async ({ courseData, courseId }: UpdateCourse) => {
//         const response = await axios.put<CourseResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/updateCourse/${courseId}`, courseData);
//         return response.data;
//     }
// );

// export const delCourse = createAsyncThunk<string, string>(
//     'nonCourse/deleteCourse',
//     async (courseId: string) => {
//         await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteCourse/${courseId}`);
//         return courseId;
//     }
// );

// Slice
const nonCourseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNonCourse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNonCourse.fulfilled, (state, action) => {
                state.nonCourses = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchNonCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch courses';
            })
            // .addCase(fetchNonCourseDetail.pending, (state) => {
            //     state.status = 'loading';
            // })
            // .addCase(fetchNonCourseDetail.fulfilled, (state, action) => {
            //     state.courseDetail = action.payload;
            //     state.status = 'succeeded';
            //     state.error = null;
            // })
            // .addCase(fetchNonCourseDetail.rejected, (state, action) => {
            //     state.courseDetail = {
            //         _id: '',
            //         title: '',
            //         code: '',
            //         price: '',
            //         exams: []
            //     };
            //     state.status = 'failed';
            //     state.error = action.error.message || 'Failed to fetch course detail';
            // })
            .addCase(postNonCourse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postNonCourse.fulfilled, (state, action) => {
                const { data }= action.payload;
                if(data) {
                    state.nonCourses.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postNonCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post course';
            })
            // .addCase(updateCourse.pending, (state) => {
            //     state.status = 'loading';
            // })
            // .addCase(updateCourse.fulfilled, (state, action) => {
            //     const { data } = action.payload;
            //     if(data) {
            //         const index = state.courses.findIndex(course => course._id === data._id);
            //         if (index !== -1) {
            //             state.courses[index] = data;
            //         }
            //     }
            //     state.status = 'succeeded';
            //     state.error = null;
            // })
            // .addCase(updateCourse.rejected, (state, action) => {
            //     state.status = 'failed';
            //     state.error = action.error.message || 'Failed to update course';
            // })
            // .addCase(delCourse.pending, (state) => {
            //     state.status = 'loading';
            // })
            // .addCase(delCourse.fulfilled, (state, action) => {
            //     state.courses = state.courses.filter(course => course._id !== action.payload);
            //     state.status = 'succeeded';
            //     state.error = null;
            // })
            // .addCase(delCourse.rejected, (state, action) => {
            //     state.status = 'failed';
            //     state.error = action.error.message || 'Failed to delete course';
            // });
    }
});

export default nonCourseSlice.reducer;
