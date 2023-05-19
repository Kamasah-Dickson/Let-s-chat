import React from "react";
import Sidebar from "../components/Sidebar";
import Notifications from "../components/Notifications";

function NotificationPage() {
	return (
		<div>
			<div className="flex">
				<div className="flex-[12] sm:flex-[7] md:flex-[5] lg:flex-[4] xl:flex-[2.5]">
					<Sidebar />
				</div>
				<div className="flex-[8] ">
					<Notifications />
				</div>
			</div>
		</div>
	);
}

export default NotificationPage;
