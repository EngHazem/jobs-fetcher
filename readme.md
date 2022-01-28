# Delayed Jobs Fetcher
A simple nodejs application that is intended for delayed jobs processing (Here we are fetching images from [Unsplash](https://unsplash.com/developers) API) and storing the response into file storage.


## Installation
- Create a [Unsplash](https://unsplash.com/developers) account and create an application.
- Rename the `.env.example` to `.env` and add your application's access key to the `.env` file under the `UNSPLASH_ACCESS_KEY` key.

```bash

$ npm i
```
Then..

```bash

$ npm run start

# or

$ npm run dev
```

### Available endpoints
```
    curl --location --request POST 'localhost:3000/jobs'
    # Creates a new empty job with an ID, stores it to file storage and schedules a delayed execution that fetches an image from Unsplash and saves the response under the empty job object we created earlier.

    # Response sample
    {
        "data": {
            "id": "KfYJ4QKP",
            "status": "PENDING",
            "data": {}
        },
        "meta": {
            "success": true,
            "message": "Job will get executed at Fri Jan 22 2022 22:31:09 GMT+0300 (Arabian Standard Time)"
        }
    }
```

```
    curl --location --request GET 'localhost:3000/jobs/{id}'
    # Searches the stored jobs for a job with an ID equivalent to the passed ID parameter and returns the result.

    # Response sample (Processed Job)
    {
        "data": {
            "id": "KfYJ4QKP",
            "status": "PROCESSED",
            "data": {
                "alt_description": "vegetable and meat on bowl",
                "blur_hash": "LnNd2SjH?wov.7bGRQaet.f*VrWE",
                "color": "#d9d9d9",
                "description": null,
                "height": 3160,
                "likes": 441,
                "links": {
                    "self": "https://api.unsplash.com/photos/kcA-c3f_3FE",
                    "html": "https://unsplash.com/photos/kcA-c3f_3FE",
                    "download": "https://unsplash.com/photos/kcA-c3f_3FE/download?ixid=MnwyOTE1OTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDMzOTgyNzA",
                    "download_location": "https://api.unsplash.com/photos/kcA-c3f_3FE/download?ixid=MnwyOTE1OTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDMzOTgyNzA"
                },
                "promoted_at": "2018-12-31T04:50:00-05:00",
                "width": 3160
            }
        },
        "meta": {
            "success": true,
            "message": "Job retrieved successfully!"
        }
    }


    # Response sample (Pending Processing Job)
    {
        "data": {
            "id": "lD7JyLST",
            "status": "PENDING",
            "data": {}
        },
        "meta": {
            "success": true,
            "message": "Job retireved but still pending unsplash image fetching."
        }
    }
```

## Development Timeline
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