import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ISettings {
	toggleSettingsCategory: boolean;
	settings: boolean;
}

const initialState: ISettings = {
	toggleSettingsCategory: false,
	settings: false,
};
export const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		setToggleSettingsCategory(
			state = initialState,
			action: PayloadAction<{ toggleSettingsCategory: boolean }>
		) {
			return {
				...state,
				toggleSettingsCategory: action.payload.toggleSettingsCategory,
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
export const { setSettings, setToggleSettingsCategory } = settingsSlice.actions;
export const settingsState = (state: RootState) => state.settings;

// export const toggleSettingsCategory = createAction<
//   { toggleSettingsCategory: boolean }
// >("settings/toggleSettingsCategory");

// export const setSettings = createAction<{ settings: boolean }>("settings/setSettings");
