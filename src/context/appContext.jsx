/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";

export const AllContext = createContext(null);

function AppContext({ children }) {
	const [options, setOptions] = useState(true);
	const [searchFocus, setSearchFocus] = useState(false);

	return (
		<AllContext.Provider
			value={{ setSearchFocus, searchFocus, options, setOptions }}
		>
			{children}
		</AllContext.Provider>
	);
}

export default AppContext;
