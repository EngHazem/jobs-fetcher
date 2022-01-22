#Delayed Jobs Fetcher
A simple nodejs application that is intended for delayed jobs processing (Here we are fetching images from [Unsplash](https://unsplash.com/developers) API) and storing the response into file storage.


## Installation
- Create a [Unsplash](https://unsplash.com/developers) account and create an application.
- Duplicate the `.env.example` to `.env` and add your application's access key to the `.env` file under the `UNSPLASH_ACCESS_KEY` key.

```bash

$ npm i
```
Then..

```bash

$ npm run start

..or..

$ npm run dev
```

##Development Timeline
<table>
<thead>
    <tr>
        <th>Section</th>
        <th>Time</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>Search and Study (Overall)</td>
        <td>8 Hours</td>
    </tr>
    <tr>
        <td>Unsplash account setup and going over documentation</td>
        <td>3 Hours</td>
    </tr>
    <tr>
        <td>Unsplash integration</td>
        <td>1 Hour</td>
    </tr>
    <tr>
        <td>Random image fetching functionality</td>
        <td>1 Hour</td>
    </tr>
    <tr>
        <td>Storing response into file storage (IO)</td>
        <td>3 Hours</td>
    </tr>
    <tr>
        <td>Filtering data and retrieving jobs from file storage (IO)</td>
        <td>2 Hour</td>
    </tr>
    <tr>
        <td>Code restructure in Typescript</td>
        <td>5 Hour</td>
    </tr>
</tbody>
</table>