// Initialize Firebase
var config = {
    apiKey: "AIzaSyAsNQGVT0zeKr_rQ4fOcaG_LKIBR0gwHLQ",
    authDomain: "train-time-a7dd7.firebaseapp.com",
    databaseURL: "https://train-time-a7dd7.firebaseio.com",
    projectId: "train-time-a7dd7",
    storageBucket: "train-time-a7dd7.appspot.com",
    messagingSenderId: "1062471759529"
};
firebase.initializeApp(config);

// create databse ref variable
var trainData = firebase.database().ref();
//onclick event for adding trains
$('#submitButton').on('click', function() {
    //gets data from input field and assign to variables
    var trainName = $('#trainNameInput').val().trim();
    var destination = $('#destinationInput').val().trim();
    var firstTime = moment($('#timeInput').val().trim(), "HH:mm").format("");
    var frequency = $('#frequencyInput').val().trim();

    //creates local holder for train times
    var newTrains = {
            name: trainName,
            tdestination: destination,
            tFirst: firstTime,
            tfreq: frequency,
        }
        //uploads data to the database
    trainData.push(newTrains);
    //alert
    alert("Train successfully added!");

    //clears all of the text boxes
    $('#trainNameInput').val("");
    $('#destinationInput').val("");
    $('#timeInput').val("");
    $('#frequencyInput').val("");

    return false;
});

//when a new item is added (child) do this function
trainData.on("child_added", function(childSnap) {
    //store everything into a variable
    var trainName = childSnap.val().name;
    var destination = childSnap.val().tdestination;
    var firstTime = childSnap.val().tFirst;
    var frequency = childSnap.val().tfreq;

    // convert first time (push back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    //current time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    //difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    //time apart (remainder)
    var tRemainder = diffTime % frequency;
    // console.log(tRemainder);

    //minute until train
    var tMinutesTillTrain = frequency - tRemainder;
    // console.log("MINUTES TIL TRAIN: " + tMinutesTillTrain);

    //next train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainConverted = moment(nextTrain).format("hh:mm a");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    //add each trains data into the table
    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td>" + nextTrainConverted + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});