import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { AdminMain } from '../admin/adminSlice';

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
    seenAt: string
    createdAt: string;
}

interface MessageResponsePayload {
    message?: string;
    data?: MessageMain[] | MessageMain;
}

// Represents the minimal user info you receive in conversation list
interface ConversationUser {
    _id: string;
    name: string;
    email: string | null;
}
// Represents the last message summary inside each conversation
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
// A single conversation entry (like a WhatsApp chat tile)
export interface Conversation {
    conversationWith: ConversationUser;
    lastMessage: LastMessage;
    unreadCount: number;
}
// API response from your backend
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


// Async actions
export const postMessage = createAsyncThunk<MessageResponsePayload, Message>('message/postMessage', async (messageData) => {
    try {
        const response = await axios.post<MessageResponsePayload>(`http://localhost:5000/postMsg`, messageData);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchMessages = createAsyncThunk<MessageResponsePayload, { senderId: string, recieverId: string, senderModel: 'Student' | 'Staff' | 'User', recieverModel: 'Student' | 'Staff' | 'User' }, { state: RootState }>('message/fetchMessages', async ({ senderId, recieverId, senderModel, recieverModel }) => {
    try {
        const response = await axios.get<MessageResponsePayload>(`http://localhost:5000/getMsgBtwSenders/${senderId}/${recieverId}/${senderModel}/${recieverModel}`);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchMessageDetail = createAsyncThunk<MessageMain, string, { state: RootState }>('message/fetchMessageDetail', async (messageId) => {
    try {
        const response = await axios.get<MessageMain>(`http://localhost:5000/getMessage/${messageId}`);

        return response.data;
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const delMessage = createAsyncThunk<string, string, { state: RootState }>('message/delMessage', async (messageId) => {
    try {
        await axios.delete(`http://localhost:5000/deleteMsg/${messageId}`);

        return messageId; // Return the ID of the deleted message
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

export const fetchConversations = createAsyncThunk<ConversationsResponsePayload, { senderId: string, senderModel: 'Student' | 'Staff' | 'User' }, { state: RootState }>('message/fetchConversations', async ({ senderId, senderModel }) => {
    try {
        const response = await axios.get<ConversationsResponsePayload>(`http://localhost:5000/fetchAllConversations?senderId=${senderId}&senderModel=${senderModel}`);

        return response.data || [];
    } catch (error: any) {
        throw error.response?.data.message;
    }
});

// Initial state
const initialState: InitialState = {
    messages: [],
    conversations: [],
    messageDetail: null,
    toBeMessageInfo: null,
    status: 'idle',
    error: null,
};

// Slice
const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<MessageMain>) => {
            if (!state.messages.some(m => m._id === action.payload._id)) {
                state.messages.push(action.payload);
            }
        },
        setToBeMessageInfo: (state, action: PayloadAction<{ _id: string; firstName: string; lastName: string; senderModel: 'Student' | 'Staff' | 'User'; recieverModel: 'Student' | 'Staff' | 'User' } | null>) => {
            state.toBeMessageInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (Array.isArray(data)) state.messages = data as MessageMain[];
                else if (data) state.messages = [data as MessageMain];
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
                if (data && !Array.isArray(data)) {
                    // Helper function to normalize user objects
                    const normalizeUser = (user: any): StaffMain | StudentData | AdminMain => {
                        if (typeof user === "string") {
                            return { _id: user } as any;
                        }

                        if (user && typeof user === "object") {
                            if (user.id && !user._id) {
                                return { ...user, _id: user.id };
                            }
                            return user;
                        }

                        return user;
                    };
                    const normalizedMessage: MessageMain = {
                        _id: data._id,
                        sender: normalizeUser(data.sender),
                        senderModel: data.senderModel,
                        receiver: normalizeUser(data.receiver),
                        receiverModel: data.receiverModel,
                        messageType: data.messageType,
                        message: data.message || '',
                        fileUrl: data.fileUrl || '',
                        seen: data.seen || false,
                        seenAt: data.seenAt || '',
                        createdAt: data.createdAt || new Date().toISOString()
                    };
                    // Check for duplicates before adding
                    if (!state.messages.some((m) => m._id === normalizedMessage._id)) {
                        state.messages.push(normalizedMessage);
                    }
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
            })
            .addCase(fetchConversations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (Array.isArray(data)) {
                    state.conversations = data;
                } else {
                    state.conversations = [];
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch conversations';
            });
    },
});

export default messageSlice.reducer;
export const { addMessage, setToBeMessageInfo } = messageSlice.actions;
