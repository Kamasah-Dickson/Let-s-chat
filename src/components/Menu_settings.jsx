/* eslint-disable react/prop-types */
import React, { useState, useContext } from "react";
import User from "./User";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { settingsData } from "../settingsData";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import Modal from "./Modal";
import { AllContext } from "../context/appContext";

function Menu_settings({ setSettings }) {
	const { pathname } = useLocation();
	const [alert, setAlert] = useState(false);
	const { setOptions, setToggleSettingsCategory } = useContext(AllContext);

	return (
		<div
			onClick={() => setOptions(true)}
			className="bg-sidebar_color h-screen px-2"
		>
			<div className="flex items-center py-3 gap-5">
				<Link to={"/"}>
					<HiOutlineArrowSmLeft
						onClick={() => setSettings(false)}
						color="white"
						size={25}
						cursor={"pointer"}
					/>
				</Link>
				<span className="text-white font-medium">Settings</span>
			</div>
			<User />

			<div className=" mt-6 flex flex-col gap-3">
				{settingsData.map((data) => {
					return (
						<Link
							onClick={() => setToggleSettingsCategory(true)}
							to={`${data.path}`}
							className={` ${
								data.path === `${pathname}` &&
								"active bg-[rgba(255,255,255,0.06)]"
							} 
							 hover:bg-[rgba(255,255,255,0.06)] cursor-pointer rounded-md p-2 flex items-center text-white gap-3`}
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
						</Link>
					);
				})}
				<div className="h-[1px] mt-3 opacity-10 w-full bg-white"></div>
			</div>

			<div
				onClick={() => setAlert(true)}
				className="mt-10  hover:bg-[rgba(255,255,255,0.06)] cursor-pointer rounded-md p-2 flex items-center text-white gap-3"
			>
				<div className="w-[20px] h-[20px]">
					<TbLogout size={20} color="white" />
				</div>
				<div>
					<p className="font-medium">Logout</p>
				</div>
			</div>
			{alert && (
				<Modal
					notify={"Are you sure you want to log out from this account?"}
					setAlert={setAlert}
					type="logout"
				/>
			)}
		</div>
	);
}

export default Menu_settings;
