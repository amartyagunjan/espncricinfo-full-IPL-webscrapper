const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";
const cheerio = require("cheerio");
const request = require("request");
const getAllMatchObj = require("./allMatch.js");
const fs = require("fs"); 
const path = require("path");

// path to ipl folder 
const iplDirpath = path.join(__dirname, "ipl");
// create folder using self made dirCreator function
dirCreator(iplDirpath); 

request(url, cb);
function cb(error, response, body){
    if(error){
        console.log(error);
    }
    else{   
        extractHTML(body);
        // console.log("1. working well");
    }
}

function extractHTML(html){
    let $ = cheerio.load(html);
    // console.log($.html());
    let linkToIplResultsArray = $(".ds-block .ds-inline-flex a");
    // console.log(linkToIplResultsArray.length);
    let linkToIplResult = "https://www.espncricinfo.com" + $(linkToIplResultsArray[linkToIplResultsArray.length -1]).attr("href");
    getAllMatchObj.getAllMatchLinkUrl(linkToIplResult);
} 

function dirCreator(dirPath){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }
}
