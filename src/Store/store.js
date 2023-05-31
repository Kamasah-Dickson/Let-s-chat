import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../Features/notification";

export const store = configureStore({
	reducer: {
		notification: notificationReducer,
	},
});
