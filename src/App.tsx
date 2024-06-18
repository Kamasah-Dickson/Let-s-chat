import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import { IChat } from "./Store/features/chatSlice";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import Loading from "./components/Loading.tsx";
import { Suspense } from "react";

function App() {
	const { showSidebar } = useSelector<RootState>(
		(state) => state.chat
	) as IChat;
	return (
		<ProtectedRoutes>
			<Suspense fallback={<Loading />}>
				<div className="flex max antialiased">
					<div
						className={`${
							showSidebar ? "block" : "hidden md:block"
						} z-10 flex-[8]  scrollbar bg-sidebar_color h-screen overflow-y-auto sm:flex-[6] md:flex-[5] lg:flex-[4] xl:flex-[2.5]`}
					>
						<Sidebar />
					</div>
					<div
						className={`flex-[8] ${showSidebar ? "hidden md:block" : "block"}`}
					>
						<Main />
					</div>
				</div>
			</Suspense>
		</ProtectedRoutes>
	);
}

export default App;
