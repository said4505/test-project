import {Injectable} from '@angular/core';
import {map} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import moment from "moment/moment";
import {ApiResponse} from "../models/api-response";

@Injectable()
export class HumidityService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getHumidityData(date: Date) {

    let params = new HttpParams()
      .append('latitude', '52.52')
      .append('longitude', '13.41')
      .append('hourly', 'relative_humidity_2m')
      .append('start_date', moment(date).startOf('day').format('YYYY-MM-DD'))
      .append('end_date', moment(date).endOf('day').format('YYYY-MM-DD'));

    return this.http.get<ApiResponse>(this.baseUrl, {params}).pipe(map((res => {
      return {
        temperatures: res.hourly.relative_humidity_2m ?? [],
        time: res.hourly.time ?? []
      }
    })))
  }
}
