import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConfigurationComponent } from './configuration/configuration.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: HomeComponent },
  { path: 'configuration', component: ConfigurationComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RoutingModule {
}