import React, { useContext } from "react";
import testImage from "../assets/background.svg";
import edit from "../assets/edit.svg";
import { Link } from "react-router-dom";
import { AllContext } from "../context/appContext";
function User() {
	const { userProfile, setToggleSettingsCategory } = useContext(AllContext);

	return (
		<div className="flex transition-colors p-2 items-center gap-5 w-full">
			<div className="cursor-pointer rounded-full w-16 h-16 relative ">
				<img
					className="h-full w-full object-cover rounded-full"
					src={userProfile?.photoUrl || testImage}
					alt={userProfile?.userName}
				/>
			</div>
			<div className="flex-1 ">
				<h3 className="name">{userProfile?.userName || "username"}</h3>
				<span className="message text-green">
					@{userProfile?.userName.toLowerCase() || "username"}
				</span>
			</div>
			<div onClick={() => setToggleSettingsCategory(true)}>
				<Link
					to={"/profileupdate"}
					className="w-[35px] flex items-center justify-center h-[35px] rounded-full bg-green"
				>
					<img src={edit} alt="" className="w-[15px] h-[15px] cursor-pointer" />
				</Link>
			</div>
		</div>
	);
}

export default User;
