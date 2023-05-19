/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { TbAlertTriangleFilled } from "react-icons/tb";

function Modal({ setAlert, notify }) {
	return (
		<div className=" z-50 absolute bg-[#000000a6] top-0 left-0 h-screen flex items-center justify-center w-full">
			<div className="bg-[#2e323e] p-7 rounded-lg text-white">
				<div className="flex flex-col items-center gap-5">
					<TbAlertTriangleFilled size={50} color="yellow" />
					<p className="text-lg">{notify || "Try again An error occured"}</p>
				</div>
				<div className="mt-5 gap-7 flex items-center justify-center">
					<button
						onClick={() => setAlert(false)}
						className=" active:scale-[1.03] text-lg rounded cursor-pointer bg-[crimson] p-1 px-5"
						type="button"
					>
						Cancel
					</button>
					<button
						className=" active:scale-[1.03] text-lg rounded cursor-pointer bg-black p-1 px-10"
						type="button"
					>
						Yes
					</button>
				</div>
			</div>
		</div>
	);
}

export default memo(Modal);
