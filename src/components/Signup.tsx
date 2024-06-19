import { useState } from "react";
import signupImage from "../assets/Login.svg";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BiShowAlt, BiHide } from "react-icons/bi";
import { GoogleAuthProvider } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { set, ref, serverTimestamp, update } from "firebase/database";
import { updateContact } from "../helpers/chat";

interface ISignup {
	userName: string;
	password: string;
	email: string;
}
function Signup() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [showPassword, setShowpassword] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [searchParams] = useSearchParams();
	const inviteId = searchParams.get("inviteId") as string;

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<ISignup>();

	const handleGoogleSignup = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			if (result) {
				await updateContact(result?.user, inviteId);
				const user = result?.user;
				const displayName = user?.displayName as string;
				const email = user?.email as string;
				const photoURL = user?.photoURL as string;
				const uid = user?.uid;

				update(ref(db, `users/${result.user.uid}`), {
					uid,
					displayName,
					email,
					photoURL,
					lastSeen: Date.now(),
					date: serverTimestamp(),
				});
				navigate("/");
			}
		} catch (error: any) {
			console.log(error);
			switch (error.code) {
				case "auth/network-request-failed":
					toast.error("Please check your internet");
					break;
				case "auth/email-already-in-use":
					toast.error("Sorry Email Already In Use Try A New One");
					break;
				case "auth/internal-error":
					toast.error("An error occurred or bad internet");
					break;
				case "auth/operation-not-allowed":
					toast.error("Sorry operation was not allowed");
					break;
				default:
					console.log(error.code);
					break;
			}
		}
	};

	const onSubmit = async (data: ISignup) => {
		setLoading(true);
		setDisabled(true);

		try {
			toast.loading("Creating Your Account");
			const userCredentials = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);

			if (userCredentials) {
				await updateContact(userCredentials.user, inviteId);

				const displayName = data?.userName;
				const email = data?.email;
				const photoURL = "";
				const userId = userCredentials.user.uid;

				//save userCredentials to database
				await set(ref(db, "users/" + userId), {
					uid: userId,
					displayName,
					email,
					photoURL,
					lastSeen: Date.now(),
					date: serverTimestamp(),
				});

				//create a userChat in database
				await set(ref(db, "usersChats/" + userId), {});

				toast.dismiss();
				navigate("/");
			}
		} catch (error: any) {
			toast.dismiss();
			console.log(error);

			switch (error.code) {
				case "auth/network-request-failed":
					toast.error("Please check your internet");
					break;
				case "auth/email-already-in-use":
					toast.error("Sorry Email Already In Use");
					break;
				case "auth/internal-error":
					toast.error("An error occurred");
					break;
				case "auth/operation-not-allowed":
					toast.error("Sorry operation was not allowed");
					break;
				default:
					console.log(error.code);
					break;
			}
			setLoading(false);
			setDisabled(false);
		}
	};

	return (
		<div className="grid h-screen overflow-y-scroll bg-[#0F172A]">
			<div className="flex w-full items-center justify-center flex-col md:flex-row gap-10 md:gap-24 my-width">
				<div className="hidden lg:flex flex-1 relative h-auto">
					<img className="w-full h-auto object-cover" src={signupImage} />
				</div>
				<div className="h-screen max-w-lg mx-auto flex z-10 flex-col justify-center text-white flex-1">
					<h1 className="clamp-h1 font-bold">
						Join <span className="text-[#5640eb]"> {`Let's`} chat</span> today
						<span className="sm:text-4xl md:text-7xl">💬</span>
					</h1>
					<p className="clamp-p text-center sm:text-left text-[#95a2b8] py-5">
						Signup to have the best experience with your friends, family and
						loved ones
					</p>
					<button
						onClick={() => handleGoogleSignup()}
						className="shadow disabled:active:scale-100 disabled:bg-[#8080808c] shadow-black hover:bg-[#1f2d4b] bg-[#20283b] active:scale-[1.02] w-full rounded-full flex items-center transition-all justify-center gap-3 p-4 my-1"
						type="button"
						disabled={disabled}
					>
						<FcGoogle size={25} />
						Sign up with Google
					</button>
					<form onSubmit={handleSubmit(onSubmit)} className="py-2">
						<div className="flex flex-col gap-3 my-2">
							<input
								disabled={disabled}
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type="text"
								{...register("userName", {
									required: {
										value: true,
										message: "Username cannot be blank",
									},
								})}
								id="username"
								placeholder="Username"
							/>
						</div>
						{errors.userName?.message && (
							<p className="mb-3 text-[crimson] text-sm ">
								{errors.userName?.message}
							</p>
						)}
						<div className="flex flex-col gap-3 my-3">
							<input
								disabled={disabled}
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type="email"
								{...register("email", {
									required: "Email cannot be blank",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Email is not valid",
									},
								})}
								id="email"
								placeholder="email"
							/>
						</div>
						{errors.email?.message && (
							<p className="mb-3 text-[crimson] text-sm ">
								{errors.email?.message}
							</p>
						)}
						<div className="flex flex-col gap-3 my-2 relative">
							<input
								disabled={disabled}
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type={showPassword ? "text" : "password"}
								{...register("password", {
									required: "password cannot be blank",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters long",
									},
								})}
								id="password"
								autoComplete="true"
								placeholder="password"
							/>
							<div
								onClick={() => setShowpassword((prev) => !prev)}
								className=" cursor-pointer absolute top-0 right-5 flex items-center h-full"
							>
								{showPassword ? (
									<BiShowAlt color="#95a2b8a2" size={20} />
								) : (
									<BiHide color="#95a2b8a2" size={20} />
								)}
							</div>
						</div>
						{errors.password?.message && (
							<p className="mb-3 text-[crimson] text-sm ">
								{errors.password?.message}
							</p>
						)}

						<p className="text-white pt-3 pb-5">
							Already having an account ?{" "}
							<Link
								to={inviteId ? `/login?inviteId=${inviteId}` : "/login"}
								className="font-semibold text-[#e94f11]"
							>
								Sign in
							</Link>
						</p>
						<div>
							{loading ? (
								<p className=" font-medium text-[#5184f1]">
									Creating your account please wait...
								</p>
							) : (
								<button
									className="py-3
								active:scale-[1.02]
								disabled:active:scale-100
								disabled:cursor-default disabled:bg-[#8080808c] px-12 cursor-pointer font-semibold hover:bg-[#2f3dbe] bg-[#4254eb] rounded-full  transition-all"
									type="submit"
									disabled={disabled}
								>
									Create Account
								</button>
							)}
						</div>
					</form>
					<Toaster />
				</div>
			</div>
		</div>
	);
}

export default Signup;
