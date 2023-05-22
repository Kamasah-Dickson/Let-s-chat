import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import useAuth from "./Hooks/auth";
import { useNavigate } from "react-router-dom";

function App() {
	const { user } = useAuth();
	const navigate = useNavigate();

	// TODO: when user is not logged in redirect to login or show the chat page
	useEffect(() => {
		if (user) {
			navigate("/login");
			// console.log(user);
		}
	}, []);

	return (
		<div className="flex max">
			<div className="flex-[8] sm:flex-[6] md:flex-[5] lg:flex-[4] xl:flex-[2.5]">
				<Sidebar />
			</div>
			<div className="flex-[8] ">
				<Main />
			</div>
		</div>
	);
}

export default App;
