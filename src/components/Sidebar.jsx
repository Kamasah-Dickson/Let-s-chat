/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import Search from "./Search";
import Sidebar_Singlechat from "./Sidebar_Singlechat";
import Menu_settings from "./Menu_settings";
import { Link } from "react-router-dom";
import { AllContext } from "../context/appContext";

function Sidebar() {
	const {
		settings,
		setsettings,
		setOptions,
		searchFocus,
		setShowTargetMessage,
	} = useContext(AllContext);

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

			<Search searchFocus={searchFocus} />
			<div className="overflow-y-auto scrollbar flex flex-col gap-2 my-3">
				<Link onClick={() => setShowTargetMessage(true)} to="/">
					<Sidebar_Singlechat />
				</Link>
			</div>
		</div>
	);
}

export default Sidebar;
