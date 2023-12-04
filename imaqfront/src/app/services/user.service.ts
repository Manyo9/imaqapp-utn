import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { UserEditDTO, UserLoginDTO, UserNewDTO } from '../models/User';
import { Observable } from 'rxjs';
import { ApiResult } from '../models/ApiResult';

@Injectable()
export class UserService {

  private API_URL: string = environment.apiurl;
  private RESOURCE: string = '/users'
  private CONFIG_CREDS = { withCredentials: true };
  constructor(private httpc: HttpClient) { }

  addManager(user: UserNewDTO): Observable<ApiResult> {
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/newManager`, user, this.CONFIG_CREDS);
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

  editUser(user: UserEditDTO): Observable<ApiResult> {
    return this.httpc.put<ApiResult>(`${this.API_URL}${this.RESOURCE}/edit`, user, this.CONFIG_CREDS);
  }

  deleteUser(id: number): Observable<ApiResult> {
    return this.httpc.delete<ApiResult>(`${this.API_URL}${this.RESOURCE}/${id}`, this.CONFIG_CREDS)
  }

  changePasswordById(idUsuario: number, oldPassword: string, newPassword: string) {
    const body = { idUsuario: idUsuario, oldPassword: oldPassword, newPassword: newPassword }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const requestOptions = { ...headers, ...this.CONFIG_CREDS}
    return this.httpc.post<ApiResult>(
      `${this.API_URL}${this.RESOURCE}/changePasswordInternal`,
      body, requestOptions);
  }

  
  changePasswordSelf(oldPassword: string, newPassword: string) {
    const body = { oldPassword: oldPassword, newPassword: newPassword }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const requestOptions = { ...headers, ...this.CONFIG_CREDS}
    return this.httpc.post<ApiResult>(
      `${this.API_URL}${this.RESOURCE}/changePasswordSelf`,
      body, requestOptions);
  }

  login(user: UserLoginDTO): Observable<ApiResult> {
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/login`, user, this.CONFIG_CREDS)
  }

  logout(): Observable<ApiResult> {
    return this.httpc.post<ApiResult>(`${this.API_URL}${this.RESOURCE}/logout`, {}, this.CONFIG_CREDS)
  }

  myProfile(): Observable<ApiResult> {
    return this.httpc.get<ApiResult>(`${this.API_URL}${this.RESOURCE}/whoami`, this.CONFIG_CREDS)
  }
}
