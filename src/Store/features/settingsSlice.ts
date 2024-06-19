import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ISettings {
	showSettingsOnMobile: boolean;
	settings: boolean;
}

const initialState: ISettings = {
	showSettingsOnMobile: false,
	settings: false,
};
export const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		setShowSettingsOnMobile(
			state = initialState,
			action: PayloadAction<{ showSettingsOnMobile: boolean }>
		) {
			return {
				...state,
				showSettingsOnMobile: action.payload.showSettingsOnMobile,
			};
		},
		setSettings(
			state = initialState,
			action: PayloadAction<{ settings: boolean }>
		) {
			return {
				...state,
				settings: action.payload.settings,
			};
		},
	},
});

export default settingsSlice.reducer;
export const { setSettings, setShowSettingsOnMobile } = settingsSlice.actions;
export const settingsState = (state: RootState) => state.settings;
