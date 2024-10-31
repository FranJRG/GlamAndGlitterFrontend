import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { User } from '../../interfaces/user';
import { GoogleCalendarService } from '../../shared/services/google-calendar.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  emailNotifications!:boolean;
  calendarNotifications!:boolean;
  events: any[] = [];
  user!:User;

  constructor(private userService:UserService,
    private authService:AuthService,
    private calendarService:GoogleCalendarService
  ){}

  /**
   * Al iniciar la página cargamos los datos del usuario y seteamos las notificaciones
   * Si hay cualquier error alertamos al usuario
   */
  ngOnInit(): void {
    let userId = this.getUserId();
    this.userService.getUserById(userId).subscribe({
      next:(data) => {
        this.user = data
        this.emailNotifications = data.emailNotifications;
        this.calendarNotifications = data.calendarNotifications;
      },
      error: (err) => 
        Toastify({
          text: "Something go bad: " + err.error.message,
          duration: 3000, 
          gravity: "bottom",
          position: 'center',
          backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
        }).showToast()
    })
  }

  /**
   * Método para activar o desactivar las notificaciones 
   * Mostramos mensaje de éxito o error en funcion de lo que sea necesario
   */
  manageNotifications(){
    this.userService.manageNotifications(this.emailNotifications,this.calendarNotifications).subscribe({
      next : (data) =>  {
        Toastify({
        text: "Notifications managed!",
        duration: 3000,
        gravity: "bottom",
        position: 'center', 
        backgroundColor: "linear-gradient(to right, #4CAF50, #2E7D32)", 
        }).showToast()
        if(this.calendarNotifications == true){
          this.login();
        }else if(this.calendarNotifications == false){
          this.logout();
        }
      },
      error : (err) =>
        Toastify({
          text: "Something go bad: " + err.error.message,
          duration: 3000, 
          gravity: "bottom",
          position: 'center',
          backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
        }).showToast()
    })
  }

  login() {
    this.calendarService.initializeGoogleAuth();
  }

  logout() {
    this.calendarService.signOut();
  }

  /**
   * Método para obtener el id del usuario logueado
   * @returns 
   */
  getUserId():number{
    return this.authService.getUserId();
  }

}
