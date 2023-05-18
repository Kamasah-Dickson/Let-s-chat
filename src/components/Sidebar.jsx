import React, { useState } from "react";
import { MdSearch, MdMenu } from "react-icons/md";
import Search from "./Search";
import Sidebar_Singlechat from "./Sidebar_Singlechat";
import Menu_options from "./Menu_options";

function Sidebar() {
	const [focus, setFocus] = useState(false);
	const [options, setOptions] = useState(false);

	return options ? (
		<Menu_options setOptions={setOptions} />
	) : (
		<div className="p-3  border-[#191D24] border-r-2 h-screen overflow-y-auto bg-sidebar_color sticky top-20 left-0">
			<MdMenu
				onClick={() => setOptions(true)}
				color="white"
				size={25}
				cursor={"pointer"}
			/>
			<div
				onClick={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				className="sticky mt-2 -top-2 overflow-hidden z-10 border-b-[1px] border-white bg-light_brown py-[7px] px-2 rounded-md flex items-center justify-between"
			>
				<Search focus={focus} placeholder="Search..." />
				<MdSearch cursor={"pointer"} color="white" size={20} />
			</div>
			<div className="overflow-y-auto scrollbar flex flex-col gap-2 my-3">
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
				<Sidebar_Singlechat />
			</div>
		</div>
	);
}

export default Sidebar;
