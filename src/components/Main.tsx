import Header_main from "./Header_main";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import { IChat, setShowSidebar } from "../Store/features/chatSlice";
import ChatInput from "./ChatInput";
import { MdMenu } from "react-icons/md";
import BodyChat from "./BodyChat";

export type ImgType = {
	type: Blob | MediaSource;
	name: string;
} | null;

export interface IMessage {
	senderId: string;
	text: string;
	message: string;
	date: number;
	img: string;
	id: string;
	isNew: boolean;
}
function Main() {
	const { messages, partneredChat } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;

	const dispatch = useDispatch<AppDispatch>();

	return (
		<>
			<Toaster />
			<div className="main-bg">
				{partneredChat.user.uid ? (
					<div className="gradient h-screen flex flex-col justify-between">
						<Header_main />
						<BodyChat messages={messages} />
						<ChatInput partneredChat={partneredChat} />
					</div>
				) : (
					<>
						<div className="flex h-screen items-center justify-center">
							<MdMenu
								onClick={() => dispatch(setShowSidebar({ showSidebar: true }))}
								cursor={"pointer"}
								size={25}
								className="absolute text-white/80 active:scale-[1.02] hover:text-white transition top-5 left-5"
							/>
							<h1 className="flex items-center justify-center bg-[#0000003b] py-1 px-4 rounded-3xl text-white">
								Select a chat to start messaging{" "}
								<span className="text-2xl">💬</span>
							</h1>
						</div>
					</>
				)}
			</div>
		</>
	);
}

export default Main;
