import admin from './clientApp'
import { updateTime } from './deleteOldDataUpdateTime';

export const deleteRoom = async () => {
	const db = admin.firestore()
	const queryCollection = db.collection('rooms');

	const timeNow = await updateTime();
	const snapshot = await queryCollection.get();
	snapshot.forEach((doc) => {
		if (timeNow.seconds - doc.data().updatedAt.seconds > (24 * 60 * 60)) {
			doc.ref.delete();
		}
	});
}