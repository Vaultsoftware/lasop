import { createSlice } from "@reduxjs/toolkit";

interface StaffData {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    address: string;
    password: string;
    role: string;
    enrol: string;
    status: string;
}

interface InitialState {
    staffData: StaffData;
    page: number;
}

const initialState: InitialState = {
    staffData: {
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        address: '',
        password: '',
        role: '',
        enrol: '',
        status: ''
    },
    page: 1,
}

const staffData = createSlice({
    name: 'Onboard',
    initialState: initialState,
    reducers: {
        addData: (state, action) => {
            state.staffData = { ...state.staffData, ...action.payload };
        },
        clearData: (state) => {
            state.staffData = {
                firstName: '',
                lastName: '',
                email: '',
                contact: '',
                address: '',
                password: '',
                role: '',
                enrol: '',
                status: ''
            };
            state.page = 1;
        },
        setPage: (state) => {
            state.page = state.page < 2 ? state.page + 1 : 2;
        },
        lastPage: (state) => {
            state.page = 3
        },
        goBack: (state) => {
            if (state.page === 2) {
                state.page = 1
            }
            else {
                state.page = state.page - 1
            }
        },
    }
})

export const { addData, clearData, setPage, lastPage, goBack } = staffData.actions;
export default staffData.reducer;