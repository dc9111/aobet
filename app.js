const api_key = '4f242d82bb940b3754ba20d1a3607ac8'

const axios = require('axios')

const twoWayHedge = (stake, max1, max2) => {

    payout = stake * max1;
    hedge = payout / max2;
    totalStake = stake + hedge;
    profit = payout - totalStake;
    
    return [profit, hedge]
}

const threeWayHedge = (stake, max1, max2, max3) => {
    payout = stake * max1;
    hedge1 = payout / max2;
    hedge2 = payout / max3;
    totalStake = stake + hedge1 + hedge2;
    profit = payout - totalStake;

    return [profit, hedge1, hedge2]
}

function getMaxOf2DIndex (arr, idx) {
    max = Math.max.apply(null, arr.map(function (e) { return e[idx]}))
    maxArr = arr.map(function (e) { return e[idx]})
    indexOf = maxArr.indexOf(max)
    //indexOf = indexOf.Math.max.apply(null, arr.map(function (e) { return e[idx]}))
    return [parseFloat(max),indexOf] 
    
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

  success = 0;  


async function getOdds (key) {

sport_key = key
bet = 10;
margin = .5;

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

    oddsArr = []
    sitesArr = []

    for (j=0; j<response.data.data.length; j++) {
    
    for (i=0; i<response.data.data[j].sites.length; i++) {
        odds = response.data.data[j].sites[i].odds.h2h;
        oddsArr.push(odds);
        sitesArr.push(response.data.data[j].sites[i].site_key)

        
    } 
    
    if (oddsArr[0].length ==2) {
        let [maxHome, maxHomeIndex ] = getMaxOf2DIndex(oddsArr, 0);
        let [maxAway, maxAwayIndex ] = getMaxOf2DIndex(oddsArr, 1);
        let [profit, hedge] = twoWayHedge(bet,maxHome,maxAway, maxDraw)
        console.log(profit, hedge)

    
        if( profit > margin) {
            console.log(JSON.stringify(response.data.data[j].teams))
            console.log(maxHome + "  " + sitesArr[maxHomeIndex]);
            console.log(maxAway + "  " + sitesArr[maxAwayIndex]);

        }
    

    } else {
        let [maxHome, maxHomeIndex ] = getMaxOf2DIndex(oddsArr, 0);
        let [maxAway, maxAwayIndex ] = getMaxOf2DIndex(oddsArr, 1);
        let [maxDraw, maxDrawIndex ] = getMaxOf2DIndex(oddsArr, 2);
        let [profit, hedge1, hedge2] = threeWayHedge(bet ,maxHome,maxAway, maxDraw)

    if (profit > margin) {
        console.log(JSON.stringify(response.data.data[j].teams))
        console.log(maxHome + "  " + sitesArr[maxHomeIndex]);
        console.log(maxAway + "  " + sitesArr[maxAwayIndex]);
        console.log(maxDraw + "  " + sitesArr[maxDrawIndex]);
        console.log(profit, hedge1, hedge2)
        }
    
    }

    oddsArr = [];
    sitesArr = [];
    odds = [];


}

})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})
}

sports.forEach(e => getOdds(e));
(console.log('Finished'))
 
 