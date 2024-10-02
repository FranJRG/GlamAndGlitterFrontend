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
  url:string = "http://localhost:8080/services";
  urlCategory:string = "http://localhost:8080/categories"
  urlRandom:string = "http://localhost:8080/randomServices";
  urlServicesCategory:string = "http://localhost:8080/servicesByCategory";


  /**
   * Método para obtener todos los servicios
   * @returns 
   */
  getServices():Observable<Services[]>{
    return this.http.get<Services[]>(this.url);
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
}
