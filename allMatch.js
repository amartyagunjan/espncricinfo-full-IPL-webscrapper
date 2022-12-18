// const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const { getMatchScorecardDetails } = require("./scorecard");

function getAllMatchLinkUrl(linkToIplResult){
    request(linkToIplResult, cb);
    // console.log(url + allIplMatchResultsPageLink);
    console.log(linkToIplResult);
    function cb(error, response, html){
        if(error){
            console.log(error);
        }
        else{
            getLinkToMatchScorecard(html);
        }
    }

    function getLinkToMatchScorecard(html){
        let $ = cheerio.load(html);
        const matchesNavigationBarArr = $(".ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t");
        // console.log("a" + matchesNavigationBarArr.length);
        
        for(let i = 0; i < matchesNavigationBarArr.length; i++){
            let linkOfScorecard = $(matchesNavigationBarArr[i]).find(".ds-inline-flex.ds-items-center a");
            // console.log(linkOfScorecard.length);
            linkOfScorecard = "https://www.espncricinfo.com" + $(linkOfScorecard[2]).attr("href");
            // console.log(i+1);
            getMatchScorecardDetails(linkOfScorecard, i+1);
            // call scorecard analysis function
        }
    }
}

module.exports = {
    getAllMatchLinkUrl : getAllMatchLinkUrl
}
