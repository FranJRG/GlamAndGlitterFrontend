import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CiteService } from '../../cites/services/cite.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { User } from '../../interfaces/user';
import { Cite } from '../../interfaces/cite';

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.css'
})
export class WorkersComponent implements OnInit{

  workers!:User[];
  @Input()id = 0;
  cite!:Cite;

  constructor(private userService:UserService,
    private citeService:CiteService

  ){}

  /**
   * Cargamos los trabajadores disponibles para esa cita
   * Cargamos la cita a la que le queremos cambiar el trabajador
   */
  ngOnInit(): void {
    this.citeService.getWorkers(this.id).subscribe({
      next : (data) => this.workers = data,
      error : (err) => 
        Toastify({
          text: "Something go bad: " + err.error.message,
          duration: 3000, 
          gravity: "bottom",
          position: 'center',
          backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
        }).showToast()
    })
    this.citeService.getCite(this.id).subscribe({
      next : (data) => this.cite = data,
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
   * Método para establecer un trabajador a una cita
   * Le pasamos el id de la cita y el id del trabajador
   * Mostramos mensaje de éxito o error según sea necesario
   * @param id 
   */
  setWorker(id:number){
    this.citeService.setWorker(this.id,id).subscribe({
      next : (data) => 
        Toastify({
          text: 'Worker assined is ' + data.name,
          duration: 4000,
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

}
