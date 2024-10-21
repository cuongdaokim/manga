import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { GenreModel } from '../models/genre.model';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private apiUrl: string = AppComponent.baseUrl + 'api/genres';

  constructor(private http: HttpClient) { }

  getAll(): Observable<GenreModel[]> {
    return this.http.get<GenreModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<GenreModel> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new GenreModel(), data)));
  }

  add(genre: GenreModel): Observable<GenreModel> {
    return this.http.post<GenreModel>(this.apiUrl, genre);
  }

  update(genre: GenreModel): Observable<GenreModel> {
    let putUrl = `${this.apiUrl}/${genre.id}`;
    return this.http.put<GenreModel>(putUrl, genre, AppComponent.httpOptions);
  }

  delete(id: number): Observable<any> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(deleteUrl);
  }
}
