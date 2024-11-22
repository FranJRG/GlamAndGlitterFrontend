import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cite } from '../../interfaces/cite';
import { CiteService } from '../../cites/services/cite.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Services } from '../../interfaces/services';
import { ServiceService } from '../../service/service.service';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';

@Component({
  selector: 'app-pending-reserves',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './pending-reserves.component.html',
  styleUrl: './pending-reserves.component.css'
})
export class PendingReservesComponent implements OnInit{
  
  pendingReserves:Cite[] = [];
  services:Services[] = [];

  sortDate:boolean = false
  isSortDate:boolean = true;
  
  constructor(private citeService:CiteService,
    private serviceService:ServiceService,
    private router:Router
  ){}


  /**
   * Al cargar la página mostramos las citas pendientes
   */
  ngOnInit(): void {
    this.getPendingCites();
  }

  /**
   * Método para cargar las citas pendientens
   * Si hay algun error al cargar las citas pendientes mostramos el error correspondiente
   */
  getPendingCites(){
    this.citeService.getPendingCites().subscribe({
      next : (data) => {
        this.pendingReserves = data;
        this.getServicesByCites(this.pendingReserves);
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

  /**
   * Obtenemos los servicios de las citas pendientes
   * Recorremos el array de citas y cargamos los servicios que haya 
   * Si hay cualquier error mostramos mensaje de error
   * @param cites 
   */
  getServicesByCites(cites:Cite[]){
    cites.forEach((cite) => {
      this.serviceService.getService(cite.idService).subscribe({
        next : (data) => this.services.push(data),
        error : (err) => 
          Toastify({
            text: "Something go bad: " + err.error.message,
            duration: 3000, 
            gravity: "bottom",
            position: 'center',
            backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
          }).showToast()
      })
    })
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
   * Método para establecer el trabajador a la cita 
   * Si hay cualquier error alertamos al usuario
   * @param idCite 
   * @param idWorker 
   */
  setWorker(idCite:number,idWorker?:number){
    this.citeService.setWorker(idCite,idWorker).subscribe({
      next : (data) => {
        Toastify({
          text: 'Worker assined is ' + data.name,
          duration: 4000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
        }).showToast()
        this.getPendingCites()
      }
      ,
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

    /**
   * Método para obtener una fecha formateada en formato HH:mm:ss de java time
   * @param date
   * @returns
   */
  getFormattedDate(date: string): string {
    const newDate = new Date(date); // Crea el objeto Date con la fecha
    const newDateWithAddedDay = addDays(newDate, 1); // Agrega 1 día a la fecha
  
    // Formateamos la fecha agregando ceros a las partes de la fecha
    const fechaFormateada = `${newDateWithAddedDay.getFullYear()}-${(newDateWithAddedDay.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${newDateWithAddedDay.getDate().toString().padStart(2, '0')}`;
    
    return fechaFormateada;
  }

  deleteCite(id: number) {
    this.citeService.deleteCite(id).subscribe({
      next: (data) => {
        this.pendingReserves = this.pendingReserves.filter((cite) => cite.id !== id);
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
   * Método para navegar a la ruta que selecciona el trabajador
   * @param id 
   */
  selectWorker(id:number){
    this.router.navigateByUrl(`/cite/updateCite/${id}`)
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
  
    this.pendingReserves.sort((a, b) => {
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
}
