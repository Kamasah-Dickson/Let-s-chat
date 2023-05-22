/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";

export const AllContext = createContext(null);

function AppContext({ children }) {
	const [settings, setsettings] = useState(false);
	const [searchFocus, setSearchFocus] = useState(false);
	const [options, setOptions] = useState(true);
	const [userProfile, setUserProfile] = useState({
		photoUrl: "",
		userName: "",
		email: "",
	});

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
			}}
		>
			{children}
		</AllContext.Provider>
	);
}

export default AppContext;
