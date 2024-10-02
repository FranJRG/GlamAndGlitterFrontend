import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidPasswordService {

  constructor() { }

  /**
   * Validador para comprobar que 2 campos sean iguales (en nuestro caso las contraseñas)
   * Comprobamos si los campos son diferentes y si lo son seteamos un error a true
   * @param field1 
   * @param field2 
   * @returns 
   */
  equalFields (field1: string, field2: string) : ValidatorFn{ 
    return (formControl: AbstractControl): ValidationErrors | null => {
      const control2 : FormControl = <FormControl>formControl.get(field2);
      const field1Input : string = formControl.get(field1)?.value; //Campo 1
      const field2Input : string = control2?.value; //Campo 2
  
      if (field1Input !== field2Input) {
        control2.setErrors({ nonEquals: true})
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
