import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../../interfaces/user';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pending-schedules',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pending-schedules.component.html',
  styleUrl: './pending-schedules.component.css'
})
export class PendingSchedulesComponent implements OnInit{

  constructor(private userService:UserService,
            private router:Router
  ){}

  users:User[] = [];

  ngOnInit(): void {
    this.userService.findByUserWithoutSchedule().subscribe({
      next : (data) => this.users = data,
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

  completeSchedule(id:number){
    this.router.navigateByUrl(`user/completeSchedule/${id}`)
  }

}
