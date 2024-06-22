import { useSelector } from "react-redux";
import SingleChatContact from "./SingleChatContact";
import { RootState } from "../Store/store";
import { IChat } from "../Store/features/chatSlice";

const Contacts = () => {
	const { contactsChat, partneredChat, searchedUsers } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;
	return (
		<>
			<SingleChatContact
				contactsChat={contactsChat}
				partneredChat={partneredChat}
				searchedUsers={searchedUsers}
			/>
		</>
	);
};

export default Contacts;
