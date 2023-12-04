import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';
import { RequestNewDTO } from '../models/Request';

@Injectable()
export class RequestService {

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/requests'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  getAll(page: number, idestado: number, idtipo: number, razonsocial: string): Observable<ApiResult> {
    let params = new HttpParams();

    params = params.append('page', page);
    params = params.append('idestado', idestado);
    params = params.append('idtipo', idtipo);
    params = params.append('razonsocial', razonsocial);
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/`, options);
  };

  getByToken(token: string): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('token', token);
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/readbytoken`, options);
  };

  cancelByToken(token: string): Observable<ApiResult> {
    const body = { token: token }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/cancelbytoken`, body, this.CONFIG_CREDS);
  };

  addPurchaseRequest(request: RequestNewDTO, idOferta: number): Observable<ApiResult> {
    const body = {
      request: request,
      idOferta: idOferta
    }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/purchases/new`, body, this.CONFIG_CREDS);
  };

  getPurchaseRequest(idSolicitud: number){
    let params = new HttpParams();
    params = params.append('id', idSolicitud);
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/purchases`, options);
  }

  getSparePartRequest(idSolicitud: number){
    let params = new HttpParams();
    params = params.append('id', idSolicitud);
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/spareparts`, options);
  }

  getServiceRequest(idSolicitud: number){
    let params = new HttpParams();
    params = params.append('id', idSolicitud);
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/services`, options);
  }

  getRentalRequest(idSolicitud: number){
    let params = new HttpParams();
    params = params.append('id', idSolicitud);
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/rentals`, options);
  }

  updateStatus(idSolicitud: number, idEstadoSolicitud: number){
    const body = {
      idSolicitud: idSolicitud,
      idEstadoSolicitud: idEstadoSolicitud
    }
    return this.httpc.put<ApiResult>(`${this.API_URL}${this.RESOURCE}/updateStatus`, body, this.CONFIG_CREDS);
  }
}
