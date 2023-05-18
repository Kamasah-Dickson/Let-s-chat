import React from "react";
import Sidebar from "../components/Sidebar";
import Chat_settings from "../components/Chat_settings";

function ChatSettingsPage() {
	return (
		<div className="flex max justify-center">
			<div className="flex-[12] sm:flex-[7] md:flex-[5] lg:flex-[4] xl:flex-[2.5]">
				<Sidebar />
			</div>
			<div className="flex-[8] ">
				<Chat_settings />
			</div>
		</div>
	);
}

export default ChatSettingsPage;
