require("dotenv").config();

var Twitter = require("twitter");
var Spotify = require("node-spotify-api")
var inquirer = require("inquirer");
var request= require("request");
var keys = require("./keys.js");
var fs = require("fs");
//try nested inquirer calls for userinput
    //first one to determine the call the user wants to make(twitter, spotify, omdb, do-this)
        //if spotify or omdb
            // try another inquirer prompt inside the .then of the original prompt
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var userInput = "";

if (process.argv[3] !== undefined){
    for (var i = 3; i < process.argv.length; i++){
        userInput += process.argv[i] + " ";
    }
};
// console.log("UserInput: " + userInput);
switch(command){
    case "my-tweets":
        getTweets(userInput);
        break;

    case "spotify-this-song":
        getSpotify(userInput);
        break;

    case "movie-this":
        if (userInput === ""){
            userInput = "Mr. Nobody"
        }
        getMovie(userInput);
        break;

    case "do-what-it-says":
        doThis()
        break;
}

function getTweets(topic){
    client.get("search/tweets", 
    {
        q: topic,
        result_type: "recent"
    }, function(error, tweets, responses){
        console.log("+ + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +");
        console.log("        ### Tweets ###");
        console.log(tweets);
        console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
        console.log("");
        dataLog(JSON.stringify(tweets));
        // console.log(responses);
    });
} //reach out to twitter and grab tweets related to userInput topic

function getSpotify(song){
    spotify.search({
        type: "track",
        query: song,
        limit: 1
    }, function(err, data){
        if (err){
            return console.log("Error ocurred " + err);
        }
        console.log("+ + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Track name: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].preview_url);
        console.log("Album name: " + data.tracks.items[0].album.name);
        console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
        console.log("");
        dataLog(JSON.stringify(data.tracks.items[0]));
    });

}//reach out to spotify and grab userInput song information

function getMovie(movie){
    request("http://www.omdbapi.com/?t=" + movie+ "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("+ + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +");
            console.log("Movie title: " + JSON.parse(body).Title);
            console.log("Year released: " + JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country of production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
            console.log("");
            dataLog(JSON.stringify(body));
        }
        else{
            console.log("Error Status Code: " + response.statusCode)
            console.log("Error: " + error);
        }
    });
}//reach out to OMDB and grab userInput movie information

function doThis(){
    fs.readFile("./random.txt", "utf8", function (error, data){
        if (error){
            console.log(error);
        }
        data = data.replace(/\n|\r/g, "");
        console.log(data);
        var dataArr = data.split(",");
        console.log(dataArr);
        for (var i = 0; i < dataArr.length; i+=2){
            switch(dataArr[i]){
                case "spotify-this-song":
                    getSpotify(dataArr[i+1]);
                    break;
                case "movie-this": 
                    getMovie(dataArr[i+1]);
                    break;
                case "my-tweets":
                    getTweets(dataArr[i+1]);
                    break;
                case "do-what-it-says":
                break;
            }
        }
    })
}

function dataLog(data){
    fs.appendFile("log.txt", ("\n" + "\n" + data), function(err){
        if (err){
            console.log(err);
        }
        else{
            console.log("Content added to log file");
        }
    })
}// write the returned data to a txt file