import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { ReviewModel } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl: string = AppComponent.baseUrl + 'api/reviews';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(this.apiUrl);
  }

  getByComicId(comicId: number): Observable<ReviewModel[]> {
    let getUrl = `${this.apiUrl}/comic/${comicId}`;
    return this.http.get<ReviewModel[]>(getUrl);
  }

  add(review: ReviewModel): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(this.apiUrl, review, AppComponent.httpOptions);
  }

  update(review: ReviewModel): Observable<ReviewModel> {
    let putUrl = `${this.apiUrl}/${review.user!.id}/${review.comic!.id}`;
    return this.http.put<ReviewModel>(putUrl, review, AppComponent.httpOptions);
  }

  delete(userId: number, comicId: number): Observable<any> {
    let deleteUrl = `${this.apiUrl}/${userId}/${comicId}`;
    return this.http.delete<any>(deleteUrl);
  }
}
