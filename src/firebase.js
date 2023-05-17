import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: import.meta.API_KEY,
	authDomain: import.meta.AUTH_DOMAIN,
	projectId: import.meta.PROJECTID,
	storageBucket: import.meta.STORAGE_BUCKET,
	messagingSenderId: import.meta.MESSAGING_SENDER_ID,
	appId: import.meta.APP_ID,
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
