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

  ngOnInit(): void {
    this.getPendingCites();
  }

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

  deleteCite(id:number){
    this.citeService.deleteCite(id).subscribe({
      next : (data) => 
        Toastify({
          text: 'Appointment for date: ' + data.day + " deleted succesfully",
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

  getFormattedDate(date:string):string{
    const newDate = new Date(date);
    const day = newDate.getDate()+1;
    const fechaFormateada = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return fechaFormateada;
  }

  editReserve(id:number){
    this.router.navigateByUrl(`/cite/updateCite/${id}`);
  }

  isPastDate(date:string){
    let dateService = new Date(this.getFormattedDate(date));
    let actualDate = new Date();
    return dateService < actualDate;
  }

}
