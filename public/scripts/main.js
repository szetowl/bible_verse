

var MAX_PAGE_DISPLAY = 5;
// create the date string
var tday = new Date();
var tday_string = dateToString(tday);
function dateToString(d) {
    var days = ["(日)", "(一)", "(二)", "(三)", "(四)", "(五)", "(六)"];
    var months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    return d_string = months[d.getMonth()] + d.getDate() + "日" + days[d.getDay()];
}
var verseContent = document.getElementById('verse-content');
var verseContent2 = document.getElementById('verse-content2');
var verseAuthor = document.getElementById('verse-author');
var verseTitle = document.getElementById('verse-title');
var verseTitleR = document.getElementById('verse-title-right');

var playButton = document.getElementById('play_audio');
var nextButton = document.getElementById('next-btn');
var backButton = document.getElementById('back-btn');
var headerTitle = document.getElementById('header-title');
var homeButton = document.getElementById('home-btn');


var audioFilePath = "";
var audioFile = null;
var verse = null; //audio
var verseNoArray = [];
var verseNoArrayIndex = 0;
var currentWeek = 1;

startPage(db);

function startPage(db) {
    db.collection("verses").orderBy('publish').where('publish', '<=', tday).limitToLast(4).get().then((snap) => {
        snap.forEach((doc) => {
            verseNoArray[verseNoArray.length] = doc.data().week;
        });
        verseNoArrayIndex = verseNoArray.length - 1;
        currentWeek = verseNoArray[verseNoArrayIndex];

        showVerse(currentWeek, db);
        console.log("currentWeek " + currentWeek);
    });
}

nextButton.addEventListener('click', function (e) {
    console.log("nextButton click.. ");
    if (verseNoArrayIndex > 0) {
        backButton.style.display = "block";
        homeButton.style.display = "none";
        verseNoArrayIndex = verseNoArrayIndex - 1;
        currentWeek = verseNoArray[verseNoArrayIndex];
        //headerTitle.innerText = "靈修時刻 (" + currentWeek + ")";
        console.log("currentWeek " + currentWeek);
        stopAudio(verse);
        showVerse(currentWeek, db);
    } else {
        backButton.style.display = "none";
        homeButton.style.display = "block";
        verseNoArrayIndex = verseNoArray.length - 1;
        currentWeek = verseNoArray[verseNoArrayIndex];
        //headerTitle.innerText = "靈修時刻";
        stopAudio(verse);
        showVerse(currentWeek, db);
    }

});

backButton.addEventListener('click', function (e) {
    console.log("backButton click.. ");
    if (verseNoArrayIndex < verseNoArray.length - 2) {
        backButton.style.display = "block";
        homeButton.style.display = "none";
        verseNoArrayIndex = verseNoArrayIndex + 1;
        currentWeek = verseNoArray[verseNoArrayIndex];
        //headerTitle.innerText = "靈修時刻 (" + currentWeek + ")";
        stopAudio(verse);
        showVerse(currentWeek, db);

    } else {
        backButton.style.display = "none";
        homeButton.style.display = "block";
        verseNoArrayIndex = verseNoArrayIndex + 1;
        currentWeek = verseNoArray[verseNoArrayIndex];
        //headerTitle.innerText = "靈修時刻";
        stopAudio(verse);
        showVerse(currentWeek, db);
    }

});
homeButton.addEventListener('click', function (e) {
    stopAudio(verse);
});

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


//findVerse(1, db);
function showVerse(weekNo, db) {
    db.collection('verses').where("week", "==", weekNo)
        .get().then(function (querySnapshot) {
            console.log("snap size:" + querySnapshot.size);
            querySnapshot.forEach(function (doc) {

                //console.log("Document content:", doc.data().content);
                verseContent.innerText = doc.data().content;
                verseContent2.innerText = doc.data().content2;
                if (doc.data().author != null) {
                    verseAuthor.innerText = "聲音 : " + doc.data().author;
                }
                if (doc.data().title != "") {
                    verseTitle.innerText = dateToString(doc.data().publish.toDate());
                    verseTitleR.innerText = doc.data().title;
                } else {
                    console.log(doc.data().publish.toDate());
                    verseTitle.innerText = dateToString(doc.data().publish.toDate());
                    verseTitleR.innerText = "";
                }
                audioFilePath = doc.data().audioURL;
                verse = getVerseAudio(audioFilePath);
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
        playButton.innerHTML = '<i class = "material-icons footer-md-36">pause</i>';
    } else {
        verse.pause();
        playButton.innerHTML = '<i class = "material-icons footer-md-36">play_arrow</i>';

    }
}

function stopAudio(verse) {
    verse.pause();
    verse.currentTime = 0;
    playButton.innerHTML = '<i class = "material-icons footer-md-36">play_arrow</i>';
}


