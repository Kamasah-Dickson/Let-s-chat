import { useState, useEffect } from "react";
import { auth } from "../firebase";

function useAuth() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			setUser(authUser);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return { user };
}

export default useAuth;
