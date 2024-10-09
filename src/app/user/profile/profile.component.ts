import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  emailNotifications!:boolean;
  smsNotifications!:boolean ;
  calendarNotifications!:boolean;
  user!:User;

  constructor(private userService:UserService,
    private authService:AuthService
  ){}

  ngOnInit(): void {
    let userId = this.getUserId();
    this.userService.getUserById(userId).subscribe({
      next:(data) => {
        this.user = data
        this.emailNotifications = data.emailNotifications;
        this.smsNotifications = data.smsNotifications;
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

  manageNotifications(){
    this.userService.manageNotifications(this.emailNotifications,this.smsNotifications,this.calendarNotifications).subscribe({
      next : (data) =>  
        Toastify({
        text: "Notifications managed!",
        duration: 3000,
        gravity: "bottom",
        position: 'center', 
        backgroundColor: "linear-gradient(to right, #4CAF50, #2E7D32)", 
        }).showToast(),
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

  getUserId():number{
    return this.authService.getUserId();
  }

}
