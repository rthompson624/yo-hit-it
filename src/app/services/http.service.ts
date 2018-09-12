import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CategoryDefJSON, EventsRequestBody, CitySparkEvents } from '../definitions/events';
import { PlaceDetailResponse } from '../definitions/google-maps';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(private http: HttpClient) {
  }

  getEventCategories(): Observable<CategoryDefJSON> {
    let url = '/assets/categories.json';
    return this.http.get<CategoryDefJSON>(url, {responseType: 'json'})
    .pipe(
      catchError(this.handleError('getEventCategories', {"categories": []}))
    );
  }

  getEvents(longitude: number, latitude: number, radius: number, categories: number[], limit: number, offset: number, start: Date): Observable<CitySparkEvents> {
    let url = environment.citySpark.domain + environment.citySpark.api.events.get;
    let requestParam: string = JSON.stringify(this.formatEventsRequestBody(longitude, latitude, radius, categories, limit, offset, start));
    let httpParams = new HttpParams().set('request', requestParam);
    return this.http.get<CitySparkEvents>(url, {params: httpParams, responseType: 'json'})
    .pipe(
      catchError(this.handleError('getEvents', {"events": [], "possible": 0}))
    );
  }

  getUtcOffset(placeID: string): Observable<PlaceDetailResponse> {
    let url = environment.google.domain + environment.google.api.geoService.getUtcOffset;
    let httpParams = new HttpParams().set('placeID', placeID);
    return this.http.get<PlaceDetailResponse>(url, {params: httpParams, responseType: 'json'})
    .pipe(
      catchError(this.handleError('getUtcOffset', 
        {"html_attributions": [], "result": {"utc_offset": 0, "formatted_address": ''}, "status": "error"}))
    );
  }

  formatEventsRequestBody(longitude: number, latitude: number, radius: number, categories: number[], limit: number, offset: number, start: Date): EventsRequestBody {
    let request: EventsRequestBody = {
      "searchKeywords": null,
      "venueKeywords": null,
      "search": "",
      "longitude": longitude,
      "latitude": latitude,
      "distance": radius,
      "limit": limit,
      "categories": categories,
      "skip": offset,
      "start": start.toJSON(),
      "end": null,
      "sortby": "start",
      "sortdir": "asc",
      "onlySparked": false,
      "oneSort": false,
      "deals": false,
      "hier": [
        2,
        5467
      ],
      "possible": false,
      "ppid": 8463,
      "blockedCategories": [],
      "blockedKeywords": [],
      "hoursOffset": 0,
      "venue": null,
      "exact": false,
      "interest": 0,
      "eventPIds": null,
      "defaultCat": true,
      "metric": false,
      "handPicked": false,
      "bhier": [
        2,
        5467
      ],
      "labels": []
    };
    return request;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  
}
