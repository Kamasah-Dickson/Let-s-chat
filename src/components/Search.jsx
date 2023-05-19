/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect, useContext } from "react";
import { AllContext } from "../context/appContext";

function Search({ placeholder, searchFocus }) {
	const [search, setSearch] = useState("");
	const { setOptions } = useContext(AllContext);
	const inputFocus = useRef(null);

	useEffect(() => {
		if (searchFocus) {
			inputFocus.current.focus();
			setOptions(true);
		}
	}, [searchFocus]);

	return (
		<input
			ref={inputFocus}
			className="bg-transparent w-full text-white outline-none"
			type="text"
			name=""
			value={search}
			onChange={(e) => setSearch(e.target.value)}
			spellCheck
			placeholder={placeholder}
		/>
	);
}

export default Search;
