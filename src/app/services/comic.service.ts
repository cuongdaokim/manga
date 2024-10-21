import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { ComicModel } from '../models/comic.model';

@Injectable({
  providedIn: 'root'
})
export class ComicService {
  private apiUrl: string = AppComponent.baseUrl + 'api/comics';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ComicModel[]> {
    return this.http.get<ComicModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<ComicModel> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new ComicModel(), data)));
  }

  getAllOrderByTime(): Observable<ComicModel[]> {
    let getUrl = `${this.apiUrl}/new`;
    return this.http.get<ComicModel[]>(getUrl);
  }

  getAllPublishedOrderByTime(): Observable<ComicModel[]> {
    let getUrl = `${this.apiUrl}/published`;
    return this.http.get<ComicModel[]>(getUrl);
  }

  getByTitleOrderByTime(keyword: string): Observable<ComicModel[]> {
    let getUrl = `${this.apiUrl}/published/${keyword}`;
    return this.http.get<ComicModel[]>(getUrl);
  }

  getByGenreIdOrderByTime(genreId: number): Observable<ComicModel[]> {
    let getUrl = `${this.apiUrl}/genre/${genreId}`;
    return this.http.get<ComicModel[]>(getUrl);
  }

  getByUserIdOrderByTime(userId: number): Observable<ComicModel[]> {
    let getUrl = `${this.apiUrl}/user/${userId}`;
    return this.http.get<ComicModel[]>(getUrl);
  }

  add(comic: ComicModel): Observable<ComicModel> {
    return this.http.post<ComicModel>(this.apiUrl, comic, AppComponent.httpOptions);
  }

  update(comic: ComicModel): Observable<ComicModel> {
    let putUrl = `${this.apiUrl}/${comic.id}`;
    return this.http.put<ComicModel>(putUrl, comic, AppComponent.httpOptions);
  }

  delete(id: number): Observable<any> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(deleteUrl);
  }
}
