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
	push,
	set,
	child,
} from "firebase/database";
import { ref as storageRef } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Main() {
	const { setOptions, combinedID } = useContext(AllContext);
	const textareaRef = useRef(null);
	const { data, setNewMessage, selectedUserID, messages, setMessages } =
		useContext(ChatContext);

	const [text, setText] = useState("");
	const [img, setImg] = useState({});
	const currentUserId = auth?.currentUser?.uid;

	const handleInputChange = (e) => {
		const textarea = textareaRef.current;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
		setText(e.target.value);
	};

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
		});

		return () => {
			off(messagesRef, messagesListener);
		};
	}, [combinedID]);

	const handleKeyDown = (event) => {
		const { key, shiftKey } = event;

		if (key === "Enter") {
			if (shiftKey) {
				// Shift + Enter: Insert a new line
				event.preventDefault();
				const textarea = textareaRef.current;
				const start = textarea.selectionStart;
				const end = textarea.selectionEnd;
				const value = textarea.value;
				const newValue = `${value.substring(0, start)}\n${value?.substring(
					end
				)}`;
				setText(newValue);
				textarea.selectionStart = textarea.selectionEnd = start + 1;
				setTimeout(() => {
					const textarea = textareaRef.current;
					textarea.style.height = "auto";
					textarea.style.height = `${textarea.scrollHeight}px`;
				}, 0);
			} else {
				event.preventDefault();
				handleSend();
				setTimeout(() => {
					const textarea = textareaRef.current;
					textarea.style.height = "auto";
				}, 0);
			}
		}
	};

	const handleSend = async () => {
		if (img) {
			const sentImgRef = storageRef(storage, "sentImages/" + uuid());
			const uploadTask = uploadBytesResumable(sentImgRef, img);

			uploadTask.on("state_changed", () => {
				getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
					const message = {
						id: uuid(),
						text,
						senderId: currentUserId,
						img: downloadURL,
						date: serverTimestamp(),
					};

					const userRef = ref(db, `chats/${data.chatId}/messages`);
					const newMessageRef = push(userRef);
					await set(newMessageRef, message);
				});
			});
			setText("");
			setImg(null);
		} else {
			const message = {
				id: uuid(),
				text,
				senderId: currentUserId,
				date: serverTimestamp(),
			};

			const userRef = ref(db, `chats/${data.chatId}/messages`);
			const newMessageRef = push(userRef);
			await set(newMessageRef, message);
			setText("");

			const chatRef = ref(db, "newMessages");
			const currentUserChatRef = child(chatRef, selectedUserID);
			const currentUserChatSnapshot = await get(currentUserChatRef);

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

			onValue(chatRef, (snapshot) => {
				const data = snapshot.val();
				if (data) {
					const nestedKey = Object.entries(data); // Get the key of the nested object
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
					className="flex pt-5 flex-col gap-3 flex-[3] px-5 overflow-y-auto"
				>
					{messages.map((message) => (
						<Message key={message.id} message={message} />
					))}

					<label
						htmlFor="message"
						className={`${
							messages.length > 6 ? "mt-[5rem] " : "mt-auto "
						}rounded-md h-auto items-center shadow-sm shadow-[#0000004f] text-white bg-[#2E323C] md:my-full gap-5 w-full flex sticky
						bottom-5 md:bottom-10 p-3`}
					>
						<input
							type="file"
							className="hidden"
							id="file"
							// value={img}
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
							ref={textareaRef}
							rows="1"
							onChange={(e) => handleInputChange(e)}
							onKeyDown={handleKeyDown}
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
