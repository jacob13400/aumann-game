import admin from './clientApp'

export const getRoom = async (query) => {
  const db = admin.firestore()
  const queryCollection = db.collection('rooms');
  const snapshot = await queryCollection.where('id', '==', query.roomID).get();
  
  var result = null;

  snapshot.forEach((doc) => {
    result = doc.data();
  });
  
  return result;
}