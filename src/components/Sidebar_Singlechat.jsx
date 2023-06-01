import React, { useContext, useEffect, useState } from "react";
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

function Sidebar_Singlechat() {
	const [chat, setChat] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const { setCombinedId } = useContext(AllContext);

	const { dispatch, newMessage, setSelectedUserID, setNewMessage } =
		useContext(ChatContext);

	//do it at the sidebar
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
			// Detach the listener
			off(chatRef, chatsListener);
		};
	}, []);
	// =========================

	useEffect(() => {
		let dataRef;
		let onData;

		function fetchContacts() {
			setLoading(true);
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

				// Register the onData listener
				onValue(dataRef, onData);

				// Set up onDisconnect event
				const connectedRef = ref(db, ".info/connected");
				onValue(connectedRef, (snapshot) => {
					const isConnected = snapshot.val();
					if (!isConnected) {
						setError("Internet connection lost. Please check your network.");
						setLoading(false);
					} else {
						setError(null);
					}
				});
			} catch (error) {
				console.log(error);
				setLoading(false);
				setError("An error occurred while fetching data.");
			}
		}

		fetchContacts();

		// Cleanup function
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
		const matchedArray = newMessage.find((arr) => arr[0] === user.uid);
		if (matchedArray) {
			const targetMessage = matchedArray[1];
			return {
				newMessage: targetMessage.newMessage,
				date: targetMessage.date,
			};
		}
	};

	return (
		<div className="flex flex-col justify-center gap-3 w-full">
			{loading && <p className="text-white">Loading...</p>}
			{error && <p className="text-[crimson]">{error}</p>}
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
								<div className="bg-sidebar_color p-[2px]  bottom-0 right-1 rounded-full absolute">
									<div className="bg-green rounded-full h-3 w-3"></div>
								</div>
							</div>
							<div className="flex-1">
								<h3 className="name">{displayName}</h3>
								<span className="message text-light_white">
									{
										newMessage.find((message) => message.chatId === uid)
											.newMessage
									}
								</span>
							</div>
							<div>
								<div className="flex items-end flex-col gap-2 text-light_white">
									<p className="text-sm">
										{/* {myNewMessage(userInfo.userInfo)?.date} */}
									</p>
									<span className="text-sm text-white bg-blue rounded-full w-5 h-5 flex items-center justify-center text-center">
										2
									</span>
								</div>
							</div>
						</div>
					);
				})}
		</div>
	);
}

export default Sidebar_Singlechat;
