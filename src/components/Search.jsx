/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect, useContext } from "react";
import { AllContext } from "../context/appContext";
import { MdSearch } from "react-icons/md";
import testImage from "../assets/background.svg";

import { auth, db } from "../firebase";
import {
	child,
	ref,
	serverTimestamp,
	onValue,
	update,
	get,
} from "firebase/database";
import { ChatContext } from "../context/chatContext";
import getTimeDifference from "../utils/timeStamp";
import toast, { Toaster } from "react-hot-toast";

function Search({ searchFocus }) {
	const {
		setOptions,
		setUserError,
		setSearchedUsers,
		setSearchFocus,
		setCombinedId,
	} = useContext(AllContext);

	const { dispatch, newMessage, onlineStatus, chat, setOnlineStatus } =
		useContext(ChatContext);

	const inputFocus = useRef(null);
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (searchFocus) {
			inputFocus.current.focus();
			setOptions(true);
		}
	}, [searchFocus]);

	useEffect(() => {
		const allUserIds = Object.values(chat)
			?.flatMap((chatResult) => Object.values(chatResult))

			.sort((a, b) => {
				const aTargetMessage = myNewMessage(a.userInfo);
				const bTargetMessage = myNewMessage(b.userInfo);
				return bTargetMessage?.date - aTargetMessage?.date;
			})
			.reduce((uniqueUsers, userInfo) => {
				const existingUser = uniqueUsers.find(
					(user) => user.userInfo.uid === userInfo.userInfo.uid
				);
				if (!existingUser) {
					uniqueUsers.push(userInfo);
				}
				return uniqueUsers;
			}, [])
			.filter((user) => user.userInfo.uid !== auth?.currentUser?.uid)
			.map((users) => users.userInfo.uid);

		const getUserStatus = async (userId) => {
			const userStatusRef = ref(db, `/userStatus/${userId}`);
			const snapshot = await get(userStatusRef);
			if (snapshot.exists()) {
				return snapshot.val();
			} else {
				const userStatus = {
					online: false,
					lastSeen: serverTimestamp(),
				};
				await update(userStatusRef, userStatus);
				return userStatus;
			}
		};

		const fetchUserStatuses = async () => {
			if (auth.currentUser) {
				const userIds = allUserIds.filter(
					(uid) => uid !== auth.currentUser.uid
				);
				const userStatuses = await Promise.all(userIds.map(getUserStatus));

				const formattedStatuses = userStatuses.map((status, index) => ({
					userId: userIds[index],
					status,
				}));
				setOnlineStatus(formattedStatuses);
			}
		};

		fetchUserStatuses();
	}, []);

	const handleSearch = async () => {
		try {
			setUserError(false);
			const starCountRef = ref(db, "users");
			onValue(starCountRef, (snapshot) => {
				const data = snapshot.val();
				if (data) {
					let filtered = Object.values(data)
						.filter((data) => data.uid !== auth?.currentUser?.uid)
						.map((data) => data)
						.filter((data) =>
							data.displayName
								.toLowerCase()
								.includes(search.toLocaleLowerCase())
						);
					if (filtered.length > 0) {
						setSearchedUsers(filtered);
						setSearch("");
					} else {
						toast.error(`${search?.toLocaleLowerCase()} was not found`);
					}
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
		const currentUserId = auth?.currentUser?.uid;
		const combinedId =
			currentUserId > user.uid
				? currentUserId + user.uid
				: user.uid + currentUserId;

		setCombinedId(combinedId);

		try {
			const chatRef = ref(db, "chats/" + combinedId + "/messages");
			const chatSnapshot = await get(chatRef);

			if (!chatSnapshot.exists()) {
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
						date: serverTimestamp(),
					},
				});
				await update(otherUserChatRef, {
					[combinedId]: {
						userInfo: {
							uid: currentUserId,
							displayName: auth.currentUser.displayName,
							photoURL: auth.currentUser.photoURL,
						},
						date: serverTimestamp(),
					},
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const myNewMessage = (user) => {
		const matchedArray = newMessage?.find((arr) => arr[0] === user.uid);
		if (matchedArray) {
			const targetMessage = matchedArray[1];
			return targetMessage?.newMessage;
		}
	};

	function getTime(uid) {
		const timestamp = Number(
			newMessage?.find((message) => message?.uid === uid)?.date
		);
		const messageTime = isNaN(timestamp) ? "" : timestamp;

		return getTimeDifference(messageTime) || "";
	}

	//get all exitingCOntactsId
	const existingContacts = Object.values(chat)
		?.flatMap((chatResult) => Object.values(chatResult))

		.sort((a, b) => {
			const aTargetMessage = myNewMessage(a.userInfo);
			const bTargetMessage = myNewMessage(b.userInfo);

			return bTargetMessage?.date - aTargetMessage?.date;
		})
		.reduce((uniqueUsers, userInfo) => {
			const existingUser = uniqueUsers.find(
				(user) => user.userInfo.uid === userInfo.userInfo.uid
			);
			if (!existingUser) {
				uniqueUsers.push(userInfo);
			}
			return uniqueUsers;
		}, [])
		.filter((user) => user.userInfo.uid !== auth?.currentUser?.uid)
		.map((users) => users.userInfo.uid);

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
				<MdSearch
					cursor={"pointer"}
					color="white"
					size={20}
					onClick={handleSearch}
				/>
			</div>

			{userError && <span>No users was found</span>}
			<Toaster />

			{searchedUsers
				?.filter((contact) => !existingContacts.includes(contact.uid))
				?.map((user) => {
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
								{onlineStatus.find((online) => online?.userId === user?.uid)
									?.userIsOnline?.status?.online && (
									<div className="bg-sidebar_color p-[2px]  bottom-0 right-1 rounded-full absolute">
										<div className="bg-green rounded-full h-3 w-3"></div>
									</div>
								)}
							</div>
							<div className="flex-1 ">
								<h3 className="name">{user.displayName}</h3>
								<span className="message text-light_white">
									{myNewMessage(user)?.slice(0, 15) ?? ""}
								</span>
							</div>
							<div>
								<div className="flex items-end flex-col gap-2 text-light_white">
									<p className="text-sm">{getTime(user?.uid) || ""}</p>
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
