import React from "react";
import Sidebar from "../components/Sidebar";
import AdvancedSettings from "../components/AdvancedSettings";

function AdvancedSettingsPage() {
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
