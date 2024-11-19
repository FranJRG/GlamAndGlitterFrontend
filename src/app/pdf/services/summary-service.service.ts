import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceSummary } from '../../interfaces/serviceSummary';
import { SummaryCites } from '../../interfaces/summaryCites';
import { AverageMedia } from '../../interfaces/averageMedia';
import { Rating } from '../../interfaces/rating';

@Injectable({
  providedIn: 'root'
})
export class SummaryServiceService {

  constructor(private http:HttpClient) { }

  url:string = "https://glamandglitter.onrender.com"

  getTopServices():Observable<ServiceSummary[]>{
    return this.http.get<ServiceSummary[]>(`${this.url}/servicesSummary`);
  }

  getCitesInLathMonth():Observable<SummaryCites[]>{
    return this.http.get<SummaryCites[]>(`${this.url}/lastCites`);
  }

  getAverageMediaLastMonth():Observable<AverageMedia>{
    return this.http.get<AverageMedia>(`${this.url}/punctuationLastMonth`);
  }

  getTotalMedia():Observable<AverageMedia>{
    return this.http.get<AverageMedia>(`${this.url}/punctuation`);
  }

  getBestRatings():Observable<Rating[]>{
    return this.http.get<Rating[]>(`${this.url}/bestPunctuation`);
  }

  getWorstRatings():Observable<Rating[]>{
    return this.http.get<Rating[]>(`${this.url}/worstPunctuation`);
  }

}