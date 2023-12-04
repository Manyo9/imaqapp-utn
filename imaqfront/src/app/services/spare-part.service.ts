import { Injectable } from '@angular/core';
import { SparePartDetailNewFrontDTO } from '../models/SparePart';
import { RequestNewFrontDTO } from '../models/Request';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';

@Injectable()
export class SparePartService {

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/requests/spareparts'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  addSparePartRequest(request: RequestNewFrontDTO, details: SparePartDetailNewFrontDTO[]): Observable<ApiResult> {
    const body = {
      request: request,
      details: details
    }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/new`, body, this.CONFIG_CREDS);
  };
}
