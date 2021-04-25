const axios = require('axios')

// An api key is required from the-odds-api.com
const api_key = '#'

var sports = [];

// Get a list of in season sports
axios.get('https://api.the-odds-api.com/v3/sports', {
    params: {
        api_key: api_key
    }
}).then(response => {

    

    console.log(
        `Successfully got ${response.data.data.length} sports.`,
        `Here's the first sport:`
    )

    for (let i=0; i<response.data.data.length; i++) {
        sports.push(response.data.data[i].key)
    }

    console.log(sports)


})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})

