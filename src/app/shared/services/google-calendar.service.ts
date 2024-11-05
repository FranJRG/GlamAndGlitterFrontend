import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formatISO } from 'date-fns';
import { catchError, map, Observable, of } from 'rxjs';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  events:any[] = [];
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

    return this.http.get<any>(`${this.apiUrl}/calendars/primary/events`, { headers }).pipe(
      map(response => {
        this.events = response.items || [] ; // Guarda los eventos en allEvents
        return this.events;
      }),
      catchError(error => {
        console.error('Error al cargar eventos:', error);
        return of([]);
      })
    );;
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

  // Método para eliminar un evento por su ID
  deleteEvent(eventId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    return this.http.delete(`${this.apiUrl}/calendars/calendarId/events/${eventId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error al eliminar evento:', error);
        return of(null);
      })
    );
  }

  // Método para cerrar sesión y eliminar el token almacenado
  signOut() {
    localStorage.removeItem('googleAccessToken');
    this.token = null;
    console.log("Sesión cerrada.");
  }
}
