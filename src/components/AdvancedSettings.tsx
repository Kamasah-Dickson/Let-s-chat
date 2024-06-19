import ComingSoon from "./ComingSoon";
import GoBackToSettings from "./GoBackToSettings";

function AdvancedSettings() {
	return (
		<div className="main-bg">
			<div className="gradient h-full flex flex-col justify-center">
				<GoBackToSettings />
				<div className="pb-44 pt-3 flex-[3] px-2 ">
					<ComingSoon />
				</div>
			</div>
		</div>
	);
}

export default AdvancedSettings;
