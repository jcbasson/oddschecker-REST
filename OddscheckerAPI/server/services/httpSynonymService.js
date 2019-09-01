const axios = require('axios')
const _ = require('lodash')

const API_ENDPOINT = 'http://localhost:8765'

const getSynonyms = (synonyms) => {
    return Promise.all(synonyms.map(s => getSynonym(s)))
}

const getSynonym = synonym => {
    const encodedSynonym = synonym.replace(' ', '%20');
    return axios
    .get(`${API_ENDPOINT}/synonyms/${encodedSynonym}`)
    .then(response => _.get(response, 'data'))
}
  


module.exports = {
    getSynonyms,
}
