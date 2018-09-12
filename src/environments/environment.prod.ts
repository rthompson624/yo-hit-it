export const environment = {
  production: true,
  defaultSettings: {
    location: {
      longitude: -87.62979819999998,
      latitude: 41.8781136,
      name: "Chicago, IL"
    },
    radius: 5
  },
  citySpark: {
    domain: "/",
    api: {
      events: {
        get: "api/events/getevents2"
      }
    }
  },
  google: {
    mapsJavascriptApi: {
      key: "AIzaSyA_3IweBHQAauD_DTlS3-k22vYHnFB5Q5Y"
    },
    domain: "/",
    api: {
      geoService: {
        getUtcOffset: "api/getUtcOffset"
      }
    }
  }
};
