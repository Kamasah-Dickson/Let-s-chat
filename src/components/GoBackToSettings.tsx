import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { setShowSettingsOnMobile } from "../Store/features/settingsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store/store";

const GoBackToSettings = () => {
	const dispatch = useDispatch<AppDispatch>();
	return (
		<HiOutlineArrowSmLeft
			onClick={() =>
				dispatch(setShowSettingsOnMobile({ showSettingsOnMobile: false }))
			}
			className="md:hidden m-3 flex"
			color="white"
			size={25}
			cursor={"pointer"}
		/>
	);
};

export default GoBackToSettings;
