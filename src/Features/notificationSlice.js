import { createSlice } from "@reduxjs/toolkit";

let appSound = JSON.parse(localStorage.getItem("settings_inAppSound"));
if (!appSound) {
	appSound = {
		name: "inAppSound",
		value: false,
	};
	localStorage.setItem("settings_inAppSound", JSON.stringify(appSound));
}

let inAppPreview = JSON.parse(
	localStorage.getItem("settings_inAppPreview")
) || {
	name: "inAppPreview",
	value: false,
};
if (!inAppPreview) {
	inAppPreview = {
		name: "inAppPreview",
		value: false,
	};
	localStorage.setItem("settings_inAppPreview", JSON.stringify(inAppPreview));
}

let countMessage = JSON.parse(
	localStorage.getItem("settings_countMessage")
) || {
	name: "countMessage",
	value: false,
};
if (!countMessage) {
	countMessage = {
		name: "countMessage",
		value: false,
	};
	localStorage.setItem("settings_countMessage", JSON.stringify(countMessage));
}

const initialState = [appSound, inAppPreview, countMessage];

const notificationSlice = createSlice({
	name: "notification",
	reducers: {
		resetSettings: (state) => {
			const initialState = [
				{ name: "inAppSound", value: false },
				{ name: "inAppPreview", value: false },
				{ name: "countMessage", value: false },
			];
			localStorage.setItem(
				"settings_inAppSound",
				JSON.stringify(initialState[0])
			);
			localStorage.setItem(
				"settings_inAppPreview",
				JSON.stringify(initialState[1])
			);
			localStorage.setItem(
				"settings_countMessage",
				JSON.stringify(initialState[1])
			);
			return [
				...state,
				{ name: "inAppSound", value: false },
				{ name: "inAppPreview", value: false },
				{ name: "countMessage", value: false },
			];
		},

		updateNotification: (state, action) => {
			const targetSettings = state.find(
				(settings) => settings.name === action.payload
			);

			if (targetSettings) {
				const targetUpdate = {
					...targetSettings,
					value: !JSON.parse(
						localStorage.getItem(`settings_${targetSettings.name}`)
					)?.value,
				};

				localStorage.setItem(
					`settings_${targetSettings?.name}`,
					JSON.stringify(targetUpdate)
				);

				const index = state.findIndex(
					(settings) => settings.name === action.payload
				);
				state[index] = targetUpdate;
			}
		},
	},
	initialState,
});

export default notificationSlice.reducer;
export const allNotifications = (state) => state.notification;
export const { resetSettings, updateNotification } = notificationSlice.actions;
