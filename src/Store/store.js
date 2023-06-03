import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../Features/notificationSlice";

export const store = configureStore({
	reducer: {
		notification: notificationReducer,
	},
});
