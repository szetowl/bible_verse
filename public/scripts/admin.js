var uploadButton = document.getElementById('upload');
var clearButton = document.getElementById('clear');

var verseContent = document.getElementById('verse_content');
var verseSource = document.getElementById('verse_source');

var verseTotal = document.getElementById('verse_total');
var verseContents = document.getElementById('verse_contents');

var audioCapture = document.getElementById('audio_capture');
var fillInSnackbar = document.getElementById('must-fillin-snackbar');

var audioFilePath = "";
var audioFile = null;
var verseNo=0;

listVerses();

/*----------------------------------------------------------------
Firebase Project : first-ngfire 
Firestore : collection=verses ; Document=verse# ; field= content ; content2 ; week;
author .
*/
uploadButton.addEventListener('click', function (e) {
        
        console.log('upload begin....');
    e.preventDefault();
    if (audioFile!= null&&verseContent.value!=""&&verseSource.value!="") {
        console.log('verseContent....'+verseContent.value);
        console.log('verseSource....'+verseSource.value);
        console.log('audioFilePath...'+audioFilePath);
        saveVerse(verseNo,verseContent.value,verseSource.value,audioFilePath);

        saveAudioFile(audioFile, audioFilePath);
        alert('DATA AND AUDIO FILE ARE SAVED');
    } else {
        console.log('verseNo '+verseNo);
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

function listVerses() {
    var firestore = firebase.firestore();
    firestore.collection("verses").orderBy('week').get().then((snap) => {
        snap.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            verseContents.innerText += doc.data().week + " " + doc.data().content.slice(0, 10) + "....\n";
        });
        verseNo = snap.size+1;
        verseTotal.innerText = "There is " + snap.size + " verses";
    });
}


// function ADD (SET) verse into the collection =verses
function saveVerse(verseNo,verseContent,verseSource,audioFilePath) {
    var DOCUMENT_PATH = "verses/verse" + verseNo;
    var firestore = firebase.firestore();
    firestore.doc(DOCUMENT_PATH).set({
        week: verseNo,
        content: verseContent,
        content2: verseSource,
        author: "",
        audioURL: audioFilePath

    })
        .then(function () {
            console.log("OK");
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}
//addVerse(4);

// function ADD verse into the collection and audio into storage
function updateVerse() {

}
