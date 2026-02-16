'use client';

import React, { useEffect, useState } from 'react';
import query from '../../../../asset/dashIcon/query.png';
import Image from 'next/image';
import { FaUserLarge } from "react-icons/fa6";
import { GrAttachment } from "react-icons/gr";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchMessages, Message, postMessage, fetchConversations, setToBeMessageInfo, Conversation } from '@/store/messageStore/msgStore';
import { socket } from '@/connection/socket';

function MsgMain() {
    const student = useSelector((state: RootState) => state.student.logDetails)
    const conversations = useSelector((state: RootState) => state.message.conversations)
    const messages = useSelector((state: RootState) => state.message.messages)
    const info = useSelector((state: RootState) => state.message.toBeMessageInfo)

    const dispatch = useDispatch<AppDispatch>();

    const senderId = student?._id as string;

    useEffect(() => {
        if (senderId) {
            dispatch(fetchConversations({ senderId, senderModel: "Student"}))
        }
    }, [dispatch, senderId]);

    useEffect(() => {
        if (info) {
            dispatch(fetchMessages({
                senderId: student?._id as string,
                recieverId: info?._id as string,
                senderModel: info?.senderModel,
                recieverModel: info?.recieverModel
            }));
        }
    }, [dispatch, info, student])

    useEffect(() => {
        socket.on('new_message', (data) => {
            if (senderId) {
                dispatch(fetchConversations({ senderId, senderModel:'Student'}));
            }
            // If the message is for current conversation, it will be fetched when selecting
        });

        return () => {
            socket.off('new_message');
        };
    }, [dispatch, senderId]);

    const [msgData, setMsgData] = useState<Message>({
        sender: senderId,
        senderModel: info?.senderModel || 'Student',
        receiver: '',
        receiverModel: info?.recieverModel || 'Staff',
        messageType: 'text',
        message: '',
    });

    const [error, setError] = useState<Partial<Message>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof Message, value: string) => {
        setMsgData(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const newError: Partial<Message> = {};

        if (msgData.messageType === 'text') {
            if (!msgData.message.trim()) {
                newError.message = 'Message field is required';
            }
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const sendChat = async () => {
        if (!validate()) return;

        try {
            setIsSubmitting(true);

            const res = await dispatch(postMessage(msgData));

            if (postMessage.fulfilled.match(res)) {
                setMsgData(prev => ({
                    ...prev,
                    message: '',
                    fileUrl: '',
                    messageType: 'text',
                }));
                // Refetch conversations to update last message
                dispatch(fetchConversations({ senderId, senderModel: 'Student' }));
            }
        } catch (err) {
            console.error('Send message failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectConversation = (conversation: Conversation) => {
        const { conversationWith, lastMessage } = conversation;

        const otherId = conversationWith._id;
        const otherName = conversationWith.name;
        const otherEmail = conversationWith.email;

        const [firstName, ...rest] = otherName.split(" ");
        const lastName = rest.join(" ");

        const senderModel: 'User' | 'Staff' | 'Student' = "Student";
        const receiverModel: 'User' | 'Student' | 'Staff' = "User";

        // Store selected conversation in Redux
        dispatch(
            setToBeMessageInfo({
                _id: otherId,
                firstName,
                lastName,
                senderModel,
                recieverModel: receiverModel,
            })
        );

        // Update local UI/message state
        setMsgData((prev) => ({
            ...prev,
            reciever: otherId,
            recieverModel: receiverModel,
        }));

        // Join socket room for this specific chat
        const chatRoom = [senderId, otherId].sort().join("_");
        socket.emit("join", chatRoom);
    };

    return (
        <main className='w-full p-5'>
            <div className='w-full h-[100vh] border rounded-md flex overflow-hidden'>
                <div className="queries flex flex-col w-[30%] h-full">
                    <div className='flex items-center gap-3 p-3'>
                        <span>Chats (2 new messages)</span>
                    </div>
                    <div className="queries_list flex flex-col gap-2 border-t-2 h-full overflow-y-scroll">
                        {
                            conversations && conversations.length > 0 ? (
                                conversations.map((conversation) => {
                                    const { conversationWith, lastMessage, unreadCount } = conversation;
                                    const otherId = conversationWith._id;
                                    const isSelected = info?._id === otherId;

                                    return (
                                        <div
                                            key={otherId}
                                            onClick={() => selectConversation(conversation)}
                                            className={`query_item flex items-center justify-between px-2 py-2 cursor-pointer ${isSelected ? "bg-gray-200" : ""
                                                }`}
                                        >
                                            <div className="query_info flex items-center gap-3">
                                                {/* Avatar/Icon */}
                                                <div className="icon w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                                                    <FaUserLarge />
                                                </div>

                                                {/* User Info and Last Message */}
                                                <div className="query_desc flex flex-col justify-center max-w-[200px]">
                                                    <div className="query_head">
                                                        <h3 className="font-semibold text-[16px] whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {conversationWith.name}
                                                        </h3>
                                                        <p className="text-[10px] text-gray-500 truncate">
                                                            {conversationWith.email}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center text-green-500">
                                                        <BsDot />
                                                        <p className="text-[12px] w-[140px] overflow-hidden whitespace-nowrap text-ellipsis">
                                                            {lastMessage.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timestamp + unread badge */}
                                            <div className="flex flex-col items-end text-right">
                                                <p className="text-[10px] font-semibold text-gray-500">
                                                    {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>

                                                {unreadCount > 0 && (
                                                    <span className="mt-1 bg-green-500 text-white text-[10px] font-bold rounded-full px-2 py-[2px]">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>No conversations yet</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="query_display w-[70%] border-l">
                    <div className='p-3 flex flex-col h-[100vh]'>
                        <div className='flex gap-4 items-center w-full border-b mb-6 p-2'>
                            <div className="icon w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                <FaUserLarge />
                            </div>
                            <div>
                                <h3 className='font-semibold'>{info ? info.firstName + ' ' + info.lastName : 'Select a chat'}</h3>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 overflow-y-scroll max-h-[90vh] h-[90vh] px-2'>
                            {
                                messages.length > 0 ? messages.map((msg) => {
                                    const senderIdMsg = (msg.sender as any)._id || (msg.sender as any).id;
                                    const isCurrentUser = senderIdMsg === senderId;
                                    return isCurrentUser ? (
                                        <div key={msg._id} className="receiver flex flex-row-reverse items-center gap-2 relative right-0">
                                            <div className="icon w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                                <FaUserLarge />
                                            </div>
                                            <div className="msg px-3 py-2 bg-shadow text-white rounded-md max-w-[70%] h-fit">
                                                <h3 className='text-[10px]'>You</h3>
                                                <p className='text-[16px]'>{msg.message}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={msg._id} className="sender flex items-center gap-2 relative left-0">
                                            <div className="icon w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                                <FaUserLarge />
                                            </div>
                                            <div className="msg px-3 py-2 bg-secondary text-shadow rounded-md max-w-[70%] h-fit">
                                                <h3 className='text-[10px]'>{(msg.sender as any).firstName || (msg.sender as any).fName} {(msg.sender as any).lastName || (msg.sender as any).lName}</h3>
                                                <p className='text-[16px]'>{msg.message}</p>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <p>{info ? 'No messages in this conversation yet' : 'Select a chat to start messaging'}</p>
                                    </div>
                                )
                            }
                        </div>

                        <div className="message_box mt-auto w-full">
                            <form action="" className='flex gap-2 items-center w-full'>
                                <div className="msg_inp flex items-center w-full bg-[#cacaca] h-[40px] py-[5px] px-[10px] rounded-full">
                                    <input
                                        type="text"
                                        value={msgData.message}
                                        onChange={(e) => handleChange('message', e.target.value)}
                                        className='w-full h-full bg-transparent outline-none text-[14px] text-black'
                                        placeholder='Type your message'
                                    />
                                    <div className="attach text-accent">
                                        <GrAttachment />
                                    </div>
                                </div>
                                <button
                                    onClick={sendChat}
                                    className="send w-[40px] h-[40px] flex items-center justify-center bg-accent text-white text-[16px] rounded-md">
                                    <IoPaperPlaneOutline />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default MsgMain