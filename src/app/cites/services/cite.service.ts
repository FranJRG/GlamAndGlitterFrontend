import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cite } from '../../interfaces/cite';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { Services } from '../../interfaces/services';
import { Rating } from '../../interfaces/rating';

@Injectable({
  providedIn: 'root'
})
export class CiteService {

  constructor(private http:HttpClient) { }

  private url:string = "http://localhost:8080";

  /**
   * Método para obtener una cita por su id
   * @param id 
   * @returns 
   */
  getCite(id:number):Observable<Cite>{
    return this.http.get<Cite>(`${this.url}/cite/${id}`);
  }

  /**
   * Método para obtener las citas pendientes
   * @returns 
   */
  getPendingCites():Observable<Cite[]>{
    return this.http.get<Cite[]>(`${this.url}/cites`);
  }

  /**
   * Método para obtener las citas de un usuario
   * @param id 
   * @returns 
   */
  getUserCites(id:number):Observable<Cite[]>{
    return this.http.get<Cite[]>(`${this.url}/myCites/${id}`);
  }

  /**
   * Método para añadir una cita
   * @param cite 
   * @returns 
   */
  addCite(cite:Omit<Cite, "id" | "username" | 'idWorker'>):Observable<Cite>{
    return this.http.post<Cite>(`${this.url}/addCite`, cite);
  }

  /**
   * Método para establecer un trabajador a una cita 
   * @param idCite 
   * @param idWorker 
   * @returns 
   */
  setWorker(idCite:number, idWorker?:number):Observable<User>{
    const params = new HttpParams()
    .set("idCite",idCite)
    .set("idWorker", idWorker ? idWorker.toString() : '');

    return this.http.post<any>(`${this.url}/setWorker`,null,{params})
  }

  /**
   * Método para obtener trabajadores por un id
   * @param id 
   * @returns 
   */
  getWorkers(id:number,dateFilter?:string,timeFilter?:string):Observable<User[]>{
    const params = new HttpParams().set("dateFilter",dateFilter as string).set("timeFilter",timeFilter as string)
    return this.http.get<User[]>(`${this.url}/workers/${id}`,{params});
  }

  /**
   * Método para obtener las valoraciones de un servicio
   */
  getRatingService(id:number):Observable<Rating[]>{
    return this.http.get<Rating[]>(`${this.url}/ratings/${id}`);
  }

  /**
   * Método para actualizar una cita
   * @param id 
   * @param cite 
   * @returns 
   */
  updateCite(id:number, cite:Omit<Cite, "id" | "username" | 'idWorker'>,idWorker?:string):Observable<Cite>{
    const params = new HttpParams().set("idWorker",idWorker as string);
    return this.http.put<Cite>(`${this.url}/modifyCite/${id}`,cite, {params});
  }

  /**
   * Método para cancelar una cita
   * @param id 
   * @returns 
   */
  deleteCite(id:number):Observable<Cite>{
    return this.http.delete<Cite>(`${this.url}/cancelCite/${id}`);
  }

}