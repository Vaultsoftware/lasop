import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Assessment, AssessmentMain, Grade, Answer, AssessmentResponsePayload } from '@/interfaces/interface';

interface InitialState {
  assessment: AssessmentMain[];
  assessmentDetail: AssessmentMain | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const pickAnyToken = (state: RootState): string => {
  const s: any = state as any;
  const fromSlices =
    s?.student?.token || s?.staff?.token || s?.user?.token || s?.admin?.token || '';
  if (fromSlices) return fromSlices;

  if (typeof window !== 'undefined') {
    const keys = [
      'token',
      'authToken',
      'jwt',
      'adminToken',
      'userToken',
      'studentToken',
      'staffToken',
      'lasop_token',
    ];
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v) return v;
    }
  }
  return '';
};

export const postAssessment = createAsyncThunk<AssessmentResponsePayload, Assessment, { state: RootState }>(
  'assessment/postAssessment',
  async (assessmentData: Assessment, { getState }) => {
    const state = getState().student;
    const { token } = state;

    try {
      const response = await axios.post<AssessmentResponsePayload>(
        `${process.env.NEXT_PUBLIC_API_URL}/postAssessment`,
        assessmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error.response?.data.message;
    }
  }
);

export const fetchAssessment = createAsyncThunk<AssessmentMain[], void, { state: RootState }>(
  'assessment/fetchAssessment',
  async (_, { getState }) => {
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
      const response = await axios.get<AssessmentMain[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/getAssessment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error.response?.data.message;
    }
  }
);

export const fetchAssessmentDetail = createAsyncThunk<AssessmentMain, string, { state: RootState }>(
  'assessment/fetchAssessmentDetail',
  async (assessmentId: string) => {
    try {
      const response = await axios.get<AssessmentMain>(
        `${process.env.NEXT_PUBLIC_API_URL}/getAssessmentDet/${assessmentId}`
      );

      return response.data;
    } catch (error: any) {
      throw error.response?.data.message;
    }
  }
);

export const postGrade = createAsyncThunk<AssessmentResponsePayload, Grade, { state: RootState }>(
  'assessment/postGrade',
  async ({ assessmentId, studentId, grade, feedback }: Grade) => {
    try {
      const response = await axios.put<AssessmentResponsePayload>(
        `${process.env.NEXT_PUBLIC_API_URL}/gradeStudent/${assessmentId}/grade/${studentId}`,
        { grade, feedback }
      );

      return response.data;
    } catch (error: any) {
      throw error.response?.data.message || 'Failed to update grade';
    }
  }
);

export const postSubmissionAss = createAsyncThunk<AssessmentResponsePayload, Answer, { state: RootState }>(
  'assessment/postSubmissionAss',
  async ({ assessmentId, studentId, answer }: Answer) => {
    try {
      const response = await axios.post<AssessmentResponsePayload>(
        `${process.env.NEXT_PUBLIC_API_URL}/submitAssessment/${assessmentId}`,
        { studentId, answer }
      );

      return response.data;
    } catch (error: any) {
      throw error.response?.data.message || 'Failed to update grade';
    }
  }
);

export const delAssessment = createAsyncThunk<string, string, { state: RootState }>(
  'assessment/delAssessment',
  async (assessmentId: string, { getState }) => {
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
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delAssessment/${assessmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return assessmentId;
    } catch (error: any) {
      throw error.response?.data.message;
    }
  }
);

// ✅ now includes Authorization header if available (harmless if server doesn’t require it)
export const updateAssessmentStatus = createAsyncThunk<void, void, { state: RootState }>(
  'assessment/updateAssessmentStatus',
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const token = pickAnyToken(getState());
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/assessmentStatus`,
        null,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
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
