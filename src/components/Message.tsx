import { auth } from "../firebase";
import getTimeDifference from "../utils/timeStamp";
import testImage from "../assets/background.svg";
import { IMessage } from "./Main";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";
import { IChat } from "../Store/features/chatSlice";

function Message({ message, isNew }: { message: IMessage; isNew: boolean }) {
	const currentUserID = auth?.currentUser;
	const { partneredChat } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;

	return (
		<div
			className={` flex justify-start animate-bounce transition ${
				message?.senderId === currentUserID?.uid
					? "owner-parent"
					: "coming-parent"
			} ${isNew ? "animate-fadeIn" : "animate-none"} gap-3`}
		>
			<div>
				<div className=" w-[45px] h-[45px] rounded-full">
					<img
						className="rounded-full h-full w-full object-cover"
						src={
							message?.senderId === currentUserID?.uid
								? currentUserID?.photoURL || testImage
								: partneredChat.user.photoURL || testImage
						}
						alt={partneredChat?.user.displayName}
					/>
				</div>
				<span className="font-normal text-gray-400 text-xs">
					{getTimeDifference(Number(message?.date)) || ""}
				</span>
			</div>

			<div
				className={` ${
					message.senderId === currentUserID?.uid ? "owner" : "coming"
				} flex flex-[2] gap-5 text-white`}
			>
				{message.text && (
					<p
						style={{ overflowWrap: "anywhere" }}
						className=" max-w-[500px] w-fit border shadow-xl shadow-[#00000021] border-[#00000044] text-white text-sm md:text-base p-2"
					>
						{message.text}
					</p>
				)}
				{message.img && (
					<div className="w-1/2 max-w-[80%] h-[320px] rounded-lg shadow-2xl shadow-[#00000062]">
						<img
							className="h-full w-full object-cover"
							src={message?.img || testImage}
							alt={message.id}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default Message;
