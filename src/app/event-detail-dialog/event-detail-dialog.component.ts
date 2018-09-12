import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Inject } from '@angular/core';
import { CitySparkEvent } from '../definitions/events';

@Component({
  selector: 'app-event-detail-dialog',
  templateUrl: './event-detail-dialog.component.html',
  styleUrls: ['./event-detail-dialog.component.css']
})
export class EventDetailDialogComponent implements OnInit {
  event: CitySparkEvent;
  utcOffset: number; // minutes (ex. Boulder, CO = -360)

  constructor(private dialogRef: MatDialogRef<EventDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) data: {"event": CitySparkEvent, "utcOffset": number}) {
    this.event = data.event;
    this.utcOffset = data.utcOffset;
  }

  ngOnInit() {
  }

  onClickClose() {
    this.dialogRef.close();
  }

  formatTimePeriod(): string {
    if (this.event.DateEnd) {
      return this.formatTime(this.convertCitySparkDate(this.event.DateStart)) + ' - ' + this.formatTime(this.convertCitySparkDate(this.event.DateEnd));
    } else {
      return this.formatTime(this.convertCitySparkDate(this.event.DateStart));
    }
  }

  encodeURL(url: string): string {
    return encodeURI(url);
  }

  formatLinkText(name: string, url: string): string {
    let retValue: string = '';
    if (name) {
      retValue = name;
    } else {
      if (url) {
        retValue = url;
      } else {
        retValue = '';
      }
    }
    return retValue;
  }

  replaceNull(value: string): string {
    if (value) {
      return value;
    } else {
      return '';
    }
  }

  cleanText(value: string): string {
    return value.replace(/\\/g, '');
  }

  formatMultiline(value: string): string {
    return value.replace(/[\n\r]/g, '<br>');
  }

  formatDate(date: Date): string {
    const options = {weekday:'long', month:'long', day:'numeric'};
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

  // CitySpark returns dates in GMT notation, but they are really local time
  convertCitySparkDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString.replace('Z', ''));
    } else {
      return null;
    }
  }

  formatDateForGoogleCalendarLink(date: Date): string {
    // YYYYMMDDTHHMMSSZ
    let formattedDate: string = '';
    if (date) {
      date = this.addMinutes(date, -this.utcOffset);
      formattedDate += date.getFullYear();
      formattedDate += this.formatNumberAsTwoDigitString(date.getMonth() + 1);
      formattedDate += this.formatNumberAsTwoDigitString(date.getDate());
      formattedDate += 'T';
      formattedDate += this.formatNumberAsTwoDigitString(date.getHours());
      formattedDate += this.formatNumberAsTwoDigitString(date.getMinutes());
      formattedDate += this.formatNumberAsTwoDigitString(date.getSeconds());
      formattedDate += 'Z';
    }
    return formattedDate;
  }

  addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + (minutes * 60000));
  }

  formatNumberAsTwoDigitString(val: number): string {
    if (val < 10) {
      return '0' + val.toString();
    } else {
      return val.toString();
    }
  }

  formatGoogleCalendarLink(): string {
    let link: string = '';
    link += 'https://www.google.com/calendar/render';
    link += '?';
    link += 'action=TEMPLATE';
    link += '&';
    link += 'text=' + encodeURIComponent(this.replaceNull(this.event.Name));
    link += '&';
    link += 'details=' + encodeURIComponent(this.replaceNull(this.formatMultiline(this.cleanText(this.event.Description))).substring(0, 1800));
    link += '&';
    link += 'location=' + encodeURIComponent(this.formatLocationforGoogleCalendarLink());
    link += '&';
    link += 'dates=' + this.formatDateForGoogleCalendarLink(this.convertCitySparkDate(this.event.DateStart));
    link += encodeURIComponent('/');
    if (this.event.DateEnd) {
      link += this.formatDateForGoogleCalendarLink(this.convertCitySparkDate(this.event.DateEnd));
    } else {
      link += this.formatDateForGoogleCalendarLink(this.addMinutes(this.convertCitySparkDate(this.event.DateStart), 60));
    }
    return link;
  }

  formatLocationforGoogleCalendarLink(): string {
    let locationText: string = '';
    if (this.event.Venue) {
      locationText += this.event.Venue;
      if (this.event.Address) {
        locationText += ', ' + this.event.Address;
        if (this.event.CityState) {
          locationText += ', ' + this.event.CityState;
          if (this.event.Zip) {
            locationText += ' ' + this.event.Zip;
          }
        }
      } else {
        if (this.event.CityState) {
          locationText += ', ' + this.event.CityState;
          if (this.event.Zip) {
            locationText += ' ' + this.event.Zip;
          }
        }  
      }
    }
    return locationText;
  }

}
