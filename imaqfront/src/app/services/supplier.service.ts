import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';
import { Observable } from 'rxjs';
import { SupplierEditDTO, SupplierNewDTO } from '../models/Supplier';

@Injectable()
export class SupplierService {

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/suppliers'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  add(supplier: SupplierNewDTO): Observable<ApiResult> {
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/new`, supplier, this.CONFIG_CREDS);
  };

  getAll(eliminados: boolean): Observable<ApiResult> {
    let params = new HttpParams();

    params = params.append('deleted', eliminados)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/`, options);
  }

  getById(id: number): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/readbyid?id=${id}`, this.CONFIG_CREDS);
  }

  editSupplier(user: SupplierEditDTO): Observable<ApiResult> {
    return this.httpc.put<ApiResult>(`${this.API_URL}${this.RESOURCE}/edit`, user, this.CONFIG_CREDS);
  }

  deleteSupplier(id: number): Observable<ApiResult> {
    return this.httpc.delete<ApiResult>(`${this.API_URL}${this.RESOURCE}/${id}`, this.CONFIG_CREDS)
  }
}
