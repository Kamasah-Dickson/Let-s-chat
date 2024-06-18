import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ITopChats {
	date: string;
	userInfo: {
		displayName: string;
		photoURL: string;
		uid: string;
		online?: "offline" | "online";
		lastSeen?: Date | number;
	};
}

export interface IChat {
	searchFocus: boolean;
	searchedUsers: ITopChats[];
	selectedUserId: string;
	messages: [];
	chat: ITopChats[];
	contactsChat: ITopChats[];
	newMessage: {
		date: number;
		uid: string;
		seen: boolean;
		text: string;
		senderId: string;
	}[];
	partneredChat: {
		user: ITopChats["userInfo"];
		combinedId: string;
	};
	chatOptions: boolean;
	showSidebar: boolean;
}

const initialState: IChat = {
	contactsChat: [],
	searchFocus: false,
	searchedUsers: [],
	showSidebar: true,
	selectedUserId: "",
	messages: [],
	chat: [
		{
			date: "",
			userInfo: {
				displayName: "",
				photoURL: "",
				uid: "",
			},
		},
	],
	newMessage: [],
	partneredChat: {
		user: { displayName: "", photoURL: "", uid: "" },
		combinedId: "",
	},

	chatOptions: false,
};

export const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setPartneredChat(
			state,
			action: PayloadAction<{
				user: ITopChats["userInfo"];
				combinedId: string;
			}>
		) {
			return {
				...state,
				partneredChat: {
					user: action.payload.user,
					combinedId: action.payload.combinedId,
				},
			};
		},

		setSearchFocus(state, action) {
			return { ...state, searchFocus: action.payload.searchFocus };
		},
		setShowSidebar(state, action: PayloadAction<{ showSidebar: boolean }>) {
			return { ...state, showSidebar: action.payload.showSidebar };
		},

		setChatOptions(state, action) {
			return { ...state, chatOptions: action.payload.chatOptions };
		},
		toggleChatOptions(state) {
			return { ...state, chatOptions: !state.chatOptions };
		},
		setSearchedUsers(state, action: PayloadAction<{ searchedUsers: [] }>) {
			return {
				...state,
				searchedUsers: action.payload.searchedUsers,
			};
		},

		setNewMessage(
			state,
			action: PayloadAction<{ newMessage: IChat["newMessage"] }>
		) {
			return {
				...state,
				newMessage: action.payload.newMessage,
			};
		},

		setSelectedUserId(state, action) {
			return { ...state, selectedUserId: action.payload.selectedUserId };
		},
		setMessages(state, action: PayloadAction<{ messages: IChat["messages"] }>) {
			return {
				...state,
				messages: action.payload.messages,
			};
		},

		setChat(state, action) {
			return { ...state, chat: action.payload.chat };
		},
		contactSearchedUsers(state, action) {
			return {
				...state,
				contactSearchedUsers: action.payload.contactSearchedUsers,
			};
		},
		setContactsChat(state, action) {
			return { ...state, contactsChat: action.payload.contactsChat };
		},

		setUserError(state, action) {
			return {
				...state,
				userError: action.payload.userError,
			};
		},
	},
});

export default chatSlice.reducer;
export const {
	setChat,
	setMessages,
	setNewMessage,
	setSearchFocus,
	setShowSidebar,
	setSearchedUsers,
	setUserError,
	setSelectedUserId,
	setPartneredChat,
	setChatOptions,
	toggleChatOptions,
	contactSearchedUsers,
	setContactsChat,
} = chatSlice.actions;
export const chatData = (state: RootState) => state.chat;
