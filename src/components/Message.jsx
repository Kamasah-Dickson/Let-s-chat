import React from "react";
import testing from "../assets/background.svg";
function Message() {
	return (
		<div className=" flex justify-start coming-parent  flex-[2] gap-5">
			<div>
				<div className=" w-[45px] h-[45px] rounded-full">
					<img
						src={testing}
						alt=""
						className="object-cover w-full h-full rounded-full"
					/>
				</div>
				<span className="font-normal text-gray-400 text-xs">Just now</span>
			</div>
			<div className="coming flex coming max-w-[80%] flex-[2] gap-5 text-white">
				<p className=" border border-[#00000044] text-white w-max p-2">
					Hello there
				</p>
				<div className="w-1/2">
					<img className="w-full h-auto" src={testing} alt="" />
				</div>
			</div>
		</div>
	);
}

export default Message;
