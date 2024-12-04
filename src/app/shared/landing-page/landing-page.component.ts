import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Services } from '../../interfaces/services';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Category } from '../../interfaces/category';
import { of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../user/services/user.service';
import { GoogleCalendarService } from '../services/google-calendar.service';
import { Cite } from '../../interfaces/cite';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CheckCiteService } from '../validators/check-cite.service';
import { CiteService } from '../../cites/services/cite.service';
import { addMinutes, formatISO } from 'date-fns';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  constructor(
    private serviceService: ServiceService,
    private authService: AuthService,
    private fb: FormBuilder,
    private checkCiteService: CheckCiteService,
    private citeService: CiteService,
    private calendarService: GoogleCalendarService
  ) {}

  @ViewChild('scrollableContainer', { read: ElementRef })
  scrollableContainer!: ElementRef;
  @ViewChild('scrollDown') targetElement!: ElementRef;

  scrollToElement() {
    this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  scrollLeft() {
    const container = this.scrollableContainer.nativeElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    const container = this.scrollableContainer.nativeElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  services!: Services[];
  service!: Services;
  categories!: Category[];
  filterServices!: Services[];

  categorySelected: boolean = false;

  cite: Omit<Cite, 'id' | 'username' | 'idWorker'> = {
    day: new Date(),
    startTime: '',
    idService: 0,
    eventId: '',
  };

  myForm: FormGroup = this.fb.group({
    day: [null],
    startTime: [null],
    idService: [0],
  });

  /**
   * Al cargar la página cargaremos los servicios y las categorías
   */
  ngOnInit(): void {
    this.getServices();
    this.getCategories();
  }

  isLoggued(): boolean {
    return this.authService.existToken();
  }

  /**
   * Método para obtener todos los servicios de la API
   */
  getServices() {
    this.serviceService.getRandomServices().subscribe({
      next: (data) => (this.services = data),
      error: (err) =>
        Toastify({
          text: 'We can´t load our services yet',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  /**
   * Método para obtener el servicio
   * Le pasamos un id y buscamos el servicio por ese id
   * @param idService
   */
  getService(idService: number) {
    this.serviceService.getService(idService).subscribe({
      next: (data) => (this.service = data),
      error: (err) =>
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  /**
   * Método para actualizar el servicio
   * Recibimos el evento del formulario en este caso es un id y obtenemos el servicio seleccionado en la lista de servicios filtrados
   * Actualizamos el campo service tanto en el objeto service como en el formulario
   * @param event
   */
  setService(event: Event) {
    let serviceId = parseInt((event.target as HTMLSelectElement).value);
    const selectedService = this.filterServices.find(
      (service) => service.id === serviceId
    );
    if (selectedService) {
      this.service = selectedService;
      console.log(this.service);
      this.myForm.patchValue({ idService: this.service.id });
    }
  }

  /**
   * Método para obtener todas las categorías de la API
   */
  getCategories() {
    this.serviceService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) =>
        Toastify({
          text: 'We can´t load our categories yet',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  /**
   * Método para cargar en el formulario de inicio los servicios según la categoría elegida
   * Rescatamos el id de la categoria como un event
   * Y con switchMap buscamos los servicios de esa categoría
   * Nos suscribimos y cargamos dichos servicios y asignamos la varibale booleana a true para mostrar los servicios en el form
   * Si hay un error alertaremos al usuario
   * @param event
   */
  getServicesByCategory(event: Event) {
    const idCategory = (event.target as HTMLSelectElement).value;

    this.serviceService
      .getServicesByCategory(idCategory)
      .pipe(
        switchMap((services) => {
          return services.length > 0 ? of(services) : of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.filterServices = data;
          this.categorySelected = true;
        },
        error: (err) =>
          Toastify({
            text: 'We can´t load our services yet: ' + err.error.message,
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast(),
      });
  }

  /**
   * Método para reservar una cita
   * Obtenemos los datos del formulario
   * Le damos formato al startTime ya que la api espera un tipo Time y asignamos el id del servicio a la cita
   * Mostramos mensaje de éxito o error en caso de la respuesta de la api
   */
  bookCite() {
    if (this.myForm.valid) {
      const { ...cite } = this.myForm.value;
      this.cite = cite;
      this.cite.startTime = this.cite.startTime + ':00'; //Damos formato a la cita HH:mm:ss
      this.cite.idService = this.service.id;
      this.cite.eventId = this.generateGoogleCalendarId();
      this.citeService.addCite(this.cite).subscribe({
        next: (data) => {
          console.log(data);
          Toastify({
            text: 'Appointment successfully added, check your future appointments!',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast();
          this.createCalendarEvent(this.cite.eventId);
        },
        error: (err) =>
          Toastify({
            text: 'Something go bad: ' + err.error.message,
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast(),
      });
    }
  }

  /**
   * Método para crear un evento en Google Calendar
   * @param data - Datos de la cita para crear el evento
   */
  createCalendarEvent(id: string) {
    const startDateTime = new Date(`${this.cite.day}T${this.cite.startTime}`);
    const endDateTime = addMinutes(
      startDateTime,
      parseInt(this.service.duration)
    );
    const event = {
      id: id,
      summary: this.service.name,
      location: 'Sevilla',
      description: 'Reserva de cita',
      start: {
        dateTime: formatISO(startDateTime), // Hora de inicio en formato ISO
        timeZone: 'Europe/Madrid', // Zona horaria correcta
      },
      end: {
        dateTime: formatISO(endDateTime), // Hora de fin en formato ISO
        timeZone: 'Europe/Madrid', // Zona horaria correcta
      },
      attendees: [
        { email: 'correo@example.com' }, // Lista de asistentes
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };
    this.calendarService.createCalendarEvent(event).subscribe({
      next: (data) => {
        Toastify({
          text: 'Event added to calendar succesfully',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
        }).showToast();
      },
      error: (err) => {
        Toastify({
          text:
            'Something go bad creating the event in Google Calendar ' +
            err.error,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast();
      },
    });
  }

  /**
   * Método para comprobar si un campo del formulario es válido o no
   * @param field
   * @returns
   */
  isInvalidField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  /**
   * Método para comprobar si la cita es válida
   * Pasaremos el campo day y startTime del formulario
   */
  checkCite() {
    const day = this.myForm.get('day')?.value;
    const startTime = this.myForm.get('startTime')?.value;

    //Al método validate de checkCiteService le pasamos el endTime que es la suma del comienzo y la duracion del servicio
    this.checkCiteService
      .validate(day, startTime, startTime + this.service.duration)
      .subscribe((result) => {
        if (result) {
          //Si obtenemos respuesta seteamos los errores a true
          this.myForm.get('startTime')?.setErrors({ existCite: true });
        } else {
          //Si no seteamos los errores a null
          this.myForm.get('startTime')?.setErrors(null);
        }
      });
  }

  /**
   * Los siguientes métodos servirán para obtener el tipo de error que tiene un campo y mostrar un mensaje en cada caso
   */
  get TimeError() {
    const error = this.myForm.get('startTime')?.errors;
    let errorMessage = '';

    if (error) {
      if (error['existCite']) {
        errorMessage = 'Cite not available at this time';
      }
    }
    return errorMessage;
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  generateGoogleCalendarId(length = 32): string {
    // Conjunto de caracteres válidos en base32hex (a-v y 0-9)
    const validChars = 'abcdefghijklmnopqrstuv0123456789';

    // longitud mínima de 5
    if (length < 5) {
      throw new Error('ID length must be at least 5 characters');
    }

    // Generar ID aleatorio
    let result = '';
    for (let i = 0; i < length; i++) {
      result += validChars[this.getRandomInt(0, validChars.length)];
    }

    // Devuelve el ID generado
    return result;
  }
}