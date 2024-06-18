import { useSelector } from "react-redux";
import SingleChatContact from "./SingleChatContact";
import { RootState } from "../Store/store";
import { IChat } from "../Store/features/chatSlice";
import Modal from "./Modal";

const Contacts = ({
	showModal,
	setShowModal,
}: {
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
			{showModal && <Modal type="invite" setAlert={setShowModal} />}
		</>
	);
};

export default Contacts;
