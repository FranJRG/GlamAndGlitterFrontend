import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ServiceService } from '../service.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Services } from '../../interfaces/services';
import { Category } from '../../interfaces/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit, OnChanges {
  services!: Services[];
  categories!: Category[];

  @Input()id = 0;

  constructor(private serviceService: ServiceService,
    private router:Router
  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    if(this.id != 0 && this.id != undefined){
      this.getServices(this.id.toString());
    }
  }

  /**
   * Al iniciar el componente de servicios cargaremos todos los servicios existentes y las categorías
   */
  ngOnInit(): void {
    if(this.id != 0 && this.id != undefined){
      this.getServices(this.id.toString());
    }
    this.serviceService.getServicesActive().subscribe({
      next: (data) => {
        this.services = data
      },
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

  /**
   * Método para filtrar servicios por categoría
   * Este método servirá para buscar los servicios de una categoría
   * Recibirá un evento haciendo referencia al id de la categoría
   * Según que sea lo que recibe filtrará por categoría o las buscará todas
   * @param event 
   */
  getServices(event: Event | string) {
    let categoryId: string;

    // Verificamos si el parámetro es un evento o un ID directo
    if (typeof event === 'string') {
      categoryId = event; // Si es un string, es un ID
    } else {
      categoryId = (event.target as HTMLInputElement).value; //Lo convertimos como evento del html
    }
    if (categoryId == 'all') {
      this.serviceService.getServicesActive().subscribe({
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

  /**
   * Método para obtener todas las categorías
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

  goTo(id:number){
    this.router.navigateByUrl(`cite/bookCite/${id}`);
  }
}
