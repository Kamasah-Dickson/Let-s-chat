import React, { useState, useRef, useEffect, useContext } from "react";
import { MdCameraEnhance, MdEdit } from "react-icons/md";
import { AllContext } from "../context/appContext";
import { auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import testImg from "../assets/background.svg";
import { HiOutlineArrowSmLeft } from "react-icons/hi";

function UpdateUserProfile() {
	const [update, setUpdate] = useState(false);
	const [userName, setUserName] = useState("");
	const { userProfile, updateUserProfile, setToggleSettingsCategory } =
		useContext(AllContext);
	const nameRef = useRef(null);

	useEffect(() => {
		if (update) {
			nameRef.current.focus();
		}
	}, [update]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateProfile(auth.currentUser, {
				displayName: userName,
			});
			toast.success("Username updated successfully");

			updateUserProfile((prev) => ({ ...prev, displayName: userName }));
			setUserName("");
			setUpdate(false);
		} catch (error) {
			switch (error.code) {
				case "auth/network-request-failed":
					toast.error("Please check your internet and try again");
					setUpdate(false);
					setUserName("");
					break;

				default:
					toast.error("Please try again an error occured");
					console.log(error.code);
					break;
			}
		}
	};

	const handleSetProfile = async (e) => {
		const profile = e.target.files[0];
		try {
			const storageRef = ref(storage, "user-profiles/" + profile?.name);
			const uploadTask = uploadBytesResumable(storageRef, profile);

			uploadTask.on("state_changed", () => {
				getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
					await updateProfile(auth.currentUser, {
						photoURL: downloadURL,
					});
					updateUserProfile((prev) => ({ ...prev, photoURL: downloadURL }));
				});
			});
			toast.success("Profile updated successfully");
		} catch (error) {
			console.log(error);
			toast.error("Profile update failed");
		}
	};

	const isDisabled = Boolean(!userProfile?.photoURL) || Boolean(!userName);

	return (
		<div className="main-bg">
			<div className="gradient h-full flex flex-col ">
				<form className="px-4 h-full md:px-8" onSubmit={handleSubmit}>
					<HiOutlineArrowSmLeft
						onClick={() => setToggleSettingsCategory(false)}
						className="md:hidden m-3 flex"
						color="white"
						size={25}
						cursor={"pointer"}
					/>
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
								src={userProfile?.photoURL || testImg}
								alt={userProfile?.displayName}
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
								{!update ? (
									<h3 className="text-white text-xl md:text-4xl flex items-center font-semibold gap-5">
										{userProfile.displayName || "username"}
										<MdEdit
											onClick={() => setUpdate(true)}
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
													? (setUpdate(false), setUserName(""))
													: null
											}
											onChange={(e) => setUserName(e.target.value)}
										/>
										<button
											onClick={() => (setUserName(""), setUpdate(false))}
											type="button"
											className="rounded-md p-2 text-sm font-medium active:scale-[1.02] bg-[crimson] text-white w-fit"
										>
											Cancel update
										</button>
									</div>
								)}
								<span className="text-sm md:text-lg  text-green">
									@
									{userProfile?.email?.slice(
										0,
										userProfile?.email.indexOf("@")
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
