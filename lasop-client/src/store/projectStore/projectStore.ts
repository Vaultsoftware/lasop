import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Project, ProjectMain, GradeProject, ProjectResponsePayload, AnswerProject } from '@/interfaces/interface';

interface InitialState {
    project: ProjectMain[];
    projectDetail: ProjectMain | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export const postProject = createAsyncThunk<ProjectResponsePayload, Project, { state: RootState }>('project/postProject', async (projectData: Project, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) {
        token = stateStudent.token;
    } else if (stateStaff?.token) {
        token = stateStaff.token;
    } else {
        throw new Error('No token found');
    }

    try {
        const response = await axios.post<ProjectResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postProject`, projectData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchProject = createAsyncThunk<ProjectMain[], void, { state: RootState }>('Project/fetchProject', async (_, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) {
        token = stateStudent.token;
    } else if (stateStaff?.token) {
        token = stateStaff.token;
    } else {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get<ProjectMain[]>(`${process.env.NEXT_PUBLIC_API_URL}/getProject`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const fetchProjectDetail = createAsyncThunk<ProjectMain, string, { state: RootState }>('Project/fetchProjectDetail', async (projectId: string, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) {
        token = stateStudent.token;
    } else if (stateStaff?.token) {
        token = stateStaff.token;
    } else {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get<ProjectMain>(`${process.env.NEXT_PUBLIC_API_URL}/getProjectDet/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const postGradePro = createAsyncThunk<ProjectResponsePayload, GradeProject, { state: RootState }>('assessment/postGrade', async ({ projectId, studentId, grade, feedback }: GradeProject, { getState }) => {
    // const stateStudent = getState().student;
    // const stateStaff = getState().staff;
    // let token = '';

    // if (stateStudent?.token) {
    //     token = stateStudent.token;
    // } else if (stateStaff?.token) {
    //     token = stateStaff.token;
    // } else {
    //     throw new Error('No token found');
    // }

    try {
        const response = await axios.put<ProjectResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/gradeProject/${projectId}/grade/${studentId}`, { grade, feedback })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message || 'Failed to update grade';
    }

})

export const postSubmissionPro = createAsyncThunk<ProjectResponsePayload, AnswerProject, { state: RootState }>('project/postSubmissionPro', async ({ projectId, studentId, answer }: AnswerProject, { getState }) => {
    // const stateStudent = getState().student;
    // const stateStaff = getState().staff;
    // let token = '';

    // if (stateStudent?.token) {
    //     token = stateStudent.token;
    // } else if (stateStaff?.token) {
    //     token = stateStaff.token;
    // } else {
    //     throw new Error('No token found');
    // }

    try {
        const response = await axios.post<ProjectResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/submitProject/${projectId}`, { studentId, answer })

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message || 'Failed to update grade';
    }

})

export const delProject = createAsyncThunk<string, string, { state: RootState }>('Project/delProject', async (projectId: string, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) {
        token = stateStudent.token;
    } else if (stateStaff?.token) {
        token = stateStaff.token;
    } else {
        throw new Error('No token found');
    }

    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delProject/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return projectId;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const updateProjectStatus = createAsyncThunk<void, void>('project/updateProjectStatus', async (_) => {
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/projectStatus`);

        return;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

const initialState: InitialState = {
    project: [],
    projectDetail: null,
    status: 'idle',
    error: null
}

const ProjectSlice = createSlice({
    name: 'Project',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.project = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch Project';
            })
            .addCase(fetchProjectDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProjectDetail.fulfilled, (state, action) => {
                state.projectDetail = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchProjectDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch Project detail';
            })
            .addCase(postProject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postProject.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    state.project.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post Project';
            })
            .addCase(postSubmissionPro.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postSubmissionPro.fulfilled, (state, action) => {
                const { data } = action.payload;

                if (data) {
                    const assessmentIndex = state.project.findIndex((ass) => ass._id === data._id);

                    if (assessmentIndex !== -1) {
                        state.project[assessmentIndex] = data;
                    } else {
                        state.project.push(data);
                    }
                }

                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postSubmissionPro.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post project';
            })
            .addCase(postGradePro.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postGradePro.fulfilled, (state, action) => {
                if (state.projectDetail) {
                    const updatedSubmission = state.projectDetail.submission.find(
                        (sub) => sub.studentId._id === action.payload.data?.submission[0].studentId._id
                    );
                    if (updatedSubmission) {
                        updatedSubmission.grade = action.payload.data?.submission[0].grade || '';
                        updatedSubmission.feedback = action.payload.data?.submission[0].feedback || '';
                    }
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postGradePro.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post grade';
            })
            .addCase(delProject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(delProject.fulfilled, (state, action) => {
                state.project = state.project.filter(coh => coh._id !== action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(delProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete Project';
            })
            .addCase(updateProjectStatus.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateProjectStatus.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updateProjectStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update status';
            });
    }
})
export default ProjectSlice.reducer;