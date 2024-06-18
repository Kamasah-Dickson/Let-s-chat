import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import {
	IChat,
	ITopChats,
	setPartneredChat,
	setSelectedUserId,
} from "../Store/features/chatSlice";
import testImage from "../assets/background.svg";
import { auth } from "../firebase";
import { useState } from "react";
import NewMessageFromContact from "./NewMessageFromContact";

const SearchedUsers = () => {
	const { searchedUsers } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;

	const [activeChat, setActiveChat] = useState<
		ITopChats["userInfo"]["uid"] | null
	>(null);

	const dispatch = useDispatch<AppDispatch>();

	const selectUserToChat = async (user: ITopChats["userInfo"]) => {
		const currentUserId = auth?.currentUser?.uid as string;
		const combinedId = [currentUserId, user.uid].sort().join("_");
		dispatch(setPartneredChat({ user, combinedId }));
		dispatch(setSelectedUserId({ setSelectedUserId: user.uid }));
	};

	return searchedUsers.map((user: ITopChats) => {
		return (
			<div
				onClick={() => (
					selectUserToChat(user.userInfo), setActiveChat(user.userInfo.uid)
				)}
				key={user.userInfo.uid + user.date}
				className={` m-3 flex items-center gap-5 justify-center transition-colors ${
					activeChat === user.userInfo.uid ? "bg-[rgba(255,255,255,0.03)]" : ""
				} hover:bg-[rgba(255,255,255,0.06)] active:bg-[rgba(255,255,255,0.04)] cursor-pointer rounded-md p-2`}
			>
				{user.userInfo.displayName && (
					<div className="rounded-full w-10 md:w-14 md:h-14 h-10 relative ">
						<img
							className="h-full w-full object-cover rounded-full"
							src={user.userInfo.photoURL || testImage}
							alt=""
						/>
						{user.userInfo.online === "online" && (
							<div className="bg-sidebar_color p-[2px]  bottom-0 right-1 rounded-full absolute">
								<div className="bg-green rounded-full h-3 w-3"></div>
							</div>
						)}
					</div>
				)}

				<NewMessageFromContact
					uid={user?.userInfo.uid}
					displayName={user.userInfo.displayName}
				/>
			</div>
		);
	});
};

export default SearchedUsers;
