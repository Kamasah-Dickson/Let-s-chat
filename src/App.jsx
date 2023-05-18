import React from "react";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

function App() {
	return (
		<div className="flex max justify-center">
			<div className="flex-[12] sm:flex-[7] md:flex-[5] lg:flex-[4] xl:flex-[2.5]">
				<Sidebar />
			</div>
			<div className="flex-[8] ">
				<Main />
			</div>
		</div>
	);
}

export default App;
