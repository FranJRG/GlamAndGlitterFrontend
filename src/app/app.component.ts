import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent,FooterComponent,NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'GlamAndGlitter';

  showNavbar:boolean = true;
  
  constructor(private router:Router){}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (this.router.url === '/pdf/serviceSummary') {
        this.showNavbar = false; // Ocultar el navbar en esta ruta
      } else {
        this.showNavbar = true; // Mostrar el navbar en otras rutas
      }
    });
  }
}