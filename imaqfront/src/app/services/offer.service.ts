import { Injectable } from '@angular/core';
import { OfferDetailNewFrontDTO, OfferEditDTO, OfferNewDTO } from '../models/Offer';
import { ApiResult } from '../models/ApiResult';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class OfferService {
  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/offers'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  addOffer(offer: OfferNewDTO, details: OfferDetailNewFrontDTO[]): Observable<ApiResult> {
    const body = {
      offer: offer,
      details: details
    }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/new`, body, this.CONFIG_CREDS);
  };

  getAll(vigentes: boolean): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('vigentes', vigentes)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/`, options);
  };

  getAvailable(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/available`, this.CONFIG_CREDS);
  };

  getById(id: number): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/readbyid?id=${id}`, this.CONFIG_CREDS);
  };

  getByIdShort(id: number): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('id', id)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/readshortbyid`, options);
  };

  cancelOffer(id: number): Observable<ApiResult> {
    const body = { idOferta: id }
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/cancel`, body, this.CONFIG_CREDS);
  };

  getDetails(id: number): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('id', id)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/details`, options);
  };

  getDetailsShort(id: number): Observable<ApiResult> {
    let params = new HttpParams();
    params = params.append('id', id)
    let options = { params: params }
    options = { ...options, ...this.CONFIG_CREDS };
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/shortdetails`, options);
  };

  markSold(id: number): Observable<ApiResult> {
    const body = { idOferta: id };
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/markSold`, body, this.CONFIG_CREDS);
  };
  editOffer(offer: OfferEditDTO): Observable<ApiResult> {
    return this.httpc.put<ApiResult>(`${this.API_URL}${this.RESOURCE}/edit`, offer, this.CONFIG_CREDS);
  };
}