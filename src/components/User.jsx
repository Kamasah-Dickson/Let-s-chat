import React from "react";
import testImage from "../assets/background.svg";
import edit from "../assets/edit.svg";
import { Link } from "react-router-dom";
function User() {
	return (
		<div className="flex transition-colors p-2 items-center gap-5 w-full">
			<div className="cursor-pointer rounded-full w-10 md:w-16 md:h-16 h-10 relative ">
				<img
					className="h-full w-full object-cover rounded-full"
					src={testImage}
					alt=""
				/>
			</div>
			<div className="flex-1 ">
				<h3 className="name">Kamasah Dickson</h3>
				<span className="message text-green">@Kamasahdickson</span>
			</div>
			<div>
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
