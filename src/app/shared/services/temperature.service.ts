import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import moment from "moment";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";
import {ApiResponse} from "../models/api-response";

@Injectable()
export class TemperatureService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getTemperatureData(date: Date) {

    let params = new HttpParams()
      .append('latitude', '52.52')
      .append('longitude', '13.41')
      .append('hourly', 'temperature_2m')
      .append('start_date', moment(date).format('YYYY-MM-DD'))
      .append('end_date', moment(date).format('YYYY-MM-DD'));

    return this.http.get<ApiResponse>(this.baseUrl, {params})
      .pipe(map((res => {
        return {
          temperatures: res.hourly.temperature_2m ?? [],
          time: res.hourly.time ?? []
        }
      })))
  }
}
