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
		icon: notification,
	},
	{
		id: nanoid(),
		name: "Chat Settings",
		icon: chatSettings,
	},
	{
		id: nanoid(),
		name: "Advanced Settings",
		icon: advancedSettings,
	},
	{
		id: nanoid(),
		name: "Language",
		icon: language,
	},
	{
		id: nanoid(),
		name: "Ask a Question",
		icon: askQuestion,
	},
];
