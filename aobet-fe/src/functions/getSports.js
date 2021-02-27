

const axios = require('axios')

// An api key is emailed to you when you sign up to a plan
const api_key = '9064bc32af8847ab9a1f5d1db559fd0f'

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

