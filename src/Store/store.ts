import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./features/notificationSlice";
import chatSlice from "./features/chatSlice";
import settingsSlice from "./features/settingsSlice";

export const store = configureStore({
	reducer: {
		chat: chatSlice,
		notification: notificationReducer,
		settings: settingsSlice,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// e.g Inferred type: {user: userReducer}
export type AppDispatch = typeof store.dispatch;
