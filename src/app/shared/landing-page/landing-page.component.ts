import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Services } from '../../interfaces/services';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Category } from '../../interfaces/category';
import { of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  constructor(private serviceService: ServiceService) {}

  services!: Services[];
  categories!: Category[];
  filterServices!:Services[];

  categorySelected:boolean = false;

  /**
   * Al cargar la página cargaremos los servicios y las categorías
   */
  ngOnInit(): void {
    this.getServices();
    this.getCategories();
  }

  /**
   * Método para obtener todos los servicios de la API
   */
  getServices(){
    this.serviceService.getRandomServices().subscribe({
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

  /**
   * Método para obtener todas las categorías de la API
   */
  getCategories(){
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

  /**
   * Método para cargar en el formulario de inicio los servicios según la categoría elegida
   * Rescatamos el id de la categoria como un event
   * Y con switchMap buscamos los servicios de esa categoría
   * Nos suscribimos y cargamos dichos servicios y asignamos la varibale booleana a true para mostrar los servicios en el form
   * Si hay un error alertaremos al usuario
   * @param event 
   */
  getServicesByCategory(event:Event){
    const idCategory = (event.target as HTMLSelectElement).value;

    this.serviceService.getServicesByCategory(idCategory).pipe(
      switchMap((services) => {
        return services.length > 0 ? of(services) : of([]);
      })
    )
    .subscribe({
      next : (data) => {
        this.filterServices = data 
        this.categorySelected = true
      },
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
