import { Component, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(private userService:UserService){}

  @ViewChild("myForm")myForm!:NgForm

  sendEmail(){
    if(this.myForm.valid){
      const{email} = this.myForm.value;
      
      this.userService.forgotPassword(email).subscribe({
        next: () => 
          Toastify({
          text: "A code have been sending",
          duration: 5000, // Duración en milisegundos
          gravity: "bottom", // 'top' o 'bottom'
          position: 'center', // 'left', 'center' o 'right'
          backgroundColor: "linear-gradient(to right, #4CAF50, #2E7D32)", // Color de fondo
        }).showToast(),

        error: (err) => 
          Toastify({
            text: "Something go bad: " + err.message,
            duration: 3000, // Duración en milisegundos
            gravity: "bottom", // 'top' o 'bottom'
            position: 'center', // 'left', 'center' o 'right'
            backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)", // Color de fondo
          }).showToast()
      })
    }
  }

}
