export enum ApplicationEventCategory {
  initialization = 'INITIALIZATION',
  error = 'ERROR'
}

export interface ApplicationEvent {
  date: Date,
  category: ApplicationEventCategory,
  function: string,
  message: string
}
