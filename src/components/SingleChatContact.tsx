import { useEffect, useState } from "react";
import {
	IChat,
	ITopChats,
	setContactsChat,
	setNewMessage,
	setPartneredChat,
	setSelectedUserId,
} from "../Store/features/chatSlice";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../firebase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store/store";
import { Unsubscribe } from "firebase/auth";
import { BarLoader } from "react-spinners";
import testImage from "../assets/background.svg";
import SearchedUsers from "./SearchedUsers";
import NewMessageFromContact from "./NewMessageFromContact";

const SingleChatContact = ({
	contactsChat,
	partneredChat,
	searchedUsers,
}: {
	contactsChat: ITopChats[];
	partneredChat: {
		user: ITopChats["userInfo"];
		combinedId: string;
	};
	searchedUsers: ITopChats[];
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const dispatch = useDispatch<AppDispatch>();
	const [activeChat, setActiveChat] = useState<
		ITopChats["userInfo"]["uid"] | null
	>(null);
	//============fetch all  contacts========
	useEffect(() => {
		setLoading(true);
		const dataRef = ref(db, `users/${auth.currentUser?.uid}/contacts`);
		const contactListener = onValue(dataRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const allContacts = Object.values(data).map((contacts: any) => {
					return {
						date: contacts.date,
						userInfo: {
							displayName: contacts.displayName,
							photoURL: contacts.photoURL,
							uid: contacts.uid,
						},
					};
				});
				dispatch(setContactsChat({ contactsChat: allContacts }));
				setLoading(false);
			}
		});

		return () => {
			contactListener();
		};
	}, [dispatch]);

	//get all new Messages
	useEffect(() => {
		try {
			const newMessageRef = ref(
				db,
				"chats/" + partneredChat.user.uid + "/newMessage"
			);

			const messagesListener: Unsubscribe = onValue(
				newMessageRef,
				(snapshot) => {
					const data = snapshot.val();
					if (data) {
						const newMessage = Object.values(data);
						dispatch(
							setNewMessage({
								newMessage: newMessage as IChat["newMessage"],
							})
						);
					}
				}
			);

			return () => {
				messagesListener();
			};
		} catch (error) {
			console.log(error);
		}
	}, [dispatch, partneredChat.user.uid]);

	//connection loading chats
	useEffect(() => {
		try {
			const connectedRef = ref(db, ".info/connected");
			const connectionListener: Unsubscribe = onValue(
				connectedRef,
				(snapshot) => {
					const isConnected = snapshot.val();
					if (isConnected) {
						setError("");
						setLoading(false);
					}
				}
			);

			return () => {
				connectionListener();
			};
		} catch (error: any) {
			setLoading(false);
			console.log(error.code);
			console.error("Firebase Error:", error.code, error.message); // More detailed logging
			if (error.code === "DISCONNECTED") {
				setError("Connection lost. Please check your internet connection.");
			} else {
				setError("An unexpected error occurred.");
			}
		}
	}, []);

	const selectUserToChat = async (user: ITopChats["userInfo"]) => {
		const currentUserId = auth?.currentUser?.uid as string;
		const combinedId = [currentUserId, user.uid].sort().join("_");
		dispatch(setPartneredChat({ user, combinedId }));
		dispatch(setSelectedUserId({ setSelectedUserId: user.uid }));
	};

	return (
		<>
			{searchedUsers?.length > 0 ? (
				<SearchedUsers />
			) : (
				<div className="flex px-3 py-3 flex-col justify-center gap-3 w-full">
					{(!contactsChat || contactsChat.length === 0) &&
						SearchedUsers.length === 0 && (
							<p className="text-gray-500 text-center text-md">
								You currently have no contacts
							</p>
						)}
					{loading && !error && (
						<div className="flex h-full flex-col items-center justify-center my-5">
							<BarLoader
								color="#ffffff"
								loading={loading}
								height={3}
								width={150}
							/>
						</div>
					)}
					{error && (
						<>
							<div className="flex h-full flex-col items-center justify-center">
								<p className="text-[crimson] text-md mb-3">{error}</p>
							</div>
						</>
					)}

					{[...(contactsChat as ITopChats[])]
						.sort((a, b) => Number(b?.date) - Number(a?.date))
						.filter((user) => {
							return user.userInfo.uid !== auth.currentUser?.uid;
						})
						.map((chat) => {
							const { displayName, photoURL, uid, online } =
								chat.userInfo || {};
							return (
								displayName && (
									<div
										onClick={() => (
											selectUserToChat(chat?.userInfo),
											setActiveChat(chat.userInfo.uid)
										)}
										key={uid + photoURL}
										className={`flex items-center gap-5 justify-center transition-colors ${
											activeChat === chat.userInfo.uid
												? "bg-[rgba(255,255,255,0.03)]"
												: ""
										} hover:bg-[rgba(255,255,255,0.06)] active:bg-[rgba(255,255,255,0.04)] cursor-pointer rounded-md p-2`}
									>
										<div className="rounded-full w-14 h-14 relative">
											<img
												className="h-full w-full object-cover rounded-full"
												src={photoURL || testImage}
												alt={displayName as string}
											/>

											{online === "online" && (
												<div className="bg-sidebar_color p-[2px]  bottom-0 right-1 rounded-full absolute">
													<div className="bg-green rounded-full h-3 w-3"></div>
												</div>
											)}
										</div>

										<NewMessageFromContact
											uid={uid}
											displayName={displayName}
										/>
									</div>
								)
							);
						})}
				</div>
			)}
		</>
	);
};

export default SingleChatContact;
