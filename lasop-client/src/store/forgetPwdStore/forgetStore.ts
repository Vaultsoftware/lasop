import { createSlice } from "@reduxjs/toolkit";
import { StudentDataMain } from "@/interfaces/interface";

interface InitialState {
    studentId: string;
    page: number;
}

const initialState: InitialState = {
    studentId: "",
    page: 1,
};


const forgetStoreSlice = createSlice({
    name: 'Forget',
    initialState: initialState,
    reducers: {
        addId: (state, action) => {
            state.studentId = action.payload;
        },
        addPage: (state) => {
            state.page = state.page < 3 ? state.page + 1 : 3
        },
        subPage: (state) => {
            if (state.page === 3) {
                state.page = 1
            }
            else if (state.page > 1) {
                state.page = state.page - 1
            }
        },
        clearData: (state) => {
            state.studentId = "";
            state.page = 1;
        }
    }
});

export const { addId, addPage, subPage, clearData } = forgetStoreSlice.actions;
export default forgetStoreSlice.reducer;