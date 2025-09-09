import { CohortMain } from "@/interfaces/interface";
import { createSlice } from "@reduxjs/toolkit";
import { setActiveCohort } from "./staffFilStore";

interface initialstate {
    adminOverviewSelectedCohort?: string;
    adminCohortSelectedCohort?: string;
    adminAssignedCohort: CohortMain[];
    activeCohort?: CohortMain;
}

const initialState: initialstate = {
    adminOverviewSelectedCohort: "",
    adminCohortSelectedCohort: "",
    adminAssignedCohort: [],
    activeCohort: undefined,
}

const adminFilterSlice = createSlice({
    name: 'adminFilter',
    initialState,
    reducers: {
        setAdminAssignedCohort: (state, action) => {
            state.adminAssignedCohort = action.payload;
        },
        setActiveCohortAd: (state, action) => {
            state.activeCohort = action.payload;
            if (action.payload) {
                const cohortId = action.payload._id;
                state.adminOverviewSelectedCohort = cohortId;
                state.adminCohortSelectedCohort = cohortId;
            }
        },
        setAdminOverviewSelectedCohort: (state, action) => {
            state.adminOverviewSelectedCohort = action.payload;
        },
        setAdminCohortSelectedCohort: (state, action) => {
            state.adminCohortSelectedCohort = action.payload;
        },
    }
});

export const {
    setAdminAssignedCohort,
    setActiveCohortAd,
    setAdminOverviewSelectedCohort,
    setAdminCohortSelectedCohort
} = adminFilterSlice.actions;

export default adminFilterSlice.reducer;