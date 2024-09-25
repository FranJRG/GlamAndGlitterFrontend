import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService:AuthService,
    private router:Router
  ){}

  @ViewChild("myLoginForm")myLoginForm!:NgForm;

  login(){
    if(this.myLoginForm.valid){
      const {email,password} = this.myLoginForm.value;
      this.authService.login(email,password).subscribe(
        resp => {
          if(resp == true) {
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
              text: "Username or password incorrect",
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

}
