import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';

@Injectable()
export class ReportService {
  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/reports'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  generateRequestReport(startDate: string, endDate: string): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('startdate', startDate)
    params = params.append('enddate', endDate)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/request`, options);
  }

  generateRequestByYear(year: number): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('year', year)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/requestByYear`, options);
  }

  generateSalesReport(startDate: string, endDate: string): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('startdate', startDate)
    params = params.append('enddate', endDate)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/sales`, options);
  }

  generateSalesByYear(year: number): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('year', year)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/salesByYear`, options);
  }

  generateCustomerReport(startDate: string, endDate: string): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('startdate', startDate)
    params = params.append('enddate', endDate)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/topCustomers`, options);
  }
}
