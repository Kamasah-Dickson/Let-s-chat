import { useState, useRef, useEffect } from "react";
import { MdCameraEnhance, MdEdit } from "react-icons/md";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile, User } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import testImg from "../assets/background.svg";
import { update, ref as databaseRef } from "firebase/database";
import GoBackToSettings from "./GoBackToSettings";

function UpdateUserProfile() {
	const [updates, setUpdates] = useState(false);
	const [userName, setUserName] = useState("");
	const nameRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (updates && nameRef.current) {
			nameRef.current.focus();
		}
	}, [updates]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await updateProfile(auth?.currentUser as User, {
				displayName: userName,
			});
			toast.success("Username updated successfully");
			setUserName("");
			setUpdates(false);
		} catch (error: any) {
			switch (error.code) {
				case "auth/network-request-failed":
					toast.error("Please check your internet and try again");
					setUpdates(false);
					setUserName("");
					break;

				default:
					toast.error("Please try again an error occured");
					console.log(error.code);
					break;
			}
		}
	};

	const handleSetProfile = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const profile = event.target.files?.[0];
		if (!profile) {
			toast.error("Please select a profile picture");
			return;
		}
		try {
			const storageRef = ref(storage, "user-profiles/" + profile.name);
			const uploadTask = uploadBytesResumable(storageRef, profile);

			uploadTask.on("state_changed", () => {
				getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
					await updateProfile(auth?.currentUser as User, {
						photoURL: downloadURL,
					});
					const userId = auth?.currentUser?.uid as string;
					const userRef = databaseRef(db, `users/${userId}`);
					const updatedData = {
						photoURL: downloadURL,
					};
					await update(userRef, updatedData);
				});
			});
			toast.success("Profile updated successfully");
		} catch (error: any) {
			console.log(error);
			toast.error("Profile update failed");
			if (error.code === "auth/network-request-failed") {
				toast.error("Please check your internet and try again");
			}
		}
	};

	const isDisabled = Boolean(!auth.currentUser?.photoURL) || Boolean(!userName);

	return (
		<div className="main-bg">
			<div className="gradient py-5 h-full overflow-y-auto flex flex-col ">
				<form className="px-4 h-full md:px-8" onSubmit={handleSubmit}>
					<GoBackToSettings />
					<h2 className="text-white py-7 md:py-10 text-3xl sm:text-4xl md:text-5xl font-semibold">
						Update Profile
					</h2>

					<div className="flex transition-colors p-2 items-center gap-3 md:gap-8 w-full">
						<label
							htmlFor="profile"
							className="shadow shadow-[#0000006b] overflow-hidden cursor-pointer rounded-full w-24 md:w-44 md:h-44 h-24 relative "
						>
							<img
								className="h-full w-full object-cover rounded-full"
								src={auth.currentUser?.photoURL || testImg}
								alt={auth.currentUser?.displayName as string}
							/>
							<div className="hover:bg-[#00000067] transiton-all bg-[#0303037e] absolute top-0 left-0 h-full w-full flex items-center justify-center">
								<MdCameraEnhance
									className="active:scale-[1.05]"
									color="white"
									size={40}
								/>
							</div>
							<input
								className="hidden"
								type="file"
								id="profile"
								name="profile"
								title="upload"
								onChange={handleSetProfile}
							/>
						</label>

						<div className="flex-1 ">
							<div className="flex flex-col gap-2">
								{!updates ? (
									<h3 className="text-white text-xl md:text-4xl flex items-center font-semibold gap-5">
										{auth?.currentUser?.displayName || "username"}
										<MdEdit
											onClick={() => setUpdates(true)}
											className="active:scale-[1.05]"
											cursor={"pointer"}
											size={30}
										/>
									</h3>
								) : (
									<div className="flex items-center gap-7">
										<input
											ref={nameRef}
											className="text-white text-2xl flex items-center font-semibold gap-5 max-w-[250px] bg-transparent border-b outline-none"
											type="text"
											name="userName"
											value={userName}
											onKeyUp={(e) =>
												e.code === "Escape"
													? (setUpdates(false), setUserName(""))
													: null
											}
											onChange={(e) => setUserName(e.target.value)}
										/>
										<button
											onClick={() => (setUserName(""), setUpdates(false))}
											type="button"
											className="rounded-md p-2 text-sm font-medium active:scale-[1.02] bg-[crimson] text-white w-fit"
										>
											Cancel update
										</button>
									</div>
								)}
								<span className="text-sm md:text-lg  text-green">
									@
									{auth.currentUser?.email?.slice(
										0,
										auth.currentUser?.email.indexOf("@")
									) || "username"}
								</span>
							</div>
						</div>
					</div>
					<button
						type="submit"
						className="py-3 
                        text-white
								 active:scale-[1.02]
								 disabled:scale-100
                                 block
                                 mx-auto
								 disabled:cursor-default disabled:bg-[#8080808c] px-12 cursor-pointer font-medium hover:bg-[#2f3dbe] bg-[#4254eb] rounded-full  transition-all"
						disabled={isDisabled}
					>
						Update
					</button>
				</form>
				<Toaster />
			</div>
		</div>
	);
}

export default UpdateUserProfile;
