import { BarLoader, GridLoader } from "react-spinners";

const Loading = () => {
	const randomLoader = Math.floor(Math.random() * 2);

	return (
		<div className="absolute top-0 left-0 w-full grid bg-slate-900 place-content-center text-white h-screen">
			{randomLoader == 1 ? (
				<GridLoader color="white" />
			) : (
				<BarLoader color="white" width={150} />
			)}
		</div>
	);
};

export default Loading;
