import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { AdminMain } from '../admin/adminSlice';

/* ================================
   Interfaces
================================ */

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
    _id?: string;
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

export interface Message {
    sender: string;
    senderModel: 'Student' | 'Staff' | 'User';
    receiver: string;
    receiverModel: 'Student' | 'Staff' | 'User';
    messageType: 'text' | 'image' | 'file';
    message: string;
}

interface MessageMain {
    _id: string;
    sender: StaffMain | StudentData | AdminMain;
    senderModel: 'Student' | 'Staff' | 'User';
    receiver: StaffMain | StudentData | AdminMain;
    receiverModel: 'Student' | 'Staff' | 'User';
    messageType: 'text' | 'image' | 'file';
    message: string;
    fileUrl: string;
    seen: boolean;
    seenAt: string;
    createdAt: string;
}

interface MessageResponsePayload {
    message?: string;
    data?: MessageMain[] | MessageMain;
}

interface ConversationUser {
    _id: string;
    name: string;
    email: string | null;
}

interface LastMessage {
    _id: string;
    sender: string;
    receiver: string;
    messageType: 'text' | 'image' | 'file';
    message: string;
    createdAt: string;
    seen: boolean;
    seenAt?: string | null;
}

export interface Conversation {
    conversationWith: ConversationUser;
    lastMessage: LastMessage;
    unreadCount: number;
}

interface ConversationsResponsePayload {
    message: string;
    data: Conversation[];
}

interface InitialState {
    messages: MessageMain[];
    conversations: Conversation[];
    messageDetail: MessageMain | null;
    toBeMessageInfo: {
        _id: string;
        firstName: string;
        lastName: string;
        senderModel: 'Student' | 'Staff' | 'User';
        recieverModel: 'Student' | 'Staff' | 'User';
    } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

/* ================================
   Async Thunks
================================ */

export const postMessage = createAsyncThunk<
    MessageResponsePayload,
    Message,
    { rejectValue: string }
>('message/postMessage', async (messageData, { rejectWithValue }) => {
    try {
        const response = await axios.post<MessageResponsePayload>(
            `http://localhost:5000/postMsg`,
            messageData
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to post message');
    }
});

export const fetchMessages = createAsyncThunk<
    MessageResponsePayload,
    {
        senderId: string;
        recieverId: string;
        senderModel: 'Student' | 'Staff' | 'User';
        recieverModel: 'Student' | 'Staff' | 'User';
    },
    { rejectValue: string }
>('message/fetchMessages', async (payload, { rejectWithValue }) => {
    try {
        const { senderId, recieverId, senderModel, recieverModel } = payload;

        const response = await axios.get<MessageResponsePayload>(
            `http://localhost:5000/getMsgBtwSenders/${senderId}/${recieverId}/${senderModel}/${recieverModel}`
        );

        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
});

export const fetchMessageDetail = createAsyncThunk<
    MessageMain,
    string,
    { rejectValue: string }
>('message/fetchMessageDetail', async (messageId, { rejectWithValue }) => {
    try {
        const response = await axios.get<MessageMain>(
            `http://localhost:5000/getMessage/${messageId}`
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch message detail');
    }
});

export const delMessage = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('message/delMessage', async (messageId, { rejectWithValue }) => {
    try {
        await axios.delete(`http://localhost:5000/deleteMsg/${messageId}`);
        return messageId;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
});

export const fetchConversations = createAsyncThunk<
    ConversationsResponsePayload,
    { senderId: string; senderModel: 'Student' | 'Staff' | 'User' },
    { rejectValue: string }
>('message/fetchConversations', async (payload, { rejectWithValue }) => {
    try {
        const { senderId, senderModel } = payload;

        const response = await axios.get<ConversationsResponsePayload>(
            `http://localhost:5000/fetchAllConversations?senderId=${senderId}&senderModel=${senderModel}`
        );

        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
});

/* ================================
   Initial State
================================ */

const initialState: InitialState = {
    messages: [],
    conversations: [],
    messageDetail: null,
    toBeMessageInfo: null,
    status: 'idle',
    error: null,
};

/* ================================
   Slice
================================ */

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<MessageMain>) => {
            if (!state.messages.some(m => m._id === action.payload._id)) {
                state.messages.push(action.payload);
            }
        },
        setToBeMessageInfo: (state, action: PayloadAction<InitialState['toBeMessageInfo']>) => {
            state.toBeMessageInfo = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const { data } = action.payload;

                if (Array.isArray(data)) {
                    state.messages = data;
                } else if (data) {
                    state.messages = [data];
                } else {
                    state.messages = [];
                }

                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch messages';
            })
            .addCase(fetchMessageDetail.fulfilled, (state, action) => {
                state.messageDetail = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchMessageDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch message detail';
            })
            .addCase(postMessage.fulfilled, (state, action) => {
                const { data } = action.payload;

                if (data && !Array.isArray(data)) {
                    if (!state.messages.some(m => m._id === data._id)) {
                        state.messages.push(data);
                    }
                }

                state.status = 'succeeded';
            })
            .addCase(postMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to post message';
            })
            .addCase(delMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(
                    msg => msg._id !== action.payload
                );
                state.status = 'succeeded';
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.conversations = action.payload.data || [];
                state.status = 'succeeded';
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch conversations';
            });
    },
});

export default messageSlice.reducer;
export const { addMessage, setToBeMessageInfo } = messageSlice.actions;
