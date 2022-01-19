const createApi = require('unsplash-js').createApi;
const nodeFetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const serverApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
});

module.exports = serverApi