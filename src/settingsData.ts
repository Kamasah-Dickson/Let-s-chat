import notification from "./assets/notification.svg";
import chatSettings from "./assets/chat.svg";
import advancedSettings from "./assets/settings.svg";
import askQuestion from "./assets/Chat Multiple.svg";
import language from "./assets/lang.svg";
import { v4 as uuid } from "uuid";

export const settingsData = [
	{
		id: uuid(),
		name: "Notifications",
		path: "/notifications",
		icon: notification,
	},
	{
		id: uuid(),
		name: "Chat Settings",
		path: "/chat-settings",
		icon: chatSettings,
	},
	{
		id: uuid(),
		name: "Advanced Settings",
		path: "/advanced-settings",
		icon: advancedSettings,
	},
	{
		id: uuid(),
		name: "Language",
		path: "/language",
		icon: language,
	},
	{
		id: uuid(),
		name: "Ask a Question",
		path: "/ask-a-question",
		icon: askQuestion,
	},
];
