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
  
  constructor(private citeService:CiteService,
    private serviceService:ServiceService,
    private router:Router
  ){}


  ngOnInit(): void {
    this.getPendingCites();
  }

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

  getServiceName(idService: number): string {
    const service = this.services.find(service => service.id === idService);
    return service ? service.name : 'Servicio no encontrado';
  }

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

  selectWorker(id:number){
    this.router.navigateByUrl(`user/workers/${id}`)
  }
}
