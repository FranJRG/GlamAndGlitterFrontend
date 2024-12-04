import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ServiceService } from '../../service/service.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  categories!: Category[];
  isMenuOpen = false;

  constructor(private authService:AuthService,
    private serviceService:ServiceService
  ){}


  ngOnInit(): void {
    this.getCategories();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

    /**
   * Método para obtener todas las categorías
   */
    getCategories() {
      this.serviceService.getCategories().subscribe({
        next: (data) => (this.categories = data),
        error: (err) =>
          Toastify({
            text: 'We can´t load our categories yet',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast(),
      });
    }

  /**
   * Método para saber si el usuario esta logueado
   */
  isLoggued():boolean{
    return this.authService.existToken();
  }

  /**
   * Método para poder hacer logout
   */
  logout(){
    this.authService.logout();
  }

  getName():string{
    return this.authService.getName();
  }

  /**
   * Método para comprobar si el usuario esta logueado
   */
  existToken():boolean{
    return this.authService.existToken();
  }

  /**
   * Método para obtener el role
   */
  getRole():string{
    return this.authService.getRole();
  }

}