import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { CiteService } from '../../cites/services/cite.service';
import { ServiceService } from '../../service/service.service';
import { Cite } from '../../interfaces/cite';
import { Services } from '../../interfaces/services';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { GoogleCalendarService } from '../../shared/services/google-calendar.service';
import { addDays, formatISO } from 'date-fns';

@Component({
  selector: 'app-my-cites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-cites.component.html',
  styleUrl: './my-cites.component.css',
})
export class MyCitesComponent implements OnInit {
  reserves: Cite[] = [];
  services: Services[] = [];
  service!: Services;
  date: Date = new Date();

  sortDate:boolean = false
  isSortDate:boolean = true;

  constructor(
    private citeService: CiteService,
    private serviceService: ServiceService,
    private authService: AuthService,
    private calendarService: GoogleCalendarService,
    private router: Router
  ) {}

  /**
   * Cargamos las citas al iniciar la página
   */
  ngOnInit(): void {
    this.getPendingCites();
  }

  /**
   * Método para obtener las citas del usuario logueado
   * Si hay algun error notificamos al usuario
   */
  getPendingCites() {
    let id = this.authService.getUserId();
    this.citeService.getUserCites(id).subscribe({
      next: (data) => {
        this.reserves = data;
        this.getServicesByCites(this.reserves);
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

  /**
   * Obtenemos los servicios de las citas del usuario
   * Recorremos el array de citas y cargamos los servicios que haya
   * Si hay cualquier error mostramos mensaje de error
   * @param cites
   */
  getServicesByCites(cites: Cite[]) {
    cites.forEach((cite) => {
      this.serviceService.getService(cite.idService).subscribe({
        next: (data) => this.services.push(data),
        error: (err) =>
          Toastify({
            text: 'Something go bad: ' + err.error.message,
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast(),
      });
    });
  }

  /**
   * Método para cancelar una cita
   * Si se puede eliminar mostraremos un mensaje de confirmado
   * Si hay algun error mostraremos el mensaje correspondiente
   * @param id
   */
  deleteCite(id: number,eventId:string) {
    this.citeService.deleteCite(id).subscribe({
      next: (data) => {
        this.reserves = this.reserves.filter((cite) => cite.id !== id);
        if(eventId != "" && eventId != null){
          this.deleteEvent(eventId);
        }
        Toastify({
          text:
            'Appointment for date: ' +
            this.getFormattedDate(data.day.toString()) +
            ' deleted succesfully',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
        }).showToast();
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

  /**
   * Método para buscar un evento por su fecha y titulo y eliminarlo
   */
  deleteEvent(eventId: string) {
      this.calendarService.deleteEvent(eventId).subscribe({
        next : () => {
          Toastify({
            text:'Appointment deleted successfully from Calendar',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast();
        },
        error: (err) =>
          Toastify({
            text: 'Something go bad deleting the event',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast(),
      })
  }

  /**
   * Método para obtener una fecha formateada en formato HH:mm:ss de java time
   * @param date
   * @returns
   */
  getFormattedDate(date: string): string {
    const newDate = new Date(date); // Crea el objeto Date con la fecha
    const newDateWithAddedDay = addDays(newDate,1);
  
    // Formateamos la fecha agregando ceros a las partes de la fecha
    const fechaFormateada = `${newDateWithAddedDay.getFullYear()}-${(newDateWithAddedDay.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${newDateWithAddedDay.getDate().toString().padStart(2, '0')}`;
    return fechaFormateada;
  }

  getService(idService: number) {
    this.serviceService.getService(idService).subscribe({
      next: (data) => {
        return data;
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

  /**
   * Método para llevar al usuario a la ruta para modificar una cita
   * @param id
   */
  editReserve(id: number) {
    this.router.navigateByUrl(`/cite/updateCite/${id}`);
  }

    /**
   * Método para obtener el nombre del servicio
   * Buscamos el servicio en el array de servicios
   * @param idService 
   * @returns 
   */
    getServiceName(idService: number): string {
      const service = this.services.find(service => service.id === idService);
      return service ? service.name : 'Servicio no encontrado';
    }

  /**
   * Método que comprueba si una cita es pasada o aún no
   * @param date
   * @returns
   */
  isPastDate(date: string) {
    let dateService = new Date(this.getFormattedDate(date));
    let actualDate = new Date();
    return dateService < actualDate;
  }

   /**
   * Ordenar la tabla por fecha
   * Llamaremos al boolean para comprobar si es la primera vez que le damos a ordenar (visual html)
   * Comprobamos si esta ordenado asc o desc (isSortDate) en funcion de lo que nos devuelva ordenamos
   * Cambiamos el valor de isSortDate para altenar cada vez que el usuario haga click
   */
   sortByDate(): void {
    if (!this.sortDate) {
      this.sortDate = true;
    }
  
    this.reserves.sort((a, b) => {
      const dateA = new Date(a.day).getTime();
      const dateB = new Date(b.day).getTime();
      
      if (this.isSortDate) {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  
    this.isSortDate = !this.isSortDate;
  }

  addRating(id:number){
    this.router.navigateByUrl(`/rating/addRating/${id}`)
  }
}