// const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

// request to homepage

function getMatchScorecardDetails(url, matchNo){
    request(url, cb);
    function cb(error, response, body){
        if(error){
            console.log(error);
        }
        else{
            extractMatchDetails(body);
        }
    }
    
    function extractMatchDetails(html){
        let $ = cheerio.load(html);
        // venue, data, both     teams,
        
        // venue, data
        let venueAndDateString = $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid").text();
        let venueAndDataArray = venueAndDateString.split(",");
        let venue = venueAndDataArray[1].trim();
        let date = (venueAndDataArray[2] + venueAndDataArray[3]).trim();
        // // console.log(venueAndDateString);
        // console.log(venue);
        // console.log(date);   
    
        // result 
        let result = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title").text().trim();
        // let resultArray = resultString.split("won");
        // let winningTeam = resultArray[0].trim();
        // console.log(winningTeam);
    
        let inningsDesc = $(".ds-bg-fill-content-prime.ds-rounded-lg");
        // console.log(inningsDesc.length);
        // let inningHtmlSting = "";
        for(let i = 0; i < inningsDesc.length; i++){
            if(i == 0){
                let teamName = $(inningsDesc[i]).find(".ds-flex.ds-items-center.ds-cursor-pointer.ds-px-4").text().split("INNINGS")[0].trim();
                console.log("Team Name : " + teamName);
                let opponentTeamIndex = i == 0 ? 1 : 0;
                let opponentTeamName = $(inningsDesc[opponentTeamIndex]).find(".ds-flex.ds-items-center.ds-cursor-pointer.ds-px-4").text().split("INNINGS")[0].trim();
                console.log(matchNo);
                console.log("Opponent Team : " + opponentTeamName);
                console.log("Result : " + result);
                console.log("Date : " + date);
                console.log("Venue : " + venue);
                let batsmenScores = $(inningsDesc[i]).find(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table .ds-border-b.ds-border-line.ds-text-tight-s").slice(1, 11);
                for(let j = 0; j < batsmenScores.length; j++){
                    let batsmenName = $($(batsmenScores[j]).find("td")[0]).text().trim();
                    let runs = $($(batsmenScores[j]).find("td")[2]).text().trim();
                    let balls = $($(batsmenScores[j]).find("td")[3]).text().trim();
                    let fours = $($(batsmenScores[j]).find("td")[5]).text().trim();
                    let sixes = $($(batsmenScores[j]).find("td")[6]).text().trim();
                    let sr = $($(batsmenScores[j]).find("td")[7]).text();
                    console.log(`${batsmenName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                    processPlayer(teamName, opponentTeamName, batsmenName, runs, balls, fours, sixes, sr, result, date, venue );
                }
                // console.log(batsmenName);
                // console.log(batsmenScores.length);
                console.log("----------------------------");
            }
           
            
        }
    }
}

/**
 * @name : processPlayer
 * @prams : teamName, opponentTeamName, batsmenName, runs, balls, fours, sixes, sr, result, date, venue
 * @desc : convert the scorecard of the player into its excel sheet
 */
function processPlayer(teamName, opponentTeamName, batsmenName, runs, balls, fours, sixes, sr, result, date, venue){
    // creating teamName path
    let teamDirPath = path.join(__dirname, "ipl", teamName);
    dirCreator(teamDirPath);
    let filePath = path.join(teamDirPath, batsmenName + ".xlsx");
    let jsonData =  xlsxReader(filePath, batsmenName );
    let playerObj = {
        teamName, 
        batsmenName,
        runs, 
        balls, 
        fours, 
        sixes,
        sr, 
        result,
        date, 
        venue, 
        opponentTeamName
    };
    jsonData.push(playerObj);
    xlsxWriter(filePath, jsonData, batsmenName);
}

function dirCreator(dirName){
    if(!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }
}

function xlsxWriter(filePath, json, sheetName){
    let newWb = xlsx.utils.book_new();
    let newWs = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWb, newWs, sheetName);
    xlsx.writeFile(newWb, filePath );
}

function xlsxReader(filePath, sheetName){
    if(!fs.existsSync(filePath)){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let jsonData = xlsx.utils.sheet_to_json(excelData);
    return jsonData;
}

module.exports = {
    getMatchScorecardDetails : getMatchScorecardDetails
}
