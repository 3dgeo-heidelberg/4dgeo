# Instructions for using the application

In order to fully understand and use this application, here are specific instructions and descriptions of the individual features. 

## Example Dashboards
The first content of the Landing Page are a selection of predefined example dashboard layouts. These Layouts are defined in the `public/custom/example_dashboards/example_dashboards.json` file.

### Dashboard Layout Definition
Each Layout consists of a `title`, `image` for the preview element, the `layout` itself, a `url` to the data and the `interval` between a reload of the dashboard

## Dashboard creation
In addition to the example dashboards, the option to create an own dashboard is also supported. Inside of the dashboard-creator, you can add all the wanted modules and the data url and create your own layout.
Clicking the `Permalink` button copies a url to the dashboard page with all of the specified information. With this link, you can go directly to the dashboard page, which will then render the final dashboard.
The `Go` button skips the copying part and redirects to the dashboard page itself.


## Data Model

4dGeo utilizes a structured data model to visualize geospatial and temporal data. The model is designed around observations, where each observation represents a snapshot of an area with detected geoobjects and their properties at a specific point in time.

### JSON Structure
```
{
    "observations": [
        {
            "startDateTime": "String in ISO 8601 format",
            "endDateTime": "String in ISO 8601 format",
            "geoObjects": [
                {
                    "id": "",
                    "type": "",
                    "dateTime": "String in ISO 8601 format",
                    "geometry": {
                        "type": "",
                        "coordinates": [
                            [1, 1, 1],
                            [1, 2, 1]
                        ]
                    },
                    "customEntityData": {
                        "customKey": "",
                        "customKey2": ""
                    }
                }
            ],
            "backgroundImageData": {
                "url": "",
                "height": 0,
                "width": 0
            }        
        }
    ]
}
```

### Explanation
- **Observations** - A list where each element represents a singular observation or scan at a certain interval in time.
- **startDateTime & endDateTime** - The time range of the observation.
- **geoObjects** - A list for every Object inside an observation.
    - **type** - Custom Type for your use case. Is used for color association and chart calculation.
    - **datetime** - Specific point in time, inside the defined time range of the observation.
    - **geometry** - Geometry data for visualising with the 2D View Module.
        - **type** - Type of geometry like in a geoJson file, like Point and Polygon.
        - **coordinates** - The Coordinates of an Object in reference to the background image. For 2D-Coordinates, the values have to be [y,x] because the origin is in the top-left hand corner of the image with the x-values going vertically and the y-values going horizontally.
- **backgroundImageData** - Image source for the background Image of the 2D View Module.



## Modules

### 2D View
This module visualizes geoobjects in a 2D plane. For this, it utilizes the background image, specified in the data model as `backgroundImageData` as the background. Each geoobject then gets rendered using their 2D coordinates. These coordinates lie in the coordinate system specified by the image height and width, with [0, 0] being in the top-left hand corner and in [y, x] format.

### Date Range Picker
The Date Range Picker represents a calendar, where you can choose a specific day-range to be selected. The current shown observations will be filtered using this day-range. 
Each day, on that at least 1 observation `startDateTime` falls on, is highlighted by a small orange dot. 

### Observation Slider
In addition to the Date Range Picker, the Observation Slider can also be used to choose and filter current observations. The range of this slider is corresponding to the range of the Date Range Picker and acts as a more detailed filter. This module also uses the `startDateTime` of each observation.

### Chart
The Chart module is another visualisation module, that uses the `customEntityData` of each geoObject to create a bar for each observation. Currently, only the sum of each geoobject per observation is calculated and shown. Also the different types of geoobjects are differentiated in this calculation.