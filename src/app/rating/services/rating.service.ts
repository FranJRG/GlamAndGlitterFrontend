import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rating } from '../../interfaces/rating';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  url:string = "https://glamandglitter.onrender.com";

  constructor(private http:HttpClient) { }

  addRating(rating:Omit<Rating, "username">):Observable<Rating>{
    return this.http.post<Rating>(`${this.url}/addRating`, rating);
  }
}