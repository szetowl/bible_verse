// APP Bible_Verse ; Firebase project first-ngfire recreate at June 2020

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCqjlf8KVPBWT_kNOX5NbhaiweOLymXFuo",
    authDomain: "first-ngfire.firebaseapp.com",
    databaseURL: "https://first-ngfire.firebaseio.com",
    projectId: "first-ngfire",
    storageBucket: "first-ngfire.appspot.com",
    messagingSenderId: "408696184214",
    appId: "1:408696184214:web:50a231812bbf91e13f91b7"
};
// Initialize Firebase      
firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();
const storage=firebase.storage();


db.enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          console('persistence failed');
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console('persistence is not available');
      }
  });
/*

*/
 