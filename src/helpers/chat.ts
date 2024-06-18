import { get, ref, serverTimestamp, update } from "firebase/database";
import { db } from "../firebase";
import { User } from "firebase/auth";

export const updateContact = async (currentUser: User, userInvite: string) => {
	// Check if the invited user exists
	const userExistsRef = ref(db, `users/${userInvite}`);
	const snapshot = await get(userExistsRef);

	if (snapshot.exists()) {
		const data = snapshot.val();
		try {
			const currentUserContactRef = ref(
				db,
				`users/${currentUser.uid}/contacts`
			);
			const currentUserContactSnapShot = await get(currentUserContactRef);

			if (
				!currentUserContactSnapShot.val() ||
				!(currentUser.uid in currentUserContactSnapShot.val())
			) {
				const updateCurrentUserContactList = ref(
					db,
					`users/${currentUser.uid}/contacts`
				);
				await update(updateCurrentUserContactList, {
					[data.uid]: { ...data },
				});
			}

			const otherUserContactListRef = ref(db, `users/${userInvite}/contacts`);
			const otherUserSnapShot = await get(otherUserContactListRef);
			if (
				!otherUserSnapShot.val() ||
				!(currentUser.uid in otherUserSnapShot.val())
			) {
				const currentUserData = {
					email: currentUser.email,
					displayName: currentUser.displayName,
					photoURL: currentUser.photoURL,
					uid: currentUser.uid,
					lastSeen: Date.now(),
					date: serverTimestamp(),
				};
				await update(otherUserContactListRef, {
					[currentUser.uid]: { ...currentUserData },
				});
			}
		} catch (error) {
			console.error("Error updating contacts:", error);
		}
	}
};
