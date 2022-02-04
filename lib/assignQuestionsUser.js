import admin from './clientApp';

export const assignQuestionsUser = async (query, answersCorrect) => {
  const db = admin.firestore()
  const queryCollection = db.collection('users');

  const snapshot = await queryCollection.where('roomID', '==', Number(query.roomID)).where('username', '==', query.username).get();
  
  var result = null;
  const FieldValue = admin.firestore.FieldValue;
 
  snapshot.forEach((doc) => {
    result = doc.data();
    
    var correctAnswer = false;
    if (Number(query.index) == answersCorrect["CorrectIndex"]){
      correctAnswer = true;
    }
    
    doc.ref.update({
      updatedAt: FieldValue.serverTimestamp(),
      question: answersCorrect.question,
      answer: query.answer,
      answerBool: correctAnswer,
    })
  });

  return result;
}