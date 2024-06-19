import { useRef, useEffect } from "react";
import { AppDispatch, RootState } from "../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import {
	IChat,
	ITopChats,
	setChatOptions,
	setSearchedUsers,
	setSearchFocus,
} from "../Store/features/chatSlice";

function Search({ activeTab }: { activeTab: "community" | "contacts" }) {
	const { searchFocus, chat, contactsChat } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;
	const dispatch = useDispatch<AppDispatch>();
	const inputFocus = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (searchFocus) {
			inputFocus?.current?.focus();
			dispatch(setChatOptions({ setChatOptions: false }));
		}
	}, [dispatch, searchFocus]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (activeTab === "community") {
			if (e.target.value) {
				const filteredChat = chat.filter((singleChat: ITopChats) => {
					return singleChat.userInfo.displayName
						.toLowerCase()
						.includes(e.target?.value.trim().toLowerCase());
				});

				if (filteredChat) {
					const uniqueFoundChats = new Set(filteredChat);
					const usersWithoutDuplicate = [...uniqueFoundChats];
					dispatch(
						setSearchedUsers({ searchedUsers: usersWithoutDuplicate as [] })
					);
				}
			} else {
				dispatch(setSearchedUsers({ searchedUsers: [] }));
			}
		} else {
			if (e.target.value) {
				const filteredChat = contactsChat.filter((singleChat: ITopChats) => {
					return singleChat.userInfo.displayName
						.toLowerCase()
						.includes(e.target?.value.trim().toLowerCase());
				});

				if (filteredChat) {
					const uniqueFoundChats = new Set(filteredChat);
					const usersWithoutDuplicate = [...uniqueFoundChats];
					dispatch(
						setSearchedUsers({ searchedUsers: usersWithoutDuplicate as [] })
					);
				}
			} else {
				dispatch(setSearchedUsers({ searchedUsers: [] }));
			}
		}
	};

	return (
		<>
			<div
				onClick={() => dispatch(setSearchFocus({ searchFocus: true }))}
				onBlur={() => dispatch(setSearchFocus({ searchFocus: false }))}
				className=" bg-gray-700 py-[10px] px-2"
			>
				<input
					ref={inputFocus}
					className="bg-transparent w-full text-white outline-none"
					type="text"
					onChange={(e) => handleSearch(e)}
					placeholder={
						activeTab === "community"
							? "Search Community..."
							: "Search Contacts..."
					}
				/>
			</div>
			<Toaster />
		</>
	);
}

export default Search;
