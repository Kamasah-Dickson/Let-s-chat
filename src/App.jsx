import React, { useContext, useEffect, lazy, Suspense } from "react";
import Sidebar from "./components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "./Hooks/useMediaQuery";
import { AllContext } from "./context/appContext";
import { BeatLoader } from "react-spinners";

function App() {
	const navigate = useNavigate();
	const { matches } = useMediaQuery("max-width:768px");
	const { showTargetMessage } = useContext(AllContext);
	const Main = lazy(() => import("./components/Main"));

	useEffect(() => {
		function deterMineUserLoggedIn() {
			try {
				const unsubscribe = onAuthStateChanged(auth, (signedUser) => {
					if (signedUser) {
						return;
					} else {
						navigate("/login");
					}
				});

				return () => {
					unsubscribe();
				};
			} catch (error) {
				console.log(error);
			}
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
							<Suspense
								fallback={
									<div className="h-screen flex items-center justify-center">
										<BeatLoader
											className="h-screen w-full flex items-center justify-center"
											color="#ffffff"
											loading={true}
											size={15}
										/>
									</div>
								}
							>
								<Main />
							</Suspense>
						</div>
					</>
				)
			)}
			{showTargetMessage && matches && (
				<div className="flex-[8] ">
					<Suspense
						fallback={
							<div className="h-screen flex items-center justify-center">
								<BeatLoader color="#ffffff" loading={true} size={15} />
							</div>
						}
					>
						<Main />
					</Suspense>
				</div>
			)}
		</div>
	);
}

export default App;
