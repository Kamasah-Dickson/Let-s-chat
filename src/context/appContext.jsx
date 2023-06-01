/* eslint-disable react/prop-types */
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";

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
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [userError, setUserError] = useState(false);
	const [combinedID, setCombinedId] = useState("");

	useEffect(() => {
		const getProfile = JSON.parse(localStorage.getItem("userProfile"));
		if (getProfile) {
			setUserProfile(getProfile);
		}
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (signedUser) => {
			if (signedUser) {
				const { displayName, email, photoURL } = signedUser;
				setUserProfile(signedUser);
				localStorage.setItem(
					"userProfile",
					JSON.stringify({ displayName, email, photoURL })
				);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [auth.currentUser]);

	const updateUserProfile = (newUserData) => {
		setUserProfile(newUserData);
	};

	const values = {
		setSearchFocus,
		options,
		setOptions,
		searchFocus,
		settings,
		setsettings,
		updateUserProfile,
		userProfile,
		showTargetMessage,
		setShowTargetMessage,
		toggleSettingsCategory,
		setToggleSettingsCategory,
		searchedUsers,
		setSearchedUsers,
		userError,
		setUserError,
		setCombinedId,
		combinedID,
	};

	return <AllContext.Provider value={values}>{children}</AllContext.Provider>;
}

export default AppContext;
