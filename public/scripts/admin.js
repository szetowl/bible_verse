//HTMLButton UPLOAD DATA; CLEAR DATA
var uploadButton = document.getElementById('upload');
var clearButton = document.getElementById('clear');

//HTMLElement of the INPUT DATA
var verseContent = document.getElementById('verse_content');
var verseSource = document.getElementById('verse_source');
var verseTitle = document.getElementById('verse_title');
var verseAuthor = document.getElementById('verse_author');
var publishDate = document.getElementById('publish_date');

//HTMLElement to show DATA in database//
//var verseTotal = document.getElementById('verse_total');
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
    let tday = new Date( );
    firestore.collection("verses").orderBy('publish').limitToLast(10).get().then((snap) => {
        snap.forEach((doc) => {
            weekArray[weekArray.length] = doc.data().week;
            //console.log(doc.data().publish);
            console.log(doc.data().publish.toDate());
            var d= doc.data().publish.toDate();
            var m=d.getMonth()+1;
            
            var d_string=d.getFullYear()+"-"+m+"-"+d.getDate();
            if (d > tday) {d_string="*"+d_string;};
            verseContents.innerText += doc.data().week + " | "+doc.data().title + " | "+d_string+ " | " + doc.data().content.slice(0, 10) + ".... |  " + doc.data().content2 + " | " + doc.data().author + "\n";
        });
        currentWeekNo = weekArray[weekArray.length - 1];
        //verseTotal.innerText = "There is " + weekArray.length + " verses";
    });
}
/*----------------------------------------------------------------
Firebase Project : first-ngfire 
Firestore : collection=verses ; Document=verse# ; field= content ; content2 ; week;
author .
*/
uploadButton.addEventListener('click', function (e) {
    var dd=new Date(publishDate.valueAsDate);
    var d=dd.setHours(00);
    console.log('upload begin....'+dd);    
    e.preventDefault();
    if (audioFile != null && verseContent.value != "" && verseSource.value != "") {
        
        saveVerse(currentWeekNo + 1, verseTitle.value, verseContent.value, verseSource.value, verseAuthor.value,publishDate.valueAsDate, audioFilePath);
        saveAudioFile(audioFile, audioFilePath);
        alert('DATA AND AUDIO FILE ARE SAVED');
    } else {
        console.log('verseNo ' + currentWeekNo);
        alert('SOME DATA ARE NOT FILLED');
    }
});

uploadButton.addEventListener('click', function (e) {

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
function saveVerse(weekNo, verseTitle, verseContent, verseSource, verseAuthor,publishDate, audioFilePath) {
    var DOCUMENT_PATH = "verses/verse" + weekNo;
    var firestore = firebase.firestore();
    firestore.doc(DOCUMENT_PATH).set({
        week: weekNo,
        content: verseContent,
        content2: verseSource,
        author: verseAuthor,
        audioURL: audioFilePath,
        title: verseTitle,
        publish:publishDate
    })
        .then(function () {
            console.log("OK");
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

