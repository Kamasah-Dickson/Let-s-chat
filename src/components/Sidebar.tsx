import { MdOutlineSettingsSuggest } from "react-icons/md";
import Search from "./Search";
import Menu_settings from "./Menu_settings";
import { AppDispatch, RootState } from "../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { ISettings, setSettings } from "../Store/features/settingsSlice";
import { useEffect, useState } from "react";
import { IChat } from "../Store/features/chatSlice";
import Contacts from "./Contacts";
import Community from "./Community";

function Sidebar() {
	const { settings } = useSelector<RootState>(
		(state) => state.settings
	) as ISettings;
	const [activeTab, setActiveTab] = useState<"community" | "contacts">(
		"community"
	);
	const { contactsChat, chat } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;
	const dispatch = useDispatch<AppDispatch>();
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		dispatch(setSettings({ settings: false }));
	}, [dispatch]);

	return (
		<>
			<Menu_settings settings={settings} />
			<div className="z-10 relative min-h-screen border-[#191D24] border-r">
				<div className="shadow gradient shadow-[#00000049] flex-col sticky top-0 bg-light_brown z-10">
					<div className="p-3">
						<MdOutlineSettingsSuggest
							onClick={() => dispatch(setSettings({ settings: true }))}
							color="white"
							size={25}
							cursor={"pointer"}
						/>
					</div>
					<div
						className={` ${
							activeTab == "community"
								? "border-white"
								: "border-b border-gray-600"
						}
								 font-medium text-white h-12 flex items-center border-b justify-between
								 `}
					>
						<button
							onClick={() => setActiveTab("community")}
							className={`${
								activeTab === "community"
									? "bg-gray-600/60 active:bg-gray-600"
									: "bg-none"
							} h-full w-full`}
							type="button"
						>
							Community
						</button>
						<button
							onClick={() => setActiveTab("contacts")}
							className={`${
								activeTab === "contacts"
									? "bg-gray-600/60 active:bg-gray-600"
									: ""
							} h-full w-full flex items-center justify-center gap-2`}
							type="button"
						>
							Contacts{" "}
							{contactsChat.length >= 1 && (
								<span className="bg-amber-700 rounded-full text-sm grid place-content-center text-center h-5 w-5">
									{contactsChat.length}
								</span>
							)}
						</button>
					</div>
					{activeTab === "contacts" && (
						<button
							onClick={() => setShowModal(true)}
							className="bg-blue h-14 font-medium text-white w-full active:bg-blue/95"
							type="button"
						>
							Invite Someone
						</button>
					)}
					{contactsChat.length >= 1 && chat.length >= 1 && (
						<Search activeTab={activeTab} />
					)}
				</div>
				{activeTab === "community" && <Community />}
				{activeTab === "contacts" && (
					<Contacts showModal={showModal} setShowModal={setShowModal} />
				)}
			</div>
		</>
	);
}

export default Sidebar;
