import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cite } from '../../interfaces/cite';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CiteService {

  constructor(private http:HttpClient) { }

  private url:string = "http://localhost:8080";

  getPendingCites():Observable<Cite[]>{
    return this.http.get<Cite[]>(`${this.url}/pendingCites`);
  }

  getUserCites(id:number):Observable<Cite[]>{
    return this.http.get<Cite[]>(`${this.url}/myCites/${id}`);
  }

  addCite(cite:Omit<Cite, "id">):Observable<Cite>{
    return this.http.post<Cite>(`${this.url}/addCite`, cite);
  }

  setWorker(idCite:number, idWorker?:number):Observable<User>{
    const params = new HttpParams()
    .set("idCite",idCite)
    .set("idWorker", idWorker ? idWorker.toString() : '');

    return this.http.post<any>(`${this.url}/setWorker`,null,{params})
  }

}
