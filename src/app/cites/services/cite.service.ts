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

  private url:string = "https://glamandglitter.onrender.com";

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
  addCite(cite:Omit<Cite, "id" | "username">):Observable<Cite>{
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
  getWorkers(id:number):Observable<User[]>{
    return this.http.get<User[]>(`${this.url}/workers/${id}`);
  }

  /**
   * Método para actualizar una cita
   * @param id 
   * @param cite 
   * @returns 
   */
  updateCite(id:number, cite:Omit<Cite, "id" | "username">):Observable<Cite>{
    return this.http.put<Cite>(`${this.url}/modifyCite/${id}`,cite);
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
