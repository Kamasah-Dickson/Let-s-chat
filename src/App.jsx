import React, { useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "./Hooks/useMediaQuery";
import { AllContext } from "./context/appContext";

function App() {
	const navigate = useNavigate();
	const { matches } = useMediaQuery("max-width:768px");
	const { showTargetMessage } = useContext(AllContext);

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
			{matches && !showTargetMessage ? (
				<div className="flex-[8] sm:flex-[6] md:flex-[5] lg:flex-[4] xl:flex-[2.5]">
					<Sidebar />
				</div>
			) : (
				!matches && (
					<>
						<div className="flex-[8] sm:flex-[6] md:flex-[5] lg:flex-[4] xl:flex-[2.5]">
							<Sidebar />
						</div>
						<div className="flex-[8] ">
							<Main />
						</div>
					</>
				)
			)}
			{showTargetMessage && matches && (
				<div className="flex-[8] ">
					<Main />
				</div>
			)}
		</div>
	);
}

export default App;
