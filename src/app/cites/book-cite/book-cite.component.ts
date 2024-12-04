import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Services } from '../../interfaces/services';
import { ServiceService } from '../../service/service.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsyncValidator } from '@angular/forms';
import { CheckCiteService } from '../../shared/validators/check-cite.service';
import { Category } from '../../interfaces/category';
import { of, switchMap } from 'rxjs';
import { CiteService } from '../services/cite.service';
import { Cite } from '../../interfaces/cite';
import { GoogleCalendarService } from '../../shared/services/google-calendar.service';
import { addDays, addMinutes, formatISO } from 'date-fns';
import { User } from '../../interfaces/user';
import { AuthService } from '../../auth/services/auth.service';
import { Rating } from '../../interfaces/rating';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-book-cite',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-cite.component.html',
  styleUrl: './book-cite.component.css',
})
export class BookCiteComponent implements OnInit {
  /**
   * Variables para este componente
   */
  service!: Services;
  ratings : Rating[] = []
  services!: Services[];
  categories!: Category[];
  filterServices!: Services[];
  idServiceCite = 0;

  dateFilter!:string;
  timeFilter!:string;

  workers:User[] = [];
  worker!:User;

  categorySelected: boolean = false;
  @Input() serviceId: number = 0;
  @Input() id: number = 0;

  eventId:string = "";

  idWorker:string = "";

  constructor(
    private serviceService: ServiceService,
    private fb: FormBuilder,
    private checkCiteService: CheckCiteService,
    private citeService: CiteService,
    private userService:UserService,
    private authService:AuthService,
    private calendarService: GoogleCalendarService
  ) {}

  cite: Omit<Cite, 'id' | 'username' | 'idWorker'> = {
    day: new Date(),
    startTime: '',
    idService: 0,
    eventId : ""
  };

  getRole():string{
    return this.authService.getRole();
  }

  /**
   * Al cargar la página si hay un id cargamos la cita y si hay un id de servicio cargamos el servicio
   * Mostramos las categorias
   */
  ngOnInit(): void {
    if (this.id != 0 && this.id != undefined) {
      this.getCite();
      if(this.authService.getRole() === "admin"){
        this.getWorkers();
      }
    }
    if (this.serviceId != 0 && this.serviceId != undefined) {
      this.getService(this.serviceId);
      this.getRatingsService(this.serviceId);
    }
    this.getCategories();
  }

  setDateFilter(event:Event){
    let date = (event.target as HTMLInputElement).value;
    this.dateFilter = date;
    this.getWorkers(this.dateFilter,this.timeFilter);
  }

  setTimeFilter(event:Event){
    let time = (event.target as HTMLInputElement).value;
    this.timeFilter = time + ":00";
    this.getWorkers(this.dateFilter,this.timeFilter);
  }

  getWorkers(dateFilter?:string, timeFilter?:string){
    this.citeService.getWorkers(this.id,dateFilter,timeFilter).subscribe({
      next : (data) => {
        this.workers = data
      },
      error : (err) => 
        Toastify({
          text: "Something go bad: " + err.error.message,
          duration: 3000, 
          gravity: "bottom",
          position: 'center',
          backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
        }).showToast()
    })
  }

  getWorkerFromCite(id:number){

    this.userService.getUserById(id).subscribe({
      next : (data) => this.worker = data,
      error : (err) => 
        Toastify({
          text: 'Failed to get the worker from this cite : ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast()
    })

  }

  getRatingsService(id:number){
    this.citeService.getRatingService(id).subscribe({
      next : (data) => this.ratings = data,
      error : (err) =>
        Toastify({
          text: 'Failed to get the ratings : ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast()
    })
  }

  /**
   * Método para obtener la cita
   * Le pasamos un id y si la cita existe cargamos los datos en el formulario
   * Mostramos un mensaje de error en caso de no existir o algun error
   */
  getCite() {
    this.citeService.getCite(this.id).subscribe({
      next: (data) => {
        this.cite = data;
        //Seteamos los valores de la peticion a los del formulario
        this.myForm.setValue({
          day: this.getFormattedDate(data.day.toString()),
          startTime: data.startTime.replace(':00', ''), //Formateamos la fecha para que sea válida en tipo Time de la api
          idService: data.idService,
        });
        this.getService(data.idService); //Obtenemos el servicio de la api
        this.getWorkerFromCite(data.idWorker); // Obtenemos el trabajador de la api asociado a esta cita
      },
      error: (err) =>
        Toastify({
          text: 'Something go bad : ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  /**
   * Método para formatear la fecha
   * @param date 
   * @returns 
   */
  getFormattedDate(date: string): string {
    const newDate = new Date(date); // Crea el objeto Date con la fecha
    const newDateWithAddedDay = addDays(newDate, 1);

    // Formateamos la fecha agregando ceros a las partes de la fecha
    const fechaFormateada = `${newDateWithAddedDay.getFullYear()}-${(
      newDateWithAddedDay.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${newDateWithAddedDay
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    return fechaFormateada;
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

  //Formulario para reservar una cita
  myForm: FormGroup = this.fb.group({
    day: [null],
    startTime: [null],
    idService: [this.serviceId]
  });

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
   * Método para comprobar si un campo del formulario es válido o no
   * @param field
   * @returns
   */
  isInvalidField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  /**
   * Método para actualizar el listado de servicios
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
      this.getRatingsService(this.service.id);
      this.myForm.patchValue({ idService: this.service.id });
    }
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

  /**
   * Método para obtener el listado de categorias
   * Mostramos mensaje de error en caso de algo ir mal
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
   * Método para actualizar una cita
   * Convertimos los datos necesarios para la respuesta de la api
   * Asignamos el idService a la cita
   * Mostramos mensaje de éxito o error a la cita
   */
  modifyCite() {
    if (this.myForm.valid) {
      const eventId = this.cite.eventId;
      console.log(eventId)
      const { ...cite } = this.myForm.value;
      this.cite = cite;
      //Si la longitud del startTime es 8 es decir HH:mm:ss no hacemos nada si no le ponemos :00 para darle formato
      //Esto lo hacemos debido a que al recoger la cita de la api la hora viene formateada y si no la cambiamos
      //no habria que añadir el :00
      this.cite.startTime = this.cite.startTime.length === 8 ? '' : this.cite.startTime + ':00';
      this.cite.idService = this.service.id;
      console.log(this.idWorker);
      this.citeService.updateCite(this.id, this.cite, this.idWorker).subscribe({
        next: (data) =>{
          Toastify({
            text: 'Appointment successfully updated, check your appointments!',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast()
          if(eventId != "" && eventId != null){
            this.updateCalendarEvent(eventId,this.cite);
          }
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
          console.log(data.startTime)
          Toastify({
            text: 'Appointment successfully added, check your future appointments!',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast();
          this.createCalendarEvent(this.cite.eventId)
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
   * Método para establecer un trabajador a una cita
   * Le pasamos el id de la cita y el id del trabajador
   * Mostramos mensaje de éxito o error según sea necesario
   * @param id 
   */
    setWorker(event:Event){
      const idWorker = (event.target as HTMLInputElement).value;
      this.idWorker = idWorker;
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
    

    /**
     * Método para actualizar un evento de Google Calendar
     */

    updateCalendarEvent(eventId:string,cite:Omit<Cite, 'id' | 'username' | 'idWorker'>){
        const startDateTime = new Date(`${cite.day}T${cite.startTime}`);
        const endDateTime = addMinutes(startDateTime, parseInt(this.service.duration));
        const event = {
          id:eventId,
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
            { email: 'correo@example.com' }, // Lista de asistentes (necesaria para crear evento)
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 10 },
            ],
          },
        };
        this.calendarService.updateEvent(eventId,event).subscribe({
          next: (data) => {
            Toastify({
              text: 'Event updated succesfully',
              duration: 3000,
              gravity: 'bottom',
              position: 'center',
              backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
            }).showToast();
          },
          error: (err) => {
            Toastify({
              text: 'Something go bad updating the event in Google Calendar',
              duration: 3000,
              gravity: 'bottom',
              position: 'center',
              backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
            }).showToast();
          },
        });
    }

  /**
   * Método para crear un evento en Google Calendar
   * @param data - Datos de la cita para crear el evento
   */
  createCalendarEvent(id:string){
    const startDateTime = new Date(`${this.cite.day}T${this.cite.startTime}`);
    const endDateTime = addMinutes(startDateTime, parseInt(this.service.duration));
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
          text: 'Something go bad creating the event in Google Calendar ' + err.error,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast();
      },
    });
  }
}