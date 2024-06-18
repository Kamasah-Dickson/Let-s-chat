import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onValue, ref, update } from "firebase/database";
import testImage from "../assets/background.svg";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import {
	IChat,
	ITopChats,
	setChat,
	setNewMessage,
	setPartneredChat,
	setSelectedUserId,
	setShowSidebar,
} from "../Store/features/chatSlice";
import SearchedUsers from "./SearchedUsers";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import NewMessageFromContact from "./NewMessageFromContact";

function Sidebar_Singlechat({
	chat,
	searchedUsers,
}: {
	chat: ITopChats[];
	searchedUsers: ITopChats[];
}) {
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeChat, setActiveChat] = useState<
		ITopChats["userInfo"]["uid"] | null
	>(null);

	const { partneredChat } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;

	// update user online status
	useEffect(() => {
		const updateStatus = () => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					update(ref(db, `users/${user?.uid}`), {
						online: "offline",
						lastSeen: Date.now(),
					});
				}
			});
		};
		window.addEventListener("beforeunload", updateStatus);

		return () => {
			window.removeEventListener("beforeunload", updateStatus);
		};
	}, [chat]);

	//============fetch all new signedUp contacts========
	useEffect(() => {
		setLoading(true);
		let timeout: NodeJS.Timeout;
		const dataRef = ref(db, "users/");
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
							online: contacts.online,
							lastSeen: contacts.lastSeen,
						},
					};
				});

				dispatch(setChat({ chat: allContacts as ITopChats[] }));
				setLoading(false);
			}
		});

		return () => {
			contactListener();
			clearTimeout(timeout);
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
		const connectedRef = ref(db, ".info/connected");
		const connectionListener: Unsubscribe = onValue(
			connectedRef,
			(snapshot) => {
				const isConnected = snapshot.val();
				if (isConnected) {
					setError("");
					setLoading(false);
				} else {
					setError("Connection unstable");
				}
			}
		);

		return () => {
			connectionListener();
		};
	}, []);

	const selectUserToChat = async (user: ITopChats["userInfo"]) => {
		const currentUserId = auth?.currentUser?.uid as string;
		const combinedId = [currentUserId, user.uid].sort().join("_");
		dispatch(setPartneredChat({ user, combinedId }));
		dispatch(setSelectedUserId({ setSelectedUserId: user.uid }));
		dispatch(setShowSidebar({ showSidebar: false }));
	};

	return (
		<>
			{searchedUsers?.length > 0 ? (
				<SearchedUsers />
			) : (
				<div className="flex px-3 py-3 flex-col justify-center gap-3 w-full">
					{(!chat || chat.length === 0) && searchedUsers.length === 0 && (
						<p className="text-white text-md">
							You currently have no contacts please search for friends e.g
							<span className="text-[#6044db] font-medium">
								{" "}
								Kamasah Dickson
							</span>
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

					{[...(chat as ITopChats[])]
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
}

export default Sidebar_Singlechat;
