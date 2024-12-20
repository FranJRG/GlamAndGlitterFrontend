import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Services } from '../interfaces/services';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }
  urlBasic:string = "https://glamandglitter.onrender.com";
  url:string = "https://glamandglitter.onrender.com/services";
  urlCategory:string = "https://glamandglitter.onrender.com/categories"
  urlRandom:string = "https://glamandglitter.onrender.com/randomServices";
  urlServicesCategory:string = "https://glamandglitter.onrender.com/servicesByCategory";


  /**
   * Método para obtener todos los servicios
   * @returns 
   */
  getServices():Observable<Services[]>{
    return this.http.get<Services[]>(this.url);
  }

  /**
   * Método para obtener todos los servicios
   * @returns 
   */
  getServicesActive():Observable<Services[]>{
    return this.http.get<Services[]>(`${this.urlBasic}/gridServices`);
  }

    /**
   * Método para obtener un servicio por su id
   * @returns 
   */
  getService(id:number):Observable<Services>{
    return this.http.get<Services>(`${this.url}/${id}`);
  }

  /**
   * Método para obtener servicios de forma aleatoria
   * @returns 
   */
  getRandomServices():Observable<Services[]>{
    return this.http.get<Services[]>(this.urlRandom);
  }

  /**
   * Método para obtener los servicios de una categoría
   */
  getServicesByCategory(idCategory:string):Observable<Services[]>{
    return this.http.get<Services[]>(`${this.urlServicesCategory}/${idCategory}`);
  }

  /**
   * Método para obtener todas las categorías
   * @returns 
   */
  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(this.urlCategory);
  }

  disabledService(id:number):Observable<Services>{
    return this.http.put<Services>(`${this.urlBasic}/disabledService/${id}`,null);
  }
}