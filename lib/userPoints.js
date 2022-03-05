import admin from './clientApp'

export const updateUserPoints = async (query) => {
  const db = admin.firestore()
  const queryCollection = db.collection('users');
  const snapshotQuery = queryCollection.where('roomID', '==', query.roomID).where('username', '==', query.username);
 
  const snapshot = await snapshotQuery.get();
  
  var result = false;
  const FieldValue = admin.firestore.FieldValue;

  var points = 100 * Math.log2(query.userCount / (query.userCount - 1) * (1 - query.estimate / 100));
  if (query.answerBool) {
    if (query.userCount == 1) {
      points = 100;
    }
    else {
      points = 100 * Math.log2(query.userCount * query.estimate / 100);
    }
  }

  points = points.toFixed(3);

  snapshot.forEach((doc) => {
    if (doc.data().roomID == query.roomID) result = true;

    doc.ref.update({
      updatedAt: FieldValue.serverTimestamp(),
      points: points,
    })
  });
  
  return result;
}