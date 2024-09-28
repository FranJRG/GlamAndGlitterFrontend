import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Services } from '../../interfaces/services';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit{

  services!:Services[];
  constructor(private serviceService:ServiceService){}

  ngOnInit(): void {
    this.serviceService.getServices().subscribe({
      next : (data) => this.services = data,
      error : (err) => 
        Toastify({
          text: 'We can´t load our services yet: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    })
  }

}
