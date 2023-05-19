import React, { useState } from "react";
import { HiOutlineUser, HiOutlineUserGroup } from "react-icons/hi";
import { TfiAnnouncement } from "react-icons/tfi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { nanoid } from "nanoid";
import Modal from "./Modal";

function Notifications() {
	const [alert, setAlert] = useState(false);

	const [Allnotifications] = useState([
		{
			id: nanoid(),
			name: "Private Chats",
			icon: <HiOutlineUser size={25} color="white" />,
			span: "On,0 exceptions",
		},
		{
			id: nanoid(),
			name: "Groups",
			icon: <HiOutlineUserGroup size={25} color="white" />,
			span: "On,0 exceptions",
		},
		{
			id: nanoid(),
			name: "Channels",
			icon: <TfiAnnouncement size={25} color="white" />,
			span: "On,0 exceptions",
		},
	]);

	return (
		<div className="main-bg">
			<div className="gradient h-full flex flex-col justify-center">
				<div className="pb-44 p-6 flex-[3] px-8 overflow-y-auto">
					<h2 className="text-white text-3xl font-medium">Notifications</h2>
					<div className="flex justify-center mt-5 flex-col gap-1">
						{Allnotifications.map((notificaions) => {
							return (
								<div
									key={notificaions.id}
									className="flex items-center bg-[#2e323e9d] transition-all cursor-pointer hover:bg-[#2e323ebe] border-[#1F232F] border rounded-sm p-3"
								>
									<div className="flex items-center justify-between w-full">
										<div className="flex items-center gap-5">
											{notificaions.icon}
											<div className="text-white">
												<h3 className="text-lg">{notificaions.name}</h3>
												<p className="text-xs text-[#D3D4D6]">
													{notificaions.span}
												</p>
											</div>
										</div>
										<MdKeyboardArrowRight color="white" size={20} />
									</div>
								</div>
							);
						})}
					</div>
					<div className="mt-10 text-white">
						<h2 className="text-lg">In-app notifications</h2>
						<div className="flex border rounded-md flex-col bg-[#2e323e9d] mt-3 transition-all cursor-pointer border-[#1F232F]">
							<label
								className="hover:bg-[#2e323ebe] transition-all border-b cursor-pointer border-[#3f444e9f] p-4 flex gap-5 px-4"
								htmlFor="app-sound"
							>
								<input
									className="border-none outline-none  "
									id="app-sound"
									type="checkbox"
									name=""
									value=""
								/>
								<p>In-app Sound</p>
							</label>
							<label
								className="hover:bg-[#2e323ebe] transition-all px-4 flex cursor-pointer gap-5 p-4"
								htmlFor="app-preview"
							>
								<input
									className="border-none outline-none "
									id="app-preview"
									type="checkbox"
									name=""
									value=""
								/>
								<p>In-app Preview</p>
							</label>
						</div>
					</div>
					<div className="text-white mt-10">
						<h2 className="text-lg">Badge Counter</h2>
						<label
							className=" bg-[#2e323e9d] transition-all cursor-pointer hover:bg-[#2e323ebe] border-[#1F232F] border rounded-md p-4 mt-3 flex items-center gap-5"
							htmlFor="app-unread"
						>
							<input
								className="border-none outline-none "
								id="app-unread"
								type="checkbox"
								name=""
								value=""
							/>
							<p>Count Unread Messages</p>
						</label>
					</div>
					<div onClick={() => setAlert(true)} className="text-white mt-10">
						<div className=" flex-col bg-[#2e323e9d] transition-all cursor-pointer hover:bg-[#2e323ebe] border border-[#1F232F] rounded-md py-3 px-5 mt-3 flex">
							<h3 className="text-red-400 text-lg">Reset All Notifications</h3>
							<p className="text-sm">
								Undo all notificaions settings for all your contacts,groups and
								channels
							</p>
						</div>
					</div>
				</div>
				{alert && (
					<Modal
						notify={"Are you sure you want to reset all notification settings?"}
						setAlert={setAlert}
					/>
				)}
			</div>
		</div>
	);
}

export default Notifications;
