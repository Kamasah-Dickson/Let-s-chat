import { useState, lazy, Suspense } from "react";
import User from "./User";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { settingsData } from "../settingsData";
import { Link } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import Modal from "./Modal";
import { AppDispatch, RootState } from "../Store/store";
import { useDispatch, useSelector } from "react-redux";
import {
	ISettings,
	setSettings,
	setShowSettingsOnMobile,
} from "../Store/features/settingsSlice";
import Loading from "./Loading.tsx";
const Notifications = lazy(() => import("./Notifications.tsx"));
const Chat_settings = lazy(() => import("./Chat_settings.tsx"));
const AdvancedSettings = lazy(() => import("./AdvancedSettings.tsx"));
const Language = lazy(() => import("./Language.tsx"));
const AskQuestions = lazy(() => import("./AskQuestions.tsx"));
const UpdateProfilePage = lazy(() => import("./UpdateProfile.tsx"));

export type selectedSettings =
	| ""
	| "notifications"
	| "chat-settings"
	| "advanced-settings"
	| "language"
	| "ask-a-question"
	| "update-profile";

const SettingsPage = (selectedSettings: selectedSettings) => {
	switch (selectedSettings) {
		case "advanced-settings":
			return (
				<Suspense fallback={<Loading />}>
					<AdvancedSettings />
				</Suspense>
			);
		case "ask-a-question":
			return (
				<Suspense fallback={<Loading />}>
					<AskQuestions />
				</Suspense>
			);
		case "update-profile":
			return (
				<Suspense fallback={<Loading />}>
					<UpdateProfilePage />
				</Suspense>
			);
		case "chat-settings":
			return (
				<Suspense fallback={<Loading />}>
					<Chat_settings />
				</Suspense>
			);
		case "language":
			return (
				<Suspense fallback={<Loading />}>
					<Language />
				</Suspense>
			);
		case "notifications":
			return (
				<Suspense fallback={<Loading />}>
					<Notifications />
				</Suspense>
			);
		default:
			<></>;
	}
};

const Menu_settings = ({ settings }: { settings: boolean }) => {
	const [alert, setAlert] = useState(false);
	const [selectedSettings, setSelectedSettings] =
		useState<selectedSettings>("");
	const dispatch = useDispatch<AppDispatch>();

	const { showSettingsOnMobile } = useSelector<RootState>(
		(state) => state.settings
	) as ISettings;
	return (
		<>
			<div
				className={`fixed right-0 z-20 w-full flex ${
					settings ? "translate-x-0" : "-translate-x-full"
				} `}
			>
				{
					<div
						className={`${settings ? "translate-x-0" : "-translate-x-full"} 
						 "flex" : "hidden"
					 left-0 transition-all w-full md:w-[450px] bg-sidebar_color h-screen overflow-y-auto px-2`}
					>
						<div className="flex items-center py-3 gap-5">
							<Link to={"/"}>
								<HiOutlineArrowSmLeft
									onClick={() => dispatch(setSettings({ settings: false }))}
									color="white"
									size={25}
									cursor={"pointer"}
								/>
							</Link>
							<span className="text-white font-medium">Settings</span>
						</div>
						<User setSelectedSettings={setSelectedSettings} />
						<div>
							<div className=" mt-5 mb-3 flex flex-col gap-3">
								{settingsData.map((data) => {
									return (
										<button
											type="button"
											onClick={() => {
												const parts = data.path.split("/");
												setSelectedSettings(parts[1] as selectedSettings);
												dispatch(
													setShowSettingsOnMobile({
														showSettingsOnMobile: true,
													})
												);
											}}
											className={` ${
												data.name === `${selectedSettings}` &&
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
												<p className="font-medium text-white">{data.name}</p>
											</div>
										</button>
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
						</div>
					</div>
				}

				<div
					className={`${
						settings
							? " md:block md:opacity-100 md:visible"
							: "md:opacity-0 md:invisible"
					} transition-all ${
						showSettingsOnMobile ? "z-30 absolute md:relative md:z-0" : "hidden"
					} md:visible h-full w-full `}
				>
					{selectedSettings == "" ? (
						<div
							onClick={() => dispatch(setSettings({ settings: false }))}
							className={`hidden md:flex ${
								settings ? "opacity-100 visible" : "md:opacity-0 md:invisible"
							} transition-all md:visible bg-[#000000a1] inset-0 h-screen w-full  `}
						></div>
					) : (
						SettingsPage(selectedSettings)
					)}
				</div>
			</div>
			{alert && (
				<Modal
					notify={"Are you sure you want to log out from this account?"}
					setAlert={setAlert}
					type="logout"
				/>
			)}
		</>
	);
};

export default Menu_settings;
