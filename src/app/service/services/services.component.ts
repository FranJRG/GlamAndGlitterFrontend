import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Services } from '../../interfaces/services';
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  services!: Services[];
  categories!: Category[];

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.serviceService.getServices().subscribe({
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
    this.getCategories();
  }

  getServices(event: Event) {
    let categoryId = (event.target as HTMLInputElement).value;
    if (categoryId == 'all') {
      this.serviceService.getServices().subscribe({
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
    } else {
      this.serviceService.getServicesByCategory(categoryId).subscribe({
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
  }

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
}
