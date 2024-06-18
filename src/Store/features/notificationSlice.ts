import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface INotification {
	name: string;
	value: boolean;
}

const initialState: INotification[] = localStorage.getItem("notificationState")
	? (JSON.parse(
			localStorage.getItem("notificationState") || "[]"
	  ) as INotification[])
	: [
			{ name: "inAppSound", value: true },
			{ name: "inAppPreview", value: false },
			{ name: "countMessage", value: true },
	  ];

export const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		resetSettings: (state = initialState) => {
			localStorage.setItem("notificationState", JSON.stringify(initialState));
			return state;
		},

		updateNotification: (
			state = initialState,
			action: PayloadAction<INotification>
		) => {
			const newState = [...state];
			const indexElementToUpdate = state.findIndex(
				(notification) => notification.name === action.payload.name
			);
			if (indexElementToUpdate != -1) {
				newState[indexElementToUpdate] = {
					...newState[indexElementToUpdate],
					value: !newState[indexElementToUpdate].value,
				};
				localStorage.setItem("notificationState", JSON.stringify(newState));
			} else {
				console.warn(
					`Notification setting with name "${action.payload.name}" not found`
				);
			}
			return newState;
		},
	},
});

export default notificationSlice.reducer;
export const { resetSettings, updateNotification } = notificationSlice.actions;
export const notificationData = (state: RootState) => state.notification;
