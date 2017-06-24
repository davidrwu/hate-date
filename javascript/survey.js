//Initialize Firebase
var config = {
  apiKey: "AIzaSyCsk5WGqR1YlbaJiCnYbs1lgPgEQZAopr8",
  authDomain: "hate-date.firebaseapp.com",
  databaseURL: "https://hate-date.firebaseio.com",
  projectId: "hate-date",
  storageBucket: "hate-date.appspot.com",
  messagingSenderId: "509489897704"
};
firebase.initializeApp(config);

var database = firebase.database();

//when the document is ready, execute the start screen and start button
$(document).ready(function(){

  function initialScreen(){
    startScreen= "<img class='center-block' src='images/redheart.jpg'>"
    + "<p class='text-center main-button-container'><a class= 'btn btn-primary btn-lg btn-block start-button'>Start</a></p>";
    $(".mainArea").html(startScreen);
  }
  initialScreen();

//function to generate questions triggered by clicking start button
$('body').on('click', '.start-button', function(event){
  event.preventDefault();
  displayButtons();
  createSubmitBtn();


function displayButtons(){
  $('.mainArea').empty(); //this empties the mainArea so buttons can go there
  for(var i = 0; i < questions.length; i++){
    var button = $("<div>");
    button.attr("value", i);
    button.addClass("btn btn-danger btn-block btn-lg");
    button.text( questions[i]);
    button.attr("data-name", questions[i]);
    $('.mainArea').append(button);
  }
}

function createSubmitBtn() {
  submitButton= "<p class='text-center' ><a class='btn btn-success btn-lg btn-block submit-button'>Submit!</a></p>";
  $(".submitBtn").append(submitButton);
}
});

  var ref = database.ref('user');
  ref.on('value',gotData)

  function gotData(data) {
    // console.log(data.val())
    var hates = data.val();
    var keys = Object.keys(hates);
    console.log(hates[keys[0]].profileFirstName)
  }


$('.submitBtn').on('click', function(){

  var ref = database.ref('user');
    ref.on('value',gotData)

  function gotData(data) {
    // console.log(data.val())
    var hates = data.val();
    var keys = Object.keys(hates);
    // console.log(keys);  
    // console.log(hates[keys[0]].hates)

    var user = firebase.auth().currentUser.uid;
    var email = firebase.auth().currentUser.email;
    var newFirstName = hates[keys[keys.length-1]].profileFirstName
    var newLastName = hates[keys[keys.length-1]].profileLastName
    var newGender = hates[keys[keys.length-1]].profileGender
    var newCity = hates[keys[keys.length-1]].profileCity
    var newState = hates[keys[keys.length-1]].profileState
    var newAge = hates[keys[keys.length-1]].profileAge

    var pushed = {
      hates : pushedAnswers,
      user:user,
      email:email,
      newFirstName: newFirstName,
      newState: newState,
      newCity: newCity,
      newGender: newGender,
      newLastName: newLastName,
      newAge: newAge
    }

  database.ref().child('hates').push(pushed);
  }
  $(".submitBtn").hide();
})

$(".mainArea").on('click', '.btn-danger', function(event){
    event.preventDefault();
    $(this).toggleClass("btn-primary btn-danger");
    console.log("You clicked: " + $(this).attr("data-name"));
	  
		//push clicked-button text into firebase
		// database.ref.(buttonText);
    var buttonPush = $(this).attr("data-name");
    pushedAnswers.push(buttonPush)
    console.log(pushedAnswers)
});

})

var pushedAnswers =[];

//global variabls go here
var questions = [
  "Useless noises like chewing, humming, whistling",
	"The phrase, 'everything happens for a reason'",
	"Parents who don't discipline their children",
	"People who are on their phones all the time",
	"People who don't believe in climate change",
	 "People who don't use indicator lights",
	"Couples that wear matching outfits",
	"People who text during movies",
	 "Too much cologne or perfume",
	"Pharmaceutical companies",
	//10 mark
	"Bad listeners",
	"Flakey people",
	"Selfie sticks",
	"Slow walkers",
	 "Justin Bieber",
	"Donald Trump",
	"Picky Eaters",
	"Hot weather",
	"Mean girls",
	"Paying extra for almond milk",
	//20 mark
	"404 errors",
	"Side hugs",
	"Rudeness",
	"Hipsters",
	"GMO food"
]

var ref = firebase.database().ref('users');
ref.on("child_added", function(childsnapshot) {
  var user = childsnapshot.val().user;
  var profileAge = childsnapshot.val().newAge;
  var profileEmail = childsnapshot.val().email;
  var profileFirstName = childsnapshot.val().newFirstName;
  var profileLastName = childsnapshot.val().newLastName;
  var profileGender = childsnapshot.val().newGender;
  var profileCity = childsnapshot.val().newCity;
  var profileState = childsnapshot.val().newState;
  var hates = childsnapshot.val().hates;
  console.log(hates)

  // $(".userName").html(profileFirstName+" "+profileLastName)
});
