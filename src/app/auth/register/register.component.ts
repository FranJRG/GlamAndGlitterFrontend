import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../../interfaces/user';
import { Services } from '../../interfaces/services';
import { ServiceService } from '../../service/service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private fb:FormBuilder,
    private authService:AuthService
  ){}

  services!:Services[];

  user:Omit<User, "id" | "role" | "notifications"> = {
    name:"",
    email:"",
    phone:"",
    password:""
  }

  myForm:FormGroup = this.fb.group({
    name:['',Validators.required],
    email:['',Validators.required],
    phone:['',[Validators.required, /*Validators.minLength(9), Validators.maxLength(9)*/]],
    password:['',Validators.required],
    confirmPassword:['',Validators.required]
  })

  register(){
    if(this.myForm.valid){
      const {...user} = this.myForm.value;
      this.user = user
      console.log(this.user);
      try{
        this.authService.registerUser(this.user).subscribe({
          next: (data) => alert("User created, welcome " + data.name),
          error: (err) => alert(err.message)
        })
      }catch(error){
        console.log(error);
      }
    }
  }

}
