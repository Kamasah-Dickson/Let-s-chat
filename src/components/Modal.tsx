import { memo, useRef, useState } from "react";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { RiLinkM } from "react-icons/ri";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { ref, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { send as emailSend } from "@emailjs/browser";

type IModal =
	| {
			setAlert: React.Dispatch<React.SetStateAction<boolean>>;
			type: "logout" | "reset";
			notify: string;
	  }
	| {
			setAlert: React.Dispatch<React.SetStateAction<boolean>>;
			type: "invite";
			notify?: never;
	  };

function Modal({ setAlert, notify, type }: IModal) {
	const overlayRef = useRef<HTMLDivElement | null>(null);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		if (e.target === overlayRef.current) {
			setAlert(false);
		}
	}

	const modalAction = () => {
		if (type === "logout") {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					update(ref(db, `users/${user?.uid}`), {
						online: "offline",
						lastSeen: Date.now(),
					});
				}
			});

			auth.signOut();
			navigate("/login");
		} else if (type === "invite") {
			setLoading(true);
			emailSend(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				{
					from_name: "lets-chat💬",
					from_email: auth.currentUser?.email,
					to_email: email,
					to_name: name,
					message: `You have been invited by ${
						auth.currentUser?.displayName
					} to join let's-chat as a friend. Click the link to accept the invitation ${
						import.meta.env.VITE_WEBSITE_URL
					}/signup?inviteId=${auth?.currentUser?.uid}`,
				},
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY
			)
				.then(
					(response) => {
						if (response.status == 200) {
							toast.success("invite has been sent");
							setLoading(false);
						}
					},
					(error) => {
						console.log(error);
						setLoading(false);
						toast.error("Something went wrong");
					}
				)
				.finally(() => {
					setAlert(false);
				});
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		modalAction();
	};
	return type == "logout" ? (
		<div
			ref={overlayRef}
			onClick={(e) => handleClick(e)}
			className="z-50 cursor-pointer absolute bg-[#000000c2] top-0 left-0 h-screen flex items-center w-full"
		>
			<div className="bg-[#2e323e] cursor-default my-max p-6 sm:p-10 rounded-md text-white">
				<div className="flex flex-col items-center gap-3">
					<TbAlertTriangleFilled size={60} color="yellow" />
					<p className="text-lg text-center">
						{notify || "Try again An error occured"}
					</p>
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
						onClick={modalAction}
						className=" active:scale-[1.03] text-lg rounded cursor-pointer bg-black p-1 px-10"
						type="button"
					>
						Yes
					</button>
				</div>
			</div>
		</div>
	) : (
		<div
			ref={overlayRef}
			onClick={(e) => handleClick(e)}
			className="z-50 cursor-pointer absolute bg-[#000000c2] top-0 left-0 h-screen flex items-center w-full"
		>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="flex justify-between gap-5 bg-slate-900 cursor-default my-max p-6 sm:p-10 rounded-md text-white"
			>
				<div className="flex gap-2 w-full">
					<div className="flex gap-2 flex-col w-full">
						<input
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							className="w-full h-8 placeholder:text-sm rounded-md text-white bg-white/10 border-none outline-none px-2"
							type="text"
							placeholder="Email Of Friend"
						/>
						<input
							onChange={(e) => setName(e.target.value)}
							value={name}
							className="w-full h-8 placeholder:text-sm placeholder:text-gray-400/30 rounded-md text-white bg-white/10 border-none outline-none px-2"
							type="text"
							placeholder="Name Of Friend - Optional"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<button
						disabled={!email || loading}
						className=" disabled:bg-blue/30 enabled:cursor-pointer disabled:cursor-not-allowed transition text-md rounded cursor-pointer bg-blue/90 active:bg-blue p-1 px-10"
						type="submit"
					>
						{loading ? <HashLoader color="white" size={25} /> : "Invite"}
					</button>
					<button
						type="button"
						onClick={() => (
							navigator.clipboard.writeText(email),
							toast.success("Link Copied"),
							setAlert(false)
						)}
						className="flex active:bg-gray-800 cursor-pointer transition text-sm gap-1 items-center bg-gray-800/80 p-2 rounded-md w-full"
					>
						<RiLinkM size={20} color="white" />
						Copy link
					</button>
				</div>
			</form>
		</div>
	);
}

export default memo(Modal);
