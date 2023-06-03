import { createSlice } from "@reduxjs/toolkit";

let initialState = JSON.parse(localStorage.getItem("notificationSettings"));
if (!initialState) {
	initialState = [
		{ name: "inAppSound", value: false },
		{ name: "inAppPreview", value: false },
		{ name: "countUnreadMessages", value: false },
	];

	localStorage.setItem("notificationSettings", JSON.stringify(initialState));
}

const notificationSlice = createSlice({
	name: "notification",
	reducers: {
		resetSettings: (state) => {
			const initialState = [
				{ name: "inAppSound", value: false },
				{ name: "inAppPreview", value: false },
				{ name: "countUnreadMessages", value: false },
			];

			localStorage.setItem(
				"notificationSettings",
				JSON.stringify(initialState)
			);
			return [
				...state,
				{ name: "inAppSound", value: false },
				{ name: "inAppPreview", value: false },
				{ name: "countUnreadMessages", value: false },
			];
		},

		updateNotification: (state, action) => {
			const targetSettings = state.find(
				(settings) => settings.name === action.payload
			);

			if (targetSettings) {
				const targetupdate = [
					...state,
					{ ...targetSettings, value: !targetSettings.value },
				];
				localStorage.setItem(
					"notificationSettings",
					JSON.stringify(targetupdate)
				);
				return targetupdate;
			}
		},
	},
	initialState,
});

export default notificationSlice.reducer;
export const allNotifications = (state) => state.notification;
export const { resetSettings, updateNotification } = notificationSlice.actions;
