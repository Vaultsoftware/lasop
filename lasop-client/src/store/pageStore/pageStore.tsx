import { createSlice } from "@reduxjs/toolkit";

interface StudentData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    address: string;
    program: {
        courseId: string;
        cohortId: string;
        center: string;
        mode: string;
    };
    allowed: boolean;
    status: string;
    createdAt?: string;
};

interface InitialState {
    studentData: StudentData;
    payment: {
        courseId: string;
        cohortId: string;
        center: string;
        mode: string;
    };
    page: number;
    id: null | number | string;
    classroomTab: 'completed' | 'missed' | 'rescheduled' | 'cancelled' | ''
}

const initialState: InitialState = {
    studentData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contact: '',
        address: '',
        program: {
            courseId: '',
            cohortId: '',
            center: '',
            mode: '',
        },
        allowed: false,
        status: 'applicant',
    },
    payment: {
        courseId: '',
        cohortId: '',
        center: '',
        mode: '',
    },
    page: 1,
    id: null,
    classroomTab: ''
}

const pageStoreSlice = createSlice({
    name: 'Onboard',
    initialState: initialState,
    reducers: {
        addData: (state, action) => {
            state.studentData = { ...state.studentData, ...action.payload };
        },
        applyProgram: (state, action) => {
            state.studentData.program = action.payload;
            state.payment = action.payload;
        },
        getFee: (state, action) => {
            state.payment = action.payload;
        },
        clearData: (state) => {
            state.studentData = {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                contact: '',
                address: '',
                program: {
                    courseId: '',
                    cohortId: '',
                    center: '',
                    mode: '',
                },
                allowed: false,
                status: '',
            };
            state.page = 1;
            state.payment = {
                courseId: '',
                cohortId: '',
                center: '',
                mode: '',
            }
        },
        setPage: (state) => {
            state.page = state.page < 4 ? state.page + 1 : 4;
        },
        lastPage: (state) => {
            state.page = 3
        },
        goBack: (state) => {
            if (state.page === 3) {
                state.page = 1
            }
            else {
                state.page = state.page - 1
            }
        },
        updateTab: (state, action) => {
            state.classroomTab = action.payload;
        }
    }
});

export const { addData, applyProgram, getFee, clearData, setPage, lastPage, goBack, updateTab } = pageStoreSlice.actions;
export default pageStoreSlice.reducer;