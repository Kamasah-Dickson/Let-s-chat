import React, { useContext, useEffect, useRef, useState } from "react";
import Header_main from "./Header_main";
import attach from "../assets/attach.svg";
import emoji from "../assets/emoji.svg";
import record from "../assets/record.svg";
import { AllContext } from "../context/appContext";
import Message from "./Message";
import { BsSendFill } from "react-icons/bs";
import { ChatContext } from "../context/chatContext";
import { auth, db, storage } from "../firebase";
import {
	off,
	onValue,
	ref,
	serverTimestamp,
	get,
	update,
	set,
	child,
} from "firebase/database";
import { v4 as uuid } from "uuid";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Main() {
	const { setOptions, combinedID } = useContext(AllContext);
	const textareaRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const { data, setNewMessage, selectedUserID } = useContext(ChatContext);

	const [text, setText] = useState("");
	const [img, setImg] = useState("");

	const handleInputChange = () => {
		const textarea = textareaRef.current;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	const currentUserId = auth?.currentUser?.uid;

	//do it at the sidebar

	// useEffect(() => {
	// 	const chatRef = ref(db, "newMessages");
	// 	const chatsListener = onValue(chatRef, (snapshot) => {
	// 		const data = snapshot.val();
	// 		// Convert the object of chats into an array
	// 		const chatArray = Object.keys(data || {}).map((key) => ({
	// 			chatId: key,
	// 			...data[key],
	// 		}));
	// 		setNewMessage(chatArray);
	// 	});

	// 	return () => {
	// 		// Detach the listener
	// 		off(chatRef, chatsListener);
	// 	};
	// }, []);

	useEffect(() => {
		const messagesRef = ref(db, "chats/" + combinedID + "/messages");
		const messagesListener = onValue(messagesRef, (snapshot) => {
			const data = snapshot.val();
			// Convert the object of messages into an array
			const messageArray = Object.keys(data || {}).map((key) => ({
				id: key,
				...data[key],
			}));

			setMessages(messageArray);
			setText("");
		});

		return () => {
			// Detach the listener
			off(messagesRef, messagesListener);
		};
	}, [combinedID, text]);

	const handleSend = async () => {
		if (img) {
			const storageRef = ref(storage, uuid);
			const uploadTask = uploadBytesResumable(storageRef, img);

			uploadTask.on("state_changed", () => {
				getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
					const message = {
						id: uuid(),
						text,
						senderId: currentUserId,
						img: downloadURL,
						date: serverTimestamp(),
					};
					const userRef = ref(db, `chats/${data.chatId}`);
					await update(userRef, {
						[`messages/${uuid()}`]: message,
					});
				});
			});
		} else {
			const message = {
				id: uuid(),
				text,
				senderId: currentUserId,
				date: serverTimestamp(),
			};

			const userRef = ref(db, `chats/${data.chatId}`);
			await update(userRef, {
				[`messages/${uuid()}`]: message,
			});

			const chatRef = ref(db, "newMessages");
			const currentUserChatRef = child(chatRef, selectedUserID);
			const currentUserChatSnapshot = await get(currentUserChatRef);

			/////////////////////
			if (currentUserChatSnapshot.exists()) {
				await update(currentUserChatRef, {
					newMessage: text,
					date: serverTimestamp(),
				});
			} else {
				await set(currentUserChatRef, {
					newMessage: text,
					date: serverTimestamp(),
				});
			}
			////////========

			onValue(chatRef, (snapshot) => {
				const data = snapshot.val();
				if (data) {
					const nestedKey = Object.entries(data); // Get the key of the nested object
					// const newMessage = data[nestedKey]; // Access the message value
					setNewMessage(nestedKey);
				}
			});
		}
	};

	return (
		<div className="main-bg">
			<Header_main />
			<div className="gradient my-height overflow-y-scroll flex flex-col justify-center">
				<div
					onClick={() => setOptions(true)}
					className="flex pt-5 flex-col gap-5   flex-[3] px-5 overflow-y-auto"
				>
					{messages.map((message) => (
						<Message key={message.id} message={message} />
					))}
					<label
						htmlFor="message"
						className="rounded-md h-[50px] mt-auto items-center shadow-sm shadow-[#0000004f] text-white bg-[#2E323C] md:my-full gap-5 w-full flex sticky
						bottom-5 md:bottom-10 p-3"
					>
						<input
							type="file"
							className="hidden"
							id="file"
							value={img}
							onChange={(e) => setImg(e.target.files[0])}
						/>
						<label htmlFor="file">
							<img
								src={attach}
								alt=""
								className="cursor-pointer h-full w-full"
							/>
						</label>

						<textarea
							rows="1"
							ref={textareaRef}
							onChange={(e) => (handleInputChange(), setText(e.target.value))}
							autoCorrect="true"
							autoComplete="true"
							id="message"
							value={text}
							className="w-full min-h-[30px] rounded-md h-auto bg-transparent object-cover border-none outline-none resize-none overflow-hidden"
							placeholder="Write a message..."
						></textarea>
						<img src={emoji} alt="" className="cursor-pointer" />
						<img src={record} alt="" className=" cursor-pointer" />
						<BsSendFill
							onClick={handleSend}
							color="#8A8A8A"
							size={25}
							className=" active:scale-[1.02] cursor-pointer h-fit"
						/>
					</label>
				</div>
			</div>
		</div>
	);
}

export default Main;
