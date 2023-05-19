import React, { useState, useContext } from "react";
import Header_main from "./Header_main";
import Search from "./Search";
import attach from "../assets/attach.svg";
import emoji from "../assets/emoji.svg";
import record from "../assets/record.svg";
import { AllContext } from "../context/appContext";
import Message from "./Message";
import { BsSendFill } from "react-icons/bs";

function Main() {
	const [focus, setFocus] = useState(false);
	const { setOptions } = useContext(AllContext);

	return (
		<div className="main-bg">
			<Header_main />
			<div className="gradient h-full flex flex-col justify-center">
				<div
					onClick={() => setOptions(true)}
					className="flex flex-col gap-5 pb-44 pt-5 flex-[3] px-5 overflow-y-auto"
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
				</div>
				<div
					className="rounded-md shadow-sm shadow-[#0000004f] bg-[#2E323C] sticky bottom-10 my-full gap-5 p-3 w-full flex items-center"
					onClick={() => (setFocus(true), setOptions(true))}
					onBlur={() => setFocus(false)}
				>
					<img src={attach} alt="" className="cursor-pointer" />
					<Search placeholder="Write a message..." focus={focus} />
					<img src={emoji} alt="" className="cursor-pointer" />
					<img src={record} alt="" className="cursor-pointer" />
					<BsSendFill
						color="#8A8A8A"
						size={25}
						className="ml-5 cursor-pointer"
					/>
				</div>
			</div>
		</div>
	);
}

export default Main;
