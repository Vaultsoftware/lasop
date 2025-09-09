import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Course, CourseResponsePayload, UpdateCourse } from "@/interfaces/interface";

interface InitialState {
    courses: Course[];
    courseDetail: Course;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: InitialState = {
    courses: [],
    courseDetail: {
        _id: '',
        title: '',
        code: '',
        price: '',
        exams: []
    },
    status: 'idle',
    error: null
};

// Async thunks
export const fetchCourse = createAsyncThunk<Course[]>(
    'course/fetchCourse',
    async () => {
        const response = await axios.get<Course[]>(`${process.env.NEXT_PUBLIC_API_URL}/getCourse`);
        return response.data;
    }
);

export const fetchCourseDetail = createAsyncThunk<Course, string>(
    'course/fetchCourseDetail',
    async (courseId: string) => {
        const response = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/getCourseDetail/${courseId}`);
        return response.data;
    }
);

export const postCourse = createAsyncThunk<CourseResponsePayload, Course>(
    'course/postCourse',
    async (courseData: Course) => {
        const response = await axios.post<CourseResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postCourse`, courseData);
        return response.data;
    }
);

export const updateCourse = createAsyncThunk<CourseResponsePayload, UpdateCourse>(
    'course/updateCourse',
    async ({ courseData, courseId }: UpdateCourse) => {
        const response = await axios.put<CourseResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/updateCourse/${courseId}`, courseData);
        return response.data;
    }
);

export const delCourse = createAsyncThunk<string, string>(
    'course/deleteCourse',
    async (courseId: string) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteCourse/${courseId}`);
        return courseId;
    }
);

// Slice
const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCourse.fulfilled, (state, action) => {
                state.courses = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch courses';
            })
            .addCase(fetchCourseDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCourseDetail.fulfilled, (state, action) => {
                state.courseDetail = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchCourseDetail.rejected, (state, action) => {
                state.courseDetail = {
                    _id: '',
                    title: '',
                    code: '',
                    price: '',
                    exams: []
                };
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch course detail';
            })
            .addCase(postCourse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postCourse.fulfilled, (state, action) => {
                const { data }= action.payload;
                if(data) {
                    state.courses.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post course';
            })
            .addCase(updateCourse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                const { data } = action.payload;
                if(data) {
                    const index = state.courses.findIndex(course => course._id === data._id);
                    if (index !== -1) {
                        state.courses[index] = data;
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update course';
            })
            .addCase(delCourse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(delCourse.fulfilled, (state, action) => {
                state.courses = state.courses.filter(course => course._id !== action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(delCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete course';
            });
    }
});

export default courseSlice.reducer;
