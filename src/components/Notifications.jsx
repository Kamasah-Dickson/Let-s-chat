import React, { useContext, useState } from "react";
import {
	HiOutlineArrowSmLeft,
	HiOutlineUser,
	HiOutlineUserGroup,
} from "react-icons/hi";
import { TfiAnnouncement } from "react-icons/tfi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { nanoid } from "nanoid";
import Modal from "./Modal";
import { AllContext } from "../context/appContext";
import { allNotifications } from "../Features/notificationSlice";
import {
	resetSettings,
	updateNotification,
} from "../Features/notificationSlice";
import { useSelector, useDispatch } from "react-redux";

function Notifications() {
	const [alert, setAlert] = useState(false);
	const { setToggleSettingsCategory } = useContext(AllContext);
	const dispatch = useDispatch();

	const allNotificationState = useSelector(allNotifications);

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

	const findSettings = (settingsName) => {
		const { name, value } = allNotificationState.find(
			(settings) => settings.name === settingsName
		);
		return { name, value };
	};

	return (
		<div className="main-bg">
			<div className="gradient h-full flex flex-col justify-center">
				<div className="pb-44 p-6 flex-[3] px-8 overflow-y-auto">
					<HiOutlineArrowSmLeft
						onClick={() => setToggleSettingsCategory(false)}
						className="md:hidden my-3 flex"
						color="white"
						size={25}
						cursor={"pointer"}
					/>
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
								className="container hover:bg-[#2e323ebe] transition-all border-b cursor-pointer border-[#3f444e9f] p-4 flex gap-5 px-4"
								htmlFor="app-sound"
							>
								<div>
									<input
										className="border-none outline-none "
										id="app-sound"
										type="checkbox"
										name={findSettings("inAppSound").name}
										value={findSettings("inAppSound").value}
										onChange={() => dispatch(updateNotification("inAppSound"))}
									/>
									<span className="checkmark"></span>
								</div>
								<p>In-app Sound</p>
							</label>
							<label
								className="container hover:bg-[#2e323ebe] transition-all px-4 flex cursor-pointer gap-5 p-4"
								htmlFor="app-preview"
							>
								<div>
									<input
										className="border-none outline-none "
										id="app-preview"
										type="checkbox"
										name={findSettings("inAppPreview").name}
										value={findSettings("inAppPreview").value}
									/>
									<span className="checkmark"></span>
								</div>
								<p>In-app Preview</p>
							</label>
						</div>
					</div>
					<div className="text-white mt-10">
						<h2 className="text-lg">Badge Counter</h2>
						<label
							className=" container bg-[#2e323e9d] transition-all cursor-pointer hover:bg-[#2e323ebe] border-[#1F232F] border rounded-md p-4 mt-3 flex items-center gap-5"
							htmlFor="app-unread"
						>
							<div>
								<input
									className="border-none outline-none "
									id="app-unread"
									type="checkbox"
									name={findSettings("countUnreadMessages").name}
									value={findSettings("countUnreadMessages").value}
								/>
								<span className="checkmark"></span>
							</div>
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
						type="reset"
					/>
				)}
			</div>
		</div>
	);
}

export default Notifications;
