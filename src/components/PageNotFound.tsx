import { Link } from "react-router-dom";

export default function PageNotFound() {
	return (
		<div className="h-screen flex items-center justify-center flex-col">
			<span className="text-7xl mb-5">💬</span>
			<h1 className="text-3xl text-center md:text-4xl font-medium text-black mb-5">
				Oops Page Not Found🚧
			</h1>
			<Link
				to={"/"}
				className="bg-white shadow-2xl shadow-[#00000071] font-semibold my-trans hover:bg-black text-black hover:text-white text-md md:text-lg rounded-3xl py-3 px-10 cursor-pointer active:scale-[0.8]"
			>
				Go Back Home
			</Link>
		</div>
	);
}
