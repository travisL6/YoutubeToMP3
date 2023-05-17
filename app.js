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
        const fetchAPI = await fetch("https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/?url=" + videoID, {
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });
        const fetchResponse = await fetchAPI.json();
        console.log(fetchResponse.title);
        if(fetchResponse.title != "") {
            return res.render("index", {success : true, title : fetchResponse.title, link : fetchResponse.link});
        } else {
            return res.render("index", {success : false, message : "failure"});
        }
    }
})

//start server
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
})