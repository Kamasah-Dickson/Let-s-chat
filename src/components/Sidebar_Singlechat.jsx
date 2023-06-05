import React, { useContext, useEffect, useCallback, useState } from "react";
import { auth, db } from "../firebase";
import {
	get,
	off,
	onValue,
	ref,
	serverTimestamp,
	update,
	child,
} from "firebase/database";
import testImage from "../assets/background.svg";
import { ChatContext } from "../context/chatContext";
import { AllContext } from "../context/appContext";
import getTimeDifference from "../utils/timeStamp";
import { BeatLoader } from "react-spinners";

function Sidebar_Singlechat() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { setCombinedId } = useContext(AllContext);
	const [newMessageCounter, setNewMessageCounter] = useState([]);

	const {
		dispatch,
		newMessage,
		setSelectedUserID,
		setNewMessage,
		setIsOnline,
		data,
		onlineStatus,
		setOnlineStatus,
		chat,
		setChat,
	} = useContext(ChatContext);

	// ==============CountNewMessage===========

	useEffect(() => {
		//change from here
		const countNewMessage = () => {
			return newMessageCounter?.reduce((count, message) => {
				if (!message?.seen) {
					console.log(count + 1);
				} else {
					console.log(count);
				}
			}, 0);
		};
		countNewMessage();
	}, []);
	// =========================

	// ========================
	useEffect(() => {
		const chatRef = ref(db, "newMessages");
		const chatsListener = onValue(chatRef, (snapshot) => {
			const data = snapshot.val();
			// Convert the object of chats into an array
			const chatArray = Object.keys(data || {}).map((key) => ({
				chatId: key,
				...data[key],
			}));
			setNewMessage(chatArray);
		});

		return () => {
			off(chatRef, chatsListener);
		};
	}, []);

	// ==============last-seen==============

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

	useEffect(() => {
		function onlineStatusOrLastSeen(contactID) {
			const userIsOnline = onlineStatus.find(
				(online) => online?.userId === contactID
			);
			if (userIsOnline) {
				if (!userIsOnline?.status?.online) {
					const foundUser = [userIsOnline].find(
						(user) => user.userId === data?.user?.uid
					);

					if (foundUser) {
						setIsOnline({
							lastSeen:
								foundUser?.status?.lastSeen &&
								"Last seen " + getTimeDifference(foundUser?.status?.lastSeen),
							userId: userIsOnline?.userId,
							online: false,
						});
					}
				} else {
					const foundUser = [userIsOnline].find(
						(user) => user.userId === data?.user?.uid
					);
					if (foundUser) {
						setIsOnline({
							lastSeen: "Online",
							userId: foundUser.userId,
							online: true,
						});
					}
				}
			}
		}

		if (chat) {
			Object.values(chat)
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
				.map((users) => onlineStatusOrLastSeen(users.userInfo.uid));
		}
	}, [onlineStatus, chat, data?.user]);

	// ===========end userStatus===========

	useEffect(() => {
		let dataRef;
		let onData;

		function fetchContacts() {
			try {
				const currentUserID = auth?.currentUser?.uid;
				dataRef = ref(db, "userChats", currentUserID);
				onData = (snapshot) => {
					if (snapshot.exists()) {
						const retrievedData = snapshot.val();
						if (retrievedData) {
							setLoading(false);
							setError("");
							setChat(retrievedData);
						}
						setError("");
					}
				};

				onValue(dataRef, onData);

				const connectedRef = ref(db, ".info/connected");
				onValue(connectedRef, (snapshot) => {
					const isConnected = snapshot.val();
					if (!isConnected) {
						setError("Connection lost reconnecting...");
						setLoading(false);
					} else {
						setError(null);
						setLoading(false);
					}
				});
			} catch (error) {
				console.log(error);
				setLoading(false);
				setError("An error occurred while fetching data.");
			}
		}

		fetchContacts();

		return () => {
			off(dataRef, "value", onData);
			setLoading(false);
			setError(null);
		};
	}, []);

	const handleSelect = async (user) => {
		dispatch({ type: "CHANGE_USER", payload: user });
		const currentUserId = auth?.currentUser?.uid;
		const combinedId =
			currentUserId > user.uid
				? currentUserId + user.uid
				: user.uid + currentUserId;

		setCombinedId(combinedId);
		setSelectedUserID(user.uid);

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
					photoURL: user?.photoURL,
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

	const myNewMessage = useCallback((user) => {
		const matchedMessages = newMessage.find((arr) => arr[0] === user.uid);
		if (matchedMessages?.length > 0) {
			const allNewMessages = matchedMessages.map((matchedArray) => {
				const targetMessage = matchedArray[1]; //am accessing the newMessage which is at an index of 1 in the matched array
				return {
					id: matchedArray[0],
					date: targetMessage?.date,
					newMessage: targetMessage?.message,
					seen: false,
				};
			});

			setNewMessageCounter(allNewMessages);
			return allNewMessages;
		}
	}, []);

	function getTime(uid) {
		const timestamp = Number(
			newMessage.find((message) => message?.chatId === uid)?.date
		);
		const messageTime = isNaN(timestamp) ? "" : timestamp;

		return getTimeDifference(messageTime) || "";
	}

	return (
		<div className="flex flex-col h-full justify-center gap-3 w-full">
			{loading ? (
				<div className="flex h-full flex-col items-center justify-center">
					<BeatLoader color="#ffffff" loading={loading} size={15} />
				</div>
			) : (
				<div className="flex h-full flex-col items-center justify-center">
					<p className="text-[crimson] mb-3">{error}</p>
					<BeatLoader color="#ffffff" loading={error} size={15} />
				</div>
			)}
			{Object.values(chat)
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
				.map((userInfo) => {
					const { displayName, photoURL, uid } = userInfo.userInfo;

					return (
						<div
							onClick={() => handleSelect(userInfo.userInfo)}
							key={uid}
							className="flex items-center gap-5 justify-center transition-colors hover:bg-[rgba(255,255,255,0.06)] cursor-pointer rounded-md p-2"
						>
							<div className="rounded-full w-10 md:w-14 md:h-14 h-10 relative">
								<img
									className="h-full w-full object-cover rounded-full"
									src={photoURL || testImage}
									alt={displayName}
								/>
								{onlineStatus.find(
									(online) => online?.userId === userInfo?.userInfo?.uid
								)?.userIsOnline?.status?.online && (
									<div className="bg-sidebar_color p-[2px]  bottom-0 right-1 rounded-full absolute">
										<div className="bg-green rounded-full h-3 w-3"></div>
									</div>
								)}
							</div>
							<div className="flex-1">
								<h3 className="name">{displayName}</h3>

								<span className="message text-light_white">
									{`${
										newMessage
											.find((message) => message?.chatId === uid)
											?.newMessage?.slice(0, 15) ?? ""
									}...`}
								</span>
							</div>
							<div>
								<div className="flex items-end flex-col gap-2 text-light_white">
									{/* {countNewMessage() > 0 && (
										<span className="text-sm text-white bg-blue rounded-full w-5 h-5 flex items-center justify-center text-center">
											{Number(countNewMessage())}
										</span>
									)} */}
									<p className="text-xs">{getTime(uid)}</p>
								</div>
							</div>
						</div>
					);
				})}
		</div>
	);
}

export default Sidebar_Singlechat;
