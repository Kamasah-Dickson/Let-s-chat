import React, { useContext, useLayoutEffect } from "react";
import Sidebar from "../components/Sidebar";
import UpdateUserProfile from "../components/UpdateProfile";
import { AllContext } from "../context/appContext";

function UpdateProfilePage() {
	const { setsettings } = useContext(AllContext);
	useLayoutEffect(() => {
		setsettings(true);
	}, []);

	return (
		<div>
			<div className="flex">
				<div className="flex-[12] sm:flex-[7] md:flex-[5] lg:flex-[4] xl:flex-[2.5]">
					<Sidebar />
				</div>
				<div className="flex-[8] ">
					<UpdateUserProfile />
				</div>
			</div>
		</div>
	);
}

export default UpdateProfilePage;
