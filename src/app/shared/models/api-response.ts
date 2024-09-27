export interface ApiResponse {
  elevation: number;
  generationtime_ms: number;
  hourly: {
    temperature_2m?: Array<number>;
    relative_humidity_2m?: Array<number>;
    time?: Array<string>;
  };
  hourly_units: {
    time: string;
    relative_humidity_2m: string;
  }
  latitude: number;
  longitude: number;
  timezone?: string;
  timezone_abbreviation?: string;
  utc_offset_seconds?: number;
}
