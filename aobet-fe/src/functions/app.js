const api_key = '5dd102f37b280288e78974b701449133'

const axios = require('axios');

class ViableBet {
    constructor(id, team1, team2, date, site1, site2, site3, maxHome, maxAway, maxDraw, point) {
        this.id = id;
        this.team1 = team1;
        this.team2 = team2;
        this.date = date;
        this.site1 = site1;
        this.site2 = site2;
        this.site3 = site3;
        this.maxHome = maxHome;
        this.maxAway = maxAway;
        this.maxDraw = maxDraw;
        this.point = point;
    }
}

const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const twoWayHedge = (stake, max1, max2) => {

    var payout = stake * max1;
    var hedge = payout / max2;
    var totalStake = stake + hedge;
    var profit = payout - totalStake;
    var point = (profit / totalStake) * 100;
    
    return [profit, hedge, point]
}

const threeWayHedge = (stake, max1, max2, max3) => {
    var payout = stake * max1;
    var hedge1 = payout / max2;
    var hedge2 = payout / max3;
    var totalStake = stake + hedge1 + hedge2;
    var profit = payout - totalStake;
    var point = (profit / totalStake) * 100;

    return [profit, hedge1, hedge2, point]
}

function getMaxOf2DIndex (arr, idx) {
    var max = Math.max.apply(null, arr.map(function (e) { return e[idx]}))
    var maxArr = arr.map(function (e) { return e[idx]})
    var indexOf = maxArr.indexOf(max)
    return [parseFloat(max),indexOf] 
    
} 

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


const sports = [
    'soccer_efl_champ',
    'soccer_england_league1',
    'soccer_england_league2',
    'soccer_epl',
    'soccer_fa_cup',
    'soccer_france_ligue_one',
    'soccer_germany_bundesliga',
    'soccer_italy_serie_a',
    'soccer_spain_la_liga',
    'soccer_spain_segunda_division',
    'soccer_uefa_champs_league',
    'soccer_uefa_europa_league',

  ]

  const blockedSites = [
      'betfair',
      'onexbet',
      'betclic', 
      'matchbook'
    ]

var viableBets = []
 


function getOdds (key) {

const sport_key = key
const bet = 10;
const margin = 0.5;

axios.get('https://api.the-odds-api.com/v3/odds', {
    params: {
        api_key: api_key,
        sport: sport_key,
        region: 'uk', // uk | us | eu | au
        mkt: 'h2h' // h2h | spreads | totals
    }
}).then(response => {
    
    
    //   upcoming events and odds for different bookmakers.
    // Events are ordered by start time (live events are first)
    console.log(
        `Successfully got ${response.data.data.length} events from ${key}`,
    )


    // Check your usage
    console.log()
    console.log('Remaining requests',response.headers['x-requests-remaining'])
    console.log('Used requests',response.headers['x-requests-used'])

    let oddsArr = []
    let sitesArr = []

    for (let j=0; j<response.data.data.length; j++) {
    
    for (let i=0; i<response.data.data[j].sites.length; i++) {

        if (blockedSites.includes(response.data.data[j].sites[i].site_key)) {
            continue;
        }

        var odds = response.data.data[j].sites[i].odds.h2h;
        oddsArr.push(odds);
        sitesArr.push(response.data.data[j].sites[i].site_key)
        var teams = response.data.data[j].teams; 

        
    } 
    
    if (oddsArr[0].length === 2) {
        let [maxHome, maxHomeIndex ] = getMaxOf2DIndex(oddsArr, 0);
        let [maxAway, maxAwayIndex ] = getMaxOf2DIndex(oddsArr, 1);
        let [profit, hedge, point] = twoWayHedge(bet,maxHome,maxAway)
        console.log(profit, hedge, point)

    
        if( point > margin) {
            console.log(JSON.stringify(response.data.data[j].teams))
            console.log(maxHome + "  " + sitesArr[maxHomeIndex]);
            console.log(maxAway + "  " + sitesArr[maxAwayIndex]);

        }
    

    } else {
        let [maxHome, maxHomeIndex ] = getMaxOf2DIndex(oddsArr, 0);
        let [maxAway, maxAwayIndex ] = getMaxOf2DIndex(oddsArr, 1);
        let [maxDraw, maxDrawIndex ] = getMaxOf2DIndex(oddsArr, 2);
        let [profit, hedge1, hedge2, point] = threeWayHedge(bet ,maxHome,maxAway, maxDraw)

    if (point > margin) {
        console.log(JSON.stringify(response.data.data[j].teams))
        console.log(maxHome + "  " + sitesArr[maxHomeIndex]);
        console.log(maxAway + "  " + sitesArr[maxAwayIndex]);
        console.log(maxDraw + "  " + sitesArr[maxDrawIndex]);
        console.log("Profit:" + profit + " H1:" + hedge1 +" H2:" + hedge2 + " %:" + point)
        let ct = response.data.data[j].commence_time;
        let id = uid()
        let vb = new ViableBet(id, teams[0], teams[1], ct, sitesArr[maxHomeIndex], sitesArr[maxAwayIndex], sitesArr[maxDrawIndex], maxHome, maxAway, maxDraw, point)

        //move if logic up to the bet option, block creation of object if it already exists
        var index = viableBets.findIndex(x => x.team1 === vb.team1);
        index === -1 ? viableBets.push(vb) : console.log("bet already exists")
        // viableBets.push(vb);
        //constructor(id, team1, team2, date, site1, site2, site3, maxHome, maxAway, maxDraw, point)

        }
    
    }

    oddsArr = [];
    sitesArr = [];
    odds = [];


}
sleep(200)


})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})
}

function getBets() {
    sports.forEach(e => getOdds(e))
}

getBets();

/*export default async function getBets () {
    sports.forEach(e => getOdds(e))
    return viableBets
    
}
*/