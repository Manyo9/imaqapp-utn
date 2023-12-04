import { Injectable } from '@angular/core';
import { InvoiceDetailNewFrontDTO, InvoiceNewDTO } from '../models/Invoice';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';

@Injectable()
export class InvoiceService {

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/invoices'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  addInvoice(invoice: InvoiceNewDTO, details: InvoiceDetailNewFrontDTO[], idSolicitud: number): Observable<ApiResult> {
    const body = {
      invoice: invoice,
      details: details,
      idSolicitud: idSolicitud
    }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/new`, body, this.CONFIG_CREDS);
  };

  fillForm(idSolicitud: number): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('id', idSolicitud)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/fill`, options);
  };

  getByToken(token: string): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('token', token)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/readbytoken`, options);
  };

  getById(id: number): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('id', id)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/readbyid`, options);
  };

  acceptBudget(token: string, accepted: string): Observable<ApiResult> {
    const body = {
      token: token,
      accepted: accepted
    }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/acceptBudget`, body, this.CONFIG_CREDS);
  };
}
