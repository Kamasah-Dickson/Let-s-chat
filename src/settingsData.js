import notification from "./assets/notification.svg";
import chatSettings from "./assets/chat.svg";
import advancedSettings from "./assets/settings.svg";
import askQuestion from "./assets/Chat Multiple.svg";
import language from "./assets/Earth.svg";
import { nanoid } from "nanoid";

export const settingsData = [
	{
		id: nanoid(),
		name: "Notifications",
		path: "/notifications",
		icon: notification,
	},
	{
		id: nanoid(),
		name: "Chat Settings",
		path: "/chat-settings",
		icon: chatSettings,
	},
	{
		id: nanoid(),
		name: "Advanced Settings",
		path: "/advanced-settings",
		icon: advancedSettings,
	},
	{
		id: nanoid(),
		name: "Language",
		path: "/language",
		icon: language,
	},
	{
		id: nanoid(),
		name: "Ask a Question",
		path: "/ask-a-question",
		icon: askQuestion,
	},
];
