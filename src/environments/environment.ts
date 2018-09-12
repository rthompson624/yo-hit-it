// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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
        get: "api/getevents"
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

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
