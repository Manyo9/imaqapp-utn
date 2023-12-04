import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';
import { MachineNewDTO, MachineEditDTO } from '../models/Machine';

@Injectable()
export class MachineService {

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/machines'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  addMachine(machine: MachineNewDTO): Observable<ApiResult> {
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/new`, machine, this.CONFIG_CREDS);
  };

  getAll(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/`, this.CONFIG_CREDS);
  };

  getAvaiable(startdate: Date, enddate: Date): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/available?startdate=${startdate}&enddate=${enddate}`
      , this.CONFIG_CREDS);
  };

  getById(id: number): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/readbyid?id=${id}`, this.CONFIG_CREDS);
  };

  editMachine(machine: MachineEditDTO): Observable<ApiResult> {
    return this.httpc.put<ApiResult>(`${this.API_URL}${this.RESOURCE}/edit`, machine, this.CONFIG_CREDS);
  };

  deleteMachine(id: number): Observable<ApiResult> {
    return this.httpc.delete<ApiResult>(`${this.API_URL}${this.RESOURCE}/${id}`, this.CONFIG_CREDS)
  };
}
