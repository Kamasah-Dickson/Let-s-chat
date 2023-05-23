import React, { useContext, useState } from "react";
import testImage from "../assets/background.svg";
import { MdSearch } from "react-icons/md";
import { HiOutlineArrowSmLeft, HiOutlineDotsVertical } from "react-icons/hi";
import { AllContext } from "../context/appContext";
import { TbLogout } from "react-icons/tb";
import Modal from "./Modal";

function Header_main() {
	const { setSearchFocus, options, setOptions, setShowTargetMessage } =
		useContext(AllContext);
	const [alert, setAlert] = useState(false);

	return (
		<div className="bg-[#232733] border-b-[1px] border-[rgba(255,255,255,0.10)] px-5 flex transition-colors p-2 items-center gap-5 w-full">
			<HiOutlineArrowSmLeft
				onClick={() => setShowTargetMessage(false)}
				className="md:hidden flex"
				color="white"
				size={25}
				cursor={"pointer"}
			/>
			<div className=" cursor-pointer rounded-full w-10 md:w-14 md:h-14 h-10  ">
				<img
					className="h-full w-full object-cover rounded-full"
					src={testImage}
					alt=""
				/>
			</div>
			<div onClick={() => setOptions(true)} className="flex-1  ">
				<h3 className="name cursor-pointer">Kamasah Dickson</h3>
				<div className="flex items-center gap-2">
					<span className="message text-light_white">Online</span>
					<div className="bg-green rounded-full h-2 w-2  "></div>
				</div>
			</div>
			<div>
				<div className=" cursor-pointer flex gap-4 text-light_white">
					<div
						onClick={() => setSearchFocus(true)}
						className="hidden hover:bg-light_white md:flex w-[35px] h-[35px]  items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-full"
					>
						<MdSearch size={20} color="white" />
					</div>

					<div
						onClick={() => setOptions((prev) => !prev)}
						className=" cursor-pointer w-[35px] hover:bg-light_white h-[35px] relative flex items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-full"
					>
						<HiOutlineDotsVertical size={20} color="white" />
						{!options && (
							<div>
								<div className="absolute bg-[rgb(26,21,21)] border rounded-md border-[#0000004d] top-12 right-0">
									<div
										onClick={() => (setAlert(true), setOptions(false))}
										className="flex py-3 px-5 rounded-md items-center gap-2 cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
									>
										<TbLogout size={20} color="white" />
										<p className="text-white">Logout</p>
									</div>
									<div
										onClick={() => (setSearchFocus(true), setOptions(false))}
										className="flex py-3 px-5 rounded-md md:hidden items-center gap-2 cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
									>
										<MdSearch size={20} cursor={"pointer"} color="white" />
										<p className="text-white">Search</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				{alert && (
					<Modal
						setAlert={setAlert}
						notify={"Are you sure you want to log out from this account?"}
						type="logout"
					/>
				)}
			</div>
		</div>
	);
}

export default Header_main;
