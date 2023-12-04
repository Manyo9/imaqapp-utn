import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';
import { Observable } from 'rxjs';

@Injectable()
export class TypeService{

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/types'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  getBudgetTypes(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/budget`, this.CONFIG_CREDS);
  }

  getMachineTypes(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/machine`, this.CONFIG_CREDS);
  }

  getProductTypes(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/product`, this.CONFIG_CREDS);
  }

  getRequestTypes(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/request`, this.CONFIG_CREDS);
  }

  getServiceTypes(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/service`, this.CONFIG_CREDS);
  }

  getRequestStatuses(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/requestStatuses`, this.CONFIG_CREDS);
  }
}
