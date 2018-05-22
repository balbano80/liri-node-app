# liri-node-app

Welcome to the LIRI app.  This app is request-style app with 4 options.

1. tweet-me - select the tweet-me option and provide a topic phrase.  LIRI will reach out to the Twitter database and return the most recent tweets that include that subject.
2. spotify-this-song - select the spotify-this-song option and provide the name of a song you would like LIRI to look up.  LIRI will return 5(if available) objects with that song name from     the Spotify database and provide some basic information on those songs.
3. movie-this - select the movie-this option and provide the name of a movie you would like LIRI to look up.  LIRI will reach out to the OMDB database and return some basic information for     that particular movie.
4. do-what-it-says - This will reach out to a text file(random.txt) and run the commands(one each of the above) with some pre-set look-up information. 

This app works both with user input command line arguments and without.  If the user does not input any arguments, the inquirer node package will be engaged and request which of the options they would like to select.  If the particular option requires more information(tweet topic, spotify song name, or movie name), inquirer will then also ask for that information.

Dependencies required(included in package.json file):
    "inquirer": "^5.2.0",
    "node-spotify-api": "^1.0.7",
    "request": "^2.86.0",
    "twitter": "^1.7.1"

To start:
    Simply navigate to the directory you saved the app to.  
    Enter "npm i" in the command line to retrieve the required dependencies.
    Type "node liri.js" and you will be directed to select which option you would like to try and a topic(if required).
    If you wish to go go directly into a command, type any of the below:
        twitter lookup - "node liri.js tweet-me 'topic to look up'"
        spotify a song - "node liri.js spotify-this-song 'song to look up'"
        movie lookup - "node liri.js movie-this 'movie to look up' "
        default lookup(one example of each of the above 3) - "node liri.js do-what-it-says"

In addition, all returned data will be saved in the log.txt file for future lookup if required.

Created and maintaned by Bryan Albano - albanobryan@yahoo.com



