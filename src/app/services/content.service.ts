import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { ContentModel } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl: string = AppComponent.baseUrl + 'api/contents';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ContentModel[]> {
    return this.http.get<ContentModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<ContentModel> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new ContentModel(), data)));
  }

  getByChapterId(chapterId: number): Observable<ContentModel[]> {
    let getUrl = `${this.apiUrl}/list/${chapterId}`;
    return this.http.get<ContentModel[]>(getUrl);
  }

  add(content: ContentModel): Observable<ContentModel> {
    return this.http.post<ContentModel>(this.apiUrl, content, AppComponent.httpOptions);
  }

  addList(contents: ContentModel[], chapterId: number): Observable<ContentModel[]> {
    let postUrl = `${this.apiUrl}/list/${chapterId}`;
    return this.http.post<ContentModel[]>(postUrl, contents, AppComponent.httpOptions);
  }

  update(content: ContentModel): Observable<ContentModel> {
    let putUrl = `${this.apiUrl}/${content.id}`;
    return this.http.put<ContentModel>(putUrl, content, AppComponent.httpOptions);
  }

  delete(id: number): Observable<any> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(deleteUrl);
  }
}
