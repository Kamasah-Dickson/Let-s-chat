/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import signupImage from "../assets/Login.svg";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

function Signup() {
	const [erorr, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [loginValues, setLoginValues] = useState({
		email: "",
		password: "",
		username: "",
	});

	const handleInputChange = (e) => {
		setLoginValues((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const isDisabled =
		Boolean(!loginValues.email) ||
		Boolean(!loginValues.password) ||
		Boolean(!loginValues.username);

	const createUser = async () => {
		setLoading(true);
		try {
			const userCredentials = await createUserWithEmailAndPassword(
				auth,
				loginValues.email,
				loginValues.password
			);
			const user = userCredentials.user;

			setLoading(false);

			updateProfile(user, {
				displayName: loginValues.username,
			});
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		createUser();
	};

	return (
		<div className="h-screen overflow-y-scroll flex w-full items-center justify-center bg-[#0F172A]">
			<div className=" py-7 md:py-0 flex max-h-screen  items-center flex-col md:flex-row gap-10 md:gap-24 my-width">
				<div className="flex-1 relative h-full py-5 md:p-0">
					<img className="w-full h-full object-cover " src={signupImage} />
				</div>

				<div className="flex z-10 flex-col justify-center text-white py-5 md:py-0 flex-1 h-auto">
					<h1 className="clamp2-h1 font-bold">Join Let's chat today 👋</h1>
					<p className="clamp-p text-[#95a2b8] py-5">
						Signup and enjoy the best experience with your friends, family and
						loved ones
					</p>
					<button
						className="hover:bg-[#1f2d4b] bg-[#20283b] active:scale-[1.02] w-full rounded-full flex items-center transition-all justify-center gap-3 p-4 my-1"
						type="button"
					>
						<FcGoogle size={25} />
						Sign up with Google
					</button>
					<form onSubmit={handleSubmit} className="py-2">
						<div className="flex flex-col gap-3 my-3">
							<input
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type="text"
								name="username"
								onChange={(e) => handleInputChange(e)}
								value={loginValues.username}
								id="username"
								placeholder="Username"
							/>
						</div>
						<div className="flex flex-col gap-3 my-3">
							<input
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type="email"
								name="email"
								onChange={(e) => handleInputChange(e)}
								value={loginValues.email}
								id="email"
								placeholder="email"
							/>
						</div>
						<div className="flex flex-col gap-3 my-3">
							<input
								className="border placeholder:text-sm leading-3 placeholder:text-[#95a2b8a2] border-[#354055] bg-transparent p-4 rounded-full"
								type="password"
								name="password"
								onChange={(e) => handleInputChange(e)}
								value={loginValues.password}
								id="password"
								placeholder="password"
								maxLength={16}
							/>
						</div>
						<div className="flex items-center gap-2 my-3">
							<input
								className="border placeholder:text-[#95a2b8] border-[#354055] bg-transparent p-3 rounded-full"
								type="checkbox"
								name="remember"
								value=""
								id="remember"
							/>
							<label className="text-base py-2" htmlFor="remember">
								Remember me
							</label>
						</div>
						<div className="mt-3">
							{!loading ? (
								<p className=" font-medium text-[#5184f1]">
									Creating your account please wait...
								</p>
							) : (
								<button
									className="py-3 
								 active:scale-[1.02]
								 disabled:active:scale-100
								 disabled:cursor-default disabled:bg-[#8080808c] px-5 cursor-pointer font-medium hover:bg-[#2f3dbe] bg-[#4254eb] rounded-full  transition-all"
									type="submit"
									disabled={isDisabled}
								>
									Create Account
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Signup;
