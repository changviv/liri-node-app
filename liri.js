require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var moment = require("moment")
var action = process.argv[2]
var allArgs = process.argv
var searchResult = "";
var artist = "";
var showData = [];
var divider = "\n------------------------------------------------------------\n\n";

switch(action) {
    case "movie-this":
        omdb()
        break;
    case "concert-this":
        bandsInTown()
        break;
    case "spotify-this-song":
        spotThisSong();
        break;
    case "do-what-it-says":
    	doWhatItSays()
}

function omdb() {
	for (var i = 3; i < allArgs.length; i++) {
		searchResult += (allArgs[i] + "+")
	}

	searchResult = searchResult.slice(0, -1)


	var queryUrl = "http://www.omdbapi.com/?t=" + searchResult + "&y=&plot=short&apikey=trilogy";
	var nobodyUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy"

	if (searchResult === "") {
		omdbResults(nobodyUrl)
	} else {
		omdbResults(queryUrl);
	}
}

function omdbResults(url) {
	axios.get(url).then(
	  function(response) {
	  	data = response.data
	  	if (data.Response === "True") {
	  		console.log("Release Year: ", data.Year);
	  		console.log("The Title: ", data.Title)
	  		console.log("Imdb Rating: ", data.imdbRating);
	  		console.log("The Country: ", data.Country)
	  		if (data.Ratings.length > 1) {
	  			console.log("Rotten Tomatoes Rating: ", data.Ratings[1].Value);
	  			var rottenRating = data.Ratings[1].Value
	  		} else {
	  			console.log("Only IMDB Rating is available: ", data.Ratings[0].Value);
	  			rottenRating = data.Ratings[0].Value
	  		}
	  		console.log("The Language: ", data.Language);
	  		console.log("The Plot: ", data.Plot);
	  		console.log("The Actors: ", data.Actors);
	  	} else {
	  		console.log(data.Error)
	  	}

	  	showData = [
	  		"Release Year: " + data.Year,
	  		"The Title: " + data.Title,
	  		"Imdb Rating: " + data.imdbRating,
	  		"Rotten Tomatoes Rating: " + rottenRating,
	  		"The Country: " + data.Country,
	  		"The Language: " + data.Language,
	  		"The Plot: " + data.Plot,
	  		"The Actors: " + data.Actors
	  	].join("\n\n");

	  	fs.appendFile("log.txt", showData + divider, function(err) {
	  	  if (err) {
	  	    return console.log(err);
	  	  }
	  	  console.log("log.txt was updated!");
	  	});
	 	}
	)
};

function spotThisSong() {


	for (var i = 3; i < allArgs.length; i++) {
		searchResult += (allArgs[i] + " ")
	}

	searchResult = searchResult.slice(0, -1)

	if (searchResult === "") {
		spotify.search({ type: 'track', query:  'The Sign' }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }

			console.log("The Artist's name is", data.tracks.items[9].album.artists[0].name)
			console.log("The Album is", data.tracks.items[9].album.name)
			console.log("The song name is", data.tracks.items[9].name)
			console.log("Listen a preview: ", data.tracks.items[9].preview_url)
			// for (var j = 0; j < data.tracks.items.length; j++) {
			// 		console.log("======================")
			// 		console.log(j)
			// 		console.log("The Artist's name is",data.tracks.items[j].album.artists[0].name)
			// }

			showData = [
				"The Artist's name is: " + data.tracks.items[9].album.artists[0].name,
				"The Album is: " + data.tracks.items[9].album.name,
				"The song name is: " + data.tracks.items[9].name,
				"Listen a preview: " + data.tracks.items[9].preview_url
			].join("\n\n");

			fs.appendFile("log.txt", showData + divider, function(err) {
				if (err) {
				  return console.log(err);
				}
				console.log("log.txt was updated!");
			});
		})
	} else {
		spotify.search({ type:  'track', query:  searchResult }, function(err, data) {
			if (err) {
			  return console.log('Error occurred:  ' + err);
			}

			var songData = data.tracks.items
			var songLength = data.tracks.items.length

			if (songLength > 0) {
				for (var j = 0; j < songLength; j++) {
					console.log("======================")
					console.log("The song name is",songData[j].name)
					console.log("The Artist's name is",songData[j].album.artists[0].name)
					console.log("The Album is",songData[j].album.name)
					if (songData[j].preview_url === null) {
						console.log("There's no preview but you can listen to it on Spotify: ",songData[j].album.external_urls.spotify)
						var preview = songData[j].album.external_urls.spotify
					} else {
						console.log("Listen a preview: ",songData[j].preview_url)
						preview = songData[j].preview_url
					}

					showData = [
						"The Artist's name is: " + data.tracks.items[j].album.artists[0].name,
						"The Album is: " + data.tracks.items[j].album.name,
						"The song name is: " + data.tracks.items[j].name,
						"Listen a preview: " + preview
					].join("\n\n");

					fs.appendFile("log.txt", showData + divider, function(err) {
						if (err) {
						  return console.log(err);
						}
					});
				}
				console.log("log.txt was updated!");
			} else {
				console.log("Looks like we can't find the song", searchResult)
			}
		});
	}
};

function bandsInTown() {
	for (var i = 3; i < allArgs.length; i++) {
		searchResult += allArgs[i]
		artist += (allArgs[i] + " ")
	}

	artist = artist.slice(0, -1)

	var queryUrl = "https://rest.bandsintown.com/artists/" + searchResult + "/events?app_id=codingbootcamp"

	if (searchResult === "") {
		console.log("Please put in a band/artist")
	} else {
			axios.get(queryUrl).then(
				function(response) {
					data = response.data
					dataLength = response.data.length

					if (dataLength > 0) {
						for (var j = 0; j < dataLength; j++) {

							console.log("======================")
							console.log("The venue is at " + data[j].venue.name);

							if (data[j].venue.region === "") {
								console.log("The location is at:  " + data[j].venue.city + ", " + data[j].venue.country);
								venue = data[j].venue.city + ", " + data[j].venue.country
							} else {
								venue = data[j].venue.city + ", " + data[j].venue.region + ", " + data[j].venue.country
								console.log("The location is at:  " + data[j].venue.city + ", " + data[j].venue.region + ", " + data[j].venue.country);
							}

							date = new Date(data[j].datetime);

							var momentObj = moment(date);
							var momentString = momentObj.format('MM/DD/YYYY');

							console.log("The date is: ", momentString);

							showData = [
								"The venue is at " + data[j].venue.name,
								"The location is at: " + venue,
								"The date is: " + momentString
							].join("\n\n");

							fs.appendFile("log.txt", showData + divider, function(err) {
								if (err) {
								  return console.log(err);
								}
							});
						}
						console.log("log.txt was updated!");
					} else {
						console.log("Uh oh, there doesn't look like there's any upcoming concerts from " + artist)
					}
				}).catch(function(error) {
		    if (error.response) {
		    	console.log("error alert")
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
		  }
		);
	}
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
	  if (error) {
	    return console.log(error);
	  }
	  console.log(data);

	  var dataArr = data.split(",");
	  console.log(dataArr);

	  action = dataArr[0]
	  searchResult = dataArr[1]

	  switch(action) {
    	case "movie-this":
    	    omdb()
    	    break;
    	case "concert-this":
    	    bandsInTown()
    	    break;
    	case "spotify-this-song":
    	    spotThisSong();
    	    break;
    	case "do-what-it-says":
    		doWhatItSays()
		}
	});
}