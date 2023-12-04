import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ServiceDetailNewFrontDTO, ServicesNewFrontDTO } from '../models/Service';
import { RequestNewFrontDTO } from '../models/Request';
import { ApiResult } from '../models/ApiResult';
import { Observable } from 'rxjs';

@Injectable()
export class ServiceService {

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/requests/services'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  addService(request: RequestNewFrontDTO, service: ServicesNewFrontDTO, details: ServiceDetailNewFrontDTO[]): Observable<ApiResult> {
    const body = {
      request: request,
      service: service,
      details: details
    }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/new`, body, this.CONFIG_CREDS);
  };
}
