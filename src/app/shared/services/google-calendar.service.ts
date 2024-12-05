import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formatISO } from 'date-fns';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  events: any[] = [];
  private clientId =
    '127291825317-utahcd35t25ihrj5nl4at620cp1l8d6r.apps.googleusercontent.com';
  private apiUrl = 'https://www.googleapis.com/calendar/v3';
  private scopes = 'https://www.googleapis.com/auth/calendar';
  private token: string | null =
    localStorage.getItem('googleAccessToken') != null
      ? localStorage.getItem('googleAccessToken')
      : '';

  constructor(private http: HttpClient) {}

  // Inicializa el cliente de token de Google Identity Services
  initializeTokenClient() {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: this.scopes,
      callback: (response: any) => {
        if (response && response.access_token) {
          //Almacenamos el token en el localStorage
          this.token = response.access_token;
          localStorage.setItem('googleAccessToken', this.token as string);
          
          //Almacenamos el momento en el que el token expirará en formato milisegundos
          const expirationTime = new Date().getTime() + (response.expires_in * 1000);
          localStorage.setItem('googleTokenExpiration',expirationTime.toString());
        } else {
          Toastify({
            text: 'Something go bad with access token',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast();
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
        text: 'User not autenticated!',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
      }).showToast();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http
      .get<any>(`${this.apiUrl}/calendars/primary/events`, { headers })
      .pipe(
        map((response) => {
          this.events = response.items || []; // Guarda los eventos en allEvents
          return this.events;
        }),
        catchError((error) => {
          console.error('Error al cargar eventos:', error);
          return of([]);
        })
      );
  }

  // Método para crear un nuevo evento en Google Calendar
  createCalendarEvent(event: any): Observable<any> {
    if (!this.token || this.isTokenExpired()) {
      // Si no hay token o si ha expirado, solicítalo nuevamente
      this.initializeTokenClient();
    }

    //Realizamos la petición post
    return this.http.post<any>(
      `${this.apiUrl}/calendars/primary/events`,
      event
    );
  }

  //Método para actualizar un evento
  updateEvent(eventId: string, event: any): Observable<any> {

    if (!this.token || this.isTokenExpired()) {
      // Si no hay token o si ha expirado, solicítalo nuevamente
      this.initializeTokenClient();
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    //Realizamos la petición de actualización
    return this.http.put(
      `${this.apiUrl}/calendars/primary/events/${eventId}`,
      event,
      { headers }
    );
  }

  // Método para eliminar un evento por su ID
  deleteEvent(eventId: string): Observable<any> {

    if (!this.token || this.isTokenExpired()) {
      // Si no hay token o si ha expirado, solicítalo nuevamente
      this.initializeTokenClient();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http
      .delete(`${this.apiUrl}/calendars/primary/events/${eventId}`, { headers })
      .pipe(
        catchError((error) => {
          Toastify({
            text: 'Something go bad deleting the event!',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast();
          return of(null);
        })
      );
  }

  private isTokenExpired(): boolean {
    const expirationTime = localStorage.getItem('googleTokenExpiration');
    if (expirationTime) {
      const now = new Date().getTime();
      return now > Number(expirationTime);
    }
    return true; // Si no hay token de expiración, asumimos que ha expirado
  }

  // Método para cerrar sesión y eliminar el token almacenado
  signOut() {
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem("googleTokenExpiration");
    this.token = null;
    console.log('Sesión cerrada.');
  }
}
