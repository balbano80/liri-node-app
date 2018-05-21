require("dotenv").config();

var Twitter = require("twitter");
var Spotify = require("node-spotify-api")
var inquirer = require("inquirer");
var request= require("request");
var keys = require("./keys.js");
var fs = require("fs");
var choice = "Exit";

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var userInput = "";

if (command === undefined){
    inquirer
        .prompt([
            { type: "list",
            name: "choice",
            message: "Which option would you like to try?",
            choices: ["Check tweets on a subject", "Get Spotify information on a song title", 
            "Check OMDB based on a movie title", "Surprise Me"],
            }
        ]).then(function(userResponse){
            // console.log(userResponse);
            choice = userResponse.choice;
            if (userResponse.choice === "Check tweets on a subject"){
                inquirer
                    .prompt([
                        { type: "input",
                        name: "tweetTopic",
                        message: "Please type in the topic of tweets your would like to search for: ",                   
                        }
                    ]).then(function(userTopic){
                        getTweets(userTopic.tweetTopic);
                    })
            } // if tweets option chosen, run tweets function on user input
            else if (userResponse.choice === "Get Spotify information on a song title"){
                inquirer
                    .prompt([
                        { type: "input",
                        name: "songTitle",
                        message: "Which song title would you like to search through Spotify?",                   
                        }
                    ]).then(function(userTopic){
                        getSpotify(userTopic.songTitle);
                    })
            } // else if spotify option chosen, run spotify function on user input
            else if (userResponse.choice === "Check OMDB based on a movie title"){
                inquirer
                    .prompt([
                        { type: "input",
                        name: "movieTitle",
                        message: "Which movie title would you like to search through OMDB?",                   
                        }
                    ]).then(function(userTopic){
                        getMovie(userTopic.movieTitle);
                    })
            } // else if movie option chosen, run OMDB funtion on user input
            else{
                doThis();
            } // else, run doThis function
        })
} // if no arguments are passed through command line by user, run inquirer package to gather information

else{
    if (process.argv[3] !== undefined){
        for (var i = 3; i < process.argv.length; i++){
            userInput += process.argv[i] + " ";
        };
    }; // if second + argument(s) passed, combine into a single string
    // console.log("UserInput: " + userInput);
    switch(command){
        case "my-tweets":
            getTweets(userInput);
            break;

        case "spotify-this-song":
            if (userInput === ""){
                userInput = "The Sign";
                console.log(userInput);
            }
            getSpotify(userInput);
            break;

        case "movie-this":
            if (userInput === ""){
                userInput = "Mr. Nobody"
            }
            getMovie(userInput);
            break;

        case "do-what-it-says":
            doThis();
            break;
    }
} // else, run functions based on argument(s) passed by user
function getTweets(topic){
    client.get("search/tweets", 
    {
        q: topic,
        result_type: "recent"
    }, function(error, tweets, responses){
        if (error){
            console.log(error);
        };
        dataLog(JSON.stringify(tweets));
        console.log("+ + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +");
        console.log("        ### Tweets ###");
        console.log(tweets);
        console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
        console.log("");
        // console.log(responses);
    });
} //reach out to twitter and grab tweets related to userInput topic

function getSpotify(song){
    spotify.search({
        type: "track",
        query: song,
        limit: 5
    }, function(err, data){
        if (err){
            return console.log("Error ocurred " + err);
        };
        dataLog(JSON.stringify(data.tracks.items));
        console.log(JSON.stringify(data.tracks.items));
        for (var i = 0; i < 5; i++){
            console.log("+ + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +");
            console.log("Artist: " + data.tracks.items[i].artists[0].name);
            console.log("Track name: " + data.tracks.items[i].name);
            console.log("Preview link: " + data.tracks.items[i].preview_url);
            console.log("Album name: " + data.tracks.items[i].album.name);
            console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
        }
        console.log("");
        // TODO set up loop to go through return object and list data for each
    });

}//reach out to spotify and grab userInput song information

function getMovie(movie){
    request("http://www.omdbapi.com/?t=" + movie+ "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            dataLog(JSON.stringify(body));
            // console.log(body);
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
        }
        else{
            console.log("Error Status Code: " + response.statusCode);
            console.log("Error: " + error);
        }
    });
}//reach out to OMDB and grab userInput movie information

function doThis(){
    fs.readFile("./random.txt", "utf8", function (error, data){
        if (error){
            console.log(error);
        }
        data = data.replace(/\n|\r/g, "");          // removing end-line portion of string and replacing with empty
        // console.log(data);
        var dataArr = data.split(",");              // splitting array on comma
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
            };
        }; // looping through array and using even indices to determine function to run, and odds as look up topics(if applicable)
    })
};

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