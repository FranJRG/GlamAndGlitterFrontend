import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private clientId = "127291825317-utahcd35t25ihrj5nl4at620cp1l8d6r.apps.googleusercontent.com";
  private apiUrl = 'https://www.googleapis.com/calendar/v3';
  private scopes = 'https://www.googleapis.com/auth/calendar';
  private token:string | null = localStorage.getItem('googleAccessToken') != null ? localStorage.getItem('googleAccessToken') : "";

  constructor(private http: HttpClient) {}

  // Inicializa el cliente de token de Google Identity Services
  initializeTokenClient() {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: this.scopes,
      callback: (response: any) => {
        if (response && response.access_token) {
          this.token = response.access_token;
          localStorage.setItem('googleAccessToken', this.token as string);
        } else {
          Toastify({
            text: "Something go bad with access token",
            duration: 3000, 
            gravity: "bottom",
            position: 'center',
            backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
          }).showToast()
        }
      },
    });

    // Solicita el token de acceso
    tokenClient.requestAccessToken();
  }

  // Método para obtener eventos del calendario
  getCalendarEvents(): Observable<any> {
    if (!this.token) {
      Toastify({
        text: "User not autenticated!",
        duration: 3000, 
        gravity: "bottom",
        position: 'center',
        backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
      }).showToast()
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${this.apiUrl}/calendars/primary/events`, { headers });
  }

  // Método para crear un nuevo evento en Google Calendar
  createCalendarEvent(event: any): Observable<any> {
    if (!this.token) {
      Toastify({
        text: "User not autenticated!",
        duration: 3000, 
        gravity: "bottom",
        position: 'center',
        backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
      }).showToast()
    }

    return this.http.post<any>(`${this.apiUrl}/calendars/primary/events`, event);
  }
  deleteCalendarEvent(eventId: string): Observable<any> {
    // Asegúrate de que el usuario esté autenticado y tenga el token
    const token = localStorage.getItem('googleAccessToken');
    if (!token) {
      throw new Error("El usuario no está autenticado.");
    }

    // Realiza la petición DELETE al endpoint correspondiente
    return this.http.delete(`${this.apiUrl}/calendars/primary/events/${eventId}`);
  }

  // Método para cerrar sesión y eliminar el token almacenado
  signOut() {
    localStorage.removeItem('googleAccessToken');
    this.token = null;
    console.log("Sesión cerrada.");
  }
}
