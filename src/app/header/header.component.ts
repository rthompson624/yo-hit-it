import { Component, OnInit } from '@angular/core';
import { HeaderEventBroadcastService } from '../services/header-event-broadcast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  listView: boolean = true;

  constructor(private headerEventBroadcastService: HeaderEventBroadcastService) {
  }

  ngOnInit() {
  }

  onClickListView(): void {
    this.listView = true;
    this.headerEventBroadcastService.emitDataViewChange('list');
  }

  onClickMapView(): void {
    this.listView = false;
    this.headerEventBroadcastService.emitDataViewChange('map');
  }
  
}
