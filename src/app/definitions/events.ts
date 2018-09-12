export interface CategoryDefJSON {
  categories: Category[];
}

export interface Category {
  parent: number | null;
  id:     number;
  name:   string;
}

export interface EventCategoryGroup {
  disabled:         boolean;
  id:               number;
  name:             string;
  eventCategories?: EventCategory[];
}

export interface EventCategory {
  id:   string;
  name: string;
}

export interface EventsRequestBody {
  searchKeywords:    null;
  venueKeywords:     null;
  search:            string;
  longitude:         number;
  latitude:          number;
  distance:          number;
  limit:             number;
  categories:        number[];
  skip:              number;
  start:             string;
  end:               null;
  sortby:            string;
  sortdir:           string;
  onlySparked:       boolean;
  oneSort:           boolean;
  deals:             boolean;
  hier:              number[];
  possible:          boolean;
  ppid:              number;
  blockedCategories: number[];
  blockedKeywords:   string[];
  hoursOffset:       number;
  venue:             null;
  exact:             boolean;
  interest:          number;
  eventPIds:         null;
  defaultCat:        boolean;
  metric:            boolean;
  handPicked:        boolean;
  bhier:             number[];
  labels:            string[];
  searchLocation?:   string;
}

export interface CitySparkEvents {
  events:   CitySparkEvent[];
  possible: number;
}

export interface CitySparkEvent {
  field1:          null;
  PId:             number;
  Name:            string;
  Description:     string;
  Venue:           string;
  CityState:       string;
  PopularityIndex: number;
  Distance:        number;
  DateStart:       string;
  DateEnd:         null | string;
  Tags:            number[];
  BiasTags:        null;
  Price:           number | null;
  PriceHigh:       number | null;
  AllDay:          boolean;
  HasTime:         boolean;
  longitude:       number;
  latitude:        number;
  Sponsor:         Link | null;
  LightUp:         LightUp[];
  SmallImg:        string;
  MediumImg:       string;
  Images:          Image[];
  Links:           Link[];
  Media:           null;
  IsPromotion:     boolean;
  SubmitPID:       number | null;
  Address:         string;
  Zip:             null | string;
  Date:            string;
  Id:              string;
  Occurances:      null;
  Free:            boolean;
  ct:              CT | null;
  lm:              string;
  enhance:         boolean;
  Tickets:         Link[];
  Picked:          boolean;
  Labels:          any[];
  PriceText:       null | string;
  HighFullPrice:   null;
  LowFullPrice:    null;
}

export interface Image {
  id:  number;
  url: string;
}

export interface LightUp {
  id:    number;
  extId: string;
}

export interface Link {
  name: null | string;
  url:  string;
  sId:  number;
  revP: number;
}

export interface CT {
  name:  null | string;
  phone: null | string;
  email: string;
  org:   null | string;
}
