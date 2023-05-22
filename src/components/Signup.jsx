/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import signupImage from "../assets/Login.svg";
import { FcGoogle } from "react-icons/fc";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BiShowAlt, BiHide } from "react-icons/bi";

function Signup() {
	// const [loading, setLoading] = useState(false);
	const [showPassword, setShowpassword] = useState(false);

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm();

	// const isDisabled =
	// 	Boolean(!loginValues.email) ||
	// 	Boolean(!loginValues.password) ||
	// 	Boolean(!loginValues.username);

	// const createUser = async () => {
	// 	setLoading(true);
	// 	try {
	// 		const userCredentials = await createUserWithEmailAndPassword(
	// 			auth,
	// 			loginValues.email,
	// 			loginValues.password
	// 		);
	// 		const user = userCredentials.user;

	// 		setLoading(false);

	// 		updateProfile(user, {
	// 			displayName: loginValues.username,
	// 		});
	// 	} catch (error) {
	// 		console.log(error);
	// 		setLoading(false);
	// 	}
	// };
	const onSubmit = (data) => {
		console.log(data);
	};

	return (
		<div className="h-screen overflow-y-scroll flex w-full items-center justify-center bg-[#0F172A]">
			<div className=" py-7 md:py-0 flex max-h-screen  items-center flex-col md:flex-row gap-10 md:gap-24 my-width">
				<div className="flex-1 relative h-full py-5 md:p-0">
					<img className="w-full h-full object-cover " src={signupImage} />
				</div>

				<div className="flex z-10 flex-col justify-center text-white py-5 md:py-0 flex-1 h-auto">
					<h1 className="clamp2-h1 leading-[1.2] md:leading-tight font-bold">
						Join <span className="text-[#5640eb]"> Let's chat</span> today
						<span className="sm:text-4xl md:text-7xl">💬</span>
					</h1>
					<p className="clamp-p font-normal text-[#95a2b8] py-3">
						Signup and enjoy the best experience with your friends, family and
						loved ones
					</p>
					<button
						className="shadow shadow-black hover:bg-[#1f2d4b] bg-[#20283b] active:scale-[1.02] w-full rounded-full flex items-center transition-all justify-center gap-3 p-4 my-1"
						type="button"
					>
						<FcGoogle size={25} />
						Sign up with Google
					</button>
					<form onSubmit={handleSubmit(onSubmit)} className="py-2">
						<div className="flex flex-col gap-3 my-2">
							<input
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type="text"
								{...register("username", {
									required: {
										value: true,
										message: "Username cannot be blank",
									},
								})}
								id="username"
								placeholder="Username"
							/>
						</div>
						{errors.username?.message && (
							<p className="mb-3 text-[crimson] text-sm ">
								{errors.username?.message}
							</p>
						)}
						<div className="flex flex-col gap-3 my-3">
							<input
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
						<div className="flex items-center gap-2">
							<input
								className="border placeholder:text-[#95a2b8] border-[#354055] bg-transparent p-3 rounded-full"
								type="checkbox"
								{...register("remember")}
								id="remember"
							/>
							<label className="text-base py-2" htmlFor="remember">
								Remember me
							</label>
						</div>
						<p className="text-white">
							Already having an account ?{" "}
							<Link to={"/login"} className="font-semibold text-[#e94f11]">
								Sign in
							</Link>
						</p>
						<div className="mt-5">
							{/* {loading ? (
								<p className=" font-medium text-[#5184f1]">
									Creating your account please wait...
								</p>
							) : ( */}
							<button
								className="py-3
								
								active:scale-[1.02]
								disabled:active:scale-100
								disabled:cursor-default disabled:bg-[#8080808c] px-12 cursor-pointer font-semibold hover:bg-[#2f3dbe] bg-[#4254eb] rounded-full  transition-all"
								type="submit"
							>
								Create Account
							</button>
							{/* )} */}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Signup;
