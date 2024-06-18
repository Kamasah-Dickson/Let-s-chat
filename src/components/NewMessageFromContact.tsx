import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import CountNewMessages from "./CountNewMessages";
import getTimeDifference from "../utils/timeStamp";

const NewMessageFromContact = ({
	uid,
	displayName,
}: {
	uid: string;
	displayName: string;
}) => {
	const [newMessage, setNewMessage] = useState<{
		fromUser: "me" | "other";
		message: string;
		seen: boolean;
		date: number;
	}>({
		fromUser: "me",
		message: "",
		seen: false,
		date: 0,
	});

	useEffect(() => {
		const combinedId = [uid, auth.currentUser?.uid].sort().join("_");
		const dataRef = ref(db, `chats/${combinedId}`);
		const newMessageListener = onValue(dataRef, (snapshot) => {
			const data = snapshot.val();
			if (data && data.messages) {
				const refinedData = Object.values(data.messages);

				const lastMessage = refinedData[refinedData.length - 1] as {
					text: string;
					senderId: string;
					seen: boolean;
					date: number;
				};

				setNewMessage({
					message: lastMessage?.text as string,
					fromUser:
						lastMessage?.senderId === auth.currentUser?.uid ? "me" : "other",
					seen: lastMessage?.seen,
					date: lastMessage?.date,
				});
			}
		});

		return () => {
			newMessageListener();
		};
	}, [newMessage.fromUser, uid]);

	return (
		<>
			<div className="flex-1">
				<h3
					title={displayName}
					className="text-white font-medium truncate overflow-ellipsis block w-[130px]"
				>
					{displayName}
				</h3>
				<span
					className={`truncate overflow-ellipsis block w-[120px] ${
						newMessage.fromUser === "me"
							? "text-light_white"
							: `${newMessage.seen ? "text-light_white" : "text-green"}`
					}`}
				>
					{newMessage.message}
				</span>
			</div>
			<div>
				<div className="flex items-end flex-col gap-2 text-light_white">
					<CountNewMessages uid={uid} />
					<p className="text-xs">
						{getTimeDifference(newMessage.date as number)}
					</p>
				</div>
			</div>
		</>
	);
};

export default NewMessageFromContact;
