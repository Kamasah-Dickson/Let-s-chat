/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect, useContext } from "react";
import { AllContext } from "../context/appContext";
import { MdSearch } from "react-icons/md";
import testImage from "../assets/background.svg";

import { auth, db } from "../firebase";
import {
	child,
	get,
	ref,
	serverTimestamp,
	set,
	onValue,
	update,
} from "firebase/database";
import { ChatContext } from "../context/chatContext";

function Search({ searchFocus }) {
	const { setOptions, setUserError, setSearchedUsers, setSearchFocus } =
		useContext(AllContext);
	const { dispatch } = useContext(ChatContext);

	const inputFocus = useRef(null);
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (searchFocus) {
			inputFocus.current.focus();
			setOptions(true);
		}
	}, [searchFocus]);

	const handleSearch = async () => {
		try {
			setUserError(false);
			const starCountRef = ref(db, "users");
			onValue(starCountRef, (snapshot) => {
				const data = snapshot.val();
				// updateStarCount(postElement, data);
				if (data) {
					let filtered = Object.values(data).filter((data) =>
						data.displayName.toLowerCase().includes(search.toLocaleLowerCase())
					);
					setSearchedUsers(filtered);
					setSearch("");
				}
			});
		} catch (error) {
			console.log(error);
			setUserError(true);
		}
	};

	function handleKey(e) {
		if (searchFocus && e.code == "Enter") {
			handleSearch();
		}
	}
	/////////////////////////////////

	const { userError, searchedUsers } = useContext(AllContext);

	const handleSelect = async (user) => {
		dispatch({ type: "CHANGE_USER", payload: user });
		const currentUserId = auth.currentUser.uid;
		const combinedId =
			currentUserId > user.uid
				? currentUserId + user.uid
				: user.uid + currentUserId;

		try {
			const chatCollectionRef = ref(db, "chats");
			const chatSnapshot = await get(child(chatCollectionRef, combinedId));

			if (!chatSnapshot.exists()) {
				const newChatData = {
					messages: [],
				};
				await set(child(chatCollectionRef, combinedId), newChatData);

				const userChatsRef = ref(db, "userChats");
				const currentUserChatRef = child(userChatsRef, currentUserId);
				const otherUserChatRef = child(userChatsRef, user.uid);

				const userInfo = {
					uid: user.uid,
					displayName: user.displayName,
					photoURL: user.photoURL,
				};

				await update(currentUserChatRef, {
					[combinedId]: {
						userInfo,
						data: serverTimestamp(),
					},
				});

				await update(otherUserChatRef, {
					[combinedId]: {
						userInfo: {
							uid: currentUserId,
							displayName: auth.currentUser.displayName,
							photoURL: auth.currentUser.photoURL,
						},
						data: serverTimestamp(),
					},
				});
			} else {
				console.log("Chat collection already exists");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div
				onClick={() => setSearchFocus(true)}
				onBlur={() => setSearchFocus(false)}
				className="sticky my-4 -top-2 overflow-hidden z-10 shadow shadow-[#00000049] bg-light_brown py-[10px] px-2 rounded-md flex items-center justify-between"
			>
				<input
					ref={inputFocus}
					className="bg-transparent w-full text-white outline-none"
					type="text"
					name=""
					value={search}
					onKeyDown={handleKey}
					onChange={(e) => setSearch(e.target.value)}
					spellCheck
					placeholder="Search..."
				/>
				{/* <Search searchFocus={searchFocus} placeholder="Search..." /> */}
				<MdSearch cursor={"pointer"} color="white" size={20} />
			</div>

			{userError && <span>No users was found</span>}
			{searchedUsers &&
				searchedUsers.map((user) => {
					return (
						<div
							onClick={() => handleSelect(user)}
							key={user.uid}
							className="flex transition-colors hover:bg-[rgba(255,255,255,0.06)] cursor-pointer rounded-md p-2 items-center gap-5 w-full"
						>
							<div className="rounded-full w-10 md:w-14 md:h-14 h-10 relative ">
								<img
									className="h-full w-full object-cover rounded-full"
									src={user.photoURL || testImage}
									alt=""
								/>
								<div className="bg-sidebar_color p-[2px]  bottom-0 right-1 rounded-full absolute">
									<div className="bg-green rounded-full h-3 w-3  "></div>
								</div>
							</div>
							<div className="flex-1 ">
								<h3 className="name">{user.displayName}</h3>
								<span className="message text-light_white">Check this out</span>
							</div>
							<div>
								<div className="flex items-end flex-col gap-2 text-light_white">
									<p className="text-sm">3:27PM</p>
									<span className="text-sm text-white bg-blue rounded-full w-5 h-5 flex items-center justify-center text-center">
										2
									</span>
								</div>
							</div>
						</div>
					);
				})}
		</>
	);
}

export default Search;
