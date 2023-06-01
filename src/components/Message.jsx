/* eslint-disable react/prop-types */
import React, { memo, useContext, useRef, useEffect } from "react";
import testing from "../assets/background.svg";
import { auth } from "../firebase";
import { ChatContext } from "../context/chatContext";

function Message({ message }) {
	const currentUserID = auth?.currentUser;
	const { data } = useContext(ChatContext);
	const ref = useRef();

	useEffect(() => {
		ref.current.scrollIntoView({ behaviour: "smooth" });
	}, [message]);

	return (
		<div
			ref={ref}
			className={` flex justify-start ${
				message.senderId === currentUserID.uid
					? "owner-parent"
					: "coming-parent"
			} gap-5`}
		>
			<div>
				<div className=" w-[45px] h-[45px] rounded-full">
					<img
						className="rounded-full h-full w-full object-cover"
						src={
							message.senderId === currentUserID.uid
								? currentUserID.photoURL
								: data.user.photoURL ?? testing
						}
						alt=""
					/>
				</div>
				<span className="font-normal text-gray-400 text-xs">Just now</span>
			</div>
			<div
				className={` ${
					message.senderId === currentUserID.uid ? "owner" : "coming"
				} flex max-w-[80%] flex-[2] gap-5 text-white`}
			>
				<p className=" border border-[#00000044] text-white w-max text-sm p-2">
					{message.text}
				</p>
				<div className="w-1/2">
					{message.img && (
						<img
							className="w-full h-auto"
							src={message.img && message.img}
							alt=""
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default memo(Message);
