import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { CommentModel } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl: string = AppComponent.baseUrl + 'api/comments';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<CommentModel> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new CommentModel(), data)));
  }

  getByChapterId(chapterId: number): Observable<CommentModel[]> {
    let getUrl = `${this.apiUrl}/list/${chapterId}`;
    return this.http.get<CommentModel[]>(getUrl);
  }

  getByComicId(comicId: number): Observable<CommentModel[]> {
    let getUrl = `${this.apiUrl}/comic/${comicId}`;
    return this.http.get<CommentModel[]>(getUrl);
  }

  add(comment: CommentModel): Observable<CommentModel> {
    return this.http.post<CommentModel>(this.apiUrl, comment, AppComponent.httpOptions);
  }

  update(comment: CommentModel): Observable<CommentModel> {
    let putUrl = `${this.apiUrl}/${comment.id}`;
    return this.http.put<CommentModel>(putUrl, comment, AppComponent.httpOptions);
  }

  delete(id: number): Observable<any> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(deleteUrl);
  }
}
