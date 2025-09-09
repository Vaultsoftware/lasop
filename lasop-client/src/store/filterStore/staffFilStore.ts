import { createSlice } from "@reduxjs/toolkit";
import { CohortMain } from "@/interfaces/interface";

interface InitialState {
    staffOverviewSelectedCohort?: string;
    staffStudentsSelectedCohort?: string;
    staffClassroomSelectedCohort?: string;
    staffAssessmentSelectedCohort?: string;
    staffProjectSelectedCohort?: string;
    staffAssignedCohort: CohortMain[];
    activeCohort?: CohortMain;
}


const initialState: InitialState = {
    staffOverviewSelectedCohort: '',
    staffStudentsSelectedCohort: '',
    staffClassroomSelectedCohort: '',
    staffAssessmentSelectedCohort: '',
    staffProjectSelectedCohort: '',
    staffAssignedCohort: [],
    activeCohort: undefined,
}

const staffFilterSlice = createSlice({
    name: 'staffFilter',
    initialState,
    reducers: {
        setStaffAssignedCohort: (state, action) => {
            state.staffAssignedCohort = action.payload;
        },
        setActiveCohort: (state, action) => {
            state.activeCohort = action.payload;
            if (action.payload) {
                const cohortId = action.payload._id;
                state.staffOverviewSelectedCohort = cohortId;
                state.staffStudentsSelectedCohort = cohortId;
                state.staffClassroomSelectedCohort = cohortId;
                state.staffAssessmentSelectedCohort = cohortId;
                state.staffProjectSelectedCohort = cohortId;
            }
        },
        setStaffOverviewSelectedCohort(state, action) {
            state.staffOverviewSelectedCohort = action.payload;
        },
        setStaffStudentsSelectedCohort(state, action) {
            state.staffStudentsSelectedCohort = action.payload;
        },
        setStaffClassroomSelectedCohort(state, action) {
            state.staffClassroomSelectedCohort = action.payload;
        },
        setStaffAssessmentSelectedCohort(state, action) {
            state.staffAssessmentSelectedCohort = action.payload;
        },
        setStaffProjectSelectedCohort(state, action) {
            state.staffProjectSelectedCohort = action.payload;
        },
    }
});

export const {
    setStaffAssignedCohort,
    setActiveCohort,
    setStaffOverviewSelectedCohort,
    setStaffStudentsSelectedCohort,
    setStaffClassroomSelectedCohort,
    setStaffAssessmentSelectedCohort,
    setStaffProjectSelectedCohort,
} = staffFilterSlice.actions;

export default staffFilterSlice.reducer;