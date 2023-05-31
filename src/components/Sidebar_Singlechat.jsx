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

	const { dispatch, newMessage } = useContext(ChatContext);

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
							// console.log(retrievedData);
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
			return targetMessage.newMessage;
		}
	};
	// const myNewMessage = (user) => {
	// 	return newMessage.map((data) => {
	// 		const getCOmbinedId = Object.entries(data[1]);
	// 		const combinedID = getCOmbinedId[0][0];
	// 		//check if user.id ==== data[0]
	// 		//if true get into the combined id and display the message
	// 		if (user.uid === data[0]) {
	// 			const contactData = data[1][combinedID];
	// 			console.log(contactData);
	// 			return contactData.newMessage;
	// 		}
	// 	});
	// };

	return (
		<div className="flex flex-col justify-center gap-3 w-full">
			{loading && <p className="text-white">Loading...</p>}
			{error && <p className="text-[crimson]">{error}</p>}
			{Object.entries(chat)?.map((chat) => {
				const userInfo = Object.values(chat[1])[0]?.userInfo;
				if (!userInfo) return null;

				// function getNewMessage(user) {
				// 	console.log(myNewMessage);
				// }

				return (
					<div
						onClick={() => handleSelect(userInfo)}
						key={chat[0]}
						className="flex items-center gap-5 justify-center transition-colors hover:bg-[rgba(255,255,255,0.06)] cursor-pointer rounded-md p-2"
					>
						<div className="rounded-full w-10 md:w-14 md:h-14 h-10 relative">
							<img
								className="h-full w-full object-cover rounded-full"
								src={userInfo.photoURL || testImage}
								alt={userInfo.displayName}
							/>
							<div className="bg-sidebar_color p-[2px]  bottom-0 right-1 rounded-full absolute">
								<div className="bg-green rounded-full h-3 w-3"></div>
							</div>
						</div>
						<div className="flex-1">
							<h3 className="name">{userInfo.displayName}</h3>
							<span className="message text-light_white">
								{myNewMessage(userInfo)}
							</span>
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
		</div>
	);
}

export default Sidebar_Singlechat;
