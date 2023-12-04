import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiResult } from '../models/ApiResult';
import { ProductEditDTO, ProductNewDTO } from '../models/Product';

@Injectable()
export class ProductService {

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/products'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  addProduct(product: ProductNewDTO): Observable<ApiResult> {
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/new`, product, this.CONFIG_CREDS);
  };

  getAll(eliminados: boolean): Observable<ApiResult> {
    let params = new HttpParams();

    params = params.append('deleted', eliminados)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/`, options);
  };

  getOfferable(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/offerable`, this.CONFIG_CREDS);
  };

  getById(id: number): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/readbyid?id=${id}`, this.CONFIG_CREDS);
  };

  editProduct(product: ProductEditDTO): Observable<ApiResult> {
    return this.httpc.put<ApiResult>(`${this.API_URL}${this.RESOURCE}/edit`, product, this.CONFIG_CREDS);
  };

  deleteProduct(id: number): Observable<ApiResult> {
    return this.httpc.delete<ApiResult>(`${this.API_URL}${this.RESOURCE}/${id}`, this.CONFIG_CREDS)
  };
}
