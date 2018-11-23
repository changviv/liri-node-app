require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

var action = process.argv[2]
var artist;
var song;
var movie;
search = "";


switch(action) {
    // case "movie-this":
    //     movie = process.argv[3]
    //     omdb(movie)
    //     break;
    case "concert-this":
    		artist = process.argv;
        bandsInTown(artist)
        break;
    // case "spotify-this-song":
    //     song = process.argv[3]
    //     spotify();
    //     break;
    // case "do-what-it-says":
    // 	doWhatItSays()
}

function bandsInTown(artist) {
	console.log(artist)
	for (var i = 3; i < artist.length; i++) {
		search += artist[i]
	}

	axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp").then(
		function(response) {
			data = response.data[0]
			console.log("The venue is called " + data.venue.name)
			console.log("The location is at: " + data.venue.city + ", " + data.venue.region + ", " + data.venue.country)

			date = new Date(data.datetime)

			year = date.getFullYear();
			month = date.getMonth()+1;
			dt = date.getDate();

			console.log("The date is: " + month + "/" + dt + "/" + year)
		}).catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
}