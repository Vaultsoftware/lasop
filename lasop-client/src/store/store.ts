import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dashReducer from "./dashMenu/dashStore";
import studentReducer from "./studentStore/studentStore";
import pageStore from "./pageStore/pageStore";
import cohortStore from "./cohortSlice/cohortStore";
import courseStore from "./courseSlice/courseStore";
import centerStore from "./centerStore/centerSlice";
import staffReducer from "./staffStore/staffSlice";
import staffFilterReducer from './filterStore/staffFilStore';
import adminFilterStore from './filterStore/adminFilStore';
import syllabusReducer from "./syllabus/syllabusSlice";
import examStore from "./examStore/examStore";
import resultStore from "./resultStore/resultStore";
import jobStore from "./jobStore/jobStore";
import classroomStore from "./classroomStore/classroomStore";
import projectStore from "./projectStore/projectStore";
import assessmentStore from "./assessmentStore/assessmentStore";
import certificateStore from "./certificate/certificateStore";
import msgStore from "./messageStore/msgStore";
import verifyEmailStore from "./verifyEmailStore/verifyEmailStore";
import staffData from './staffData/staffData';
import nonCourseStore from './nonCourseStore/nonCourseSlice';
import profileSlice from './profile/profileStore'
import forgetSlice from './forgetPwdStore/forgetStore'

const persistConfig = {
    key: 'root',
    storage
}

const rootReducer = combineReducers({
    student: studentReducer,
    staff: staffReducer,
    staffFilter: staffFilterReducer,
    adminFilter: adminFilterStore,
    syllabus: syllabusReducer,
    cohort: cohortStore,
    courses: courseStore,
    centers: centerStore,
    classroom: classroomStore,
    project: projectStore,
    assessment: assessmentStore,
    certificate: certificateStore,
    exam: examStore,
    job: jobStore,
    message: msgStore,
    results: resultStore,
    pageData: pageStore,
    staffData: staffData,
    dashMenu: dashReducer,
    verifyOtp: verifyEmailStore,
    nonCourse: nonCourseStore,
    profile: profileSlice,
    forget: forgetSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;