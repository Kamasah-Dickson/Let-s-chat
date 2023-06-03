import React, { useContext, useLayoutEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdvancedSettings from "../components/AdvancedSettings";
import { AllContext } from "../context/appContext";
import useMediaQuery from "../Hooks/useMediaQuery";

function AdvancedSettingsPage() {
	const { setSettings, toggleSettingsCategory } = useContext(AllContext);
	const { matches } = useMediaQuery("max-width:768px");

	useLayoutEffect(() => {
		setSettings(true);
	}, []);

	return (
		<div className="flex max">
			{matches && !toggleSettingsCategory ? (
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
							<AdvancedSettings />
						</div>
					</>
				)
			)}
			{toggleSettingsCategory && matches && (
				<div className="flex-[8] ">
					<AdvancedSettings />
				</div>
			)}
		</div>
	);
}

export default AdvancedSettingsPage;
