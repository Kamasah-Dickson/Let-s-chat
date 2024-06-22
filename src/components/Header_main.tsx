import { useEffect, useRef, useState } from "react";
import testImage from "../assets/background.svg";
import { MdSearch } from "react-icons/md";
import { HiOutlineArrowSmLeft, HiOutlineDotsVertical } from "react-icons/hi";
import { TbLogout } from "react-icons/tb";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import {
	IChat,
	setChatOptions,
	setSearchFocus,
	setShowSidebar,
	toggleChatOptions,
} from "../Store/features/chatSlice";
import getTimeDifference from "../utils/timeStamp";

function Header_main() {
	const [alert, setAlert] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { chatOptions, chat } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;

	const { partneredChat } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;
	const chatOptionRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleMouseDown = (event: MouseEvent) => {
			if (!chatOptionRef.current?.contains(event.target as Node)) {
				dispatch(setChatOptions({ chatOptions: false }));
			}
		};
		window.addEventListener("mousedown", handleMouseDown);
		return () => {
			window.removeEventListener("mousedown", handleMouseDown);
		};
	}, [dispatch]);

	return (
		<div
			className="bg-[#232733] border-[#191D24] border-b px-5 flex transition-colors p-3 sm:p-2 items-center gap-5 w-full"
			// className="position sticky top-0 left-0 bg-[#232733] border-[#191D24] border-b px-5 flex transition-colors p-3 sm:p-2 items-center gap-5 w-full"
		>
			<HiOutlineArrowSmLeft
				onClick={() => dispatch(setShowSidebar({ showSidebar: true }))}
				className="md:hidden flex"
				color="white"
				size={25}
				cursor={"pointer"}
			/>
			<div className=" cursor-pointer rounded-full w-14  h-14 relative ">
				<img
					className="h-full w-full object-cover rounded-full"
					src={partneredChat?.user.photoURL || testImage}
					alt={partneredChat?.user.displayName}
				/>

				{chat.find((chat) => chat?.userInfo.uid === partneredChat.user.uid)
					?.userInfo.online === "online" && (
					<div className="bg-sidebar_color p-[2px] bottom-0 right-1 rounded-full absolute">
						<div className="bg-green rounded-full h-3 w-3"></div>
					</div>
				)}
			</div>
			<div className="flex-1">
				<h3 className="text-white font-medium cursor-pointer">
					{partneredChat?.user.displayName || (
						<span className="text-[crimson]">Anonymous</span>
					)}
					{chat
						.filter((chat) => chat.userInfo.uid === partneredChat.user.uid)
						.map((chat) => {
							return (
								chat.userInfo.online === "offline" && (
									<p key={chat.date} className="text-xs text-light_white">
										{getTimeDifference(partneredChat?.user.lastSeen as number)}
									</p>
								)
							);
						})}
				</h3>
			</div>
			<div>
				<div className=" cursor-pointer flex gap-4 text-light_white">
					<div
						onClick={() => dispatch(setSearchFocus({ searchFocus: true }))}
						className="hidden hover:bg-light_white md:flex w-[35px] h-[35px]  items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-full"
					>
						<MdSearch size={20} color="white" />
					</div>

					<div
						ref={chatOptionRef}
						onClick={() => dispatch(toggleChatOptions())}
						className=" cursor-pointer w-[35px] hover:bg-light_white h-[35px] relative flex items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-full"
					>
						<HiOutlineDotsVertical size={20} color="white" />
						{chatOptions && (
							<div>
								<div className="absolute bg-[rgb(26,21,21)] border rounded-md border-[#0000004d] top-12 right-0">
									<div
										onClick={() => (
											setAlert(true),
											dispatch({
												type: "setOptions",
												payload: { options: false },
											})
										)}
										className="flex py-3 px-5 rounded-md items-center gap-2 cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
									>
										<TbLogout size={20} color="white" />
										<p className="text-white">Logout</p>
									</div>
									<div
										onClick={() => (
											dispatch(setShowSidebar({ showSidebar: true })),
											dispatch(setSearchFocus({ searchFocus: true }))
										)}
										className="flex py-3 px-5 rounded-md md:hidden items-center gap-2 cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
									>
										<MdSearch size={20} cursor={"pointer"} color="white" />
										<p className="text-white">Search</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				{alert && (
					<Modal
						setAlert={setAlert}
						notify={"Are you sure you want to log out from this account?"}
						type="logout"
					/>
				)}
			</div>
		</div>
	);
}

export default Header_main;
