export enum ApplicationEventCategory {
  initialization = 'INITIALIZATION',
  error = 'ERROR',
  userAction = 'USER_ACTION'
}

export interface ApplicationEvent {
  date: Date,
  category: ApplicationEventCategory,
  function: string,
  message: string
}
