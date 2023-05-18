import React from "react";
import testImage from "../assets/background.svg";

function Sidebar_Singlechat() {
	return (
		<div className="flex transition-colors hover:bg-[rgba(255,255,255,0.06)] cursor-pointer rounded-md p-2 items-center gap-5 w-full">
			<div className="rounded-full w-10 md:w-14 md:h-14 h-10 relative ">
				<img
					className="h-full w-full object-cover rounded-full"
					src={testImage}
					alt=""
				/>
				<div className="bg-sidebar_color p-[2px]  bottom-0 right-1 rounded-full absolute">
					<div className="bg-green rounded-full h-3 w-3  "></div>
				</div>
			</div>
			<div className="flex-1 ">
				<h3 className="name">Kamasah Dickson</h3>
				<span className="message text-light_white">Check this out</span>
			</div>
			<div>
				<div className="flex flex-col gap-2 text-light_white">
					<p className="text-sm">3:27PM</p>
					<span className="text-sm text-white bg-blue rounded-full w-5 h-5 flex items-center justify-center text-center">
						2
					</span>
				</div>
			</div>
		</div>
	);
}

export default Sidebar_Singlechat;
