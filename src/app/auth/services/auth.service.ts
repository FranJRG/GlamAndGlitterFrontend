import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginResponse, User } from '../../interfaces/user';
import { Router } from '@angular/router';

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

  url:string = "http://localhost:8080/users/";
  urlLogin:string = "http://localhost:8080/signin";

  registerUser(user:Omit<User, "id" | "role" | "notifications">):Observable<User>{
    return this.http.post<User>(`${this.url}`, user);
  }

  storage(resp:LoginResponse){
    localStorage.setItem('token',resp.token)
    this._user = resp.user;
  }

  login(email:string, password:string):Observable<Boolean | null>{
    return this.http.post<LoginResponse>(this.urlLogin, {email,password}).pipe(
      tap(resp =>{
        this.storage(resp)
      }),
      map(resp => true),
      catchError(err => of(err.error.msg))
    )
  }

  existToken():boolean {
    const token = localStorage ? localStorage.getItem("token") : null;
    if(token){
      return true
    }
    return false
  }

  logout(){
    localStorage.removeItem("token");
    this.router.navigateByUrl("/auth/login");
  }

}
