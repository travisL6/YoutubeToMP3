//required packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//create the express server
const app = express();

//server port
const PORT = process.env.PORT || 3000;

//template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//parse html data for post request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/convert", async (req, res) => {
    const videoID = req.body.videoID;
    if(videoID === undefined || videoID === "" || videoID === null) {
        return res.render("index", {success : false, message : "Please enter a video ID"});
    } else {
        const fetchAPI = await fetch('https://youtube-to-mp32.p.rapidapi.com/api/yt_to_mp3?video_id=' + videoID, {
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });
        const fetchResponse = await fetchAPI.json();

        if(fetchResponse.Status === "Success") {
            return res.render("index", {success : true, title : fetchResponse.Title, link : fetchResponse.Download_url});
        } else {
            return res.render("index", {success : false, message : fetchResponse.Status});
        }
    }
})

//start server
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
})