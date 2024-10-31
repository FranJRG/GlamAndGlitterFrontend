import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  token: string | null = null;

  constructor() {
    this.initializeGoogleAuth();
  }

  initializeGoogleAuth() {
    google.accounts.id.initialize({
      client_id: '127291825317-utahcd35t25ihrj5nl4at620cp1l8d6r.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });
    google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    console.log(response);
    this.token = response.credential;
    localStorage.setItem('googleAccessToken', this.token as string);
    console.log("Token JWT de usuario:", this.token);
  }

  signOut() {
    google.accounts.id.disableAutoSelect(); // Esto evita el inicio automático de sesión la próxima vez
    localStorage.removeItem('googleAccessToken');
    this.token = null;
    console.log("Sesión cerrada");
  }

}
