export interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom?: number;
  address?: string;
  placeID?: string;
  utcOffset?: number;
}

export interface PlaceDetailResponse {
  html_attributions: any[];
  result:            PlaceDetail;
  status:            string;
}

export interface PlaceDetail {
  utc_offset: number;
}
