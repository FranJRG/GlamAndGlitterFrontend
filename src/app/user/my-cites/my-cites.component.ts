import { Component } from '@angular/core';
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

@Component({
  selector: 'app-my-cites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-cites.component.html',
  styleUrl: './my-cites.component.css'
})
export class MyCitesComponent {
  reserves:Cite[] = [];
  services:Services[] = [];
  date:Date = new Date();
  
  constructor(private citeService:CiteService,
    private serviceService:ServiceService,
    private authService:AuthService,
    private router:Router
  ){}

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
  getPendingCites(){
    let id = this.authService.getUserId();
    this.citeService.getUserCites(id).subscribe({
      next : (data) => {
        this.reserves = data;
        this.getServicesByCites(this.reserves);
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
   * Obtenemos los servicios de las citas del usuario
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
   * Método para cancelar una cita
   * Si se puede eliminar mostraremos un mensaje de confirmado
   * Si hay algun error mostraremos el mensaje correspondiente
   * @param id 
   */
  deleteCite(id:number){
    this.citeService.deleteCite(id).subscribe({
      next : (data) => 
        Toastify({
          text: 'Appointment for date: ' + this.getFormattedDate(data.day.toString()) + " deleted succesfully",
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
        }).showToast(),
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
  getFormattedDate(date:string):string{
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    const fechaFormateada = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}`;
    return fechaFormateada;
  }

  /**
   * Método para llevar al usuario a la ruta para modificar una cita
   * @param id 
   */
  editReserve(id:number){
    this.router.navigateByUrl(`/cite/updateCite/${id}`);
  }

  /**
   * Método que comprueba si una cita es pasada o aún no
   * @param date 
   * @returns 
   */
  isPastDate(date:string){
    let dateService = new Date(this.getFormattedDate(date));
    let actualDate = new Date();
    return dateService < actualDate;
  }

}
