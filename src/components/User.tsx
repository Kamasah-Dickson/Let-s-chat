import testImage from "../assets/background.svg";
import edit from "../assets/edit.svg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store/store";
import { auth } from "../firebase.ts";
import { setShowSettingsOnMobile } from "../Store/features/settingsSlice.ts";
import { selectedSettings } from "./Menu_settings.tsx";

function User({
	setSelectedSettings,
}: {
	setSelectedSettings: React.Dispatch<React.SetStateAction<selectedSettings>>;
}) {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div className="flex transition-colors p-2 items-center gap-5 w-full">
			<div className="cursor-pointer rounded-full w-16 h-16 relative ">
				<img
					className="h-full w-full object-cover rounded-full"
					src={auth?.currentUser?.photoURL || testImage}
					alt={auth?.currentUser?.displayName as string}
				/>
			</div>
			<div className="flex-1 ">
				<h3 className="name text-white">
					{auth?.currentUser?.displayName || "username"}
				</h3>
				<span className="message text-green">
					@
					{auth?.currentUser?.email
						?.toLowerCase()
						.slice(0, auth?.currentUser?.email?.indexOf("@")) || "user"}
				</span>
			</div>
			<div
				onClick={() =>
					dispatch(setShowSettingsOnMobile({ showSettingsOnMobile: true }))
				}
			>
				<button
					type="button"
					onClick={() => setSelectedSettings("update-profile")}
					className="w-[35px] flex items-center justify-center h-[35px] rounded-full bg-green"
				>
					<img src={edit} alt="" className="w-[15px] h-[15px] cursor-pointer" />
				</button>
			</div>
		</div>
	);
}

export default User;
