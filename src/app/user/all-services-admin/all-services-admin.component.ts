import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Services } from '../../interfaces/services';
import { ServiceService } from '../../service/service.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-services-admin',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './all-services-admin.component.html',
  styleUrl: './all-services-admin.component.css'
})
export class AllServicesAdminComponent implements OnInit{

  services!:Services[];
  filterServices!:Services[];
  @Input() name:string=""; //Para la barra de búsqueda

  constructor(private serviceService:ServiceService){}

  ngOnInit(): void {
   this.getServices();
  }

  disabledService(id:number){
    this.serviceService.disabledService(id).subscribe({
      next : (data) => {
        if(data.active === false){
          Toastify({
            text:'Service with name ' + data.name + " disabled successfully",
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast();
        }else{
          Toastify({
            text:'Service with name ' + data.name + " enabled successfully",
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast();
        }
        this.getServices();
      },
      error : (err) => 
        Toastify({
          text: 'Something go bad disabled the service '  + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    })
  }

  getServices(){
    this.serviceService.getServices().subscribe({
      next : (data) => {
          this.services = data;
          this.filterServices = this.services
      },
      error : (err) => 
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    })
  }

  filterServicesByName(){
  if(this.name != "" && this.name != undefined){
    this.filterServices = this.services.filter((service) => service.name.toUpperCase().includes(this.name.toUpperCase()));
  }else{
    this.filterServices = this.services;
  }
  }

}
