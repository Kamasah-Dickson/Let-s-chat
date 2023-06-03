/* eslint-disable react/prop-types */
import React, { createContext, useReducer, useState } from "react";
import { auth } from "../firebase";

export const ChatContext = createContext();

function ChatContextProvider({ children }) {
	const currentUserId = auth?.currentUser?.uid;

	const INITIAL_STATE = {
		chatId: null,
		user: {},
	};
	const chatReducer = (state, action) => {
		switch (action.type) {
			case "CHANGE_USER":
				return {
					user: action.payload,
					chatId:
						currentUserId > action.payload.uid
							? currentUserId + action.payload.uid
							: action.payload.uid + currentUserId,
				};

			default:
				return state;
		}
	};

	const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

	const [newMessage, setNewMessage] = useState([]);
	const [selectedUserID, setSelectedUserID] = useState("");
	const [messages, setMessages] = useState([]);
	const [isOnline, setIsOnline] = useState([]);
	return (
		<ChatContext.Provider
			value={{
				data: state,
				newMessage,
				setNewMessage,
				dispatch,
				selectedUserID,
				setSelectedUserID,
				setMessages,
				messages,
				isOnline,
				setIsOnline,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export default ChatContextProvider;
