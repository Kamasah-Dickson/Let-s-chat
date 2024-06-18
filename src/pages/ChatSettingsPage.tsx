import Chat_settings from "../components/Chat_settings";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";
import { ISettings } from "../Store/features/settingsSlice";
import Menu_settings from "../components/Menu_settings";

function ChatSettingsPage() {
	const { toggleSettingsCategory } = useSelector<RootState>(
		(state) => state.settings
	) as ISettings;

	return (
		<div className="flex max">
			{/* Sidebar */}
			<div
				className={`
  flex-[8] sm:flex-[6] md:flex-[5] lg:flex-[4] xl:flex-[2.5]
  ${toggleSettingsCategory && "hidden md:block lg:block xl:block"}`}
			>
				<Menu_settings />
			</div>

			{/* Notifications */}
			<div
				className={`flex-[8] ${
					!toggleSettingsCategory && "hidden md:block lg:block xl:block"
				}`}
			>
				<Chat_settings />
			</div>
		</div>
	);
}

export default ChatSettingsPage;
