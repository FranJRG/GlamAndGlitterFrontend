import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidPasswordService {

  constructor() { }

  equalFields (field1: string, field2: string) : ValidatorFn{ //Validador para que no haya 2 contraseas iguales
    return (formControl: AbstractControl): ValidationErrors | null => {
      const control2 : FormControl = <FormControl>formControl.get(field2);
      const field1Input : string = formControl.get(field1)?.value; //Campo 1
      const field2Input : string = control2?.value; //Campo 2
  
      if (field1Input !== field2Input) { //Comprobamos si son iguales
        control2.setErrors({ nonEquals: true}) //Seteamos un error a true
        return { nonEquals: true};
        
      }
      
      if(control2?.errors && control2.hasError('nonEquals')) { 
        delete control2.errors['nonEquals'];
        control2.updateValueAndValidity();
      }
      return null
    }
  }
}
