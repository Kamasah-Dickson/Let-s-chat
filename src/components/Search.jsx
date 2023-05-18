/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";

function Search({ placeholder, focus }) {
	const [search, setSearch] = useState("");
	const inputFocus = useRef(null);
	focus && inputFocus.current.focus();
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
