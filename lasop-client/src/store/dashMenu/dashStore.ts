import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
    openMenu: boolean;
    openCreate: boolean;
    openCert: boolean;
    appDet: boolean;
    assessmentDet: boolean;
    profileDis: boolean;
    createClass: boolean;
    assignCoh: boolean;
    attendance: boolean;
    project: boolean;
    openCode: boolean;
    startClass: boolean;
    openGrade: boolean;
    classStatus: boolean;
    notification: boolean;
    edit: boolean;
    delete: boolean;
    share: boolean;
    applicants: boolean;
}

const initialState: InitialState = {
    openMenu: false,
    openCreate: false,
    openCert: false,
    appDet: false,
    assessmentDet: false,
    profileDis: false,
    createClass: false,
    assignCoh: false,
    attendance: false,
    project: false,
    openCode: true,
    startClass: true,
    openGrade: true,
    classStatus: true,
    notification: true,
    edit: false,
    delete: false,
    share: false,
    applicants: false
};

const dashSlice = createSlice({
    name: 'Sidemenu',
    initialState,
    reducers: {
        handleMenu: (state) => {
            if (!state.openMenu) {
                Object.assign(state, initialState, { openMenu: true });
            } else {
                state.openMenu = false;
            }
        },
        handleCreate: (state) => {
            if (!state.openCreate) {
                Object.assign(state, initialState, { openCreate: true });
            } else {
                state.openCreate = false;
            }
        },
        handleCert: (state) => {
            if (!state.openCert) {
                Object.assign(state, initialState, { openCert: true });
            } else {
                state.openCert = false;
            }
        },
        handleAppDet: (state) => {
            if (!state.appDet) {
                Object.assign(state, initialState, { appDet: true });
            } else {
                state.appDet = false;
            }
        },
        handleAssessment: (state) => {
            if (!state.assessmentDet) {
                Object.assign(state, initialState, { assessmentDet: true });
            } else {
                state.assessmentDet = false;
            }
        },
        handleProfile: (state) => {
            if (!state.profileDis) {
                Object.assign(state, initialState, { profileDis: true });
            } else {
                state.profileDis = false;
            }
        },
        handleClass: (state) => {
            if (!state.createClass) {
                Object.assign(state, initialState, { createClass: true });
            } else {
                state.createClass = false;
            }
        },
        handleAssCoh: (state) => {
            if (!state.assignCoh) {
                Object.assign(state, initialState, { assignCoh: true });
            } else {
                state.assignCoh = false;
            }
        },
        handleAttendance: (state) => {
            if (!state.attendance) {
                Object.assign(state, initialState, { attendance: true });
            } else {
                state.attendance = false;
            }
        },
        handleProject: (state) => {
            if (!state.project) {
                Object.assign(state, initialState, { project: true });
            } else {
                state.project = false;
            }
        },
        handleCode: (state) => {
            if (!state.openCode) {
                Object.assign(state, initialState, { openCode: true });
            } else {
                state.openCode = false;
            }
        },
        handleStartClass: (state) => {
            if (!state.startClass) {
                Object.assign(state, initialState, { startClass: true });
            } else {
                state.startClass = false;
            }
        },
        handleGrade: (state) => {
            if (!state.openGrade) {
                Object.assign(state, initialState, { openGrade: true });
            } else {
                state.openGrade = false;
            }
        },
        handleClassStatus: (state) => {
            if (!state.classStatus) {
                Object.assign(state, initialState, { classStatus: true });
            } else {
                state.classStatus = false;
            }
        },
        handleNotification: (state) => {
            if (!state.notification) {
                Object.assign(state, initialState, { notification: true });
            } else {
                state.notification = false;
            }
        },
        handleEdit: (state) => {
            if (!state.edit) {
                Object.assign(state, initialState, { edit: true });
            } else {
                state.edit = false;
            }
        },
        handleDelete: (state) => {
            if (!state.delete) {
                Object.assign(state, initialState, { delete: true });
            } else {
                state.delete = false;
            }
        },
        handleShare: (state) => {
            if (!state.share) {
                Object.assign(state, initialState, { share: true });
            } else {
                state.share = false;
            }
        },
        handleApplicants: (state) => {
            if (!state.applicants) {
                Object.assign(state, initialState, { applicants: true });
            } else {
                state.applicants = false;
            }
        }
    }
});

export default dashSlice.reducer;

export const {
    handleMenu,
    handleCreate,
    handleCert,
    handleAppDet,
    handleAssessment,
    handleProfile,
    handleClass,
    handleAssCoh,
    handleAttendance,
    handleProject,
    handleCode,
    handleStartClass,
    handleGrade,
    handleClassStatus,
    handleNotification,
    handleEdit,
    handleDelete,
    handleShare,
    handleApplicants
} = dashSlice.actions;
