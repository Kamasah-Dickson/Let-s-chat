import { useSelector } from "react-redux";
import { IChat } from "../Store/features/chatSlice";
import { RootState } from "../Store/store";
import Sidebar_Singlechat from "./Sidebar_Singlechat";

const Community = () => {
	const { chat, searchedUsers }: any = useSelector<RootState>(
		(state) => state.chat
	) as IChat;

	return <Sidebar_Singlechat chat={chat} searchedUsers={searchedUsers} />;
};

export default Community;
