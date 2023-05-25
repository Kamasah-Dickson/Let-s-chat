import React, { useContext, useRef } from "react";
import Header_main from "./Header_main";
import attach from "../assets/attach.svg";
import emoji from "../assets/emoji.svg";
import record from "../assets/record.svg";
import { AllContext } from "../context/appContext";
import Message from "./Message";
import { BsSendFill } from "react-icons/bs";
function Main() {
	const { setOptions } = useContext(AllContext);

	const textareaRef = useRef(null);

	const handleInputChange = () => {
		const textarea = textareaRef.current;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	return (
		<div className="main-bg">
			<Header_main />
			<div className="gradient my-height overflow-y-scroll flex flex-col justify-center">
				<div
					onClick={() => setOptions(true)}
					className="flex pt-5 flex-col gap-5   flex-[3] px-5 overflow-y-auto"
				>
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<Message />
					<label
						htmlFor="message"
						className="rounded-md items-end shadow-sm shadow-[#0000004f] text-white bg-[#2E323C] md:my-full gap-5 w-full flex sticky
						bottom-5 md:bottom-10 mt-20 p-3 h-full"
					>
						<textarea
							rows="1"
							ref={textareaRef}
							onChange={handleInputChange}
							autoCorrect="true"
							autoComplete="true"
							id="message"
							className="w-full min-h-[30px] rounded-md h-auto bg-transparent object-cover border-none outline-none resize-none overflow-hidden"
							placeholder="Write a message..."
						></textarea>
						<img src={attach} alt="" className="cursor-pointer" />
						<img src={emoji} alt="" className="cursor-pointer" />
						<img src={record} alt="" className=" cursor-pointer" />
						<BsSendFill
							color="#8A8A8A"
							size={25}
							className="ml-3 md:hidden cursor-pointer h-fit"
						/>
					</label>
				</div>
			</div>
		</div>
	);
}

export default Main;
