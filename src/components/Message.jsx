/* eslint-disable react/prop-types */
import React, { memo, useContext, useRef, useEffect } from "react";
import testing from "../assets/background.svg";
import { auth } from "../firebase";
import { ChatContext } from "../context/chatContext";
import getTimeDifference from "../utils/timeStamp";

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
			} gap-3`}
		>
			<div>
				<div className=" w-[45px] h-[45px] rounded-full">
					<img
						className="rounded-full h-full w-full object-cover"
						src={
							message.senderId === currentUserID.uid
								? currentUserID.photoURL || testing
								: data.user.photoURL || testing
						}
						alt={data?.user?.displayName}
					/>
				</div>
				<span className="font-normal text-gray-400 text-xs">
					{getTimeDifference(Number(message?.date)) || ""}
				</span>
			</div>
			<div
				className={` ${
					message.senderId === currentUserID.uid ? "owner" : "coming"
				} flex flex-[2] max-w-[400px] gap-5 text-white`}
			>
				{message.text && (
					<p
						style={{ overflowWrap: "anywhere" }}
						className=" max-w-fit border shadow-xl shadow-[#00000021] border-[#00000044] text-white text-sm p-2"
					>
						{message.text}
					</p>
				)}
				{message.img && (
					<div className="w-1/2 min-h-auto rounded-lg shadow-2xl shadow-[#00000062]">
						<img
							className="w-full h-auto rounded-lg"
							src={message.img && message.img}
							alt={data?.user?.displayName}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(Message);
