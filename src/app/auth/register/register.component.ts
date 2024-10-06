import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../../interfaces/user';
import { Services } from '../../interfaces/services';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { EmailValidatorService } from '../../shared/validators/email-validator.service';
import { ValidPasswordService } from '../../shared/validators/valid-password.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private emailExistService: EmailValidatorService,
    private validPassword: ValidPasswordService
  ) {}

  /**
   * Inicializamos un usuario vacío
   */
  user: Omit<User, 'id' | 'role' | 'emailNotifications' | 'smsNotifications' | 'calendarNotifications'> = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };

  /**
   * Creamos un formGroup con los datos de nuestro formulario y sus validaciones requeridas
   */
  myForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
        [this.emailExistService.validate.bind(this.emailExistService)],
      ],
      phone: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [
        this.validPassword.equalFields('password', 'confirmPassword'),
      ],
    }
  );

  /**
   * Método para comprobar si un campo del formulario es válido o no
   * @param field
   * @returns
   */
  isInvalidField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  /**
   * Los siguientes métodos servirán para obtener el tipo de error que tiene un campo y mostrar un mensaje en cada caso
   */
  get NameError() {
    const error = this.myForm.get('name')?.errors;
    let errorMessage = '';

    if (error) {
      if (error['required']) {
        errorMessage = 'Name is required';
      } else if (error['minlength']) {
        errorMessage = 'Name min length must be 5';
      }
    }
    return errorMessage;
  }

  get PasswordError() {
    const error = this.myForm.get('password')?.errors;
    let errorMessage = '';

    if (error) {
      if (error['required']) {
        errorMessage = 'Password is required';
      }
    }

    return errorMessage;
  }

  get PhoneError() {
    const error = this.myForm.get('phone')?.errors;
    let errorMessage = '';

    if (error) {
      if (error['required']) {
        errorMessage = 'Phone is required';
      } else if (error['minlength']) {
        errorMessage = 'Phone min length must be 9';
      } else if (error['maxlength']) {
        errorMessage = 'Phone max length must be 9';
      }
    }
    return errorMessage;
  }

  get EmailError() {
    const error = this.myForm.get('email')?.errors;
    let errorMessage = '';

    if (error) {
      if (error['required']) {
        errorMessage = 'Email is required';
      } else if (error['pattern']) {
        errorMessage = 'Email format not valid';
      } else if (error['existUser']) {
        errorMessage = 'This email already exist!';
      }
    }

    return errorMessage;
  }

  /**
   * Método para registrarnos en la aplicación
   * Si todos los datos son válidos se creará el usuario y mostraremos un mensaje de éxito
   * Si hay algun error al enviar la petición se lo haremos saber al usuario
   */
  register() {
    if (this.myForm.valid) {
      const { name,email,phone,password } = this.myForm.value;
      this.user = { name,email,phone,password };
      this.authService.registerUser(this.user).subscribe({
        next: (data) =>
          Toastify({
            text: 'Welcome ' + data.name + ' login in the app',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast(),
        error: (err) => {
          console.error('Error in the request:', err);
          Toastify({
            text: 'Something go bad: ' + err.error.message,
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast()

        }
      });
    }
  }
}
