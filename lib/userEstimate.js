import admin from './clientApp'

export const updateUserEstimate = async (query) => {
  const db = admin.firestore()
  const queryCollection = db.collection('users');
  const snapshotQuery = queryCollection.where('roomID', '==', query.roomID).where('username', '==', query.username);
 
  const snapshot = await snapshotQuery.get();
  
  var result = false;
  const FieldValue = admin.firestore.FieldValue;

  snapshot.forEach((doc) => {
    if (doc.data().roomID == query.roomID) result = true;

    doc.ref.update({
      updatedAt: FieldValue.serverTimestamp(),
      estimate: query.estimate,
    })
  });
  
  return result;
}