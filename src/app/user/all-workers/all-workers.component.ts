import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../services/user.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-workers',
  standalone: true,
  imports: [],
  templateUrl: './all-workers.component.html',
  styleUrl: './all-workers.component.css'
})
export class AllWorkersComponent implements OnInit{

  users:User[] = [];

  constructor(private userService:UserService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.userService.getWorkers().subscribe({
      next  : (data) => this.users = data,
      error : (err) =>
        Toastify({
          text: 'Something go bad obtaining the workers ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    })
  }

  editSchedule(id:number){
    this.router.navigateByUrl(`/schedule/changeSchedule/${id}`);
  }

}
