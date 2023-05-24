import React, { useContext, useLayoutEffect } from "react";
import Sidebar from "../components/Sidebar";
import Language from "../components/Language";
import { AllContext } from "../context/appContext";
import useMediaQuery from "../Hooks/useMediaQuery";

function LanguagePage() {
	const { setsettings, toggleSettingsCategory } = useContext(AllContext);
	const { matches } = useMediaQuery("max-width:768px");
	useLayoutEffect(() => {
		setsettings(true);
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
							<Language />
						</div>
					</>
				)
			)}
			{toggleSettingsCategory && matches && (
				<div className="flex-[8] ">
					<Language />
				</div>
			)}
		</div>
	);
}

export default LanguagePage;
