import { Component, Input, OnInit } from '@angular/core';
import { Services } from '../../interfaces/services';
import { ServiceService } from '../../service/service.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsyncValidator } from '@angular/forms';
import { CheckCiteService } from '../../shared/validators/check-cite.service';
import { Category } from '../../interfaces/category';
import { of, switchMap } from 'rxjs';
import { CiteService } from '../services/cite.service';
import { Cite } from '../../interfaces/cite';

@Component({
  selector: 'app-book-cite',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-cite.component.html',
  styleUrl: './book-cite.component.css',
})
export class BookCiteComponent implements OnInit {
  service!: Services;
  services!:Services[];
  categories!:Category[];
  filterServices!:Services[];

  categorySelected:boolean = false;
  @Input() id: number = 0;

  constructor(
    private serviceService: ServiceService,
    private fb: FormBuilder,
    private checkCiteService: CheckCiteService,
    private citeService:CiteService
  ) {}

  cite:Omit<Cite, "id" | "username"> = {
    day:new Date(),
    startTime: "",
    idService:0
  }

  ngOnInit(): void {
    if(this.id != 0){
      this.serviceService.getService(this.id).subscribe({
        next: (data) => (this.service = data),
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
    this.getCategories();
  }

  myForm: FormGroup = this.fb.group({
    day: [null],
    startTime: [null],
    idService: [this.id],
  });

  checkCite() {
    const day = this.myForm.get('day')?.value;
    const startTime = this.myForm.get('startTime')?.value;

    this.checkCiteService.validate(day, startTime, startTime+this.service.duration).subscribe((result) => {
      if (result) {
        this.myForm.get('startTime')?.setErrors({ existCite: true });
      } else {
        this.myForm.get('startTime')?.setErrors(null);
      }
    });
  }

  /**
   * Método para comprobar si un campo del formulario es válido o no
   * @param field
   * @returns
   */
  isInvalidField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  setService(event:Event) {
    let serviceId = parseInt((event.target as HTMLSelectElement).value);
    const selectedService = this.filterServices.find(service => service.id === serviceId);
    if (selectedService) {
      this.service = selectedService;
      this.myForm.patchValue({ idService: this.service.id });
    }
  }

  /**
   * Los siguientes métodos servirán para obtener el tipo de error que tiene un campo y mostrar un mensaje en cada caso
   */
  get TimeError() {
    const error = this.myForm.get('startTime')?.errors;
    let errorMessage = '';
  
    if (error) {
      if (error['existCite']) {
        errorMessage = 'Cite not available at this time';
      }
    }
    return errorMessage;
  }

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

  bookCite(){
    if(this.myForm.valid){
      const { ...cite } = this.myForm.value;
      this.cite = cite;
      this.cite.startTime = this.cite.startTime + ":00";
      this.cite.idService = this.service.id;
      console.log(this.cite);
      this.citeService.addCite(this.cite).subscribe({
        next : (data) => 
          Toastify({
            text: 'Appointment successfully added, check your future appointments!',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast(),
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
}
