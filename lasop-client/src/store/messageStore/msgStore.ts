import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface OtherInfo {
    fName: string;
    lName: string;
    contact: string;
    address: string;
}

interface OtherInfoData {
    id?: string;
    staffId: string;
    kin: OtherInfo;
    guarantor1: OtherInfo;
    guarantor2: OtherInfo;
}

interface StudentData {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    address: string;
    program: {
        courseId: string | any;
        cohortId: string | any;
        center: string | any;
        mode: string;
    }[];
    allowed: boolean;
    status: string;
    createdAt?: string;
}

interface StaffMain {
    id?: string;
    fName: string;
    lName: string;
    email: string;
    contact: string;
    address: string;
    nationality: string;
    dateOfEmploy: string;
    salary: string;
    password: string;
    otherInfo: OtherInfoData[];
    role: string;
    status: string;
    createdAt?: string;
}

interface Message {
    _id: string;
    sender: string;
    senderModel: 'Student' | 'Staff';
    reciever: string;
    recieverModel: 'Student' | 'Staff';
    message: string;
    read: boolean;
    createdAt: string;
}

interface MessageMain {
    _id: string;
    sender: StaffMain | StudentData;
    senderModel: 'Student' | 'Staff';
    reciever: string;
    recieverModel: 'Student' | 'Staff';
    message: string;
    read: boolean;
    createdAt: string;
}

interface MessageResponsePayload {
    message?: string;
    data?: MessageMain;
}

interface InitialState {
    messages: MessageMain[];
    messageDetail: MessageMain | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; 
    error: string | null;
}


// Async actions
export const postMessage = createAsyncThunk<MessageResponsePayload, Omit<Message, '_id' | 'createdAt'>, { state: RootState }>('message/postMessage', async (messageData, { getState }) => {
    const state = getState().student || getState().staff; // Assuming state structure
    const { token } = state;

    try {
        const response = await axios.post<MessageResponsePayload>(`${process.env.NEXT_PUBLIC_API_URL}/postMsg`, messageData);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchMessages = createAsyncThunk<MessageMain[], void, { state: RootState }>('message/fetchMessages', async (_, { getState }) => {
    const state = getState().student || getState().staff; // Assuming state structure
    const { token } = state;

    try {
        const response = await axios.get<MessageMain[]>(`${process.env.NEXT_PUBLIC_API_URL}/getMsg`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchMessageDetail = createAsyncThunk<MessageMain, string, { state: RootState }>('message/fetchMessageDetail', async (messageId, { getState }) => {
    const state = getState().student || getState().staff; // Assuming state structure
    const { token } = state;

    try {
        const response = await axios.get<MessageMain>(`${process.env.NEXT_PUBLIC_API_URL}/getMessage/${messageId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const delMessage = createAsyncThunk<string, string, { state: RootState }>('message/delMessage', async (messageId, { getState }) => {
    const state = getState().student || getState().staff; // Assuming state structure
    const { token } = state;

    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteMsg/${messageId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return messageId; // Return the ID of the deleted message
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

// Initial state
const initialState: InitialState = {
    messages: [],
    messageDetail: null,
    status: 'idle',
    error: null,
};

// Slice
const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch messages';
            })
            .addCase(fetchMessageDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessageDetail.fulfilled, (state, action) => {
                state.messageDetail = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchMessageDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch message detail';
            })
            .addCase(postMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postMessage.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data) {
                    state.messages.push(data);
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to post message';
            })
            .addCase(delMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(delMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(msg => msg._id !== action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(delMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete message';
            });
    },
});

export default messageSlice.reducer;
