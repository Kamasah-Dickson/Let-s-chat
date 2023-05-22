import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function App() {
	const navigate = useNavigate();

	useEffect(() => {
		function deterMineUserLoggedIn() {
			onAuthStateChanged(auth, (signedUser) => {
				if (signedUser) {
					return;
				} else {
					navigate("/login");
				}
			});
		}
		deterMineUserLoggedIn();
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
