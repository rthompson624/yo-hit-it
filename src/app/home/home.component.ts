import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';
import { EventCategory, CitySparkEvent } from '../definitions/events';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EventDetailDialogComponent } from '../event-detail-dialog/event-detail-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { HeaderEventBroadcastService } from '../services/header-event-broadcast.service';
import { Location, PlaceDetailResponse } from '../definitions/google-maps';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

declare var google: any; // Needed for Angular Google Maps

const BUFFER_SIZE: number = 50;
const ICON_COUNT: number = 2;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  showSpinner: boolean = false;
  searchPanelExpanded: boolean = false;
  date: Date = new Date();
  radius: string = environment.defaultSettings.radius.toString(10);
  categories: EventCategory[] = [];
  selectedCategory: string = '';
  events: CitySparkEvent[] = [];
  dataView: string = 'list'; // list and map are the permitted values
  geocoder: any; // Needed for Angular Google Maps
  locationChanged: boolean = false;
  location: Location = {
    lat: environment.defaultSettings.location.latitude,
    lng: environment.defaultSettings.location.longitude,
    address: environment.defaultSettings.location.name,
    zoom: 11
  };
  userLocation: Location[] = [];
  @ViewChild(AgmMap) map: AgmMap; // Needed for Angular Google Maps

  constructor(
    private httpService: HttpService, 
    private dialogService: MatDialog, 
    private headerEventBroadcastService: HeaderEventBroadcastService,
    private mapsApiLoader: MapsAPILoader,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    // Angular Google Maps
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
    // Initialize icons
    iconRegistry.addSvgIcon(
      'local_activity',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-local_activity-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'music_note',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-music_note-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'color_lens',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-color_lens-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'library_books',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-library_books-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'terrain',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-terrain-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'school',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-school-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'business_center',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-business_center-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'public',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-public-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'local_dining',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-local_dining-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'local_bar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-local_bar-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'face',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-face-24px.svg')
    );
  }

  ngOnInit() {
    this.headerEventBroadcastService.dataViewChange.subscribe(dataView => this.dataView = dataView);
    this.date = new Date(this.date.toDateString());
    this.showSpinner = true;
    this.getUserLocation();
    this.loadEventCategories();
  }
  
  onClickSearch(): void {
    if (this.locationChanged) {
      this.showSpinner = true;
      this.updateMapLocation(this.location.address);
    } else {
      this.searchPanelExpanded = false;
      this.reloadEvents();
    }
  }

  onClickEvent(event: CitySparkEvent): void {
    this.openEventDialog(event);
  }
  
  openEventDialog(event: CitySparkEvent): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {"event": event, "utcOffset": this.location.utcOffset};
    dialogConfig.autoFocus = false;
    this.dialogService.open(EventDetailDialogComponent, dialogConfig);
  }
  
  openAlertDialog(title: string, message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {"title": title, "message": message};
    dialogConfig.autoFocus = false;
    this.dialogService.open(AlertDialogComponent, dialogConfig);
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        this.userLocation.length = 0;
        this.userLocation.push({lat: position.coords.latitude, lng: position.coords.longitude});
        this.geocodeLatLng();
        this.reloadEvents();
      });
    } else {
      this.reloadEvents();
      this.openAlertDialog('Where You Be?', 'Geolocation is not supported by your browser. Please enter your location manually.');
    }
  }

  geocodeLatLng(): void {
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    const latlng = {lat: this.location.lat, lng: this.location.lng};
    this.geocoder.geocode({'location': latlng}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          // The following has to run inside zone.run() for Angular event detection to work properly
          this.zone.run(() => {
            // console.log('geocodeLatLng::results:');
            // console.log(results);
            this.location.address = this.parseCityState(results);
            this.location.placeID = results[0].place_id;
            this.userLocation[0].address = this.location.address;
            this.userLocation[0].placeID = this.location.placeID;
            this.getUserLocationUtcOffset();
          });
        }
      } else {
        this.zone.run(() => {
          this.openAlertDialog('Whoops', 'We could not identify your city name, but we were able to locate you, so events within your radius will display.');
        });
      }
    });
  }

  getUserLocationUtcOffset(): void {
    this.httpService.getUtcOffset(this.userLocation[0].placeID, 'user').toPromise().then((response: PlaceDetailResponse) => {
      if (response.status === 'OK') {
        this.location.utcOffset = response.result.utc_offset;
        this.userLocation[0].utcOffset = response.result.utc_offset;
        // console.log('User & events Utc Offset: ' + response.result.utc_offset);
      }
    });
  }

  getEventsLocationUtcOffset(): void {
    this.httpService.getUtcOffset(this.location.placeID, 'events').toPromise().then((response) => {
      if (response.status === 'OK') {
        this.location.utcOffset = response.result.utc_offset;
        // console.log('Events Utc Offset: ' + response.result.utc_offset);
      }
    });
  }

  parseCityState(results: any): string {
    const result = results.find(
      (result) => result.types.find(
        (type) => type === 'street_address'
      )
    );
    const city = result.address_components.find(
      (address_component) => address_component.types.find(
        (type) => type === 'locality'
      )
    ).short_name;
    const state = result.address_components.find(
      (address_component) => address_component.types.find(
        (type) => type === 'administrative_area_level_1'
      )
    ).short_name;
    return city + ', ' + state;
  }

  updateMapLocation(address: string): void {
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({'address': address}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0].geometry.location) {
          // console.log('New location: ' + results[0].formatted_address);
          // console.log('Lat: ' + results[0].geometry.location.lat());
          // console.log('Lng: ' + results[0].geometry.location.lng());
          // console.log(results);
          // The following has to run inside zone.run() for Angular event detection to work properly
          this.zone.run(() => {
            this.location.lat = results[0].geometry.location.lat();
            this.location.lng = results[0].geometry.location.lng();
            this.location.placeID = results[0].place_id;
            this.getEventsLocationUtcOffset();
            this.locationChanged = false;
            this.searchPanelExpanded = false;
            this.reloadEvents();
          });
        }
      } else {
        this.zone.run(() => {
          this.showSpinner = false;
          this.openAlertDialog('Say What?', 'We did not recognize that place. Please enter location as CITY, ST (like Boulder, CO).');
        });
      }
    });
  }

  formatDate(date: Date): string {
    const options = {weekday:'long', month:'short', day:'numeric'};
    return date.toLocaleDateString('en-US', options);
  }

  formatTime(date: Date): string {
    let am_pm = 'AM';
    let hour = date.getHours();
    if (hour >= 12) am_pm = 'PM';
    if (hour > 12) hour = hour - 12;
    if (hour == 0) hour = 12;
    let minuteString = date.getMinutes().toString();
    if (date.getMinutes() < 10) minuteString = '0' + date.getMinutes().toString();
    return hour.toString() + ':' + minuteString + ' ' + am_pm;
  }

  reloadEvents(): void {
    this.showSpinner = true;
    this.events.length = 0;
    this.loadEvents(0);
  }

  getCategoryName(value: string): string {
    return this.categories.find((category) => category.id === value).name;
  }

  loadEventCategories(): void {
    this.categories = [
      {id: '', name: 'All Categories'},
      {id: '2', name: 'Performing Arts'},
      {id: '3', name: 'Visual Arts'},
      {id: '4', name: 'Literary Arts'},
      {id: '6', name: 'Sports & Outdoors'},
      {id: '7', name: 'Learning'},
      {id: '8', name: 'Professional'},
      {id: '11', name: 'Civic Benefit'},
      {id: '12', name: 'Food & Drink'},
      {id: '14', name: 'Nightlife'},
      {id: '76', name: 'Pursuits & Hobbies'}
    ];
  }

  getEventIcon(tag: number): string {
    let categoryIcon: string = '';
    switch (tag) {
      // No category
      case 0:
        categoryIcon = 'local_activity';
        break;
      // Performing Arts
      case 2:
        categoryIcon = 'music_note';
        break;
      // Visual Arts
      case 3:
        categoryIcon = 'color_lens';
        break;
      // Literary Arts
      case 4:
        categoryIcon = 'library_books';
        break;
      // Sports & Outdoors
      case 6:
        categoryIcon = 'terrain';
        break;
      // Learning
      case 7:
        categoryIcon = 'school';
        break;
      // Professional
      case 8:
        categoryIcon = 'business_center';
        break;
      // Civic Benefit
      case 11:
        categoryIcon = 'public';
        break;
      // Food & Drink
      case 12:
        categoryIcon = 'local_dining';
        break;
      // Nightlife
      case 14:
        categoryIcon = 'local_bar';
        break;
      // Pursuits & Hobbies
      case 76:
        categoryIcon = 'face';
        break;
      case 999:
        categoryIcon = '';
    }
    return categoryIcon;
  }

  parseStringToNumber(string: string): number {
    if (string) {
      if (string === '') return 0;
      return parseInt(string, 10);
    } else {
      return 0;
    }
  }

  loadEvents(offset: number): void {
    this.httpService.getEvents(
      this.location.lng,
      this.location.lat,
      parseInt(this.radius, 10),
      this.selectedCategory === '' ? [] : [parseInt(this.selectedCategory, 10)],
      BUFFER_SIZE,
      offset,
      this.date
    ).toPromise().then((json) => {
      if (this.bleedsIntoTomorrow(json.events)) {
        this.events = this.events.concat(this.trimFutureEvents(this.trimLapsedEvents(json.events)));
        this.trimEventTags();
        this.showSpinner = false;
        // console.log(this.events);
      } else {
        this.events = this.events.concat(this.trimLapsedEvents(json.events));
        this.loadEvents(offset + BUFFER_SIZE);
      }
    });  
  }

  bleedsIntoTomorrow(events: CitySparkEvent[]): boolean {
    let hasFutureEvents: boolean = false;
    events.forEach((event) => {
      if (this.isFutureEvent(event)) hasFutureEvents = true;
    });
    return hasFutureEvents;
  }

  trimEventTags(): void {
    this.events.forEach((event) => {
      if (event.Tags) {
        // The following sorting logic should be improved by checking if the event category filter is on, and placing the filtered category first followed by the rest of the event tags (in numerical order).
        event.Tags = event.Tags.sort((a, b) => {return a - b});
        event.Tags = event.Tags.filter((tag) => {
          if (this.categories.find((category) => parseInt(category.id) == tag)) return true;
        });
      } else {
        event.Tags = [];
      }
      if (event.Tags.length == 0) event.Tags.push(0);
      if (event.Tags.length > ICON_COUNT) event.Tags.length = ICON_COUNT;
    });
    this.events.forEach((event) => {
      let itemsToAdd = ICON_COUNT - event.Tags.length;
      for (let i = 0; i < itemsToAdd; i++) {
        event.Tags.push(999);
      }
    });
  }

  trimFutureEvents(events: CitySparkEvent[]): CitySparkEvent[] {
    return events.filter((event) => {
      return !this.isFutureEvent(event);
    });
  }

  isFutureEvent(event: CitySparkEvent): boolean {
    let isFuture: boolean = false;
    let eventDate: Date = this.convertCitySparkDate(event.DateStart);
    let cutoff: Date = this.addHours(this.date, 26);
    if (eventDate > cutoff) {
      isFuture = true;
    }
    return isFuture;
  }

  trimLapsedEvents(events: CitySparkEvent[]): CitySparkEvent[] {
    return events.filter((event) => {
      return !this.hasEventLapsed(event);
    });
  }

  hasEventLapsed(event: CitySparkEvent): boolean {
    let hasLapsed: boolean = false;
    let eventDate: Date = this.convertCitySparkDate(event.DateStart);
    let now: Date = new Date();
    if (eventDate < now) {
      hasLapsed = true;
    }
    return hasLapsed;
  }

  addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + (hours * 3600000));
  }

  // CitySpark returns dates in GMT notation, but they are really local time
  convertCitySparkDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString.replace('Z', ''));
    } else {
      return null;
    }
  }

}
