// DATE LAUCHER (SUNDAY) TO CALCULATE THE NO. OF WEEK
START_DATE = "2020-06-14";
var startDate = new Date(START_DATE);

// create the date string
var d = new Date();

var days = ["(日)", "(一)", "(二)", "(三)", "(四)", "(五)", "(六)"];
var months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
document.getElementById("date_string").innerHTML = d.getFullYear() + "年" + months[d.getMonth()] + d.getDate() + "日" + days[d.getDay()];

var verseContent = document.getElementById('verse-content');
var verseContent2 = document.getElementById('verse-content2');
var playButton = document.getElementById('play_audio');
var pauseButton = document.getElementById('pause_audio');

var audioFilePath = "";
var audioFile = null;
var verse = null; //audio


//var weekNo = Math.floor((d.getDate() - startDate.getDate()) / 7 + 1);
//console.log('week no. :' + weekNo);
playButton.addEventListener('click', function (e) {
    console.log("speakerButton click.. ");
    if (audioFilePath != "") {
        console.log("audioFilePath = " + audioFilePath);       
        
        playOrPause(verse);
    } else {
        console.log("audioFilePath is NULL");
    }
});

findVerse(15,db);
function findVerse(weekNo,db) {
    console.log("begin findVerse.... ");
    //db = firebase.firestore();
    db.collection('verses').where("week", "==", weekNo)
        .get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {

                console.log("Document data:", doc.data());
                console.log("Document content:", doc.data().content);
                verseContent.innerText = doc.data().content;
                verseContent2.innerText = doc.data().content2;
                audioFilePath = doc.data().audioURL;
                verse=getVerseAudio(audioFilePath);
            });

        })
        .catch(function (error) {
            // doc.data() will be undefined in this case
            console.log("Error getting documents: ", error);
        });
}

function getVerseAudio(audioFilePath) {

    console.log("begin getVerseAudio.... ");
    var storage = firebase.storage();
    var audioRef = storage.ref(audioFilePath);
    audioRef.getDownloadURL().then(function (url) {
        console.log("url.... " + url);
        //  var xhr=new XMLHttpRequest();
        verse = new Audio(url);
        return verse;
        
        
    }).catch(function (error) {
        console.log("error to get url.... ");

    });
}

function playOrPause(verse) {
    if (verse.paused) {
        verse.play();
        playButton.src="";
    } else {
      verse.pause();
      playButton.src="";  

    }
}


    /*
mediaPlayer = MediaPlayer()
mediaPlayer.setDataSource(it.toString())
mediaPlayer.setOnPreparedListener { player ->
player.start()
}
mediaPlayer.prepareAsync()
})
*/

