import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  url:string = "http://localhost:8080";

  forgotPassword(email:string):Observable<any>{
    const params = new HttpParams().set("email",email);
    return this.http.post<any>(`${this.url}/forgotPassword`,null,{params});
  }

  verifyCode(email:string,code:string):Observable<any>{
    const params = new HttpParams().set("email",email).set("codeToCheck",code);
    return this.http.post<any>(`${this.url}/verifyCode`,null,{params});
  }

  changePassword(email:string,password:string):Observable<any>{
    const params = new HttpParams().set("email",email).set("password",password);
    return this.http.post<any>(`${this.url}/changePassword`, null, {params});
  }

}
