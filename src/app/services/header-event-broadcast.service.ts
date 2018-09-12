import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HeaderEventBroadcastService {
  @Output() dataViewChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  // Permitted values for parameter view: list | map
  emitDataViewChange(view: string): void {
    this.dataViewChange.emit(view);
  }

}
