import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { RootState } from '../store';
import { pickAnyToken } from '@/utils/token';
import { Project, ProjectMain, GradeProject, ProjectResponsePayload, AnswerProject } from '@/interfaces/interface';

interface InitialState {
  project: ProjectMain[];
  projectDetail: ProjectMain | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const postProject = createAsyncThunk<ProjectResponsePayload, Project, { state: RootState }>(
  'project/postProject',
  async (projectData: Project, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) token = stateStudent.token;
    else if (stateStaff?.token) token = stateStaff.token;
    else throw new Error('No token found');

    const response = await api.post<ProjectResponsePayload>('/postProject', projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchProject = createAsyncThunk<ProjectMain[], void, { state: RootState }>(
  'Project/fetchProject',
  async (_, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) token = stateStudent.token;
    else if (stateStaff?.token) token = stateStaff.token;
    else throw new Error('No token found');

    const response = await api.get<ProjectMain[]>('/getProject', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchProjectDetail = createAsyncThunk<ProjectMain, string, { state: RootState }>(
  'Project/fetchProjectDetail',
  async (projectId: string, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) token = stateStudent.token;
    else if (stateStaff?.token) token = stateStaff.token;
    else throw new Error('No token found');

    const response = await api.get<ProjectMain>(`/getProjectDet/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const postGradePro = createAsyncThunk<ProjectResponsePayload, GradeProject, { state: RootState }>(
  'assessment/postGrade',
  async ({ projectId, studentId, grade, feedback }: GradeProject) => {
    const response = await api.put<ProjectResponsePayload>(
      `/gradeProject/${projectId}/grade/${studentId}`,
      { grade, feedback }
    );
    return response.data;
  }
);

export const postSubmissionPro = createAsyncThunk<ProjectResponsePayload, AnswerProject, { state: RootState }>(
  'project/postSubmissionPro',
  async ({ projectId, studentId, answer }: AnswerProject) => {
    const response = await api.post<ProjectResponsePayload>(
      `/submitProject/${projectId}`,
      { studentId, answer }
    );
    return response.data;
  }
);

export const delProject = createAsyncThunk<string, string, { state: RootState }>(
  'Project/delProject',
  async (projectId: string, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) token = stateStudent.token;
    else if (stateStaff?.token) token = stateStaff.token;
    else throw new Error('No token found');

    await api.delete(`/delProject/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return projectId;
  }
);

// Protected on server
export const updateProjectStatus = createAsyncThunk<void, void, { state: RootState }>(
  'project/updateProjectStatus',
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const token = pickAnyToken(getState());
      await api.put('/projectStatus', null, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed');
    }
  }
);

const initialState: InitialState = {
  project: [],
  projectDetail: null,
  status: 'idle',
  error: null,
};

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
        state.project = state.project.filter((coh) => coh._id !== action.payload);
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
  },
});
export default ProjectSlice.reducer;
