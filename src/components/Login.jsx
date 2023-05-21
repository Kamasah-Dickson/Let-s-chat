/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import signupImage from "../assets/signup.svg";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function Login() {
	const [loginValues, setLoginValues] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState(true);

	const handleInputChange = (e) => {
		setLoginValues((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const isDisabled =
		Boolean(!loginValues.email) || Boolean(!loginValues.password);

	return (
		<div className="h-screen overflow-y-scroll flex w-full items-center justify-center bg-[#0F172A]">
			<div className=" py-7 md:py-0 flex max-h-screen  items-center flex-col md:flex-row gap-10 md:gap-24 my-width">
				<div className="flex-1 relative h-full py-5 md:p-0">
					<img className="w-full h-full object-cover " src={signupImage} />
					<div className="blur h-36 w-36 block inset-0 rounded-full translate-y-10 absolute"></div>
					<div className="blur h-64 w-40 block translate-y-28 translate-x-40 inset-0 rounded-full   absolute"></div>
				</div>
				<div className="flex z-10 flex-col justify-center text-white py-5 md:py-0 flex-1 h-auto">
					<h1 className="clamp-h1 font-bold">
						Hey there, welcome{" "}
						<span className="sm:text-4xl md:text-7xl">💬</span>
					</h1>
					<p className="clamp-p text-[#95a2b8] py-5">
						We've missed you! please sign in to catch up on what you've missed
					</p>
					<button
						className="hover:bg-[#1f2d4b] bg-[#20283b] active:scale-[1.02] w-full rounded-full flex items-center transition-all justify-center gap-3 p-4 my-1"
						type="button"
					>
						<FcGoogle size={25} />
						Sign in with Google
					</button>
					<form className="py-2">
						<div className="flex flex-col gap-3 my-3">
							<label className="text-base" htmlFor="email">
								Email Address
							</label>
							<input
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type="email"
								name="email"
								onChange={(e) => handleInputChange(e)}
								value={loginValues.email}
								id="email"
								placeholder="i.e Kamasahdickson19@gmail.com"
							/>
							{error && (
								<p className="text-[crimson] text-sm ">
									User cannot be found or incorrect username
								</p>
							)}
						</div>
						<div className="flex flex-col gap-3 my-3">
							<label className="text-base" htmlFor="password">
								Password
							</label>
							<input
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type="password"
								name="password"
								onChange={(e) => handleInputChange(e)}
								value={loginValues.password}
								id="password"
								placeholder="**********"
								maxLength={16}
							/>
							{error && (
								<p className="text-[crimson] text-sm ">incorrect password</p>
							)}
						</div>

						<div className="mt-8">
							<button
								className="py-3 
								 active:scale-[1.02]
								 disabled:active:scale-100
								 disabled:cursor-default disabled:bg-[#8080808c] px-12 cursor-pointer font-medium hover:bg-[#2f3dbe] bg-[#4254eb] rounded-full  transition-all"
								type="submit"
								disabled={isDisabled}
							>
								Sign in
							</button>
							<p className="pt-5">
								Don't have an account?
								<Link className=" text-[#b63db6]" to="/signup">
									{" "}
									Create a free account
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;
