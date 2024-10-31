import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  token: string | null = localStorage.getItem("googleAccessToken") != null ? localStorage.getItem("googleAccessToken") : null;
  private clientId = "127291825317-utahcd35t25ihrj5nl4at620cp1l8d6r.apps.googleusercontent.com";
  private apiUrl = 'https://www.googleapis.com/calendar/v3';
  private scopes = 'https://www.googleapis.com/auth/calendar';

  constructor(private http: HttpClient) {
  }

  // Inicializa la autenticación de Google y el prompt
  initializeGoogleAuth() {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.prompt();  // Muestra el prompt para inicio de sesión
  }

  // Manejador de respuesta para credenciales
  handleCredentialResponse(response: any) {
    if (response && response.credential) {
      this.token = response.credential;
      localStorage.setItem('googleAccessToken', this.token as any);
      console.log("Token JWT obtenido:", this.token);
    } else {
      console.error("Error al obtener el token.");
    }
  }

  // Cierra sesión y elimina el token almacenado
  signOut() {
    google.accounts.id.disableAutoSelect();
    localStorage.removeItem('googleAccessToken');
    this.token = null;
    console.log("Sesión cerrada.");
  }

  // Método para obtener eventos del calendario
  getCalendarEvents(): Observable<any> {
    if (!this.token) {
      throw new Error("El usuario no está autenticado.");
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${this.apiUrl}/calendars/primary/events`, { headers });
  }

  // Método para crear un nuevo evento en Google Calendar
  createCalendarEvent(event: any): Observable<any> {
    console.log(this.token);
    if (!this.token) {
      throw new Error("El usuario no está autenticado.");
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/calendars/primary/events`, event, { headers });
  }
}
