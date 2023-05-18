/* eslint-disable react/prop-types */
import React, { useState } from "react";
import User from "./User";
import Search from "./Search";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { settingsData } from "../settingsData";

function Menu_options({ setOptions }) {
	const [focus, setFocus] = useState(false);

	return (
		<div className="bg-sidebar_color h-full px-2">
			<div className="flex items-center py-3 gap-5">
				<HiOutlineArrowSmLeft
					onClick={() => setOptions(false)}
					color="white"
					size={25}
					cursor={"pointer"}
				/>
				<span className="text-white font-medium">Settings</span>
			</div>
			<User />
			<div
				onClick={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				className="mt-2 border-b-[1px] border-white bg-light_brown py-[7px] px-2 rounded-md"
			>
				<Search placeholder={"search"} focus={focus} />
			</div>
			<div className="mt-6 flex flex-col gap-5">
				{settingsData.map((data) => {
					return (
						<div
							className=" active hover:bg-[rgba(255,255,255,0.06)] cursor-pointer rounded-md p-2 flex items-center text-white gap-4"
							key={data.id}
						>
							<div className="w-[20px] h-[20px]">
								<img
									src={data.icon}
									className="w-full h-full"
									alt={data.name}
								/>
							</div>
							<div>
								<p className="font-medium">{data.name}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Menu_options;
