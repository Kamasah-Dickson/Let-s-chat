import React, { useContext, useLayoutEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdvancedSettings from "../components/AdvancedSettings";
import { AllContext } from "../context/appContext";

function AdvancedSettingsPage() {
	const { setsettings } = useContext(AllContext);
	useLayoutEffect(() => {
		setsettings(true);
	}, []);

	return (
		<div className="flex max justify-center">
			<div className="flex-[12] sm:flex-[7] md:flex-[5] lg:flex-[4] xl:flex-[2.5]">
				<Sidebar />
			</div>
			<div className="flex-[8] ">
				<AdvancedSettings />
			</div>
		</div>
	);
}

export default AdvancedSettingsPage;
