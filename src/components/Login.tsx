import { useState } from "react";
import signupImage from "../assets/signup.svg";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
	signInWithPopup,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, serverTimestamp, update } from "firebase/database";
import { updateContact } from "../helpers/chat";

interface ILoginCredentials {
	email: string;
	password: string;
}
function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginCredentials>();
	const provider = new GoogleAuthProvider();
	const navigate = useNavigate();
	const [disabled, setDisabled] = useState(false);
	const [loading, setLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const inviteId = searchParams.get("inviteId") as string;

	const loginWithGoogle = async () => {
		setLoading(true);
		setDisabled(true);
		try {
			const userCredential = await signInWithPopup(auth, provider);
			if (userCredential) {
				await updateContact(userCredential.user, inviteId);

				update(ref(db, `users/${userCredential.user.uid}`), {
					uid: userCredential?.user?.uid,
					displayName: userCredential.user.displayName,
					email: userCredential.user.email,
					photoURL: userCredential.user.photoURL,
					lastSeen: Date.now(),
					date: serverTimestamp(),
				});

				toast.dismiss();
				navigate("/");
			}
		} catch (error: any) {
			setLoading(false);
			setDisabled(false);
			console.log(error);
			switch (error.code) {
				case "auth/network-request-failed":
					toast.error("Please check your internet connection");
					break;
				case "auth/invalid-email":
					toast.error("Invalid Email Address");
					break;
				case "auth/internal-error":
					toast.error("An error occurred or bad internet");
					break;
				case "auth/user-not-found":
					toast.error("You don't have an account");
					break;
				case "auth/wrong-password":
					toast.error("Wrong password");
					break;
				case "auth/popup-closed-by-user":
					toast.error("Failed to sign in with Google");
					break;

				default:
					console.log(error.code);
					break;
			}
		}
	};

	const onSubmit = async (data: ILoginCredentials) => {
		setLoading(true);
		setDisabled(true);
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);

			if (userCredential) {
				toast.dismiss();
				await updateContact(userCredential.user, inviteId);
				navigate("/");
			}
		} catch (error: any) {
			setLoading(false);
			setDisabled(false);
			console.log(error);
			switch (error.code) {
				case "auth/network-request-failed":
					toast.error("Please check your internet connection");
					break;
				case "auth/user-not-found":
					toast.error("You don't have an account");
					break;
				case "auth/wrong-password":
					toast.error("Wrong password");
					break;
				case "auth/operation-not-allowed":
					toast.error("Sorry operation was not allowed");
					break;
				case "auth/invalid-email":
					toast.error("Invalid Email Address");
					break;
				case "auth/user-disabled":
					toast.error("Sorry user has been disabled");
					break;
				default:
					console.log(error.code);
					break;
			}
		}
	};

	return (
		<div className="h-screen overflow-y-scroll flex w-full items-center justify-center bg-[#0F172A]">
			<div className=" py-7 md:py-0 flex max-h-screen  items-center flex-col md:flex-row gap-10 md:gap-24 my-width">
				<div className="hidden md:flex flex-1 relative h-full py-5 md:p-0">
					<img className="w-full h-full object-cover " src={signupImage} />
					<div className="blur h-36 w-36 block inset-0 rounded-full translate-y-10 absolute"></div>
					<div className="blur h-64 w-40 block translate-y-28 translate-x-40 inset-0 rounded-full   absolute"></div>
				</div>
				<div className="flex z-10 flex-col justify-center text-white py-5 md:py-0 flex-1 h-auto">
					<h1 className="clamp-h1 font-bold">
						Hey there, <span className="text-[#5640eb]">welcome</span>
						<span className="sm:text-4xl md:text-7xl">💬</span>
					</h1>
					<p className="clamp-p text-[#95a2b8] py-5">
						{`We've`} missed you! please sign in to catch up on what{` you've`}{" "}
						missed
					</p>
					<button
						disabled={disabled}
						onClick={() => loginWithGoogle()}
						className="shadow disabled:active:scale-100 disabled:bg-[#8080808c] shadow-black hover:bg-[#1f2d4b] bg-[#20283b] active:scale-[1.02] w-full rounded-full flex items-center transition-all justify-center gap-3 p-4 my-1"
						type="button"
					>
						<FcGoogle size={25} />
						Sign in with Google
					</button>
					<form onSubmit={handleSubmit(onSubmit)} className="py-2">
						<div className="flex flex-col gap-3 my-3">
							<input
								disabled={disabled}
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-5 rounded-full"
								type="email"
								{...register("email", {
									required: {
										value: true,
										message: "Email is required",
									},
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Your email is not valid",
									},
								})}
								placeholder="i.e Kamasahdickson19@gmail.com"
							/>
							{errors.email?.message && (
								<p className="mb-3 text-[crimson] text-sm ">
									{errors.email?.message}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-3 my-3">
							<input
								disabled={disabled}
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-5 rounded-full"
								type="password"
								autoComplete="true"
								{...register("password", {
									required: {
										value: true,
										message: "Password cannot be blank",
									},
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters long",
									},
								})}
								placeholder="Password"
							/>
							{errors.password?.message && (
								<p className="text-[crimson] text-sm ">
									{errors.password?.message}
								</p>
							)}
						</div>

						<div className="mt-5">
							{loading ? (
								<p className=" font-medium text-[#5184f1]">please wait...</p>
							) : (
								<button
									disabled={disabled}
									className="py-3 
								
								 active:scale-[1.02]
								 disabled:active:scale-100
								 disabled:cursor-default disabled:bg-[#8080808c] px-12 cursor-pointer font-medium hover:bg-[#2f3dbe] bg-[#4254eb] rounded-full  transition-all"
									type="submit"
								>
									Sign in
								</button>
							)}
							<p className="font-semibold mt-7">
								{`Don't`} have an account?
								<Link
									className=" font-medium text-[#b63db6]"
									to={inviteId ? `/signup?invteId=${inviteId}` : "/signup"}
								>
									{" "}
									Create a free account
								</Link>
							</p>
						</div>
					</form>
					<Toaster />
				</div>
			</div>
		</div>
	);
}

export default Login;
