// ==================================================
// File: src/store/pageStore/pageStore.ts  (FULL FILE)
// ==================================================
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProgramSelection {
  courseId: string;
  cohortId: string;
  center: string;
  mode: string;
}

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contact: string;
  houseNo: string;      // new
  streetName: string;   // new
  city: string;         // new
  program: ProgramSelection;
  allowed: boolean;
  status: string;
  createdAt?: string;
}

interface InitialState {
  studentData: StudentData;
  payment: ProgramSelection;
  page: number;
  id: null | number | string;
  classroomTab: "completed" | "missed" | "rescheduled" | "cancelled" | "";
}

const initialState: InitialState = {
  studentData: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    houseNo: "",       // new
    streetName: "",    // new
    city: "",          // new
    program: {
      courseId: "",
      cohortId: "",
      center: "",
      mode: "",
    },
    allowed: false,
    status: "applicant",
  },
  payment: {
    courseId: "",
    cohortId: "",
    center: "",
    mode: "",
  },
  page: 1,
  id: null,
  classroomTab: "",
};

const pageStoreSlice = createSlice({
  name: "Onboard",
  initialState,
  reducers: {
    addData: (state, action: PayloadAction<Partial<StudentData>>) => {
      // Why: allow step-wise merging without losing previous fields.
      state.studentData = { ...state.studentData, ...action.payload };
    },
    applyProgram: (state, action: PayloadAction<ProgramSelection>) => {
      state.studentData.program = action.payload;
      state.payment = action.payload;
    },
    getFee: (state, action: PayloadAction<ProgramSelection>) => {
      state.payment = action.payload;
    },
    clearData: (state) => {
      state.studentData = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contact: "",
        houseNo: "",       // new
        streetName: "",    // new
        city: "",          // new
        program: {
          courseId: "",
          cohortId: "",
          center: "",
          mode: "",
        },
        allowed: false,
        status: "",
      };
      state.page = 1;
      state.payment = {
        courseId: "",
        cohortId: "",
        center: "",
        mode: "",
      };
    },
    setPage: (state) => {
      state.page = state.page < 4 ? state.page + 1 : 4;
    },
    lastPage: (state) => {
      state.page = 3;
    },
    goBack: (state) => {
      if (state.page === 3) state.page = 1;
      else state.page = state.page - 1;
    },
    updateTab: (state, action: PayloadAction<InitialState["classroomTab"]>) => {
      state.classroomTab = action.payload;
    },
  },
});

export const {
  addData,
  applyProgram,
  getFee,
  clearData,
  setPage,
  lastPage,
  goBack,
  updateTab,
} = pageStoreSlice.actions;

export type ClassroomTab = InitialState["classroomTab"]; // ✅ export the union type
export default pageStoreSlice.reducer;