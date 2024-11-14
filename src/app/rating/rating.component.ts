import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Rating } from '../interfaces/rating';
import { RatingService } from './services/rating.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';


@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {

  message: string = '';
  punctuacion: number = 0;
  @Input()id:number = 0;

  rating:Omit<Rating, "username"> = {
    punctuation : 0,
    message : "",
    citeId : this.id
  }

  constructor(private ratingService:RatingService){}

  seleccionarPuntuacion(valor: number): void {
    this.punctuacion = valor;
  }

  sendRating(){
    this.rating.message = this.message;
    this.rating.punctuation = this.punctuacion;
    this.rating.citeId = this.id
    console.log(this.rating);
    this.ratingService.addRating(this.rating).subscribe({
      next : (data) =>{
        if(this.punctuacion < 3){
          Toastify({
            text:'Rating added successfully, we try to do better, sorry and thank you!',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast()
        }else{
          Toastify({
            text:"Rating added successfully, thanks for your support!",
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
          }).showToast()
        }
      },
      error : (err) => 
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    })
  }

}
