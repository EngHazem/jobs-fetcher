import { createApi } from 'unsplash-js'
import * as nodeFetch from 'node-fetch'

export const serverApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch.default as unknown as typeof fetch,
});