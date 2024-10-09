import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService:AuthService){}

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
