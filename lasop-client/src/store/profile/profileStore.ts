import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { ProfileData, ProfileDataMain, ProfilePayload } from "@/interfaces/interface";

interface InitialState {
    profiles: ProfileDataMain[];
    profileDetail: ProfileDataMain | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export const postProfile = createAsyncThunk<ProfilePayload, ProfileData>('profile/postProfile', async (proData: ProfileData) => {
    try {
        const response = await axios.post<ProfilePayload>(
            `${process.env.NEXT_PUBLIC_API_URL}/postProfile`,
            proData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const fetchProfile = createAsyncThunk<ProfileDataMain[], void>('profile/fetchProfile', async () => {
    try {
        const response = await axios.get<ProfileDataMain[]>(`${process.env.NEXT_PUBLIC_API_URL}/getProfile`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

export const fetchProfileDet = createAsyncThunk<ProfileDataMain, string>('profile/fetchProfileDet', async (proId: string) => {
    try {
        const response = await axios.get<ProfileDataMain>(`${process.env.NEXT_PUBLIC_API_URL}/getProfileDet/${proId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

const deleteProfile = createAsyncThunk<string, string>('profile/deleteProfile', async (proId: string) => {
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delProfile/${proId}`);
        return proId;
    } catch (error: any) {
        throw error.response?.data.message;
    }
})

// InitialState
const initialState: InitialState = {
    profiles: [],
    profileDetail: null,
    status: 'idle',
    error: null
};

// Slices
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postProfile.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    state.profiles.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post certificate';
            })
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.profiles = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch profiles';
            })
            .addCase(fetchProfileDet.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProfileDet.fulfilled, (state, action) => {
                state.profileDetail = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchProfileDet.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch profile details';
            })
            .addCase(deleteProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteProfile.fulfilled, (state, action) => {
                state.profiles = state.profiles.filter(prof => prof._id !== action.payload);
                state.profileDetail = null;
                state.status = 'succeeded';
                state.error = null;
            })
    }
})

export default profileSlice.reducer;