const createApi = require('unsplash-js').createApi;
const nodeFetch = require('node-fetch');

const serverApi = createApi({
  accessKey: 'ivbdSQr8D48gFjxRPono7oKgNzOLFme8DRtJ8RX_IgI',
  fetch: nodeFetch,
});

module.exports = serverApi