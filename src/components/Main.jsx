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
import toast, { Toaster } from "react-hot-toast";
import { BsArrowDownCircleFill } from "react-icons/bs";
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
import { MdClose } from "react-icons/md";

function Main() {
	const { setOptions, combinedID, settings, setSettings } =
		useContext(AllContext);
	const textareaRef = useRef(null);
	const scrollRef = useRef(null);
	const scrolltoBottomRef = useRef(null);
	const mainRef = useRef(null);
	const {
		data,
		setNewMessage,
		messages,
		setMessages,
		setNewMessageCounter,
		newMessageCounter,
		selectedUserID,
	} = useContext(ChatContext);
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [scroller, setScroller] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const currentUserId = auth?.currentUser?.uid;

	const focusTextarea = () => {
		setTimeout(() => {
			textareaRef?.current?.focus();
		}, 0);
	};

	useEffect(() => {
		const updateSeenMessages = () => {
			mainRef?.current?.addEventListener("scroll", handleScroll);
			function handleScroll() {
				if (currentUserId) {
					const remainingNewMessages = newMessageCounter.filter(
						(sentMessage) =>
							!messages.some((message) => message.uuid === sentMessage.uuid)
					);

					const messagesSeen = newMessageCounter.filter((sentMessage) =>
						messages.some((message) => message.uuid === sentMessage.uuid)
					);
					if (messagesSeen.length > 0) {
						messagesSeen.forEach((message) => {
							const newMessage = {
								...message,
								seen: true,
							};
							const newChatRef = ref(
								db,
								`countNewChats/messages/${newMessage.id}`
							);
							set(newChatRef, newMessage);
						});
					}
					setNewMessageCounter(remainingNewMessages);
				}
			}

			return () => {
				mainRef?.current?.removeEventListener("scroll", handleScroll);
			};
		};
		updateSeenMessages();
	}, [newMessageCounter, messages]);

	useEffect(() => {
		try {
			focusTextarea();
			const messagesRef = ref(db, "chats/" + combinedID + "/messages");
			const messagesListener = onValue(messagesRef, (snapshot) => {
				const data = snapshot.val();
				const messageArray = Object.keys(data || {}).map((key) => ({
					id: key,
					...data[key],
				}));
				setMessages(messageArray);
			});

			return () => {
				off(messagesRef, messagesListener);
			};
		} catch (error) {
			console.log(error);
		}
	}, [combinedID]);

	useEffect(() => {
		mainRef?.current?.addEventListener("scroll", handleScroll);
		function handleScroll() {
			const scrollBottom =
				mainRef?.current?.scrollHeight -
				(mainRef?.current?.scrollTop + mainRef?.current?.clientHeight);
			if (scrollBottom > 50) {
				setScroller(true);
			} else {
				setScroller(false);
			}
		}

		return () => {
			mainRef?.current?.removeEventListener("scroll", handleScroll);
		};
	}, [messages]);

	const scrollToBottom = () => {
		scrollRef?.current.scrollIntoView({ behavior: "smooth" });
	};

	const handleInputChange = (e) => {
		const textarea = textareaRef.current;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
		setText(e.target.value);
	};

	const handleKeyDown = (event) => {
		const { key, shiftKey } = event;

		if (key === "Enter") {
			if (shiftKey) {
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
				!isSending && textareaRef?.current?.focus();
			} else {
				event.preventDefault();
				if (text || img) {
					handleSend();
					setTimeout(() => {
						const textarea = textareaRef.current;
						textarea.style.height = "auto";
					}, 0);
					!isSending && textareaRef?.current?.focus();
				}
			}
		}
	};

	const handleSend = async () => {
		if (isSending) {
			// Return if a message is already being sent
			setText("");
			return;
		} else {
			setIsSending(true);
		}

		if (img) {
			const sentImgRef = storageRef(storage, "sentImages/" + uuid());
			const uploadTask = uploadBytesResumable(sentImgRef, img);

			uploadTask.on(
				"state_changed",
				() => {
					// handle Progress or other snapshot updates
				},
				(error) => {
					console.log("Upload error:", error);
					toast.error("Error uploading file");
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref)
						.then(async (downloadURL) => {
							const message = {
								id: uuid(),
								text,
								senderId: currentUserId,
								img: downloadURL,
								date: serverTimestamp(),
								seen: false,
							};
							const userRef = ref(db, `chats/${data.chatId}/messages`);
							const newMessageRef = push(userRef);
							await set(newMessageRef, message);
							setText("");
						})
						.catch((error) => {
							console.log("Download URL error:", error);
						});
				}
			);
			setImg(null);
		} else if (text) {
			const message = {
				id: uuid(),
				text,
				senderId: currentUserId,
				date: serverTimestamp(),
				seen: false,
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
					id: selectedUserID,
				});
			}

			const updatedSnapshot = await get(currentUserChatRef);

			if (updatedSnapshot.exists()) {
				const data = updatedSnapshot.val();
				if (data) {
					setNewMessage([data]);
				}
			}

			setIsSending(false);
		} else {
			return;
		}
	};

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		const isImageFile = (fileType) => {
			return (
				fileType.startsWith("image/jpeg") ||
				fileType.startsWith("image/png") ||
				fileType.startsWith("image/svg+xml") ||
				fileType.startsWith("image/gif") ||
				fileType.startsWith("image/webp")
			);
		};

		const fileType = file.type || "application/octet-stream";
		if (file && isImageFile(fileType)) {
			setImg(file);
		} else {
			toast.error("Sorry you can only upload an image file for now");
		}
	};

	const getLocalUpload = (img) => {
		textareaRef?.current?.focus();
		const file = img;
		const isImageFile = (fileType) => {
			return (
				fileType.startsWith("image/jpeg") ||
				fileType.startsWith("image/png") ||
				fileType.startsWith("image/svg+xml") ||
				fileType.startsWith("image/gif") ||
				fileType.startsWith("image/webp")
			);
		};

		const fileType = file.type || "application/octet-stream";
		if (file && isImageFile(fileType)) {
			return URL.createObjectURL(file);
		} else {
			// Not an image file
			toast.error("Sorry you can only upload an image file for now");
		}
	};

	return (
		<div className="main-bg">
			{data.chatId ? (
				<>
					<Toaster />
					<Header_main />
					<div className="gradient my-height overflow-y-scroll flex flex-col justify-center">
						<div
							ref={mainRef}
							onClick={() => setOptions(true)}
							className="flex pt-5 flex-col gap-7 flex-[3] px-5 overflow-y-auto"
						>
							{messages.map((message) => (
								<Message key={message.id} message={message} />
							))}

							<div className="opacity-0 w-0 h-0" ref={scrollRef}>
								{/* scroll to here */}
							</div>

							<div
								className={`${messages.length > 6 ? "mt-[5rem] " : "mt-auto "}${
									img
										? "flex gap-5 p-3 w-full rounded-md flex-col justify-center shadow shadow-[#0000004f] bg-[#2E323C]"
										: ""
								} sticky
						bottom-5 md:bottom-10`}
							>
								{img && (
									<div className="h-auto w-[250px] rounded-md relative">
										<MdClose
											color="white"
											className="absolute top-3 right-3"
											size={20}
											cursor={"pointer"}
											onClick={() => setImg(null)}
										/>
										<img
											src={getLocalUpload(img)}
											className="h-full w-full rounded-md object-cover"
											alt={img.name}
										/>
									</div>
								)}

								<label
									htmlFor="message"
									className={`rounded-md h-auto items-end gap-5 shadow-sm ${
										!img && "shadow-[#0000004f]"
									} text-white bg-[#2E323C] flex  p-3`}
								>
									<input
										type="file"
										className="hidden"
										id="file"
										onChange={(e) => handleFileUpload(e)}
									/>
									<label htmlFor="file">
										<img
											src={attach}
											alt=""
											className="cursor-pointer h-[25px] w-[25px]"
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
										className="w-full rounded-md h-auto bg-transparent object-cover border-none outline-none resize-none overflow-hidden"
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
						{/* scrolls to the bottom of the page */}

						{scroller && (
							<button
								ref={scrolltoBottomRef}
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
				</>
			) : (
				<>
					{settings && (
						<div
							onClick={() => setSettings(false)}
							className=" bg-[#00000073] h-full w-full absolute "
						></div>
					)}
					<div className="flex h-full items-center justify-center">
						<h1 className="flex items-center  justify-center bg-[#0000003b] py-1 px-4 rounded-3xl text-white">
							Select a chat to start messaging{" "}
							<span className="text-2xl">💬</span>
						</h1>
					</div>
				</>
			)}
		</div>
	);
}

export default Main;
