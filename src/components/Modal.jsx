/* eslint-disable react/prop-types */
import React, { memo, useRef } from "react";
import { TbAlertTriangleFilled } from "react-icons/tb";

function Modal({ setAlert, notify }) {
	const overlayRef = useRef(null);

	function handleClick(e) {
		if (e.target === overlayRef.current) {
			setAlert(false);
		}
	}
	return (
		<div
			ref={overlayRef}
			onClick={(e) => handleClick(e)}
			className="z-50 cursor-pointer absolute bg-[#000000c2] top-0 left-0 h-screen flex items-center justify-center w-full"
		>
			<div className="bg-[#2e323e] cursor-default py-10 px-7  rounded-md text-white">
				<div className="flex flex-col items-center gap-3">
					<TbAlertTriangleFilled size={60} color="yellow" />
					<p className="text-lg">{notify || "Try again An error occured"}</p>
				</div>
				<div className="mt-7 gap-7 flex items-center justify-center">
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
