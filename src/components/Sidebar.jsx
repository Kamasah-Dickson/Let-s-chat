/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { MdSearch, MdOutlineSettingsSuggest } from "react-icons/md";
import Search from "./Search";
import Sidebar_Singlechat from "./Sidebar_Singlechat";
import Menu_settings from "./Menu_settings";
import { Link } from "react-router-dom";
import { AllContext } from "../context/appContext";

function Sidebar() {
	const { settings, setsettings, setOptions, searchFocus, setSearchFocus } =
		useContext(AllContext);

	return settings ? (
		<Menu_settings setsettings={setsettings} />
	) : (
		<div
			onClick={() => setOptions(true)}
			className="p-3 border-[#191D24] border-r-2 h-screen overflow-y-auto bg-sidebar_color sticky top-20 left-0"
		>
			<MdOutlineSettingsSuggest
				onClick={() => setsettings(true)}
				color="white"
				size={25}
				cursor={"pointer"}
			/>
			<div
				onClick={() => setSearchFocus(true)}
				onBlur={() => setSearchFocus(false)}
				className="sticky mt-4 -top-2 overflow-hidden z-10 border-b-[1px] border-white bg-light_brown py-[7px] px-2 rounded-md flex items-center justify-between"
			>
				<Search searchFocus={searchFocus} placeholder="Search..." />
				<MdSearch cursor={"pointer"} color="white" size={20} />
			</div>
			<div className="overflow-y-auto scrollbar flex flex-col gap-2 my-3">
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
				<Link to="/">
					<Sidebar_Singlechat />
				</Link>
			</div>
		</div>
	);
}

export default Sidebar;
