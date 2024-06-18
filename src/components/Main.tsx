import Header_main from "./Header_main";

import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import { IChat, setShowSidebar } from "../Store/features/chatSlice";
import ChatInput from "./ChatInput";
import BodyChat from "./BodyChat";
import { setSettings } from "../Store/features/settingsSlice";
import { MdMenu } from "react-icons/md";

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

	const { settings }: any = useSelector<RootState>((state) => state.settings);
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div className="main-bg">
			{partneredChat.user.uid ? (
				<>
					<Toaster />
					<div className="gradient h-full overflow-y-scroll flex flex-col justify-between">
						<Header_main />
						<BodyChat messages={messages} />
						<ChatInput partneredChat={partneredChat} />
					</div>
				</>
			) : (
				<>
					{settings && (
						<div
							onClick={() => dispatch(setSettings({ settings: false }))}
							className=" bg-[#00000073] inset-0 h-full w-full absolute "
						></div>
					)}
					<div className="flex h-full items-center justify-center">
						<MdMenu
							onClick={() => dispatch(setShowSidebar({ showSidebar: true }))}
							cursor={"pointer"}
							size={25}
							className="absolute text-white/80 active:scale-[1.02] hover:text-white transition top-5 left-5"
						/>
						<h1 className="flex items-center  justify-center bg-[#0000003b] py-1 px-4 rounded-3xl text-white">
							Select a chat to start messaging{" "}
							<span className="text-2xl">💬</span>
						</h1>
					</div>
				</>
			)}
		</div>
	);
}

export default Main;
