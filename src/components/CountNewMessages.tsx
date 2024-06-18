import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { IChat } from "../Store/features/chatSlice";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";
import newMessageSound from "../new-notification.mp3";

const CountNewMessages = ({ uid }: { uid: string }) => {
	const [newMessageCount, setNewMessageCount] = useState(0);
	const { partneredChat, showSidebar } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;

	useEffect(() => {
		let playedOnce = false;

		if (!playedOnce && newMessageCount > 0) {
			new Audio(newMessageSound).play();
			playedOnce = true;
		}
	}, [newMessageCount]);

	useEffect(() => {
		const combinedId = [uid, auth.currentUser?.uid].sort().join("_");
		const dataRef = ref(db, `chats/${combinedId}`);
		const newMessageListener = onValue(dataRef, (snapshot) => {
			const data = snapshot.val();
			if (data && data.messages) {
				const refinedData = Object.entries(data.messages).map(
					([key, value]: [string, any]) => {
						return {
							date: value.date,
							uid: [key, value.senderId],
							seen: value.seen,
							text: value.text,
						};
					}
				) as unknown as IChat["newMessage"];

				const filteredNewMessageFromContact = refinedData.filter(
					(newMessage) =>
						newMessage.uid[1] !== auth.currentUser?.uid &&
						newMessage.seen === false
				);
				if (filteredNewMessageFromContact) {
					setNewMessageCount(filteredNewMessageFromContact.length);
				}

				if (partneredChat.combinedId === combinedId && !showSidebar) {
					filteredNewMessageFromContact.forEach(async (message) => {
						await update(
							ref(db, `chats/${combinedId}/messages/${message.uid[0]}`),
							{
								seen: true,
							}
						);
					});
				}
			}
		});

		return () => {
			newMessageListener();
		};
	}, [partneredChat, showSidebar, uid]);
	return (
		newMessageCount >= 1 && (
			<span className="text-xs text-white bg-blue font-medium rounded-full p-1 aspect-square flex items-center justify-center text-center">
				{newMessageCount}
			</span>
		)
	);
};

export default CountNewMessages;
