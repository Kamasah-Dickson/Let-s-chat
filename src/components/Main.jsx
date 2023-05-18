import React, { useState } from "react";
import Header_main from "./Header_main";
import Search from "./Search";
import attach from "../assets/attach.svg";
import emoji from "../assets/emoji.svg";
import record from "../assets/record.svg";

function Main() {
	const [focus, setFocus] = useState(false);

	return (
		<div className="main-bg">
			<Header_main />
			<div className="gradient h-full flex flex-col justify-center">
				<div className="pb-44 pt-3 flex-[3] px-2 overflow-y-auto">
					<p>dfsdfdfds</p>
					<p>dfsdfdfds</p>
				</div>
				<div
					className="rounded-md shadow-sm shadow-[#0000004f] bg-[#2E323C] sticky bottom-12 my-full gap-5 p-3 w-full flex items-center"
					onClick={() => setFocus(true)}
					onBlur={() => setFocus(false)}
				>
					<img src={attach} alt="" className="cursor-pointer" />
					<Search placeholder="Write a message..." focus={focus} />
					<img src={emoji} alt="" className="cursor-pointer" />
					<img src={record} alt="" className="cursor-pointer" />
				</div>
			</div>
		</div>
	);
}

export default Main;
