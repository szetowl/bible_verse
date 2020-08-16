var uploadButton = document.getElementById('upload');
var clearButton = document.getElementById('clear');

var verseContent = document.getElementById('verse_content');
var verseSource = document.getElementById('verse_source');
var verseTitle = document.getElementById('verse_title');
var verseAuthor = document.getElementById('verse_author');

var verseTotal = document.getElementById('verse_total');
var verseContents = document.getElementById('verse_contents');

var audioCapture = document.getElementById('audio_capture');
var fillInSnackbar = document.getElementById('must-fillin-snackbar');

var audioFilePath = "";
var audioFile = null;
var currentWeekNo = 0;
var weekArray = [];

listVerses();
function listVerses() {
    var firestore = firebase.firestore();
    firestore.collection("verses").orderBy('week').get().then((snap) => {
        snap.forEach((doc) => {
            weekArray[weekArray.length] = doc.data().week;
            console.log(doc.data());
            console.log("weekArray :" + weekArray);
            verseContents.innerText += doc.data().week + " " + doc.data().content.slice(0, 10) + "....   " + doc.data().content2 + " " + "(" + doc.data().author + ")\n";
        });
        currentWeekNo = weekArray[weekArray.length - 1];
        verseTotal.innerText = "There is " + weekArray.length + " verses";
    });
}
/*----------------------------------------------------------------
Firebase Project : first-ngfire 
Firestore : collection=verses ; Document=verse# ; field= content ; content2 ; week;
author .
*/
uploadButton.addEventListener('click', function (e) {

    console.log('upload begin....');
    e.preventDefault();
    if (audioFile != null && verseContent.value != "" && verseSource.value != "") {
        console.log('verseContent....' + verseContent.value);
        console.log('verseSource....' + verseSource.value);
        console.log('audioFilePath...' + audioFilePath);
        saveVerse(currentWeekNo + 1, verseTitle.value, verseContent.value, verseSource.value, verseAuthor.value, audioFilePath);

        saveAudioFile(audioFile, audioFilePath);
        alert('DATA AND AUDIO FILE ARE SAVED');
    } else {
        console.log('verseNo ' + verseNo);
        alert('SOME DATA ARE NOT FILLED');
    }
});

audioCapture.addEventListener('change', function (e) {
    //Get file
    audioFile = e.target.files[0];
    console.log("audio file selected " + audioFile.name);
    audioFilePath = "audio/" + audioFile.name;
    console.log("audio file path " + audioFilePath);

});

function saveAudioFile(audioFile, audioFilePath) {
    //Create a storage ref
    var storage = firebase.storage();
    var storageRef = storage.ref(audioFilePath);

    // Upload file
    storageRef.put(audioFile).then(function (snapshot) {
        console.log('Uploaded a blob or file!');
    });
}




// function ADD (SET) verse into the collection =verses
function saveVerse(weekNo, verseTitle, verseContent, verseSource, verseAuthor, audioFilePath) {
    var DOCUMENT_PATH = "verses/verse" + weekNo;
    var firestore = firebase.firestore();
    firestore.doc(DOCUMENT_PATH).set({
        week: weekNo,
        content: verseContent,
        content2: verseSource,
        author: verseAuthor,
        audioURL: audioFilePath,
        title: verseTitle
    })
        .then(function () {
            console.log("OK");
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

