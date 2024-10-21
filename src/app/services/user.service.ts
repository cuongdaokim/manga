import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = AppComponent.baseUrl + 'api/users';

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<UserModel> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new UserModel(), data)));
  }

  add(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, user, AppComponent.httpOptions);
  }

  update(user: UserModel): Observable<UserModel> {
    let putUrl = `${this.apiUrl}/${user.id}`;
    return this.http.put<UserModel>(putUrl, user, AppComponent.httpOptions);
  }

  delete(id: number): Observable<any> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(deleteUrl);
  }

  login(user: UserModel) {
    let loginUrl = `${this.apiUrl}/login`;
    return this.http.post<UserModel>(loginUrl, user, AppComponent.httpOptions);
  }
}
