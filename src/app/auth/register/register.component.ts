import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../../interfaces/user';
import { Services } from '../../interfaces/services';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { EmailValidatorService } from '../../shared/validators/email-validator.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private fb:FormBuilder,
    private authService:AuthService,
    private emailExistService : EmailValidatorService
  ){}

  user:Omit<User, "id" | "role" | "notifications"> = {
    name:"",
    email:"",
    phone:"",
    password:""
  }

  myForm:FormGroup = this.fb.group({
    name:['',[Validators.required, Validators.minLength(5)]],
    email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')], 
                      [this.emailExistService.validate.bind(this.emailExistService)]],
    phone:['',[Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    password:['',Validators.required],
    confirmPassword:['',Validators.required]
  })

  isInvalidField(field:string){
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  get NameError(){
    const error = this.myForm.get('name')?.errors;
    let errorMessage = "";

    if(error){
      if(error['required']){
        errorMessage = "Name is required";
      }else if(error['minlength']){
        errorMessage = "Name min length must be 5";
      }
    }
    return errorMessage;
  }

  get PhoneError(){
    const error = this.myForm.get('phone')?.errors;
    let errorMessage = "";

    if(error){
      if(error['required']){
        errorMessage = "Phone is required";
      }else if(error['minlength']){
        errorMessage = "Phone min length must be 9";
      }else if(error['maxlength']){
        errorMessage = "Phone max length must be 9";
      }
    }
    return errorMessage;
  }

  get EmailError(){
    const error = this.myForm.get('email')?.errors
    let errorMessage = "";
    
    if(error){
      if(error['required']){
        errorMessage = "Email is required";
      }else if(error['pattern']){
        errorMessage = "Email format not valid";
      }else if(error['existUser']){
        errorMessage = "This email already exist!";
      }
    }

    return errorMessage;
  }

  register(){
    if(this.myForm.valid){
      const {...user} = this.myForm.value;
      this.user = user
      console.log(this.user);
      try{
        this.authService.registerUser(this.user).subscribe({
          next: (data) =>  
            Toastify({
            text: "Welcome " + data.name + " login in the app",
            duration: 3000,
            gravity: "bottom",
            position: 'center', 
            backgroundColor: "linear-gradient(to right, #4CAF50, #2E7D32)", 
          }).showToast()
          ,
          error: (err) => 
            Toastify({
              text: "Something go bad: " + err.error.message,
              duration: 3000, 
              gravity: "bottom",
              position: 'center',
              backgroundColor: "linear-gradient(to right, #FF4C4C, #FF0000)",
            }).showToast()
        })
      }catch(error){
        console.log(error);
      }
    }
  }

}
