import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { UserService } from '../../user/services/user.service';
import { GoogleCalendarService } from '../../shared/services/google-calendar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService:AuthService,
    private userService:UserService,
    private calendarService:GoogleCalendarService,
    private router:Router
  ){}

  /**
   * Vinculamos el formulario del html con el del component
   */
  @ViewChild("myLoginForm")myLoginForm!:NgForm;

  /**
   * Método para loguearnos en la aplicación
   * Llamamos al método del servicio para hacer login
   * Si la respuesta es correcta mandamos un mensaje de bienvenida al usuario y navegamos al landing page
   * Si hay cualquier error mandamos un mensaje con el error correspondiente
   */
  login(){
    if(this.myLoginForm.valid){
      const {email,password} = this.myLoginForm.value;
      this.authService.login(email,password).subscribe(
        resp => {
          if(resp == true) {
            if(this.getUserId() != 0 && this.getUserId() != undefined){
              this.userService.getUserById(this.getUserId()).subscribe({
                next : (data) => {
                  if(data.calendarNotifications){
                    this.calendarService.initializeTokenClient();
                  }
                }
              })
            }
            this.router.navigateByUrl("/")
            Toastify({
              text: "Welcome " + email,
              duration: 3000, // Duración en milisegundos
              gravity: "bottom", // 'top' o 'bottom'
              position: 'center', // 'left', 'center' o 'right'
              backgroundColor: "linear-gradient(to right, #4CAF50, #2E7D32)", // Color de fondo
            }).showToast();
          }else{
            Toastify({
              text: "Wrong username or password",
              duration: 3000, // Duración en milisegundos
              gravity: "bottom", // 'top' o 'bottom'
              position: 'center', // 'left', 'center' o 'right'
              backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)", // Color de fondo
            }).showToast();
          }
        }
      )
    }
  }

  getUserId():number{
    return this.authService.getUserId();
  }

}
