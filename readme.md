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
            "id": "lD7JyLST",
            "status": "PENDING",
            "data": {}
        },
        "meta": {
            "success": true,
            "message": "Job will get processed at Sun Jan 23 2022 01:22:54 GMT+0300 (Arabian Standard Time)"
        }
    }
```

```
    curl --location --request GET 'localhost:3000/jobs/{id}'
    # Searches the stored jobs for a job with an ID equivalent to the passed ID parameter and returns the result.

    # Response sample (Processed Job)
    {
        "data": {
            "id": "Ybnf2Iow",
            "status": "PROCESSED",
            "data": {
                "id": "f-TWhXOrLiU",
                "width": 6144,
                "height": 4069,
                "urls": {
                    "raw": "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixid=MnwyOTE1OTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI4ODg0OTg&ixlib=rb-1.2.1",
                    "full": "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyOTE1OTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI4ODg0OTg&ixlib=rb-1.2.1&q=85",
                    "regular": "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE1OTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI4ODg0OTg&ixlib=rb-1.2.1&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE1OTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI4ODg0OTg&ixlib=rb-1.2.1&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTE1OTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI4ODg0OTg&ixlib=rb-1.2.1&q=80&w=200"
                },
                "color": "#d9d9d9",
                "description": "Fresh bear garlic on wooden table with knife",
                "alt_description": "kitchen knife and green leaf vegetable on tableto",
                "user": {
                    "username": "goumbik",
                    "name": "Lukas Blazek"
                }
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