import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { off, onValue, ref } from "firebase/database";
import testImage from "../assets/background.svg";
import { ChatContext } from "../context/chatContext";

function Sidebar_Singlechat() {
	const [chat, setChat] = useState([]);
	const [loading, setLoading] = useState(true);

	const { dispatch } = useContext(ChatContext);

	useEffect(() => {
		const currentUserID = auth?.currentUser?.uid;
		const dataRef = ref(db, "userChats", currentUserID);
		const onData = (snapshot) => {
			if (snapshot.exists()) {
				const retrievedData = snapshot.val();
				if (retrievedData) {
					setLoading(false);
					setChat(retrievedData);
				}
			} else {
				return;
			}
		};

		onValue(dataRef, onData);

		return () => {
			off(dataRef, "value", onData);
		};
	}, []);

	const handleSelect = (user) => {
		dispatch({ type: "CHANGE_USER", payload: user });
		// console.log(user);
	};

	return (
		<div className="flex flex-col justify-center gap-3 w-full">
			{loading && <p>Loading...</p>}
			{Object.entries(chat)?.map((chat) => {
				const userInfo = Object.values(chat[1])[0]?.userInfo;
				if (!userInfo) return null;

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
								{userInfo.lastMessage?.text}
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
