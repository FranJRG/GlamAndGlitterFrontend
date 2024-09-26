import { Component, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(private userService:UserService,
    private router:Router
  ){}

  @ViewChild("myForm")myForm!:NgForm
  sended:boolean = false;
  isValidCode:boolean = false;
  errorMessage:string = "";

  sendEmail(){
    if(this.myForm.valid){
      const{email} = this.myForm.value;
      
      this.userService.forgotPassword(email).subscribe({
        next: () => {
          Toastify({
          text: "A code have been sending",
          duration: 3000,
          gravity: "bottom",
          position: 'center', 
          backgroundColor: "linear-gradient(to right, #4CAF50, #2E7D32)", 
        }).showToast()
        this.sended = true;
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
  }

  checkCode(){
    if(this.myForm.valid){
      const{email,code} = this.myForm.value;
      
      this.userService.verifyCode(email,code).subscribe({
        next : () => {
          Toastify({
            text: "You can change your password!",
            duration: 3000,
            gravity: "bottom",
            position: 'center', 
            backgroundColor: "linear-gradient(to right, #4CAF50, #2E7D32)", 
          }).showToast()
          this.isValidCode = true;
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
  }

  changePassword(){
    if(this.myForm.valid){
      const{email,password,confirmPassword} = this.myForm.value;

      if(password === confirmPassword){
        this.userService.changePassword(email,password).subscribe({
          next : () => {
            Toastify({
              text: "Password changed",
              duration: 3000,
              gravity: "bottom",
              position: 'center', 
              backgroundColor: "linear-gradient(to right, #4CAF50, #2E7D32)", 
            }).showToast() 
            this.router.navigateByUrl("/auth/login");
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
      }else{
        this.errorMessage = "Passwords must be equals";
      }
    }
  }

}
