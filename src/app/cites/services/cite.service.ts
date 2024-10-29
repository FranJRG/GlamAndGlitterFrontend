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

  getCite(id:number):Observable<Cite>{
    return this.http.get<Cite>(`${this.url}/cite/${id}`);
  }

  getPendingCites():Observable<Cite[]>{
    return this.http.get<Cite[]>(`${this.url}/cites`);
  }

  getUserCites(id:number):Observable<Cite[]>{
    return this.http.get<Cite[]>(`${this.url}/myCites/${id}`);
  }

  addCite(cite:Omit<Cite, "id" | "username">):Observable<Cite>{
    return this.http.post<Cite>(`${this.url}/addCite`, cite);
  }

  setWorker(idCite:number, idWorker?:number):Observable<User>{
    const params = new HttpParams()
    .set("idCite",idCite)
    .set("idWorker", idWorker ? idWorker.toString() : '');

    return this.http.post<any>(`${this.url}/setWorker`,null,{params})
  }

  getWorkers(id:number):Observable<User[]>{
    return this.http.get<User[]>(`${this.url}/workers/${id}`);
  }

  updateCite(id:number, cite:Omit<Cite, "id" | "username">):Observable<Cite>{
    return this.http.put<Cite>(`${this.url}/modifyCite/${id}`,cite);
  }

  deleteCite(id:number):Observable<Cite>{
    return this.http.delete<Cite>(`${this.url}/cancelCite/${id}`);
  }

}
