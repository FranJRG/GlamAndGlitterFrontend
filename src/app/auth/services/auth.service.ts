import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginResponse, User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,
    private router:Router
  ) { }

  private _user!:User;

  get user():User{
    return { ...this._user } 
  }

  /**
   * Urls para enviar peticiones a la API
   */
  url:string = "http://localhost:8080/users";
  urlLogin:string = "http://localhost:8080/signin";

  /**
   * Método para registrar un usuario
   * @param user 
   * @returns 
   */
  registerUser(user:Omit<User, 'id' | 'role' | 'emailNotifications' | 'smsNotifications' | 'calendarNotifications'>):Observable<User>{
    return this.http.post<User>(this.url, user);
  }

  /**
   * En este método almacenaremos el token en el localStorage
   * @param resp 
   */
  storage(resp:LoginResponse){
    localStorage.setItem('token',resp.token)
    this._user = resp.user;
  }

  /**
   * Método para loguearnos
   * Si el login es válido almacenaremos el token de respuesta en el localStorage
   * En caso de error mandaremos un mensaje
   * @param email 
   * @param password 
   * @returns 
   */
  login(email:string, password:string):Observable<Boolean | null>{
    return this.http.post<LoginResponse>(this.urlLogin, {email,password}).pipe(
      tap(resp =>{
        this.storage(resp)
      }),
      map(resp => true),
      catchError(err => of(err.error.msg))
    )
  }

  /**
   * Comprobamos si hay token en el localStorage para saber si el usuario esta logueado en la app
   * @returns 
   */
  existToken():boolean {
    const token = localStorage ? localStorage.getItem("token") : null;
    if(token){
      return true
    }
    return false
  }

  getName(): string {
    const token = localStorage ? localStorage.getItem("token") : null;
    return token ? (jwtDecode(token) as any).name : ''; 
  }

  getUserId(): number {
    const token = localStorage ? localStorage.getItem("token") : null; 
    return token ? (jwtDecode(token) as any).userId : '';
  }

  getRole(): string {
    const token = localStorage ? localStorage.getItem("token") : null; 
    return token ? (jwtDecode(token) as any).role : '';
  }

  /**
   * Método para hacer logout de la app
   * Eliminamos el token del localStorage y redirigimos al login
   */
  logout(){
    localStorage.removeItem("token");
    this.router.navigateByUrl("/auth/login");
  }

}
