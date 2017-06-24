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
var storage = firebase.storage().ref();
var user = firebase.auth().currentUser;
var profileImageURL;
var selectedFile;

var ref = database.ref('user');
ref.on('value',gotData,errData)

function gotData(data) {
  console.log(data.val())
  var scores = data.val();
  var keys = Object.keys(scores);
  console.log(keys);  

  console.log(scores[keys[0]].user)
}
function errData(err) {
  console.log('Error!')
  console.log(err);
}

$("#add-profile").on("click", function() {
  var questionVal = false;
  var profileAge = $("#profile-age").val().trim().charAt(0).toUpperCase();
  var profileEmail = $("#profile-email").val().trim();
  var profileFirstName = $("#profile-first-name").val().trim().charAt(0).toUpperCase();
  var profileLastName = $("#profile-last-name").val().trim().charAt(0).toUpperCase();
  var profileGender = $("#profile-gender").val().trim().charAt(0).toUpperCase();
  var profileCity = $("#profile-city").val().trim().charAt(0).toUpperCase();
  var profileState = $("#profile-state").val().trim().charAt(0).toUpperCase();
  var user = firebase.auth().currentUser.uid;
  var pushedAnswers = [];

  var newProfile = {
    user: user,
    profileEmail: profileEmail,
    profileAge: profileAge,
    profileFirstName: profileFirstName,
    profileLastName: profileLastName,
    profileGender: profileGender,
    profileCity: profileCity,
    profileState: profileState,
    hates: pushedAnswers,
    profileImageURL: profileImageURL
  }

  database.ref().child('user').push(newProfile);
});


var ref = firebase.database().ref('user');
ref.on("child_added", function(childsnapshot) {
  var user = childsnapshot.val().user;
  var profileAge = childsnapshot.val().profileAge;
  var profileEmail = childsnapshot.val().profileEmail;
  var profileFirstName = childsnapshot.val().profileFirstName;
  var profileLastName = childsnapshot.val().profileLastName;
  var profileGender = childsnapshot.val().profileGender;
  var profileCity = childsnapshot.val().profileCity;
  var profileState = childsnapshot.val().profileState;
  var profileImageURL = childsnapshot.val().profileImageURL;
  
  if ( firebase.auth().currentUser.uid === user ) {
    $("#age").html("Age: " + profileAge);
    $("#location").html("Location: " + profileCity + ", " + profileState);
    $("#gender").html("Gender: " + profileGender);
    $("#name").html("Name: " + profileFirstName + " " + profileLastName)
    console.log(user)
    console.log(profileFirstName);
    $("#profile-info").hide();
  }
});

var ref = firebase.database().ref('hates');
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

 if (firebase.auth().currentUser.uid !== user) {
    $("#hate-content").append(
    "<tr><td>" + profileFirstName +" "+profileLastName + "</td>"
    +"<td>" + profileGender + "</td>"
    +"<td>" + profileAge + "</td>"
    +"<td>" + hates + "</td></tr>")
    // +"<td>" + "<button type='button' class='btn btn-info' data-toggle='modal' data-target='#myModal'>"+"Hates"+"</button>" + "</td></tr>");
    // $("#modal-body").append(hates);
  }
});

$("#imgFile").on("change", function(event){
    selectedFile = event.target.files[0];
    console.log(selectedFile.name);
});

function uploadFile(){
var filename = selectedFile.name;
console.log(selectedFile);
var storageRef = firebase.storage().ref("profile-images/" + filename);
var uploadTask = storageRef.put(selectedFile);
    

//On change get the URL for the image that was saved to the Firebase Storage Bucket
uploadTask.on("state_changed", function(snapshot){

}, function(error){

}, function(){

  storageRef.getDownloadURL().then(function(url) {
    console.log(profileImageURL);
    profileImageURL = url;       
                           
    //save url to global variable
    $("#profile-pic").attr("src", profileImageURL);   //apply the url src to the profile-pic image tag
    //Hide the submit Buttons.
    $(".hide-after-submit").hide();
    });
  });
}


$("#add-weather").on("click", function(event) {

event.preventDefault();

// This line will grab the text from the input box
var userLocation = $("#location-input").val().trim();
// The movie from the textbox is then added to our array
var APIKey = "8e0a569e0df74e849d282d50ea2c2232";
var queryURL = "https://api.weatherbit.io/v1.0/current/geosearch?city="
                + userLocation + "&key=" + APIKey;
  

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
    url: queryURL,
    method: "GET"
  })
// We store all of the retrieved data inside of an object called "response"
.done(function(response) {

console.log(queryURL);

console.log(response);
console.log(response.data[0].weather.description);

var weatherResult = response.data[0].weather.description
var locationResult = response.data[0].city_name;
var weatherDisplay = $("<img>")
weatherDisplay.addClass('weatherDiv')

if(weatherResult === "Clear sky" || weatherResult === "Few clouds") {
  weatherDisplay.attr('src',"images/clear.png")
  $("#weatherDisplay").html("<span class='weatherHeader'>" + locationResult +" weather has "+weatherResult+"<div>")
  $("#weatherDisplay").append(weatherDisplay);
  $("#weatherDisplay").append("<div class='weatherCon'> Perfect day to go out. <br> Don't forget sunscreen. </div></span>");
} else if (weatherResult === "Broken clouds" || weatherResult === "Scattered clouds") {
  weatherDisplay.attr('src',"images/light-clouds.png")
  $("#weatherDisplay").html("<span class='weatherHeader'>" + locationResult +" weather has "+weatherResult+"<div>")
  $("#weatherDisplay").append(weatherDisplay);
  $("#weatherDisplay").append("<div class='weatherCon'> Bring a light jacket </div></span>");
} else if (weatherResult === "Overcast clouds" || weatherResult === "Mist" || weatherResult === "Fog") {
  weatherDisplay.attr('src',"images/cloudy.png")
  $("#weatherDisplay").html("<span class='weatherHeader'>" + locationResult +" weather has "+weatherResult+"<div>")
  $("#weatherDisplay").append(weatherDisplay);
  $("#weatherDisplay").append("<div class='weatherCon'> This is still a datable weather </div></span>");
} else if (weatherResult === "Light rain" || weatherResult === "Moderate rain" || weatherResult === "Drizzle" || weatherResult === "Light Drizzle" || weatherResult === "Light shower rain") {
  weatherDisplay.attr('src',"images/light-rain.png")
  $("#weatherDisplay").html("<span class='weatherHeader'>" + locationResult +" weather has "+weatherResult+"<div>")
  $("#weatherDisplay").append(weatherDisplay);
  $("#weatherDisplay").append("<div class='weatherCon'> This is still a datable weather </div></span>");
} else if (weatherResult === "Heavy Rain" || weatherResult === "Shower rain" || weatherResult === "Heavy shower rain") {
  weatherDisplay.attr('src',"images/heavy-rain.png")
  $("#weatherDisplay").html("<span class='weatherHeader'>" + locationResult +" weather has "+weatherResult+"<div>")
  $("#weatherDisplay").append(weatherDisplay);
  $("#weatherDisplay").append("<div class='weatherCon'> Find an indoor activity to do </div></span>");
} else if (weatherResult === "Snow" || weatherResult === "Heavy snow" || weatherResult === "Snow shower" || weatherResult === "Heavy snow shower") {
  weatherDisplay.attr('src',"images/snow.png")
  $("#weatherDisplay").html("<span class='weatherHeader'>" + locationResult +" weather has "+weatherResult+"<div>")
  $("#weatherDisplay").append(weatherDisplay);
  $("#weatherDisplay").append("<div class='weatherCon'> Find an indoor activity to do </div></span>");
} else if (weatherResult === "Sleet" || weatherResult === "Heavy sleet" || weatherResult === "Mix snow/rain") {
  weatherDisplay.attr('src',"images/sleet.png")
  $("#weatherDisplay").html("<span class='weatherHeader'>" + locationResult +" weather has "+weatherResult+"<div>")
  $("#weatherDisplay").append(weatherDisplay);
  $("#weatherDisplay").append("<div class='weatherCon'> Find an indoor activity to do </div></span>");
} else if (weatherResult === "Thunderstorm with light rain" || weatherResult === "Thunderstorm with rain" || weatherResult === "Thunderstorm with heavy rain" || weatherResult === "Thunderstorm with drizzle") {
  weatherDisplay.attr('src',"images/thunderstorm.png")
  $("#weatherDisplay").html("<span class='weatherHeader'>" + locationResult +" weather has "+weatherResult+"<div>")
  $("#weatherDisplay").append(weatherDisplay);
  $("#weatherDisplay").append("<div class='weatherCon'> Find an indoor activity to do </div></span>");
}

});
});
