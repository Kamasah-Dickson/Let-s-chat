export default function getTimeDifference(timestamp: number) {
	if (timestamp == 0) {
		return;
	}
	const currentDate = new Date();
	const messageDate = new Date(timestamp);
	const timeDifference = currentDate.getTime() - messageDate.getTime();
	const seconds = Math.floor(timeDifference / 1000);

	if (seconds < 10) {
		return "just now";
	} else if (seconds < 60) {
		return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
	} else if (seconds < 3600) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else if (seconds < 86400) {
		const hours = Math.floor(seconds / 3600);
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else {
		const days = Math.floor(seconds / 86400);
		return `${days} day${days > 1 ? "s" : ""} ago`;
	}
}
