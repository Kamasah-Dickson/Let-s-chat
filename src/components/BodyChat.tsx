import { BsArrowDownCircleFill } from "react-icons/bs";
import { db } from "../firebase";
import { IMessage } from "./Main";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { Unsubscribe } from "firebase/auth";
import { IChat, setMessages } from "../Store/features/chatSlice";

interface IBodyChat {
	messages: [];
}
const BodyChat = ({ messages }: IBodyChat) => {
	const dispatch = useDispatch<AppDispatch>();
	const [scroller, setScroller] = useState(false);
	const mainRef = useRef<HTMLDivElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const { partneredChat } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;

	useEffect(() => {
		const containerRef = mainRef?.current;
		scrollToBottom();
		const handleScroll = () => {
			const scrollTop = containerRef?.scrollTop as number;
			const scrollHeight = containerRef?.scrollHeight as number;
			const clientHeight = containerRef?.clientHeight as number;
			const scrollBottom = scrollHeight - (scrollTop + clientHeight);

			if (scrollBottom > 40) {
				setScroller(true);
			} else {
				setScroller(false);
			}
		};
		containerRef?.addEventListener("scroll", handleScroll);

		return () => {
			containerRef?.removeEventListener("scroll", handleScroll);
		};
	}, [dispatch, mainRef, messages]);

	const scrollToBottom = () => {
		scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
	};

	//fetch and set chats
	useEffect(() => {
		try {
			const messagesRef = ref(
				db,
				"chats/" + partneredChat.combinedId + "/messages"
			);
			const messagesListener: Unsubscribe = onValue(messagesRef, (snapshot) => {
				const data = snapshot.val();
				if (data) {
					const messageArray = Object.keys(data).map((key) => ({
						id: key,
						...data[key],
					})) as IChat["messages"];
					dispatch(
						setMessages({
							messages: messageArray as IChat["messages"],
						})
					);

					// Remove the isNew flag after a delay
				} else {
					dispatch(
						setMessages({
							messages: [],
						})
					);
				}
			});

			return () => {
				messagesListener();
			};
		} catch (error) {
			console.log(error);
		}
	}, [dispatch, partneredChat.combinedId]);

	return (
		<div
			ref={mainRef}
			onClick={() =>
				dispatch({ type: "setOptions", payload: { options: false } })
			}
			className="flex h-full flex-col flex-1 overflow-y-auto"
		>
			{messages.length >= 1 ? (
				messages.map((message: IMessage, index) => (
					<Message
						key={message.id}
						message={message}
						isNew={index === messages.length - 1}
					/>
				))
			) : (
				<span className="h-full text-center text-lg font-medium text-gray-400 w-full grid place-content-center">
					There are no messages yet. Be the first to say hi! 😀
				</span>
			)}

			<div ref={scrollRef}></div>

			{scroller && (
				<button
					type="button"
					onClick={scrollToBottom}
					className="fixed bottom-32 right-10 z-50"
				>
					<BsArrowDownCircleFill
						size={25}
						className="text-[#ffffff80] hover:text-white"
					/>
				</button>
			)}
		</div>
	);
};

export default BodyChat;
