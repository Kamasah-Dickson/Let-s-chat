/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";

export const AllContext = createContext(null);

function AppContext({ children }) {
	const [settings, setsettings] = useState(false);
	const [searchFocus, setSearchFocus] = useState(false);
	const [options, setOptions] = useState(true);
	const [userProfile, setUserProfile] = useState({
		displayName: "",
		email: "",
		photoURL: "",
	});
	const [showTargetMessage, setShowTargetMessage] = useState(false);
	const [toggleSettingsCategory, setToggleSettingsCategory] = useState(false);

	return (
		<AllContext.Provider
			value={{
				setSearchFocus,
				options,
				setOptions,
				searchFocus,
				settings,
				setsettings,
				userProfile,
				setUserProfile,
				showTargetMessage,
				setShowTargetMessage,
				toggleSettingsCategory,
				setToggleSettingsCategory,
			}}
		>
			{children}
		</AllContext.Provider>
	);
}

export default AppContext;
