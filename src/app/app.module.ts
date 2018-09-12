import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { MaterialComponentsModule } from './material-components.module';
import { RoutingModule } from './routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EventDetailDialogComponent } from './event-detail-dialog/event-detail-dialog.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ConfigurationComponent,
    EventDetailDialogComponent,
    AlertDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialComponentsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google.mapsJavascriptApi.key,
      libraries: ['places']
    }),
    RoutingModule
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EventDetailDialogComponent,
    AlertDialogComponent
  ]
})
export class AppModule { }
