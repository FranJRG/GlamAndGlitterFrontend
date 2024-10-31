import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare var gapi: any;
@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private clientId = "127291825317-utahcd35t25ihrj5nl4at620cp1l8d6r.apps.googleusercontent.com";
  private apiKey = 'AIzaSyAEEVRSwiKESgxudog09g9t5juzyYPOiVk';
  private scopes = 'https://www.googleapis.com/auth/calendar';
  private readonly calendarId = 'primary';

  constructor(private http: HttpClient) {}

  getEvents(token: string): Observable<any> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(url, { headers });
  }
}
