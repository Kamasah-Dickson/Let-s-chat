import { HiOutlineArrowSmLeft } from "react-icons/hi";
import ComingSoon from "./ComingSoon";
import { useDispatch } from "react-redux";
import { setToggleSettingsCategory } from "../Store/features/settingsSlice";
import { AppDispatch } from "../Store/store";

function Chat_settings() {
	const dispatch = useDispatch<AppDispatch>();
	return (
		<div className="main-bg">
			<div className="gradient h-full flex flex-col justify-center">
				<HiOutlineArrowSmLeft
					onClick={() =>
						dispatch(
							setToggleSettingsCategory({ toggleSettingsCategory: false })
						)
					}
					className="md:hidden m-3 flex"
					color="white"
					size={25}
					cursor={"pointer"}
				/>
				<div className="pb-44 pt-3 flex-[3] px-2 ">
					<ComingSoon />
				</div>
			</div>
		</div>
	);
}

export default Chat_settings;
