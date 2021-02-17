
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const request = require('request');

const api_key = '9064bc32af8847ab9a1f5d1db559fd0f'

const axios = require('axios')

const twoWayHedge = (stake, max1, max2) => {

    payout = stake * max1;
    hedge = payout / max2;
    totalStake = stake + hedge;
    profit = payout - totalstake;

    return (profit)
}

function getMaxOf2DIndex (arr, idx) {
    return {
        max: Math.max.apply(null, arr.map(function (e) { return e[idx]}))
    }
} 


 
// To get odds for a sepcific sport, use the sport key from the last request
//   or set sport to "upcoming" to see live and upcoming across all sports
let sport_key = 'upcoming'

axios.get('https://api.the-odds-api.com/v3/odds', {
    params: {
        api_key: api_key,
        sport: sport_key,
        region: 'uk', // uk | us | eu | au
        mkt: 'h2h' // h2h | spreads | totals
    }
}).then(response => {
    // odds_json['data'] contains a list of live and 
    //   upcoming events and odds for different bookmakers.
    // Events are ordered by start time (live events are first)
    console.log(
        `Successfully got ${response.data.data.length} events`,
        `Here's the first event:`
    )
    console.log(JSON.stringify(response.data.data[0]))

    // Check your usage
    console.log()
    console.log('Remaining requests',response.headers['x-requests-remaining'])
    console.log('Used requests',response.headers['x-requests-used'])
    console.log(JSON.stringify(response.data.data[0].teams)) 

    oddsArr = []

    for (i=0; i<response.data.data[0].sites.length; i++) {
        odds = response.data.data[0].sites[i].odds.h2h;
        oddsArr.push(odds);
/*         for (j=0; j<odds.length; j++) {
            odds1.push(odds[j])
        } */

        
    } 

    maxHome = getMaxOf2DIndex(oddsArr, 0);
    maxAway = getMaxOf2DIndex(oddsArr, 1);
    // maxDraw = getMaxOf2DIndex(oddsArr, 2);

    console.log(oddsArr);

    console.log(maxHome);
    console.log(maxAway);

    //console.log(twoWayHedge(100,maxHome,maxAway));


    odds1 = []
    odds2 = []
    odds3 = []

   /* for (i=0; i<odds.length; i++) {
        for (j=0; j<odds.length[i]; i++) {
            odds[j].push(odds[i][j])
        }
    }*/

    //console.log(odds1);
    //console.log(odds2);
    //console.log(odds3);


})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})