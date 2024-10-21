import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { StatisticModel } from '../models/statistic.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private apiUrl = AppComponent.baseUrl + 'api/statistic';

  constructor(private http: HttpClient) { }

  getReport(): Observable<StatisticModel> {
    return this.http.get<StatisticModel>(this.apiUrl);
  }
}
