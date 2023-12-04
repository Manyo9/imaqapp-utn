import { Injectable } from '@angular/core';
import { RequestNewFrontDTO } from '../models/Request';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';
import { Observable } from 'rxjs';
import { RentalDetailNewFrontDTO, RentalNewFrontDTO } from '../models/Rental';

@Injectable()
export class RentalService {
  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/requests/rentals'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  addRental(request: RequestNewFrontDTO, rental: RentalNewFrontDTO, details: RentalDetailNewFrontDTO[]): Observable<ApiResult> {
    const body = {
      request: request,
      rental: rental,
      details: details
    }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/new`, body, this.CONFIG_CREDS);
  };

  getRentable(startDate: string, endDate: string): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('startdate', startDate)
    params = params.append('enddate', endDate)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}/machines/available`, options);
  };
}
