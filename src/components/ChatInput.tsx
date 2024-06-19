import { MdClose } from "react-icons/md";
import attach from "../assets/attach.svg";
import emoji from "../assets/emoji.svg";
import { ImgType } from "./Main";
import { BsSendFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ref as storageRef } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import {
	ref,
	serverTimestamp,
	push,
	set,
	child,
	update,
} from "firebase/database";
import Emoji from "./EmojiPicker";
import sentNotificationSound from "../message-sent.mp3";
import { RootState } from "../Store/store";
import { useSelector } from "react-redux";
import { INotification } from "../Store/features/notificationSlice";

interface IChatInput {
	partneredChat: {
		user: {
			displayName: string;
			photoURL: string;
			uid: string;
		};
		combinedId: string;
	};
}
const ChatInput = ({ partneredChat }: IChatInput) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [img, setImg] = useState<ImgType>(null);
	const [isSending, setIsSending] = useState(false);
	const [text, setText] = useState("");
	const [emojiOpen, setEmojiOpen] = useState(false);
	const emojiRef = useRef<HTMLLabelElement | null>(null);
	const currentUserId = auth?.currentUser?.uid;
	const notificationSettings = useSelector<RootState>(
		(state) => state.notification
	) as INotification[];

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const { key, shiftKey } = event;
		if (key === "Enter" && !shiftKey) {
			handleSend();
			event.preventDefault(); //prevent default line breaks
		} else if (shiftKey && key === "Enter") {
			const textAreaInput = textareaRef.current;
			if (textAreaInput) {
				const start = textAreaInput.selectionStart as number;
				const end = textAreaInput.selectionEnd as number;
				const value = textAreaInput.value;
				const newValue = `${value.substring(0, start)}\n${value.substring(
					end
				)}`;
				setText(newValue);
				textAreaInput.selectionStart = textAreaInput.selectionEnd = start + 1;
				textAreaInput.style.height = `auto`;

				setTimeout(() => {
					if (textAreaInput) {
						textAreaInput.style.height = `${textAreaInput.scrollHeight}px`;
					}
				}, 0);
				!isSending && textareaRef?.current?.focus();
			}
		}
	};

	const handleFileUpload = (e: any) => {
		const file = e.target.files[0];
		const isImageFile = (fileType: string) => {
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

	const getLocalUpload = (img: { type: Blob | MediaSource }) => {
		textareaRef?.current?.focus();
		const file = img;
		const isImageFile = (fileType: string) => {
			return (
				fileType.startsWith("image/jpeg") ||
				fileType.startsWith("image/png") ||
				fileType.startsWith("image/svg+xml") ||
				fileType.startsWith("image/gif") ||
				fileType.startsWith("image/webp")
			);
		};

		const fileType = file.type || "application/octet-stream";
		if (file && isImageFile(fileType as unknown as string)) {
			return URL.createObjectURL(file as any);
		} else {
			// Not an image file
			toast.error("Sorry you can only upload an image file for now");
		}
	};

	const handleSend = async () => {
		setEmojiOpen(false);
		if (isSending) {
			// Return if a message is already being sent
			setText("");
		} else {
			setText("");
			setIsSending(true);
		}

		if (img) {
			const sentImgRef = storageRef(storage, "sentImages/" + uuid());
			const uploadTask = uploadBytesResumable(sentImgRef, img as any);

			uploadTask.on(
				"state_changed",
				() => {
					// handle Progress or other snapshot updates
				},
				(error) => {
					console.log("Upload error:", error);
					toast.error("Error uploading file");
				},
				async () => {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
					const message = {
						id: uuid(),
						text,
						senderId: currentUserId,
						img: downloadURL,
						seen: false,
						date: serverTimestamp(),
					};

					const userRef = ref(db, `chats/${partneredChat.user.uid}/messages`);

					const newMessageRef = push(userRef);
					await set(newMessageRef, message);

					const inAppSound = notificationSettings.find(
						(settings) => settings.name === "inAppSound"
					);
					if (inAppSound) {
						inAppSound.value && new Audio(sentNotificationSound).play();
					}
					setText("");
				}
			);
			setImg(null);
		} else if (text) {
			try {
				const message = {
					id: uuid(),
					text,
					senderId: currentUserId,
					seen: false,
					date: serverTimestamp(),
				};

				const userRef = ref(db, `chats/${partneredChat.combinedId}/messages`);
				const messageRef = push(userRef);
				await set(messageRef, message);

				const inAppSound = notificationSettings.find(
					(settings) => settings.name === "inAppSound"
				);
				if (inAppSound) {
					inAppSound.value && new Audio(sentNotificationSound).play();
				}
				setText("");
			} catch (error) {
				console.error("Error saving text message:", error);
			}
		}

		try {
			// update timestamp for other user to automatically sort list
			const userChatsRef = ref(db, "users");
			const otherUserChatRef = child(userChatsRef, partneredChat.user.uid);
			await update(otherUserChatRef, {
				date: serverTimestamp(),
			});
		} catch (error) {
			console.log(error);
		}
		setIsSending(false);
	};

	//automatically increase textAreaHeight
	useEffect(() => {
		const textAreaInput = textareaRef?.current;
		if (textAreaInput) {
			if (!text) {
				textAreaInput.style.height = "48px";
			}
			textAreaInput.style.height = `${textAreaInput.scrollHeight}px`;
		}
	}, [text]);

	useEffect(() => {
		const handleEmojiRef = (event: MouseEvent) => {
			if (textareaRef.current?.contains(event.target as Node)) return;
			else if (!emojiRef?.current?.contains(event.target as Node)) {
				setEmojiOpen(false);
			}
		};

		window.addEventListener("mousedown", handleEmojiRef);
		return () => {
			window.removeEventListener("mousedown", handleEmojiRef);
		};
	}, []);

	return (
		<div className={`sticky mt-8 bottom-7 mx-5`}>
			{img && (
				<div className="px-5">
					<div
						className="
                    flex gap-5 p-3 w-full  h-72 rounded-tr-md rounded-tl-md -mb-1 flex-col justify-center shadow shadow-[#0000004f] bg-[#2E323C]"
					>
						<div className="h-auto w-96 rounded-md relative flex gap-2">
							<div>
								<MdClose
									className="absolute top-2 -right-10 text-white/50 hover:text-white transition active:scale-[1.02]"
									size={20}
									cursor={"pointer"}
									onClick={() => setImg(null)}
								/>
								<img
									src={getLocalUpload(img)}
									className="h-full w-full rounded-md object-cover"
									alt={img?.name}
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			<label
				htmlFor="message"
				className={`text-white max-w-5xl bg-[#2E323C] px-5 xl:mx-auto flex rounded-md items-end gap-5 shadow-sm ${
					!img && "shadow-[#0000004f]"
				}`}
			>
				<input
					type="file"
					className="hidden"
					id="file"
					onChange={(e) => handleFileUpload(e)}
				/>
				<label htmlFor="file" className="h-12 flex items-center">
					<img src={attach} alt="" className="cursor-pointer h-6 w-6" />
				</label>

				<textarea
					ref={textareaRef}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
					autoComplete="off"
					id="message"
					value={text}
					className="w-full relative mx-auto max-h-64 py-1/2  h-[48px] py-3 overflow-y-auto rounded-md bg-transparent object-cover border-none outline-none resize-none overflow-hidden"
					placeholder="Write a message..."
				></textarea>
				<label
					ref={emojiRef}
					htmlFor="emoji"
					className="h-12 flex items-center"
				>
					<Emoji
						emojiOpen={emojiOpen}
						textareaRef={textareaRef}
						setText={setText}
					/>
					<img
						onClick={() => setEmojiOpen((prev) => !prev)}
						src={emoji}
						id="emoji"
						alt="record"
						className="cursor-pointer h-6 w-6"
					/>
				</label>
				<button type="button" className="h-12 flex items-center">
					<BsSendFill
						id="sendMessage"
						onClick={() => handleSend()}
						color="#8A8A8A"
						className=" active:scale-[1.02] cursor-pointer h-6 w-6"
					/>
				</button>
			</label>
		</div>
	);
};

export default ChatInput;
