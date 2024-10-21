import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { AuthorModel } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl: string = AppComponent.baseUrl + 'api/authors';

  constructor(private http: HttpClient) { }

  getAll(): Observable<AuthorModel[]> {
    return this.http.get<AuthorModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<AuthorModel> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new AuthorModel(), data)));
  }

  getByName(name: string): Observable<AuthorModel> {
    let getUrl = `${this.apiUrl}/name/${name}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new AuthorModel(), data)));
  }

  add(author: AuthorModel): Observable<AuthorModel> {
    return this.http.post<AuthorModel>(this.apiUrl, author, AppComponent.httpOptions);
  }

  update(author: AuthorModel): Observable<AuthorModel> {
    let putUrl = `${this.apiUrl}/${author.id}`;
    return this.http.put<AuthorModel>(putUrl, author, AppComponent.httpOptions);
  }

  delete(id: number): Observable<any> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(deleteUrl);
  }
}
