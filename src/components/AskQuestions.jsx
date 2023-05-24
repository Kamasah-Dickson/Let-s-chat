import React, { useContext } from "react";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { AllContext } from "../context/appContext";

function AskQuestions() {
	const { setToggleSettingsCategory } = useContext(AllContext);
	return (
		<div className="main-bg">
			<div className="gradient h-full flex flex-col justify-center">
				<HiOutlineArrowSmLeft
					onClick={() => setToggleSettingsCategory(false)}
					className="md:hidden m-3 flex"
					color="white"
					size={25}
					cursor={"pointer"}
				/>
				<div className="pb-44 pt-3 flex-[3] px-2 overflow-y-auto">
					<p>dfsdfdfds</p>
					<p>dfsdfdfds</p>
				</div>
			</div>
		</div>
	);
}

export default AskQuestions;
