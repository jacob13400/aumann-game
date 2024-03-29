import admin from './clientApp'

export const getQuestions = async () => {
  const db = admin.firestore()
  const snapshot = await db.collection('questions').get();

  var result = null;
  snapshot.forEach((doc) => {
    if (doc && doc.exists){
      result = doc.data();
      return result;
    }
  });

  return result;
}
