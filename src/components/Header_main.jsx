import React from "react";
import testImage from "../assets/background.svg";
import { MdSearch } from "react-icons/md";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
function Header_main() {
	return (
		<div className="bg-[#232733] border-b-[1px] border-[rgba(255,255,255,0.10)] px-5 flex transition-colors p-2 items-center gap-5 w-full">
			<div className="rounded-full w-10 md:w-14 md:h-14 h-10  ">
				<img
					className="h-full w-full object-cover rounded-full"
					src={testImage}
					alt=""
				/>
			</div>
			<div className="flex-1 ">
				<h3 className="name">Kamasah Dickson</h3>
				<div className="flex items-center gap-2">
					<span className="message text-light_white">Online</span>
					<div className="bg-green rounded-full h-2 w-2  "></div>
				</div>
			</div>
			<div>
				<div className="flex gap-4 text-light_white">
					<div className="w-[35px] h-[35px] flex items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-full">
						<MdSearch size={20} cursor={"pointer"} color="white" />
					</div>
					<div className="w-[35px] h-[35px] flex items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-full">
						<HiOutlineChatAlt2 size={20} cursor={"pointer"} color="white" />
					</div>
					<div className="w-[35px] h-[35px] flex items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-full">
						<HiOutlineDotsVertical size={20} cursor={"pointer"} color="white" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Header_main;
