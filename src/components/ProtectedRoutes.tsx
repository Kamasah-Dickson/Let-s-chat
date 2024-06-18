import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import Loading from "./Loading";
import { ref, update } from "firebase/database";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState<null | User>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (signedUser) => {
			if (signedUser) {
				setUser(signedUser);
				update(ref(db, `users/${signedUser?.uid}`), {
					online: "online",
				});
				return;
			} else {
				navigate("/login", { replace: true });
			}
		});

		return () => unsubscribe();
	}, [navigate]);

	return user ? children : <Loading />;
};

export default ProtectedRoutes;
