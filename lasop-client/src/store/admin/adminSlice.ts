import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface AdminData {
    name: string;
    contact: string;
    role: string;
    email: string;
    password: string;
}

export interface AdminMain {
    _id: string;
    name: string;
    contact: string;
    role: string;
    email: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdminResponsePayload {
    data?: AdminMain;
    message?: string
}

export const createAsyncThunkAdmin = createAsyncThunk<AdminResponsePayload, AdminData>(
    "admin/createAsyncThunkAdmin",
    async (adminData: AdminData, thunkApi) => {
        try {
            const response = await axios.post<AdminResponsePayload>('http://localhost:5000/createAccount', adminData);
            return response.data;
        } catch (error) {
            return thunkApi.rejectWithValue("Failed to create admin account");
        }
    })

export const logAdminThunk = createAsyncThunk<AdminResponsePayload, { email: string; password: string }>(
    "admin/logAdminThunk",
    async (loginData: { email: string; password: string }, thunkApi) => {
        try {
            const response = await axios.post<AdminResponsePayload>('http://localhost:5000/logAdmin', loginData);
            return response.data;
        } catch (error) {
            return thunkApi.rejectWithValue("Failed to log in admin");
        }
    })

interface AdminState {
    adminInfo: AdminMain | null;
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    adminInfo: null,
    loading: false,
    error: null,
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createAsyncThunkAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAsyncThunkAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload.data || null;
            })
            .addCase(createAsyncThunkAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create admin account";
            })
            .addCase(logAdminThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logAdminThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload.data || null;
            })
            .addCase(logAdminThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to log in admin";
            });
    }
});

export default adminSlice.reducer;