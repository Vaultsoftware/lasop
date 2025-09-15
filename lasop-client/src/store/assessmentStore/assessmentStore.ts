import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { RootState } from '../store';
import { pickAnyToken } from '@/utils/token';
import { Assessment, AssessmentMain, Grade, Answer, AssessmentResponsePayload } from '@/interfaces/interface';

interface InitialState {
  assessment: AssessmentMain[];
  assessmentDetail: AssessmentMain | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const postAssessment = createAsyncThunk<AssessmentResponsePayload, Assessment, { state: RootState }>(
  'assessment/postAssessment',
  async (assessmentData: Assessment, { getState }) => {
    const state = getState().student;
    const { token } = state;

    const response = await api.post<AssessmentResponsePayload>(
      '/postAssessment',
      assessmentData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const fetchAssessment = createAsyncThunk<AssessmentMain[], void, { state: RootState }>(
  'assessment/fetchAssessment',
  async (_, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) token = stateStudent.token;
    else if (stateStaff?.token) token = stateStaff.token;
    else throw new Error('No token found');

    const response = await api.get<AssessmentMain[]>('/getAssessment', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchAssessmentDetail = createAsyncThunk<AssessmentMain, string, { state: RootState }>(
  'assessment/fetchAssessmentDetail',
  async (assessmentId: string) => {
    const response = await api.get<AssessmentMain>(`/getAssessmentDet/${assessmentId}`);
    return response.data;
  }
);

export const postGrade = createAsyncThunk<AssessmentResponsePayload, Grade, { state: RootState }>(
  'assessment/postGrade',
  async ({ assessmentId, studentId, grade, feedback }: Grade) => {
    const response = await api.put<AssessmentResponsePayload>(
      `/gradeStudent/${assessmentId}/grade/${studentId}`,
      { grade, feedback }
    );
    return response.data;
  }
);

export const postSubmissionAss = createAsyncThunk<AssessmentResponsePayload, Answer, { state: RootState }>(
  'assessment/postSubmissionAss',
  async ({ assessmentId, studentId, answer }: Answer) => {
    const response = await api.post<AssessmentResponsePayload>(
      `/submitAssessment/${assessmentId}`,
      { studentId, answer }
    );
    return response.data;
  }
);

export const delAssessment = createAsyncThunk<string, string, { state: RootState }>(
  'assessment/delAssessment',
  async (assessmentId: string, { getState }) => {
    const stateStudent = getState().student;
    const stateStaff = getState().staff;
    let token = '';

    if (stateStudent?.token) token = stateStudent.token;
    else if (stateStaff?.token) token = stateStaff.token;
    else throw new Error('No token found');

    await api.delete(`/delAssessment/${assessmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return assessmentId;
  }
);

// Protected on server
export const updateAssessmentStatus = createAsyncThunk<void, void, { state: RootState }>(
  'assessment/updateAssessmentStatus',
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const token = pickAnyToken(getState());
      await api.put('/assessmentStatus', null, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed');
    }
  }
);

const initialState: InitialState = {
  assessment: [],
  assessmentDetail: null,
  status: 'idle',
  error: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssessment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssessment.fulfilled, (state, action) => {
        state.assessment = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchAssessment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch assessment';
      })
      .addCase(fetchAssessmentDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssessmentDetail.fulfilled, (state, action) => {
        state.assessmentDetail = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchAssessmentDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch assessment detail';
      })
      .addCase(postAssessment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postAssessment.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (data) {
          state.assessment.push(data);
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(postAssessment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to post assessment';
      })
      .addCase(postSubmissionAss.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postSubmissionAss.fulfilled, (state, action) => {
        const { data } = action.payload;

        if (data) {
          const assessmentIndex = state.assessment.findIndex((ass) => ass._id === data._id);

          if (assessmentIndex !== -1) {
            state.assessment[assessmentIndex] = data;
          } else {
            state.assessment.push(data);
          }
        }

        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(postSubmissionAss.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to post assessment';
      })
      .addCase(postGrade.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postGrade.fulfilled, (state, action) => {
        if (state.assessmentDetail) {
          const updatedSubmission = state.assessmentDetail.submission.find(
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
      .addCase(postGrade.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to post grade';
      })
      .addCase(delAssessment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(delAssessment.fulfilled, (state, action) => {
        state.assessment = state.assessment.filter((coh) => coh._id !== action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(delAssessment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete assessment';
      })
      .addCase(updateAssessmentStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAssessmentStatus.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateAssessmentStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update status';
      });
  },
});
export default assessmentSlice.reducer;
